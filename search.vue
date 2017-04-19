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

        <div v-for="arena in arenas">
               <h3 v-text="arena.name"></h3>
               <h3 v-text="arena.price"></h3>
                <h3 v-text="arena.location"></h3>

                <hr>
        </div>


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
                   arenas:[],
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
                                            this.no_search = false;
                                            this.arenas = response.data.result;
                                          }
                                    )
                                       .catch(error => {alert(error.response.data.error);this.arenas = [];this.search_value = '';
                                       this.search_type ='name';
                                       this.no_search = true;
                                     });
                          }
                    }
          }

</script>

</script>
