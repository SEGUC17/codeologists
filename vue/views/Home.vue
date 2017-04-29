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
	</div>
</template>


<script>
    export default {
        data() {
            return {
                check: true,
                statuses: [],
                location: 'Your Location',
                locations: ['El rehab', 'Nasr City', 'Agouza'],
            }
        },

        created() {
            this.statuses.push({
                user: "Omar",
                content: "Hello"
            });
        },

        methods: {
            setLocation(loc) {
                this.check = false;
                this.location = loc;
            },

            view_by_location() {
                axios.post('/arenas', querystring.stringify({
                        "location": this.location
                    }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then(arenas => {
                        Event.$emit('view-arenas', arenas);
                    })
                    .catch(err => {
                        console.log(err);
                    });

            }
        }
    }
</script>