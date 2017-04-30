<template>
<div>
   <div v-for="Notification in Notifications">
<div class="notify notify-yellow"><span class="symbol icon-tick"></span>{{Notification}}</div> 
</div>
</div>
</template>
<style >
  .notify {
  background-color:#e3f7fc; 
  color:#555; 
    border:.1em solid;
  border-color: #8ed9f6;
    border-radius:10px;
    font-family:Tahoma,Geneva,Arial,sans-serif;
    font-size:1.1em;
    padding:10px 10px 10px 10px;
    margin:10px;
    cursor: default;
}

.notify-yellow { background: #fff8c4; border-color: #f7deae; }
.notify-red { background: #ffecec; border-color: #fad9d7; }
.notify-green { background: #e9ffd9; border-color: #D1FAB6; }


</style>

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