<template>
    <div v-if="shown">
            <a  v-on:click="hideMe">&#10799; </a>
            <div>
            <span class="tag is-primary is-medium">Click on a slot to either set it available or unavailable</span>
            <span class="tag is-danger is-medium">note that black checked slots are booked, red checked slots are unavailable and green checked slots are available </span>
            
            <table class="table is-bordered">
          <tr>
            <td v-for="i in 12" @click="handleClick(i-1)" >
              <div >
                <a >
                  <p>Start: {{findTime(i-1)}}</p><br>
                  <p>End  : {{findTime(i)}}</p>
                  <img v-if = "schedule[i-1] != 0 && schedule[i-1] != 3 && schedule[i-1] != -1" src="blacktick.png">
                  <img v-if = "schedule[i-1] == 0" src="tick.png">
                  <img v-if = "schedule[i-1] == 3" src="bluetick.png">
                  <img v-if = "schedule[i-1] == -1" src="cross.png">
                </a>
            </div>
            </td>
          </tr>
          
          <tr>
            <td v-for="i in 12" @click="handleClick(i+11)" >
              <div >
                <a >
                  <p>Start: {{findTime(i+11)}}</p><br>
                  <p>End  : {{findTime(i+12)}}</p>
                  <img v-if = "schedule[i+11] != 0 && schedule[i+11] != 3 && schedule[i+11]!= -1" src="blacktick.png">
                  <img v-if = "schedule[i+11] == 0" src="tick.png">
                  <img v-if = "schedule[i+11] == 3" src="bluetick.png">
                  <img v-if = "schedule[i+11] == -1" src="cross.png">
                  </a>
            </div>
            </td>
          </tr>
          <tr>
            <td v-for="i in 12" @click="handleClick(i+23)" >
              <div >
                <a >
                  <p>Start: {{findTime(i+23)}}</p><br>
                  <p>End  : {{findTime(i+24)}}</p>
                  <img v-if = "schedule[i+23] != 0 && schedule[i+23] != 3 && schedule[i+23] != -1" src="blacktick.png">
                  <img v-if = "schedule[i+23] == 0" src="tick.png">
                  <img v-if = "schedule[i+23] == 3" src="bluetick.png">
                  <img v-if = "schedule[i+23] == -1" src="cross.png">
                </a>
            </div>
            </td>
          </tr>
          <tr>
            <td v-for="i in 12"  @click="handleClick(i+35)">
              <div >
                <a >
                  <p>Start: {{findTime(i+35)}}</p><br>
                  <p>End  : {{findTime(i+36)}}</p>
                  <img v-if = "schedule[i+35] != 0 && schedule[i+35] != 3 && schedule[i+35] != -1" src="blacktick.png">
                  <img v-if = "schedule[i+35] == 0" src="tick.png">
                  <img v-if = "schedule[i+35] == 3" src="bluetick.png">
                  <img v-if = "schedule[i+35] == -1" src="cross.png">
                </a>
            </div>
            </td>
          </tr>
          
          </table>
            </div>
     
           <button class="button is-black is-focused" v-on:click="setUnavailable" v-if="startTime != null && endTime != null">Set unavailable  </button>
   <button class="button is-black is-focused" v-on:click="setUnavailable2" v-if="startTime != null && endTime != null">Set available  </button>
    </div>
        
