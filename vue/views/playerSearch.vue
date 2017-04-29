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
          <input class="input" type="text" id="val" v-model="search_value" v-on:keyup="suggest">

          <div class = "w3-border">
            <ul>
              <li><div v-for = "suggestion in suggestions" @click = "search_value = suggestion; suggestions = []" class="w3-hover-grey">
                {{suggestion}}
              </div></li>
            </ul>
          </div>

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
          <router-link class="button is-primary" @click.native="view_details(arenas[n])" to="/arenaDetails" tag="button">view details</router-link>
          <hr style="background-color: #fff border-top: 2px dotted #8c8b8b">

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
                   suggestions: [],
                   getPath(photo){
                     if(photo && photo.data)
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
                            axios.post('/searchPlayer', querystring.stringify({
                                      search_type : this.search_type,
                                      search_value : this.search_value,
                                      limit: 1
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
                            axios.post('/searchPlayer', querystring.stringify({
                                      search_type : this.search_type,
                                      index : event.target.value,
                                      search_value : this.search_value,
                                      limit: 0
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
                                            console.log(this.active);
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
                          },view_details(arena){
  				                      	Event.$emit('view_details_of_arena', arena);
  			                       	},

                                suggest(){
                                  console.log('hi');
                                  this.suggestions = [];
                                  axios.post('/search', querystring.stringify({
                                            search_type : this.search_type,
                                            search_value : this.search_value,
                                            limit: 1
                                          })).then(response => {
                                            console.log(response.data.result);
                                            var searchType = this.search_type;
                                              for (var i = 0; i < response.data.result.length; i++) {
                                                if(response.data.result[i])
                                                  if(searchType == 'name')
                                                  {
                                                    this.suggestions.push(response.data.result[i].name);
                                                  }
                                                  else
                                                  {
                                                    var entry = response.data.result[i].location;
                                                    if(this.suggestions.indexOf(entry) < 0)
                                                      this.suggestions.push(entry);
                                                  }
                                                  if(this.suggestions.length > 4)
                                                    break;
                                              }
                                            }
                                          )
                                             .catch(error => {
                                               console.log(error);
                                           });
                                }
                          }
          }
</script>
