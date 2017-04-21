<script>
//import calenderHeader from './calenderHeader.vue';
import month from './month.vue';
export default {
    methods:
    {
        findHREF:function(index){
            if(index>=this.cDayIndex)
            return "/dayDetail/"+index;
            else
            {   
                console.log('index :' + index);
                return "/dayDetail/1";
            }
        },
        showDayDetails:function(day){
            //TODO:handle re-showing the dayDetails component
            var index =this.getScheduleIndex(day,this.calMonth)
            var dateToComp = new Date((new Date()).getFullYear(),this.calMonth,day);
            dateToComp.setHours(0,0,0,0);
            var date = new Date();
            date.setHours(0,0,0,0);
            if(!((date)>(dateToComp) || !this.arena.schedule) )
            {
                
                Event.$emit('showagain',{schedule:this.arena.schedule[index.weekIndex][index.dayIndex],day:day,month:this.calMonth,arenaName:this.arena.name});
            }
            else if(! this.arena.schedule)
            {   
                Event.$emit('showagain');
            }
        },
        getScheduleIndex(bDay,bMonth)
        {
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            var year = date.getFullYear();
            var weekDay = (date.getDay() + 1) % 7;
            var curDate = new Date(year, bMonth, bDay);
            var firstDayInWeek = new Date(date - (weekDay * 1000 * 60 * 60 * 24));
            var difInWeeks = Math.floor((curDate - firstDayInWeek) / 1000 / 60 / 60 / 24 / 7);
            return { weekIndex: difInWeeks, dayIndex: (curDate.getDay() + 1) % 7 };
        },
        refresh(){
            //TODO get the value of arenaName from $route.params
            var arenaName = "12";
            axios.get('/arena/'+arenaName+'/show').then(res => this.arena = res.data).catch(error => this.errors = (error.data));
        
        }
    },
    data()
    {
        return {
            arena:{},
            errors:{},
            monthName:(new Date()).toLocaleString("en-us", { month: "long" }),
        }
    },
    mounted()
    {
        //TODO get the value of arena name from $route.params
      
         Event.$emit('calendercreated',{month:this.calMonth,day:this.cDayIndex});
        this.refresh();
    },
    computed :
    {
        calMonth(){
            if(! this.monthName)
            return -1;
            else if(this.monthName === 'January')
            return 0;
            else if(this.monthName === 'February')
            return 1;
            else if(this.monthName === 'Mars')
            return 2;
            else if(this.monthName === 'April')
            return 3;
            else if(this.monthName === 'May')
            return 4;
            else if(this.monthName === 'June')
            return 5;
            else if(this.monthName === 'July')
            return 6;
            else if(this.monthName === 'August')
            return 7;
            else if(this.monthName === 'September')
            return 8;
            else if(this.monthName === 'October')
            return 9;
            else if(this.monthName === 'November')
            return 10;
            else if(this.monthName === 'December')
            return 11;
            else
            return -1;
        },
        year(){
            return (new Date()).getFullYear();
        },
        cDayIndex()
        {
            var todayDate= new Date();
            if(todayDate.getMonth()<this.calMonth)
            {
                return -1;
            }
            else if(todayDate.getMonth()==this.calMonth)
            {
            return todayDate.getDate();
            }
            else
            {
                return 100;
            }
        }
    },
    created(){
    
        Event.$on('bookingsent',()=>this.refresh());
       
    }
    
}
</script>
<template>
<div>
<div >
<div class="month">      
  <ul>
    <li class="prev">&#10094;</li>
    <li class="next">&#10095;</li>
    <li style="text-align:center">
      <p name="monthName" v-model="monthName" v-text="monthName"></p><br>
      <span style="font-size:18px"><p v-text="year" ></p></span>
    </li>
  </ul>
</div>
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
<router-link tag="li"  v-for="n in 31" :to="findHREF(n)" :key='n' :day="n"><button @click="showDayDetails(n)">{{n}}</button></router-link>
</ul>
</div>
<router-view ></router-view>
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