</template>
<script>
//import Stripe from 'stripe';
    export default {
        data() {
            return {
                shown: true,
                schedule: null,
                startTime: null,
                endTime: null,
                day: null,
                month: null,
                error: false,
                arenaName: null,
                   }
        },
        methods: {
            handleClick(index){
                if(this.schedule[index] != 0 && this.schedule[index] !=3 && this.schedule[index] != -1)
                {
                    console.log("You can not use this as start/end index because it is already used");
                }
                else if(this.startTime == null)
                {
                    var x=this.findTime(index);
                    this.startTime = x;
                    this.schedule[index]=3;
                    this.endTime = this.findTime(index+1);
                }
                else 
                {
                    //user is selecting 
                    if(this.findIndex(this.startTime)<=index && this.checkAvailable(parseInt(this.findIndex(this.startTime)),parseInt(index)))
                    {
                        if(this.findIndex(this.startTime) == index && this.findIndex(this.endTime) == index+1){
                            this.schedule[index] = 0;
                            this.startTime = null;
                            this.endTime = null;
                            return;
                        }
                        var j=0;
                        for( j=this.findIndex(this.startTime)+1;j<this.findIndex(this.endTime);j++)
                        {
                            this.schedule[j]=0;
                        } 
                        var i=0;
                        for(i=this.findIndex(this.startTime)+1;i<=index;i++)
                        {
                            this.schedule[i] = 3;
                        }
                        if(i !=0)
                        {
                        var x= this.findTime(i);
                        
                        this.endTime = x;
                        i=0;
                        }
                    }
                }
            },
             checkAvailable(startIndex, endIndex) {
                for (var counter = startIndex; counter <= endIndex; counter++) {
                    if (this.schedule[counter] != 0  && this.schedule[counter] != 3 && this.schedule[counter] != -1){
                        
                        return false;
                    }
                }
                return true;
            },
            hideMe: function () {
                this.shown = false;
                this.startTime = null;
                this.endTime = null;
                this.error = false;
            },
            nullifyEndTime() {
                this.endTime = null;
                this.error = false;
            },
            findTime(index) {
                
                var hours = Math.floor(index / 2);
                var min = '00';
                if (index % 2 == 1)
                    min = '30';
                if (hours < 10)
                    return '0' + hours + ':' + min;
                else
                    return hours + ':' + min;
            },
            findIndex(time) {
                if (!time) return -1;
                var arr = time.split(':');
                var min = parseInt(arr[1], 10)
                var hours = parseInt(arr[0], 10);
                return Math.floor(min / 30) + 2 * (hours);
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
                                    this.$notify({title:"Error!" , message: error.response.data.error, type: "error"})   });
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
                                    this.$notify({title:"Error!" , message: error.response.data.error, type: "error"})    });
             },
            assignValues(data) {
                this.shown = true;
                if (!data)
                    return;
                this.schedule = data.schedule;
                this.day = data.day;
                this.month = data.month;
                this.arenaName = data.arenaName;
                this.pricePerHour= data.price;
            },
            updateSchedule(data) {
                //update schedule of dayDtails component
                this.startTime = null;
                this.endTime = null;
                this.schedule = data.data;
                Event.$emit('changed', { day: this.day, month: this.month, schedule: this.schedule });
            },
        },
        computed: {
            freeSlots() {
                var freeSlotsArray = [];
                if (!this.schedule)
                    return freeSlotsArray;
                for (var i = 0; i < this.schedule.length; i++) {
                    if (this.schedule[i] == 0)
                        freeSlotsArray.push(this.findTime(i));
                }
                return freeSlotsArray;
            },
            reservedSlots() {
                var bookedBlocks = [];
                if (!this.schedule)
                    return bookedBlocks;
                for (var i = 0; i < this.schedule.length; i++) {
                    if (this.schedule[i] != 0) {
                        var startOfBlock = i;
                        while (this.schedule[i] != 0 && i < this.schedule.length) {
                            i++;
                        }
                        bookedBlocks.push({ "start": this.findTime(startOfBlock), "end": this.findTime(i) })
                    }
                }
                return bookedBlocks;
            },
            maxAllowedEndIndex() {
                var index = this.findIndex(this.startTime);
                while ((this.schedule[index] == 0) && index < this.schedule.length) {
                    index++;
                }
                return index;
            },
            getPrice() {
                return Math.floor((this.findIndex(this.endTime)-this.findIndex(this.startTime))*(this.pricePerHour)*2.5)
            },
        },
        created() {
            this.hideMe();
            Event.$on('hidedaydetails2', () => this.hideMe());
            Event.$on('showagain2', (data) => this.assignValues(data));
            Event.$on('updatedBookings2',(eventData) => this.updateSchedule(eventData));
        }
    }
</script>

<style>
    
</style>