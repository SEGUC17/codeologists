<template>
<div>

<h1>Arena Details</h1>

<h4 v-if="arena[0]">Name: {{arena[0].name}}</h4>
<h4 v-if="arena[0]">Location: {{arena[0].location}}</h4>
<h4 v-if="arena[0]">Address: {{arena[0].address}}</h4>
<h4 v-if="arena[0]">Rules And Regulations: {{arena[0].rules_and_regulations}}</h4>
<h4 v-if="arena[0]">Size: {{arena[0].size}}</h4>
<h4 v-if="arena[0]">Type: {{arena[0].Type}}</h4>
<h4 v-if="arena[0]">Price: {{arena[0].Price}}</h4>
<h4 v-if="arena[0]">Ratings: {{arena[0].ratings_count}}</h4>
<h4 v-if="arena[0]">Average Rating: {{arena[0].avg_rating}}</h4>

<hr>
<h2>arena comments</h2>
<h4 v-if="arena[0]" v-for="comment in arena[0].comments">{{comment.content}} <br><br> {{comment.time_stamp}} <br> <br> {{comment.player}} <hr></h4>

<h2>Arena Schedule</h2>

<!-- schedule -->
<table border = "1" v-for = "(schedule, ind) in arena[0].schedule">
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

</table>

<!-- default_weekly_schedule -->
<table border = "1" v-for = "(schedule, ind) in arena[0].default_weekly_schedule">
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

</table>

</div>
</template>

<script>
	var querystring = require('querystring');
	export default{

		data(){
			return{
				arena: {},
				name: 'not updated',
				time_slot: ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"],

				day_counter:["1", "2", "3", "4", "5", "6", "7"],
				week_counter:["1", "2", "3", "4"]
			};
		},

		created(){

			Event.$on('view_details_of_arena', arenaName => { 

				this.name = arenaName;

				axios.post('/arenaDetails', querystring.stringify({
                   "name" : this.name
 					   }), {
				      headers: { 
				        "Content-Type": "application/x-www-form-urlencoded"
				      }
				    })
                 .then(res => this.arena = res.data)
                 .catch(error => this.arena = ['error']);

			});

		}
	}
</script>



