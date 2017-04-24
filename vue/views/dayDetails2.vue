<template>

<div v-if="shown">
   Selected day: {{day}}
   <a  v-on:click="hideMe">&#10799; </a>
    <div class="Content">
   <span class="tag is-primary" > Start Time</span>
    <select v-model="startTime"  @change="nullifyEndTime()">
    <option v-for="(freeSlot,index) in freeSlots" :key="index">{{freeSlot}}</option>
   </select>
   </div>

 <div v-if="startTime != null">
    <span class="tag is-primary"> End Time</span>
    <select v-model="endTime" >
    <option v-if="startTime != null" v-for="n in (findIndex(maxAllowedEndTime) - findIndex(startTime))" :key="n">{{findTime(n+findIndex(startTime))}}</option>

   </select>
   </div> 



   <div>
   <span class="tag is-danger">Booked slots</span>
   <table class="table is-bordered is-striped" id="unavailable">
   <tr>
    <th> <abbr title="Played">Start</abbr> </th>
    <td v-for="reserved in reservedSlots"> {{reserved.start}}</td>
    </tr>
  <tr>
    <th> <abbr>End</abbr></th>
    <td v-for="reserved in reservedSlots">{{reserved.end}}</td>
  </tr>
   </table>
</div>


   
   <div>
   <span class="tag is-danger">Unavailable slots</span>
   <table class="table is-bordered is-striped" id="unavailable">
   <tr>
    <th> <abbr>Start</abbr></th>
    <td v-for="reserved in unavailableSlots"> {{reserved.start}}</td>
        <td>&nbsp</td>
                <td>&nbsp</td>
</tr>
  <tr>
    <th> <abbr title="Played">End</abbr></th>
    <td v-for="reserved in unavailableSlots">{{reserved.end}}</td>
  </tr>
   </table>
</div>

   <button class="button is-black is-focused" v-on:click="setUnavailable" v-if="startTime != null && endTime != null">Set unavailable  </button>
   <button class="button is-black is-focused" v-on:click="setUnavailable2" v-if="startTime != null && endTime != null">Set available  </button>
   <div id="error">
    <label v-if="error">Sorry Could not complete your action</label>
   </div>
