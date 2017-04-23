<template>



	<div>
		
		<!--Start of edit arena info form-->

		<form method="post" action="/signup" @submit.prevent="signup" @keydown="form.errors.clear($event.target.name)">
			<div >
				<label  class="label">Choose type of account</label>
				<input type="radio" name="type" placeholder="Player" v-model="form.type" value="player" class="radio">Player
				<input type="radio" name="type" placeholder="Service Provider" v-model="form.type" value="service" class="radio">Service Provider
			</div>
			<div class="control">
				<label  class="label">Name</label>
				<input type="text" name="name" class="input" placeholder="name" v-model="form.name" >
				<span class="help is-danger" v-if="form.errors.has('name')" v-text="form.errors.get('name')"></span>
			</div>
			<div class="control">
				<label  class="label">Username</label>
				<input type="text" name="username" class="input" placeholder="username" v-model="form.username">
				<span class="help is-danger" v-if="form.errors.has('username')" v-text="form.errors.get('username')"></span>
			</div>
			<div class="control">
				<label  class="label">Password</label>
				<input type="password" name="password" class="input" placeholder="Password" v-model="form.password">
				<span class="help is-danger" v-if="form.errors.has('password')" v-text="form.errors.get('password')"></span>
			</div>
			<div class="control">
				<label  class="label">Email</label>
				<input type="text" name="email" class="input" placeholder="Email" v-model="form.email">
				<span class="help is-danger" v-if="form.errors.has('email')" v-text="form.errors.get('email')"></span>
			</div>
			<div class="control">
				<label  class="label">Location</label>
				<input type="text" name="location" class="input" placeholder="Location" v-model="form.location">
				<span class="help is-danger" v-if="form.errors.has('location')" v-text="form.errors.get('location')"></span>
			</div>
			<div class="control">
				<label  class="label">Phone number</label>
				<input type="text" name="phone_number" class="input" placeholder="Phone number" v-model="form.phone_number">
				<span class="help is-danger" v-if="form.errors.has('phone_number')" v-text="form.errors.get('phone_number')"></span>
			</div>
			<div class="control" v-if="form.type=='player'">
				<label  class="label" >Birthdate</label>
				<input type="date" name="birthdate" class="input" v-model="form.birthdate">
				<span class="help is-danger" v-if="form.errors.has('birthdate')" v-text="form.errors.get('birthdate')"></span>
			</div>
			<div class="control"  v-if="form.type=='service'">
				<label  class="label">Mode</label>
				<input type="checkbox" name="mode" class="checkbox" v-model="form.mode">
			</div>
			<div class="control">
				<label  class="label">Profile picture</label>
				<img :src="form.profile_pic">
				<input type="file" name="profile_pic" class="input" placeholder="Profile picture" @change="onFileChange">
			</div>
			<div class="control">
				<button class="button is-primary">Sign Up!</button>
			</div>
		</form>

	</div>

</template>

<script>

	export default {
		data(){
			return {
				form : new Form({
					type:'player',
					name : '',
					location : '',
					username : '',
					password : '',
					email : '',
					phone_number : '',
					birthdate : '',
					mode:'',
					profile_pic:'/default-user-image.png'
				})
			}
		},

		methods : {
			signup(){
				this.form.submit('post','/signup')
				.then(res => {
					this.$router.push('/');;
				})
				.catch(err => {
					console.log(err);
				});
			},
			onFileChange(e) {
		      var files = e.target.files || e.dataTransfer.files;
		      if (!files.length)
		        return;
		      this.createImage(files[0]);
		    },
		    createImage(file) {
		      var image = new Image();
		      var reader = new FileReader();
		      var vm = this;

		      reader.onload = (e) => {
		        vm.form.profile_pic = e.target.result;
		      };
		      reader.readAsDataURL(file);
		    }
		}

	}
</script>