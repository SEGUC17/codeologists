<style>

.normal {    
box-sizing:border-box;
list-style-type: none;
    display: inline-block;
    width: 13.6%;
    text-align: center;
    margin-bottom: 5px;
    font-size:15px;
    color: #777;
        }   
.active {
     padding: 5px;
    background: #1abc9c;
    color: white !important
}
</style>

<template>
<li class="normal" ><slot name="dayNumber"></slot></li>
</template>
<script>
    export default{
        
    }
</script>
