<template>
<div v-if="shown">
   <button v-on:click="hideMe">Close Me </button>
    {{$route.params.dayIndex}}

</div>
</template>
<script>
    export default{
        data(){
            return{
                shown:true

            }
        },
        methods:{
            hideMe:function(){
                this.$emit('hide');
            },
            

        },
      mounted(){
          
      }  
        
    }
</script>
<style>
    
</style>