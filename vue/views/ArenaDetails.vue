<template>
<div>

<h1>Arena Details</h1>

<h4 v-if="arena">Name: {{arena.name}}</h4>
<h4 v-if="arena">Location: {{arena.location}}</h4>
<h4 v-if="arena">Address: {{arena.address}}</h4>
<h4 v-if="arena">Rules And Regulations: {{arena.rules_and_regulations}}</h4>
<h4 v-if="arena">Size: {{arena.size}}</h4>
<h4 v-if="arena">Type: {{arena.Type}}</h4>
<h4 v-if="arena">Price: {{arena.Price}}</h4>
<h4 v-if="arena">Ratings: {{arena.ratings_count}}</h4>
<h4 v-if="arena">Average Rating: {{arena.avg_rating}}</h4>


<!-- <hr>
<h2>arena comments</h2>
<h4 v-if="arena[0].comments.length>0" v-for="comment in arena[0].comments">{{comment.content}} <br><br> {{comment.time_stamp}} <br> <br> {{comment.player}} <hr></h4> -->

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

<!-- <h2>Arena Schedule</h2> -->

<!-- schedule -->

<!-- Mohamed's schedule view can bw put here -->


<!-- <table border = "1" v-for = "(schedule, ind) in arena.schedule">
<tr v-for = "week in schedule">
	<th>week {{week_counter[ind]}}</th>
</tr>

<tr v-for="(day, ind2) in schedule.week">
	<td v-for = "slot in day">
		<th>day {{day_counter[ind2]}}</th>

		<h5 v-for = "(tmp, index) in slot">
			{{time_slot[index]}} : {{tmp}}
		</h5>

	</td>
</tr>

</table> -->


		<!-- Tawfik comments -->
		<comments :initialMina="this.arenaId" :initialcomments="this.arena.comments"></comments>
		<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


</div>


</template>

<script>

	import comments from './commentOnArena.vue';
	var querystring = require('querystring');
	export default{

		data(){
			return{
				arena: {},
				name: 'not updated',
				time_slot: ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"],

				day_counter:["1", "2", "3", "4", "5", "6", "7"],
				week_counter:["1", "2", "3", "4"],
				photos:{},
				arenaId:''
			};
		},

		created(){

			Event.$on('view_details_of_arena', arena => { 

				this.arena = arena;
				this.photos = arena.photos;
				this.arenaId=arena._id;		
				/*axios.post('/arenaDetails', querystring.stringify({
                   "name" : this.name
 					   }), {
				      headers: { 
				        "Content-Type": "application/x-www-form-urlencoded"
				      }
				    })
                 .then(res => this.arena = res.data)
                 .catch(error => this.arena = ['error']);*/

			});

			
		},

		components : {
			comments
		},

		methods:{
			getPath(photo) {
				return 'data:image/*;base64,' + (new Buffer(photo.data.data).toString('base64'));
			},
			dispalyImage(element) {
				document.getElementById("img01").src = element;
				document.getElementById("modal01").style.display = "block";
			},
			
		},
		computed:{
			
		}
	}
</script>



