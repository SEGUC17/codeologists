<template>
<div id="rservetimeroot"  >

<calender v-if="!showNextMonth" :id="getCurrentMonth"  :monthName="getCurrentMonth" ><template slot="month">{{getCurrentMonth}}</template></calender>

<calender :id="getNextMonth" v-if="showNextMonth && nextMonthHasDays"  :monthName="getNextMonth" ><template slot="month">{{getNextMonth}}</template></calender>
<br>
</div>
</template>
<script>
   import calender from '../components/calender';  
   import bulma from 'bulma';
    export default {
        data(){
            return {//arena name and schedule are to be changed to props ! 
                showNextMonth :false,
                schedule:"",
                arenaName:'',
            }
        },
        computed:{
            getCurrentMonth(){
                var objDate = new Date();
                var cMonth =  objDate.toLocaleString("en-us", { month: "long" });
                return cMonth;
            },
            getNextMonth(){
             var objDate = new Date();
             objDate.setDate(28);//to avoid overloading (e.g 31/Jan + one month = 2/Mars)
             objDate.setMonth(objDate.getMonth()+1);
             return  objDate.toLocaleString("en-us", { month: "long" });
                
            },
            nextMonthHasDays(){
                var endDay = this.getRange((new Date()).getMonth());
                var date = new Date();
                return (endDay - (date.getDate())+ date.getDay() <28);
            },

        },
        components:[calender],
        methods:{
            getRange(monthIndex){
                if(monthIndex ==0 || monthIndex ==2 || monthIndex ==4 || monthIndex ==6 || monthIndex ==7 || monthIndex ==9 || monthIndex ==11)
                    return 31;
                else if(monthIndex != 1)
                    return 30;
                else if((new Date()).getFullYear()%4 ==0)
                    return 29;
                else
                    return 28;
                },
            
            },
        created()
            {
                Event.$on('showfirstmonth',() => this.showNextMonth = false);
                Event.$on('shownextmonth',() => this.showNextMonth = (this.nextMonthHasDays))

            }
    }
</script>
<style>
    
</style>