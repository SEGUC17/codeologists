<template>
	<div class="modal is-active">
	  <div class="modal-background" @click="closeAlert"></div>
	  <div class="modal-content">
	  	<div class="box">
	  		<div class="columns">
	  			<div class="column">
			  		<slot></slot>
			  	</div>
			  	<div class="column">
			  		<img src="/red.jpg" height="360" width="128">
			  	</div>
	  		</div>
	  	</div>
	  </div>
	  <button class="modal-close" @click="closeAlert"></button>
	</div>
</template>

<script >
	export default{
		methods:{
			closeAlert(){
				Event.$emit('closeAlert');
			}
		}
	}
</script>