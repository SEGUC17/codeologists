Vue.component('game',{
	props:['creator','size','location','sugeestedarenas','startdate','enddate','id'],
	template:	`
  <div v-for="game in games">
    <article class="message" >
    <div class="message-header">
        <p>Game number#</p>
      </div>
    <h3>Creator : {{creator}}</h3>
    <h3>Size : {{size}}</h3>
    <h3>Location : {{location}}</h3>
    <h3>Sugeested Arenas : {{sugeestedarenas}}</h3>
    <h3>Start date  : {{startdate}}</h3>
    <h3>End date : {{enddate}}</h3>

    <slot></slot>

     </article>
   <button type="button" @click="showmodal=true" >Send a request</button>

     </div>

     	`
 

});
Vue.component('modal',{
  template:`
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-content">

        <form :action="accept" method="POST">
      <input  class="textarea" placeholder="Add a comment..." v-model="comment">
        <button type="submit" >Send The Request</button>
      </form>

  </div>
  <button class="modal-close" @click="$emit('close')"></button>
</div>`
,data(){

    return{
      accept:"/RequestGame/:"+this.id
    };
   }
});
new Vue({
	el:'#root'
  ,
  data:{
    showmodal:false,
    comment:"",
    games:[{creator:"ff"},{creator:"faaf"}]

  },
  mounted(){
axios.get("/viewgames").then(res=>{
this.games=res.data
});
  }
});