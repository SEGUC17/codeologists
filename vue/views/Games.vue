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
    <h3>Start date  : {{game.startdate}}</h3>
    <h3>End date : {{game.enddate}}</h3>

 <button type="button" class="button is-info" @click="showmodal=true" >Send a request</button>

     </article>
   
   <div v-if="showmodal">
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">

        <form :action="accept" method="POST" @submit.prevent="onsubmit(game)">
      <input  class="textarea" placeholder="Add a comment..." v-model="comment">
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
				accept:"/RequestGame/:"+this.id,
				games:[],
				comment:"",
				showmodal:false
			}
		},

		created(){
			axios.get("/viewgames").then(res=>{
			this.games=res.data
			});
		},

		methods : {
		onsubmit(game){
    axios.post('/RequestGame/'+game._id,{
comment:this.comment
    });
    alert("Request was sent successfully");
  }
			
		}
	}
</script>