<template>
<div>

<div class="is-grouped w3-container">

        <div v-for="arena in arenas">
          <article class="media">
    <figure class="media-left">
      <p class="image is-128x128">
        <img :src="getPath(arena.photos[0])" alt="Image">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>Name:</strong><small>  {{arena.name}}</small> <br>
          <!-- <strong>Price:</strong><small>  {{arenas[n].price}}</small> <br> -->
          <strong>Location:</strong><small>  {{arena.location}}</small> <br>
          <router-link v-if="user" class="button is-primary" @click.native="view_details(arena)" to="/arenaDetails" tag="button">view details</router-link>

          <br>
        </p>
        </div>
      </div>
    </article>
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
