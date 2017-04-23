<template>



	<div class="box">
		
		<!--Start of edit arena info form-->

		<form method="post" action="/signup" @submit.prevent="signup" @keydown="form.errors.clear($event.target.name)">
			<label  class="label">Choose type of account</label>
			<div class="tabs is-toggle">
				<ul>
					<li :class="{'is-active':form.type=='player'}" @click="form.type='player'">
						<a>
							<span>Player</span>
						</a>
					</li>
					<li :class="{'is-active':form.type=='service'}" @click="form.type='service'">
						<a>
							<span>Service Provider</span>
						</a>
					</li>
				</ul>
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
				<input type="checkbox" name="mode" class="checkbox" v-model="form.mode">
			</div>
			<div class="field">
				<label  class="label">Profile picture</label>
				<img :src="form.profile_pic" class="w3-circle">
				<input type="file" name="profile_pic" class="input" placeholder="Profile picture" @change="onFileChange">
			</div>
			<div class="field">
				<a :class="loading" @click="signup">Sign Up!</a>
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
					mode:'checked',
					profile_pic:'/default-user-image.png'
				}),
				loading:'button is-primary w3-xlarge'
				loginData:{
					username:'',
					password:''
				}
			}
		},

		methods : {
			signup(){
				this.loading='button is-primary w3-xlarge is-loading';
				this.loginData = {username:this.form.username,password:this.form.password};
				this.form.submit('post','/signup')
				.then(res => {
					axios.post('/login', querystring.stringify(this.loginData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
	                .then(response => {
	                	
	                    this.$router.push('/');
	                })
	                .catch(error => {
	                    console.log(error);
	                });
				})
				.catch(err => {
					this.loading='button is-primary w3-xlarge';
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