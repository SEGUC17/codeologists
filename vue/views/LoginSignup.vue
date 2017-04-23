<template>
	<div class="box">
		<div class="tabs is-centered is-boxed is-medium">
			<ul>		
				<li  @click="login=true" :class="{'is-active' : login}"><router-link to="/login-signup/login"><span>Login</span></router-link></li>
				<li @click="login=false" :class="{'is-active' : !login}"><router-link to="/login-signup/signup"><span>Signup</span></router-link></li>
			</ul>
		</div>
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
				error:false,
				login:true
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