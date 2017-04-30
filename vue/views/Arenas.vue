<template>
<div class="w3-container">

<div class="w3-row">
              <div v-for="arena in arenas" class="w3-container w3-quarter">
               <div class="w3-container w3-padding w3-card-4">
                 <img :src="getPath(arena.photos[0]) " alt="Arena image" style="width:100%; height: 200px">
                   <h1 style="color: black; font-size: 200%; font-style: italic; font-style: bold;" >{{arena.name}}</h1>
                    <p><i class="fa fa-map-marker fa-fw w3-margin-right w3-large w3-text-teal"></i>{{arena.location}}</p>
                    <p><i class="fa fa-money fa-fw w3-margin-right w3-large w3-text-teal"></i>{{arena.price}}</p>
                   <div class="w3-container">

                     <el-rate
                      :value="arena.ratings_count"
                       disabled
                       show-text
                       text-color="#ff9900"
                       text-template="{value} points"
                       style="padding-left: 0.5cm">
                     </el-rate>
                     <h6 style="color:black; text-align: left; padding-left: 0.5cm">({{arena.ratings_count}} votes)</h6>

                   </div>
                   <div  v-if="user" class="w3-container">
                      <router-link style="font-size: 16px" class="button is-primary is-focused w3-red" @click.native="view_details(arena)" to="/arenaDetails" tag="button">view details</router-link>
                  </div>



                 </div>
              </div>
            </div>

</div>
</template>

<script>
  var querystring = require('querystring');
  export default{

        data(){
          return{
                    arenas:[],
                    location : ''
          };
        },

        created() {
          Event.$on('view-arenas',arenas => {
            this.arenas=arenas.data;
          })
        },

        methods:{

          view_details(arena){

            Event.$emit('view_details_of_arena', arena);

          },

          getPath(photo){
  																	if(photo && photo.data)
  												return 'data:image/*;base64,'+(new Buffer(photo.data.data).toString('base64'));
  												return 'field-big.jpg';
  											}
        },

        computed : {
          user: function () { return this.$session.get('user'); },
          type: function () { return this.$session.get('type'); }
        }

  }
</script>
