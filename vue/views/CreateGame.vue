<template>
<div class="w3-container" v-if="type=='Player'">
	<div class="w3-quarter"> 
		<h>&nbsp</h>
	</div>

	<div class="w3-half">
		<br>
		<br>
		<form method="post" action="/createGame" @submit.prevent="createGame" @keydown="form.errors.clear($event.target.name)">
			<div class="control">
				<label for="name" class="label">Size</label>
				<input type="text" onkeypress='return event.charCode >= 48 && event.charCode <= 57' name="size" class="input" placeholder="Size" v-model="form.size" >
				<span class="help is-danger" v-if="form.errors.has('size')" v-text="form.errors.get('size')"></span>
			</div>
			
			<div class="control">
				<label for="name" class="label">Location</label>
				<input type="text" name="location" class="input" placeholder="Location" v-model="form.location">
				<span class="help is-danger" v-if="form.errors.has('location')" v-text="form.errors.get('location')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">Start date</label>
				<input id ="start_date" type="date" name="start_date" class="input" value="2017-01-01" v-model="form.start_date">
				<span class="help is-danger" v-if="form.errors.has('start_date')" v-text="form.errors.get('start_date')"></span>
			</div>
			<div class="control">
				<label for="name" class="label">End date</label>
				<input id = "end_date" type="date" name="end_date" class="input" :value="form.end_date" v-model="form.end_date">
				<span class="help is-danger" v-if="form.errors.has('end_date')" v-text="form.errors.get('end_date')"></span>
			</div>
			<br>
			<div class="control">
				<button class="button is-primary">Create a Game</button>
			</div>
		</form>
	</div>

	<div class="w3-quarter" >
		
	</div>

</div>
</template>

<script>
	export default {
		data(){
			return {
				form : new Form({
					start_date : '',
					location : '',
					size : '',
					end_date : ''
				})
			}
		},

		created(){ 
			
		},

		methods : {
			createGame(){
				this.form.submit('post','/createGame')
				.then(res => {
					alert('Game added successfully');
					this.$router.push('/');
				})
				.catch(err => {
					alert(err.error);
				});
			}
		},

        computed: {
            user: function () { return this.$session.user; },
            type: function () { return this.$session.type; }
        }
	}
</script>