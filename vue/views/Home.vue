<template>
	<div>
		<div class="w3-display-container">
			  <img src="image/1.jpg" alt="Lights" style="width: 100%" >
			  <div class="w3-display-middle w3-large">
			  		
			  		<h1 class="w3-text-white">Choose location</h1>
			  		<div class="box" style="opacity: 0.65;">
			  			<div class="w3-dropdown-hover">
							<button class="w3-button w3-black">Your Location</button>
							<div class="w3-dropdown-content w3-bar-block w3-border">
								<a v-for="loc in locations" class="w3-bar-item w3-button" @click="setLocation(loc)">{{loc}}</a>
							</div>
						</div>

						<button class="w3-button w3-red" @click="view_by_location">
							<router-link to="/viewArenas">
	    						<a>Show Arenas</a>
	    					</router-link>
						</button>


			  		</div>


			  </div>
		</div>

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

				statuses: [],
				location : '',
				locations : ['El rehab','Nasr City','Agouza']
			}
		},

		created() {
			this.statuses.push({ user: "Omar", content: "Hello" });
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

  				}
		}
	}

</script>