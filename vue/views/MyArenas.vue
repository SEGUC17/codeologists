<template>
	<div>
		<article class="message" v-for="arena in arenas">
	  		<div class="message-header">
	    		<p>{{arena.name}}</p>
	    		<button @click="editClicked(arena)" class="button is-primary">
	    			<router-link to="/editArena">
	    				<a>Edit</a>
	    			</router-link>
	    		</button>
	  		</div>
	  		<div class="message-body">{{arena.location}}</div>
		</article>
	</div>

</template>


<script>

	export default {
		data(){
			return {
				arenas : []
			}
		},

		created(){
			axios.get('/myArenas')
			.then(res => this.arenas=res.data)
			.catch(err => console.log(err));
		},

		methods : {
			editClicked(arena){
				Event.$emit('edit-arena',arena);
			}
		}
	}
</script>