</div>
</template>
<script>
    export default{
        data(){
            return{
                shown:true,
                schedule:{},
                startTime:null,
                endTime:null,
                day:null,
                month:null,
                error:false,
                arenaName:null,
            }
        },
        methods:{
            hideMe:function(){
                this.startTime=null;
                this.endTime = null;
                this.error = false;
                this.shown =false;
            },
            nullifyEndTime(){
                 this.endTime =null;},
            findTime(index)
            {
               
                var hours = Math.floor(index / 2);
                var min = '00';
                if (index % 2 == 1)
                min = '30';
               if(hours<10)
                return '0'+hours+':'+min;
                else
                return hours+':'+min;
            },
            findIndex(time){
               if(! time) return -1;
                var arr = time.split(':');
                var min = parseInt(arr[1], 10)
                var hours= parseInt(arr[0],10);
               return Math.floor(min/30) + 2 *(hours);   
             },
             setUnavailable(){
                 
                 axios.post('/sp/arena/'+this.arenaName,querystring.stringify(
                 {
                     day:this.day,
                     month:this.month,
                     startIndex:this.findIndex(this.startTime),
                     endIndex:this.findIndex(this.endTime)-1,
                     flag:1,
                     username:"h"
                    
                 }),
                 {headers:
                 {
                     "Content-Type":"application/x-www-form-urlencoded"
                 }
                 }).then((res)=>
                     {  Event.$emit('changed',{day:this.day,month:this.month})
                        this.hideMe();
                        }
                 ).catch(error => {this.error=true
                                    alert(error)    });
             },
             setUnavailable2(){
                axios.post('/sp/arena/'+this.arenaName,querystring.stringify(
                 {
                     day:this.day,
                     month:this.month,
                     startIndex:this.findIndex(this.startTime),
                     endIndex:this.findIndex(this.endTime)-1,
                     flag:0,
                     username:"h"
                    
                 }),
                 {headers:
                 {
                     "Content-Type":"application/x-www-form-urlencoded"
                 }
                 }).then((res)=>
                     {  Event.$emit('changed',{day:this.day,month:this.month})
                                             this.hideMe();
                 }
                 ).catch(error => {this.error=true
                                    console.log(error)
                                    alert(error)    });
             },
             assignValues(data){
                 //console.log("in assignValues ");
                 this.shown= true;                
                 if(!data)
                 return;
                 this.day = data.day;
                 this.month = data.month;
                 this.schedule =data.schedule;
                 this.arenaName = data.arenaName;
             },
              updateSchedule(){
                     //update schedule of dayDtails component
                     Event.$emit('changed',{day:this.day,month:this.month});
                     for(var i=this.findIndex(this.startTime);i<this.findIndex(this.endTime);i++)
                     {
                         this.schedule[i]=-1;
                     }
                     this.startTime=null;
                     this.endTime = null;}
        
        },
        computed:{
            freeSlots(){
                var freeSlotsArray = [];
                for(var i=0;i<this.schedule.length;i++)
                {
                    if(this.schedule[i]==0 || this.schedule[i]== -1)
                        freeSlotsArray.push(this.findTime(i));
                }
                return freeSlotsArray;
            },
            unavailableSlots(){
                var bookedBlocks = [];
                for(var i=0;i<this.schedule.length;i++)
                {
                    if(this.schedule[i] != 0)
                    {
                        var startOfBlock =i;
                        while(this.schedule[i] == -1  && i<this.schedule.length)
                        {
                            i++;
                        }
                        if(this.findTime(startOfBlock)!=this.findTime(i))
                        bookedBlocks.push({"start":this.findTime(startOfBlock),"end":this.findTime(i)})
                    }
                }
                return bookedBlocks;
            },
            reservedSlots(){
             var bookedBlocks = [];
                for(var i=0;i<this.schedule.length;i++)
                {
                    if(this.schedule[i] != 0)
                    {
                        //console.log(i);
                        var startOfBlock =i;
                        while(this.schedule[i] != -1 && this.schedule[i] != 0 && i<this.schedule.length)
                        {
                            i++;
                        }
                        if(this.findTime(startOfBlock)!=this.findTime(i))
                        bookedBlocks.push({"start":this.findTime(startOfBlock),"end":this.findTime(i)})
                    }
                }
                return bookedBlocks;      
            },
            maxAllowedEndTime(){
               var index =  this.findIndex(this.startTime);
                while((this.schedule[index]==0 || this.schedule[index]==-1) && index<this.schedule.length)
                {
                    index++;
                }
                return this.findTime(index);
            }
        },
        created()
        {   this.hideMe();
            //Event.$emit('daydetailcreated');
            Event.$on('hidedaydetails2',() => this.hideMe());
            Event.$on('showagain2',(data) => this.assignValues(data));
            Event.$on('updatedBookings2',(eventData) => this.updateSchedule(eventData));
        }
        
        
    }
</script>
<style>
    select {
     -webkit-appearance: button;
     -moz-appearance: button;
     -webkit-user-select: none;
     -moz-user-select: none;
     -webkit-padding-end: 20px;
     -moz-padding-end: 20px;
     -webkit-padding-start: 2px;
     -moz-padding-start: 2px;
     background-color: #F07575; /* fallback color if gradients are not supported */
     background-image: url(../images/select-arrow.png), -webkit-linear-gradient(top, #E5E5E5, #F4F4F4); /* For Chrome and Safari */
     background-image: url(../images/select-arrow.png), -moz-linear-gradient(top, #E5E5E5, #F4F4F4); /* For old Fx (3.6 to 15) */
     background-image: url(../images/select-arrow.png), -ms-linear-gradient(top, #E5E5E5, #F4F4F4); /* For pre-releases of IE 10*/
     background-image: url(../images/select-arrow.png), -o-linear-gradient(top, #E5E5E5, #F4F4F4); /* For old Opera (11.1 to 12.0) */ 
     background-image: url(../images/select-arrow.png), linear-gradient(to bottom, #E5E5E5, #F4F4F4); /* Standard syntax; must be last */
     background-position: center right;
     background-repeat: no-repeat;
     border: 1px solid #AAA;
     border-radius: 2px;
     box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
     color: #555;
     font-size: inherit;
     margin: 0;
     overflow: hidden;
     padding-top: 2px;
     padding-bottom: 2px;
     text-overflow: ellipsis;
     white-space: nowrap;
 }
 </style>