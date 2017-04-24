<style >
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
@media screen and (max-width:720px) {
    .weekdays li, .days li {width: 13.1%;}
}

@media screen and (max-width: 420px) {
    .weekdays li, .days li {width: 12.5%;}
    .days li .active {padding: 2px;}
}

@media screen and (max-width: 290px) {
    .weekdays li, .days li {width: 12.2%;}
}

</style>
<template>
<div id="wrapper">
<div class="days" v-for="n in 31">
<day><template slot="dayNumber">{{n}}</template></day> 
</div>
</div>
</template>
<script>
    export default{
        } 
    
</script>