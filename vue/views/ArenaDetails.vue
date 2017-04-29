<template>
<div class="w3-container">

<!-- start of banner -->
	<div class="w3-container w3-card-2 w3-white w3-margin-bottom">

		<div class="w3-display-container">
		  <img src="1.png" alt="Lights" style="width:100%; height: 200px">
		  <div class="w3-padding w3-display-topleft">
				<h1 style="color: white; font-size: 250%; font-style: italic; font-style: bold; text-align: left; padding-left: 0.5cm" >{{arena.name}}</h1>
		  </div>
		  <div class="w3-padding w3-display-bottomleft">
				<el-rate
				  v-model="value5"
				  disabled
				  show-text
				  text-color="#ff9900"
				  text-template="{value} points"
				  style="padding-left: 0.5cm">
				</el-rate>
				<h6 style="color:white; text-align: left; padding-left: 0.5cm">({{arena.ratings_count}} votes)</h6>

		  </div>
		  <div class="w3-padding w3-display-bottomright">
		  	<router-link :to="getUrl">
				<a @click.native="showReserveTimes()" class="button is-primary is-focused w3-red">
					<b>Book Now</b>
				</a>
			</router-link>
		  </div>
		  <div class="w3-padding w3-display-left">
				<h2 style="font-size: 120%; color:white; text-align: left; padding-left: 0.5cm" >{{arena.location}}</h2>
		  </div>
		</div>
	</div>

<!-- end of banner -->

<!-- start of details -->
<div class="w3-container">
	<div class="columns">
	  <div class="column is-3">
	    <div class="card">
	       <div class="card-content">
	    <p class="title">
	      Address
	    </p>
	    <p class="subtitle">
	      {{arena.address}}
	    </p>
	      </div>
	    </div>
	  </div>

	  <div class="column is-3">
	    <div class="card">
	       <div class="card-content">
	    <p class="title">
	      Size
	    </p>
	    <p class="subtitle">
	      {{arena.size}}
	    </p>
	      </div>
	    </div>
	  </div>

	  <div class="column is-3">
	    <div class="card">
	       <div class="card-content">
	    <p class="title">
	      Type
	    </p>
	    <p class="subtitle">
	      {{arena.type}}
	    </p>
	      </div>
	    </div>
	  </div>

	  <div class="column is-3">
	    <div class="card">
	       <div class="card-content">
	    <p class="title">
	      Price
	    </p>
	    <p class="subtitle">
	      {{arena.price}}
	    </p>
	      </div>
	    </div>
	  </div>

	</div>

</div>
<!-- end of details -->

<!-- start of regulatoins -->
<div class="w3-container">
<article class="message">
  <div class="message-header">
    <p>Rules and Regulations</p>
  </div>
  <div class="message-body">
    {{arena.rules_and_regulations}}
  </div>
</article>

</div>
<!-- end of regulations -->


	<div class="w3-row-padding">
		<div class="w3-third" v-for="photo in photos">
			<img :src="getPath(photo)" style="width:100%" @click="dispalyImage(getPath(photo))" alt="arena image">
		</div>
	</div>

	<!-- Modal for full size images on click-->
	<div id="modal01" class="w3-modal w3-black" style="padding-top:0" onclick="this.style.display='none'">
		<div class="w3-modal-content w3-animate-zoom w3-center w3-transparent w3-padding-64">
			<img id="img01" class="w3-image">
		</div>
	</div>


		<!-- Tawfik comments -->
		<comments :initialMina="this.arenaId" :initialcomments="this.arena.comments"></comments>


</div>


</template>

<script>

	import comments from './commentOnArena.vue';
	var querystring = require('querystring');
	export default{

		data(){
			return{
				arena: {},
				photos:{},
				arenaId:'',
				value5 : 0,
			};
		},

		created(){

			Event.$on('view_details_of_arena', arena => {
				this.arena = arena;
				this.photos = arena.photos;
				this.arenaId=arena._id;
				this.value5=arena.avg_rating;

			});


		},

		components : {
			comments
		},

		methods:{
			getPath(photo) {
				if(photo && photo.data)
                  return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
                return '';
			},
			dispalyImage(element) {
				document.getElementById("img01").src = element;
				document.getElementById("modal01").style.display = "block";
			},

		},

		computed: {
            user: function () { return window.user; },
            type: function () { return window.type; },
            getUrl() {
            	return "/schedule/"+this.arena.name;
            }
        }

	}
</script>

<style>

.details{
	position: absolute;
    left: 15px;
    top: 220px;
    z-index: -1;
}

.column{
	font-family: "Times New Roman";
	text-align: center;
}


#data{
	border:1px solid black;
	height: 100%px;
	width: 200px;
}

.gallery{
	font-family: "Times New Roman";
}

div.gallery {
    margin: 10px;
    float: left;
    width: 380px;
}

</style>
