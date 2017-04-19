<template>
   <div>
        <br></br>
        <form autocomplete="off" method="POST" @submit.prevent="onSubmit">
          <label for="drop">Search Type</label>
          <select id="drop"name="cars" v-model="search_type" >
               <option value="price">Price</option>
               <option value="location">Location</option>
               <option value="name">Name</option>
          </select>
          &nbsp;&nbsp;
          <label for="val">Search Value</label>
          <input type="text" id="val" v-model="search_value">
          <br></br>

          <input type="submit" name="submit" value="search">
        </form>
        <h1 v-if="no_search">select search type and enter search value to show you the matched Arenas</h1>
        <div v-for="n in elements">
               <h3>{{ arenas[n].name}}</h3>
               <h3 >{{ arenas[n].location}}</h3>
                <h3 >{{ arenas[n].price}}</h3>

                <hr>
        </div>


                <input v-for ="n in count" type="submit" :id="n" name="submit" :value="n" @click="onindex">
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
                   active:'',
                   elements:0
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
                                            for (var i = 0; i < this.end; i++) {
                                              this.arenas.push(response.data.result[i]);
                                            }

                                          }
                                    )
                                       .catch(error => {alert(error.response.data.error);this.arenas = [];this.search_value = '';
                                       this.search_type ='name';
                                       this.no_search = true;
                                       this.count = '';
                                       this.elements ='';
                                       this.arenas =[''];
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
                                            this.arenas=[''];
                                            for (var i = this.start; i < this.end; i++) {
                                              this.arenas.push(response.data.result[i]);

                                            }

                                          }
                                    )
                                       .catch(error => {alert(error.response.data.error);this.arenas = [];this.search_value = '';
                                       this.search_type ='name';
                                       this.no_search = true;
                                       this.count = '';
                                       this.arenas=[''];
                                       this.elements ='';
                                     });

                          }
                    }
          }

</script>

</script>
