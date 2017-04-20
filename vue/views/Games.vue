<template>

<div>
	<div v-for="game in games">
    <article class="message" >
    <div class="message-header">
        <p>Game details</p>
      </div>
    <h3>Creator : {{game.creator}}</h3>
    <h3>Size : {{game.size}}</h3>
    <h3>Location : {{game.location}}</h3>
    <h3>Start date  : {{game.start_date}}</h3>
    <h3>End date : {{game.end_date}}</h3>

 <button type="button" class="button is-info" @click="showmodal=true" >Send a request</button>

     </article>
   
   <div v-if="showmodal">
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">

        <form action="/RequestGame" method="POST" @submit.prevent="onsubmit(game)">
      <input  class="textarea" placeholder="Add a comment..." v-model="form.comment">
        <button type="submit" class="button is-info" >Send The Request</button>
      </form>

  </div>
  <button class="modal-close" @click="showmodal=false"></button>
</div>
</div>

     </div>

</div>

</template>


<script>

	export default {
		data(){
			return {
				form : new Form ({
				comment:""
				}),
				games:[],
				showmodal:false,
			}
		},

		created(){
			axios.get("/viewgames").then(res=>{
			this.games=res.data
			});
		},

		methods : {
		onsubmit(game){
			this.form.submit('post','/RequestGame/'+game._id).then(response => alert(response))
    .catch(errors => alert(errors));
  			  
  			}
			
		}
	}
</script>