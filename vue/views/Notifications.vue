<template>
<div>
   <div v-for="Notification in Notifications">
<article class="message" >
    <div class="message-header">
        <p>Notification detail:</p>
      </div>
    <h3>Details :{{Notification}}</h3>
  <!--  <form action="/delete" method="POST" @submit.prevent="rej(request)">
   <button type="submit" class="button is-info" >Reject</button>
   </form> -->
     </article>
</div>
</div>
</template>


<script>

  export default {
    data(){
        return{
          Notifications:[],
        };
   },

    mounted(){
        axios.get("/myNotifications").then(res=>{
        // this.Notifications=res.data
        for(var i=res.data.length-1 ;i>=0;i--){
          this.Notifications.push(res.data[i]);
        }
        }); 



  },
  methods:{
   }
}
</script>