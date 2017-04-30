<template>
	<div>
		<div class="w3-display-container">
			  <img src="image/1.jpg" alt="Lights" style="width: 100%" >
			  <div class="w3-display-middle w3-large">

			  		<h3><font size="6"><font color="white">Choose Location</font></font></h3>
			  		<div class="box">
			  			<div class="w3-dropdown-hover">
							<button class="w3-button w3-black" style="width: 300px">{{this.location}}</button>
							<div class="w3-dropdown-content w3-bar-block w3-border" >
								<a v-for="loc in locations" class="w3-bar-item w3-button" @click="setLocation(loc)">{{loc}}</a>
							</div>
						</div>

						<button class="w3-button w3-red w3-text-black" @click="view_by_location" :disabled="this.check " >
							<router-link to="/viewArenas">
	    						<a>Show Arenas</a>
	    					</router-link>
						</button>
			  		</div>
			  </div>
		</div>
    <hr>
     <div class="w3-container w3-white w3-margin-bottom ">
       <br>		<div class="has-text-centered">
					 <h1 style="font-family: Chalkboard SE"><font size="8"><b><font color="red">TOP</font> ARENAS</b></font></h1>
					 <h2 v-if="top_arenas.length == 0" class="title w3-text-blue">NO arenas created yet</h2>
				 <br>
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
									 <div  v-if="user" class="w3-container">
										  <router-link style="font-size: 16px" class="button is-primary is-focused w3-red" @click.native="view_details(arena)" to="/arenaDetails" tag="button">view details</router-link>
	 								</div>



								 </div>
							</div>
            </div>
					</div>
<hr>

		<br>

		<div class="w3-container content has-text-centered">
			<h1 style="font-family: Chalkboard SE"><font size="8"><b><font color="red">HOW</font> IT WORKS</b></font></h1>
				<div class="columns">
	 				<div class="column is-3">
	  					<img src="search.jpg" height="1000" width="1000">
	  					<h1 style="font-family: Chalkboard SE"><font size="5"color="red"><b>FIND ARENA</b></font></h1>
	  				</div>

	  				<div class="column is-3">
						<img src="book2.jpeg">
						<br>
						<h1 style="font-family: Chalkboard SE"><font size="5"color="red"><b>BOOK SLOT</b></font></h1>
	  				</div>

	  				<div class="column is-3">
						<img src="play.png" height="550" width ="215">
						<h1 style="font-family: Chalkboard SE"><font size="5" color="red"><b>ENJOY THE GAME!</b></font></h1>
	  				</div>
				</div>
		</div>
	</div>


</template>


<script>
	export default {
		data() {
			return {
				check: true,
				location : 'your location',
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
			.catch(error => {
				this.$notify({
							title: 'Error',
							message: error,
							type: 'error'
						});
			});
		},

		methods : {
			setLocation(loc){
				this.check = false;
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
		},computed:{
		  user: function () { return this.$session.get('user'); }
		}
	}

</script>
