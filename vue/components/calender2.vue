<script>
export default {
    methods:
    {
        showPrev(){
            if(this.calMonth != ((new Date()).getMonth()))
            {
                Event.$emit('hidedaydetails2');
            }
            
            Event.$emit('showfirstmonth2');    
            
            
        },
        showNext(){
            if(this.calMonth == ((new Date()).getMonth()))
            {
                Event.$emit('hidedaydetails2');
            }
            
               Event.$emit('shownextmonth2');    
                
        },
        findHREF:function(index){
            if(this.isButtonEnabled(index))
            return "/editSchedule/"+this.arenaName+"/dayDetail2/"+index;
            else
            {   
                return "/editSchedule/"+this.arenaName+"/dayDetail2/-1";
            }
        },
       isButtonEnabled:function(index){
             return index>=this.cDayIndex && (index-this.cDayIndex+this.daysInPreMonth()<=28);
         },
         daysInPreMonth(){
             var today = new Date();
             if(this.calMonth == today.getMonth())
                 return 0;
             else
             {
                 var nDays = this.getRange(today.getMonth());
                 return (nDays-today.getDate()+1);
             }
         },
        showDayDetails:function(day){
            //TODO:handle re-showing the dayDetails component
            var index =this.getScheduleIndex(day,this.calMonth)
            var dateToComp = new Date((new Date()).getFullYear(),this.calMonth,day);
            dateToComp.setHours(0,0,0,0);
            var date = new Date();
            date.setHours(0,0,0,0);
            var weekDay = (date.getDay()+1)%7;
            if(!((date)>(dateToComp) || !this.arena.schedule || Math.floor((dateToComp-date)/(3600*1000*24))+weekDay>27) ) //or diff in days >27-weekDayIndex
            {
                
                Event.$emit('showagain2',{schedule:this.arena.schedule[index.weekIndex][index.dayIndex],day:day,month:this.calMonth,arenaName:this.arenaName});
            }
            else if(! this.arena.schedule)
            {   
                Event.$emit('showagain2');
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
          //  console.log(this.arenaName());
             axios.get('/arena/'+this.arenaName+'/show').then((res) => this.updateBookings(res.data)).catch(error => this.errors = (error.data));
        
        },
         getRange(monthIndex){
             if(monthIndex ==0 || monthIndex ==2 || monthIndex==4 || monthIndex ==6 || monthIndex ==7 || monthIndex ==9 ||monthIndex ==11)
                    return 31;
                else if(monthIndex != 1)
                    return 30;
                else if((new Date()).getFullYear()%4 ==0)
                    return 29;
                else
                    return 28;
        },
        getShiftAmount(){
            var startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setMonth(this.calMonth);
            return (startOfMonth.getDay() -1)%7;
        },
        updateBookings(newArenaData,eventData){
            
             this.arena = newArenaData;
             if(!eventData)
             return //handling the refresh call in mounted();
             var index = this.getScheduleIndex(eventData.day,eventData.month);
             console.log(this.arena.schedule[index.weekIndex][index.dayIndex]);
             Event.$emit('updatedBookings2',this.arena.schedule[index.weekIndex][index.dayIndex]);}
    },
    data()
    {
        return {
            arena:{},
            errors:{},
            
        }
    },
    mounted()
    {
        //TODO get the value of arena name from $route.params
      
        // Event.$emit('calendercreated',{month:this.calMonth,day:this.cDayIndex});
        this.refresh();
    },
    computed :
    {arenaName()
        {
            return this.$route.params.arenaName;
        },
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
        //this.arenaName = this.arenaName();
        Event.$on('changed',()=>this.refresh());
        Event.$emit('calendercreated2');
       
    },
    props:['monthName']
    
}
</script>
<template>
<div class="w3-container">
 <br>
 <div class="w3-quarter">
     <h1>&nbsp</h1>
 </div>
 <div class=" w3-half w3-card">
 <div class="month w3-display-container">      
     <div class="w3-display-left" v-if="calMonth != ((new Date()).getMonth())"><a style="color:black" v-on:click="showPrev"><b> &#10094; Back  </b></a></div>
     <div class="w3-display-right w3-text-white" v-if="calMonth == ((new Date()).getMonth())"><a style="color:black" v-on:click="showNext"><b> Next &#10095 </b> </a></div>
     <div class="w3-display-middle w3-text-white">
      <slot name="month" ></slot><br>
      <span style="font-size:18px"><p v-text="year" ></p></span>
      </div>
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
<li v-for="i in getShiftAmount()"><a>-</a></li>
<router-link tag="li"  v-for="n in getRange(calMonth)" :to="findHREF(n)" :key='n' :day="n"><button class="button is-white" @click="showDayDetails(n)" :disabled="! isButtonEnabled(n)">{{n}}</button></router-link>

</ul>
</div>
</div>
</template>
<style>
* {box-sizing:border-box;}
ul {list-style-type: none;}
a { cursor:hand;}
body {font-family: Verdana,sans-serif;}
.month {
    padding: 70px 25px;
    width: 100%;
    background: #00ccff;
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
    background-color: #fff;
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