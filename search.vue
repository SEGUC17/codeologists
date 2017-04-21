<template>
   <div class="is-grouped container">
        <br></br>
        <form autocomplete="off" method="POST" @submit.prevent="onSubmit">
            <div class="control">
          <label class="label" for="drop">Search Type</label>
          <div class="select">
          <select class="input" id="drop"name="cars" v-model="search_type" >
               <option value="price">Price</option>
               <option value="location">Location</option>
               <option value="name">Name</option>
          </select>
        </div>
        </div>
        <div class="field">
          <label class ="label" for="val">Search Value</label>
          <input class="input" type="text" id="val" v-model="search_value">
          <span class="help is-danger" v-if="err">{{msg}}</span>
        </div>
          <div>
          <input class="button is-primary" type="submit" name="submit" value="search">
          <br></br>
        </div>
        </form>

        <div class="is-centered">
        <h1 v-if="no_search">select search type and enter search value to show you the matched Arenas</h1>
        </div>

        <div v-for="n in elements">
          <article class="media">
    <figure class="media-left">
      <p class="image is-128x128">
        <img v-if="arenas.photos" :src="getPath(arenas.photos[0])" alt="Image">
        <img v-else src="/field-big.jpg" alt="Image">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>Name:</strong><small>  {{arenas[n].name}}</small> <br>
          <strong>Price:</strong><small>  {{arenas[n].price}}</small> <br>
          <strong>Location:</strong><small>  {{arenas[n].location}}</small> <br>
          <br>
        </p>
        </div>
      </div>
    </article>
    </div>
        <nav class="pagination is-centered">
                      <ul class="pagination-list">
                        <li>
                              <input v-for="n in count" :class="n == active ? 'pagination-link is-current' : 'pagination-link'" type="submit" :id="n" name="submit" :value="n" @click="onindex">
                        </li>
                     </ul>
        </nav>

   </div>
</template>
<script>
    var querystring = require('querystring');
     export default{
            data(){
              return{
                   no_search: true,
                   search_type: 'name',
                   search_value: '',
                   arenas:[''],
                   count:'',
                   start:'',
                   end:'',
                   active:2,
                   elements:0,
                   err : false,
                   msg: '',
                   getPath(photo){
                     if(photo)
   return 'data:image/*;base64,'+(new Buffer(photo.data.data).toString('base64'));
}
              };
            },
            created(){
                   this.no_search = true;
                   this.search_type = 'name';
                   this.no_match= false;

            },
            methods:{
                          onSubmit(){
                            axios.post('/search', querystring.stringify({
                                      search_type : this.search_type,
                                      search_value : this.search_value
                                    })).then(response => {
                                            this.count = response.data.count;
                                            this.start = response.data.start;
                                            this.end = response.data.end;
                                            this.active = response.data.active;
                                            this.no_search = false;
                                            this.elements = this.end-this.start;
                                            this.arenas=[''];
                                            this.err = false;
                                            for (var i = 0; i < this.end; i++) {
                                              this.arenas.push(response.data.result[i]);
                                            }

                                          }
                                    )
                                       .catch(error => {this.arenas = [];this.search_value = '';
                                       this.err = true;
                                       this.search_type ='name';
                                       this.no_search = true;
                                       this.count = '';
                                       this.elements ='';
                                       this.arenas =[''];
                                       this.msg = error.response.data.error;
                                     });
                          },onindex(event){
                            axios.post('/search', querystring.stringify({
                                      search_type : this.search_type,
                                      index : event.target.value,
                                      search_value : this.search_value
                                    })).then(response => {
                                            this.count = response.data.count;
                                            this.start = response.data.start;
                                            this.end = response.data.end;
                                            this.elements = this.end-this.start;
                                            this.active = response.data.active;
                                            this.no_search = false;
                                            this.err = false;
                                            this.arenas=[''];
                                            for (var i = this.start; i < this.end; i++) {
                                              this.arenas.push(response.data.result[i]);

                                            }
                                            this.active = response.data.active;
                                         

                                          }
                                    )
                                       .catch(error => {this.arenas = [];this.search_value = '';
                                       this.err = true;
                                       this.search_type ='name';
                                       this.no_search = true;
                                       this.count = '';
                                       this.arenas=[''];
                                       this.elements ='';
                                       this.msg = error.response.data.error;
                                     });

                          }
                    }
          }

</script>
