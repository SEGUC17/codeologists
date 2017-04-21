Vue.component('request',{
	props:['playerusername','comment'],
	template:	`
    <article class="message" v-show="visible">
    <div class="message-header">
        <p>Requet details</p>
      </div>
    <li><h3>Player Username :{{playerusername}}</h3><h3>Comment :{{comment}} </h3></li>

    <div class="tabs is-right">
      <form :action="accept" method="POST" @submit.prevent="onsubmitAcc">
              <button type="submit" class="button is-info" @click="hide">Accept</button>
      </form>
    </div>

    <div class="tabs is-left">
      <form :action="reject" method="POST" @submit.prevent="onsubmitRej">
              <button type="submit" class="button is-info" @click="hide">Reject</button>
      </form>
      </div>
     </article>	`
 ,data(){

    return{
    	visible:true,
      reject:"/RejectRequest/"+this.id,
      accept:"/AcceptRequest/"+this.id
    };
   },
 methods:{
 	hide(){
 		this.visible=false;
 	}
  ,onsubmitAcc(){
    axios.post('/AcceptRequest/'+this.id,{
playerUsername:this.playerUsername
    });
    alert("Request was accepted successfully");
  }
,onsubmitRej(){
    axios.post('/RejectRequest/'+this.id,{
playerUsername:this.playerUsername
    });
    alert("Request sent rejected successfully");
  }
 }

});
new Vue({
	el:'#root'
  ,
  data:{
    requests:[{playerusername:"ff"},{playerusername:"faaf"}],
    id:"",

  }
  ,
 
});