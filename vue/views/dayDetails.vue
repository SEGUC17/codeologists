<template>

<div v-if="shown">
   Reservation day: {{day}}
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
   <div id="error">
    <label v-if="error">Sorry Could not complete your booking</label>
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
             bookHours(){
                 //TODO:send axios POST request to '/bookHours'
                 
                 axios.post('/arena/'+this.arenaName+'/bookHours',querystring.stringify(
                 {
                     day:this.day,
                     month:this.month,
                     startIndex:this.findIndex(this.startTime),
                     endIndex:this.findIndex(this.endTime),
                    
                 }),
                 {headers:
                 {
                     "Content-Type":"application/x-www-form-urlencoded"
                 }
                 }).then(()=>
                     Event.$emit('bookingsent',{day:this.day,month:this.month})
                 ).catch(error => this.error=true);
             },
             assignValues(data){
                 console.log("in assignValues ");
                 this.shown= true;                
                 if(!data)
                 return;
                 this.day = data.day;
                 this.month = data.month;
                 this.schedule =data.schedule;
                 this.arenaName = data.arenaName;
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
        created()
        {
            //Event.$emit('daydetailcreated');
            Event.$on('showagain',(data) => this.assignValues(data));
        }
        
        
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