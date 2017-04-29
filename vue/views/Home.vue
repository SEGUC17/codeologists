<template>
	<div>
		<div class="w3-display-container">
			  <img src="image/1.jpg" alt="Lights" style="width: 100%" >
			  <div class="w3-display-middle w3-large">

			  		<h1 class="w3-text-white">Choose location</h1>
			  		<div class="box" style="opacity: 0.65;">
			  			<div class="w3-dropdown-hover">
							<button class="w3-button w3-black" >{{this.location}}</button>
							<div class="w3-dropdown-content w3-bar-block w3-border" >
								<a v-for="loc in locations" class="w3-bar-item w3-button" @click="setLocation(loc)">{{loc}}</a>
							</div>
						</div>

						<button class="w3-button w3-red" @click="view_by_location" :disabled="this.check " >
							<router-link to="/viewArenas">
	    						<a>Show Arenas</a>
	    					</router-link>
						</button>
			  		</div>
			  </div>
		</div>
    <hr>
     <div class="w3-container w3-card-2 w3-white w3-margin-bottom">
       <div class="heading w3-center w3-container w3-card-2 w3-white w3-margin-bottom">
				 <h1 class="title w3-text-red">TOP ARENAS</h1>
				 <h2 v-if="top_arenas.length == 0" class="title w3-text-blue">NO arenas created yet</h2>
				 </div>
           <div class="w3-row">
  				 		<div v-for="arena in top_arenas" class="w3-container w3-quarter">
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
									 <div  class="w3-container">
										  <router-link style="font-size: 16px" class="button is-primary is-focused w3-red" @click.native="view_details(arena)" to="/arenaDetails" tag="button">view details</router-link>
	 								</div>



								 </div>
							</div>
            </div>
					</div>
<hr>
     </div>

 	</div>


</template>


<script>
	export default {
		data() {
			return {
				location : '',
				locations : ['El rehab','Nasr City','Agouza'],
				top_arenas : [],
				getPath(photo){
																	if(photo && photo.data)
												return 'data:image/*;base64,'+(new Buffer(photo.data.data).toString('base64'));
												return 'field-big.jpg';
											},


			}
		},

		created() {
			axios.get('/topArenas')
			.then(response => {this.top_arenas = response.data})
			.catch(error => alert(error));
		},

		methods : {
			setLocation(loc){
				this.location=loc;
			},

			view_by_location(){
  					axios.post('/arenas', querystring.stringify({
                   "location" : this.location
 					   }), {
				      headers: {
				        "Content-Type": "application/x-www-form-urlencoded"
				      }
				    })
                 .then(arenas =>{
                 	Event.$emit('view-arenas', arenas);
                 })
                 .catch(err => {
                 	console.log(err);
                 });

  				},view_details(arena){
									Event.$emit('view_details_of_arena', arena);
								}
		}
	}

</script>
