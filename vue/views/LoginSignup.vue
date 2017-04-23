<template>

		<div>

		<router-link to="/login-signup/login"><a>login</a></router-link>
		<router-link to="/login-signup/signup"><a>signup</a></router-link>

		<router-view></router-view>

		</div>

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