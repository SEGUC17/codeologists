<template>

		<form class="box" action="/login" method="post" @submit.prevent="login" @keydown="error=false">
			<input type="text" name="username" v-model="form.username" class="input" placeholder="Username">	
			<input type="password" name="password" v-model="form.password" class="input" placeholder="Password">
			<input type="submit" value="login" class="button">

			<span class="help is-danger" v-if="error">Invalid username or password</span>

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
				error:false
			}
		},
		methods : {
			login(){
				this.form.submit('post','/login')
				.then(res => {
					console.log(res);
					Event.$emit('loggedIn',{user:res.user,type:res.type});
					this.$router.push('/');
				})
				.catch(err => {
					
					this.error = true
				});
			}
		}

	}
</script>