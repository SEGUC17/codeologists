<template>
<div>
  <h1> {{requests}}</h1>
   <div v-for="request in requests">
<article class="message" v-show="visible">
    <div class="message-header">
        <p>Requet details: {{this.requests}}</p>
      </div>
      <h1> {{requests}}</h1>
       <h1> {{request}}</h1>
    <h3>Player Username :{{request.playerUsername}}</h3>
    <h3>Comment :{{request.comment}} </h3>

   <button type="submit" class="button is-info" @click="acc(request)">Accept</button>
   <button type="submit" class="button is-info" @click="rej(request)">Reject</button>
     </article>
</div>
</div>
</template>


<script>

  export default {
    data(){
        return{
          visible:true,
          requests:[{playerUsername:"dkdl",comment:"dlk"},{playerUsername:"dkdl",comment:"dlk"}],
          id:""
        };
   },

    mounted(){
        axios.get("/myrequests").then(res=>{
        this.requests=res.data
        }); 

        axios.get("/mygame").then(res=>{
        this.id=res.data
        }); 

  },
  methods:{
  acc(request){
     axios.post('/AcceptRequest/'+this.id,{
        playerUsername:request.playerUsername
        });
    alert("Request was accepted successfully");
    this.visible=false;
  }
,rej(request){
    axios.post('/RejectRequest/'+this.id,{
        playerUsername:request.playerUsername
        });
    alert("Request sent rejected successfully");
    this.visible=false;

    }

   }
}
</script>