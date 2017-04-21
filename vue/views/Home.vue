<template>
	<div>
		<article class="message" v-for="status in statuses">
	  		<div class="message-header">
	    		<p>{{status.user}} says</p>
	    		<button class="delete"></button>
	  		</div>
	  		<div class="message-body">{{status.content}}</div>
		</article>
	</div>

</template>


<script>

	export default {
		data(){
			return {
				statuses : [],
				pp:''
			}
		},

		created(){
			this.statuses.push({user : "Omar" , content : "Hello"});
		}
	}
</script>