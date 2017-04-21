<template>
<li>
<slot name="player"></slot>
<button v-on:click="print(this.bookingID)" >Accept</button>
<button >Reject</button>
</li> 
</template>
<script>
export default{ 
    props:['bookingID'],
    methods:{
        print(id){
            window.alert(id);
        }
    }
    
}
</script>
<style >
</style>

