<template>

		<form action="/login" method="post" @submit.prevent="login" @keydown="error=false" class="w3-container">
			<div class="field">
					<input type="text" name="username" v-model="form.username" class="w3-input w3-animate-input" placeholder="Username">	
			</div>
			<div class="field">
					<input type="password" name="password" v-model="form.password" class="w3-input w3-animate-input" placeholder="Password">
			</div>

			<span class="help is-danger" v-if="error">Invalid username or password</span>

			<div class="field">
					<a :class="loading" @click="login">Login</a>
			</div>

		</form>

</template>


<script>

	export default {
		data(){
			return{
				form : new Form({
					username:'',
					password:''
				}),
				error:false,
				loading:'button is-primary w3-xlarge'
			}
		},
		methods : {
			login(){
				this.loading='button is-primary is-loading w3-xlarge';
				this.form.submit('post','/login')
				.then(res => {
					this.loading='button is-primary w3-xlarge';
					console.log(res);
					Event.$emit('loggedIn',{user:res.user,type:res.type});
					this.$router.push('/');
				})
				.catch(err => {
					this.loading='button is-primary w3-xlarge';
					this.error = true
				});
			}
		}

	}
</script>