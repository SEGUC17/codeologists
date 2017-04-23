<template>

<div>
   <button v-on:click="hideMe">Close Me </button>
   <div>
   <label>Booking Start Time</label>
   <select v-model="startTime">
   <option v-for="(freeSlot,index) in freeSlots">{{freeSlot}}</option>
   </select>
   </div>
   <div>
   <label>Booking End Time</label>
   <select v-model="endTime">
   <option v-if="startTime != null" v-for="n in (findIndex(maxAllowedEndTime) - findIndex(startTime))">{{findTime(n+findIndex(startTime))}}</option>
   </select>
   </div> 
   <table id="unavailable">
   <tr>
    <th>Start </th>
    <td v-for="reserved in reservedSlots"> {{reserved.start}}</td>
    </tr>
  <tr>
    <th>End</th>
    <td v-for="reserved in reservedSlots">{{reserved.end}}</td>
  </tr>
   </table>
   <button v-on:click="bookHours" v-if="startTime != null && endTime != null">book NOW ! </button>
</div>
</template>
<script>
    export default{
        data(){
            return{
                shown:true,
                schedule:[-1,0,0,0,-1,0,0,-1,0,-1,-1,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,0,0,0,-1,-1,-1,-1],
                startTime:null,
                endTime:null
            }
        },
        methods:{
            hideMe:function(){
                this.startTime=null;
                this.endTime = null;
                Event.$emit('hide');
            },
            getSchedule:function(day,month){
            
            },
            findTime(index)
            {
                var min = (index)*30;
                var hours=Math.floor(min/60);
                min=min-60*hours;
                if(min<10 && hours<10)
                return '0'+hours+':'+'0'+min;
                else if(min>=10 && hours<10)
                return '0'+hours+':'+min;
                else if(min<10 && hours>=10)
                return  hours+':'+'0'+min;
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
             bookHours(){
                 //TODO:send axios POST request to '/bookHours'
             }

        
        },
        computed:{
            freeSlots(){
                var freeSlotsArray = [];
                for(var i=0;i<this.schedule.length;i++)
                {
                    if(this.schedule[i]==0)
                        freeSlotsArray.push(this.findTime(i));
                }
                return freeSlotsArray;
            },
            reservedSlots(){
             var bookedBlocks = [];
                for(var i=0;i<this.schedule.length;i++)
                {
                    if(this.schedule[i]!=0)
                    {
                        var startOfBlock =i;
                        while(this.schedule[i] != 0 && i<this.schedule.length)
                        {
                            i++;
                        }
                        bookedBlocks.push({"start":this.findTime(startOfBlock),"end":this.findTime(i)})
                    }
                }
                return bookedBlocks;      
            },
            maxAllowedEndTime(){
               var index =  this.findIndex(this.startTime);
                while((this.schedule[index]==0) && index<this.schedule.length)
                {
                    index++;
                }
                return this.findTime(index);
            }
        },
        
        
    }
</script>
<style>
    table, th, td {
    border: 1px solid ;
    border-collapse: collapse;
    }
    th, td {
    padding: 15px;
    }

</style>