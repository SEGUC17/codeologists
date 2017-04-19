<script>
import calenderHeader from './calenderHeader.vue';
import month from './month.vue';
export default {
    methods:{
        findHREF:function(index){
            return "/dayDetail/"+index;
        
        },
        showDayDetails:function(){
            //TODO:handle re-showing the dayDetails component
            this.$emit('showagain');
        }
    },
    data(){
        return {
            arena:{},
            errors:{}
        }
    },
    mounted(){
        axios.get('/arena/12/show').then(res => arena = (res.data) ).catch(error => errors = (error));
    }
}
</script>
<template>
<div>
<div >
<calenderHeader></calenderHeader>
<ul class="weekdays">
  <li>Mo</li>
  <li>Tu</li>
  <li>We</li>
  <li>Th</li>
  <li>Fr</li>
  <li>Sa</li>
  <li>Su</li>
</ul>
<ul class="days">  
<router-link tag="li"  v-for="n in 31" :to="findHREF(n)" :key='n'><button v-on:click="showDayDetails">{{n}}</button></router-link>
</ul>
</div>
</div>
</template>
<style>
* {box-sizing:border-box;}
ul {list-style-type: none;}
body {font-family: Verdana,sans-serif;}

.month {
    padding: 70px 25px;
    width: 100%;
    background: #1abc9c;
}

.month ul {
    margin: 0;
    padding: 0;
}

.month ul li {
    color: white;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 3px;
}

.month .prev {
    float: left;
    padding-top: 10px;
}

.month .next {
    float: right;
    padding-top: 10px;
}

.weekdays {
    margin: 0;
    padding: 10px 0;
    background-color: #ddd;
}

.weekdays li {
    display: inline-block;
    width: 13.6%;
    color: #666;
    text-align: center;
}

.days {
    padding: 10px 0;
    background: #eee;
    margin: 0;
}

.days li {
    list-style-type: none;
    display: inline-block;
    width: 13.6%;
    text-align: center;
    margin-bottom: 5px;
    font-size:12px;
    color: #777;
}

.days li .active {
    padding: 5px;
    background: #1abc9c;
    color: white !important
}

</style>