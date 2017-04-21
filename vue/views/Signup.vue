<template>



	<div class="box">
		
		<!--Start of edit arena info form-->

		<form method="post" action="/signup" @submit.prevent="signup" @keydown="form.errors.clear($event.target.name)">
			<div class="columns">
				<div class="column">
					<div class="field">
						<label  class="label">Choose type of account</label>
						<input type="radio" name="type" placeholder="Player" v-model="form.type" value="player" class="radio is-large">Player
						<input type="radio" name="type" placeholder="Service Provider" v-model="form.type" value="service" class="radio is-large">Service Provider
					</div>
					<div class="field">
						<label  class="label">Name</label>
						<input type="text" name="name" class="input" placeholder="name" v-model="form.name" >
						<span class="help is-danger" v-if="form.errors.has('name')" v-text="form.errors.get('name')"></span>
					</div>
					<div class="field">
						<label  class="label">Username</label>
						<input type="text" name="username" class="input" placeholder="username" v-model="form.username">
						<span class="help is-danger" v-if="form.errors.has('username')" v-text="form.errors.get('username')"></span>
					</div>
					<div class="field">
						<label  class="label">Password</label>
						<input type="password" name="password" class="input" placeholder="Password" v-model="form.password">
						<span class="help is-danger" v-if="form.errors.has('password')" v-text="form.errors.get('password')"></span>
					</div>
					<div class="field">
						<label  class="label">Email</label>
						<input type="text" name="email" class="input" placeholder="Email" v-model="form.email">
						<span class="help is-danger" v-if="form.errors.has('email')" v-text="form.errors.get('email')"></span>
					</div>
					<div class="field">
						<label  class="label">Location</label>
						<input type="text" name="location" class="input" placeholder="Location" v-model="form.location">
						<span class="help is-danger" v-if="form.errors.has('location')" v-text="form.errors.get('location')"></span>
					</div>
					<div class="field">
						<label  class="label">Phone number</label>
						<input type="text" name="phone_number" class="input" placeholder="Phone number" v-model="form.phone_number">
						<span class="help is-danger" v-if="form.errors.has('phone_number')" v-text="form.errors.get('phone_number')"></span>
					</div>
					<div class="field" v-if="form.type=='player'">
						<label  class="label" >Birthdate</label>
						<input type="date" name="birthdate" class="input" v-model="form.birthdate">
						<span class="help is-danger" v-if="form.errors.has('birthdate')" v-text="form.errors.get('birthdate')"></span>
					</div>
					<div class="field"  v-if="form.type=='service'">
						<label  class="label">Mode</label>
						<input type="checkbox" name="mode" class="checkbox is-medium" v-model="form.mode">
					</div>
					<div class="field">
						<button class="button is-primary">Sign Up!</button>
					</div>
				</div>
				<div class="column">
					<div class="card">
						<div class="card-content">
							<label  class="title is-centered">Profile picture</label>
						</div>
							<div class="box">
								<img :src="form.profile_pic" class="image">
							</div>
						<div >
							<input type="file" name="profile_pic" placeholder="Profile picture" @change="onFileChange" accept="image/*" class="custom-file-input">
						</div>
					</div>
				</div>
			</div>
			
		</form>

	</div>

</template>

<style >
	.custom-file-input::-webkit-file-upload-button {
	  visibility: hidden;
	}
	.custom-file-input::before {
	  content: 'Select some files';
	  visibility: visible;
	  display: inline-block;
	  background: -webkit-linear-gradient(top, #f9f9f9, #e3e3e3);
	  border: 1px solid #999;
	  border-radius: 3px;
	  padding: 5px 8px;
	  outline: none;
	  white-space: nowrap;
	  -webkit-user-select: none;
	  cursor: pointer;
	  text-shadow: 1px 1px #fff;
	  font-weight: 700;
	  font-size: 10pt;
	}
	.custom-file-input:hover::before {
	  border-color: black;
	}
	.custom-file-input:active::before {
	  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
	}
</style>

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
					mode:'checked',
					profile_pic:'/default-user-image.png'
				}),
				loginData:{
					username:'',
					password:''
				}
			}
		},

		methods : {
			signup(){
				this.loginData = {username:this.form.username,password:this.form.password};
				this.form.submit('post','/signup')
				.then(res => {
					//this.$router.push('/');
					axios.post('/login', querystring.stringify(this.loginData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
	                .then(response => {
	                	
	                    this.$router.push('/');
	                })
	                .catch(error => {
	                    console.log(error);
	                });
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