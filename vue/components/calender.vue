<script>
export default {
    methods:
    {
        getData(){
        
        axios.get('/arena/'+this.arenaName+'/getSchedule').then((res) => this.updateSchedule(res.data)).catch(error => this.errors = (error.data));
        axios.get('/arena/'+this.arenaName+'/getPrice').then(res => {
            this.pricePerHour = res.data.price;
        }).catch((err) => window.alert('Error'));

        },
        showPrev(){
            if(this.calMonth != ((new Date()).getMonth()))
            {
                Event.$emit('hidedaydetails');
            }
            
            Event.$emit('showfirstmonth');    
            
            
        },
        showNext(){

            if(this.calMonth == ((new Date()).getMonth()))
            {
                Event.$emit('hidedaydetails');
            }
            

               Event.$emit('shownextmonth');    
                
        },
        findHREF:function(index){
            if(this.isButtonEnabled(index))
            return "/schedule/"+this.arenaName+"/dayDetail/"+index;
            else
            {   
                return "/schedule/"+this.arenaName+"/dayDetail/-1";
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
            if(!((date)>(dateToComp) || !this.schedule || Math.floor((dateToComp-date)/(3600*1000*24))+weekDay>27) ) //or diff in days >27-weekDayIndex
            {
                
                Event.$emit('showagain',{schedule:this.schedule[index.weekIndex][index.dayIndex],day:day,month:this.calMonth,arenaName:this.arenaName,price:this.pricePerHour});
            }
            else if(! this.schedule)
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
        refresh(eventData){
            //TODO get the value of arenaName from $route.params
            //change when merging
          
            
            var index = this.getScheduleIndex(eventData.day,eventData.month);
            this.schedule[index.weekIndex][index.dayIndex] = eventData.schedule;
            
        },
        getRange(monthIndex){
            if(monthIndex ==0 || monthIndex ==2 || monthIndex==4 || monthIndex ==6 || monthIndex ==7 || monthIndex ==9 || monthIndex ==11)
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
        updateSchedule(newArenaData){
            this.schedule = newArenaData.schedule;
        }
    },
    data()
    {
        return {
            schedule:{},
            errors:{},
            pricePerHour:{}
            
        }
    },
    mounted()
    {
        //TODO get the value of arena name from $route.params
      
         
        this.getData(); 
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
        arenaName()
        {
            return this.$route.params.arenaName;
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
        Event.$emit('calendercreated');
        Event.$on('bookingsent',(data) => this.refresh(data) );
       
    },
    props:['monthName']
    
}
</script>
<template>
<div>
<div >
<div class="month">      
  <ul>
    <li class="prev" v-if="calMonth != ((new Date()).getMonth())"><a v-on:click="showPrev">&#10094; Back  </a></li>
    <li class="next" v-if="calMonth == ((new Date()).getMonth())"><a v-on:click="showNext">  Next Month &#10095;</a></li>
    <li style="text-align:center">
      <slot name="month" ></slot><br>
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
    background: #ff9800;

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