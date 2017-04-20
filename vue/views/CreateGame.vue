<template>



	<div>
		
		<!--Start of edit arena info form-->

		<form method="post" action="/createGame" @submit.prevent="createGame" @keydown="form.errors.clear($event.target.name)">
			<div class="control">
				<label for="name" class="label">Size</label>
				<input type="text" name="size" class="input" placeholder="Size" v-model="form.size" >
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
			<div class="control">
				<button class="button is-primary">Create a Game</button>
			</div>
		</form>

		<!--End of edit arena info form-->
		

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
				//console.log(this.form.errors);
				this.form.submit('post','/createGame')
				.then(res => {
					alert(res.success);
					this.$router.push('/');
				})
				.catch(err => {
					alert(err.error);
				});
			}
		}

	}
</script>