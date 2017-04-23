<template>
<div>
<h1 v-if="arenas[0]">Arenas in {{arenas[0].location}}</h1>

<section v-if="arenas[0]" v-for="arena in arenas">

	<h4>Name: {{arena.name}}</h4>
	<h4>Address: {{arena.address}}</h4>
	<h4>Size: {{arena.size}}</h4>
	<h4>Type: {{arena.type}}</h4>
	<h4>Rating: {{arena.avg_rating}}</h4>

<router-link @click.native="view_details(arena)" to="/arenaDetails" tag="button">view details</router-link>

	<hr><br>

</section>
	
	<!-- <section v-if="arenas.length == 0">

		<h3>Please choose a location to view arenas in from here </h3>
			
				<select name="locations" id="drop">
					<option value="rehab">rehab</option>
					<option value="nasr city">nasr city</option>
					<option value="mohandesen">mohandesen</option>
					<option value="tagamoa">tagamoa</option>
					<option value="zamalek">zamalek</option>
					<option value="6 october">6 october</option>
					<option value="madinaty">madinaty</option>
				</select>
				<br><br>

		<button @click="view_by_location">Submit</button>

	</section> -->

</div>
</template>

<script>
  var querystring = require('querystring');
  export default{

  			data(){
  				return{
                    arenas:[]
  				};
  			},

  			created(){
  				Event.$on('view-arenas', arenas => {
  					this.arenas=arenas.data;
  				});
  			},


  			methods:{

  				view_details(arena){

  					Event.$emit('view_details_of_arena', arena);

  				}
  			}
  }
</script>



