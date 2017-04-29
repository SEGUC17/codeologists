<template>
    <div v-if="shown">
            <a  v-on:click="hideMe">&#10799; </a>
            <div>
            <span class="tag is-primary is-medium">Click on a slot to book it</span>
            <span class="tag is-danger is-medium">note that if you click on another slot you will book all the slots in between </span>
            
            <table class="table is-bordered">
          <tr>
            <td v-for="i in 12" @click="handleClick(i-1)" >
              <div >
                <a >
                  <p>Start: {{findTime(i-1)}}</p><br>
                  <p>End  : {{findTime(i)}}</p>
                  <img v-if = "schedule[i-1] != 0 && schedule[i-1] != 3" src="cross.png">
                  <img v-if = "schedule[i-1] == 0" src="tick.png">
                  <img v-if = "schedule[i-1] == 3" src="bluetick.png">
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
                  <img v-if = "schedule[i+11] != 0 && schedule[i+11] != 3" src="cross.png">
                  <img v-if = "schedule[i+11] == 0" src="tick.png">
                  <img v-if = "schedule[i+11] == 3" src="bluetick.png">
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
                  <img v-if = "schedule[i+23] != 0 && schedule[i+23] != 3" src="cross.png">
                  <img v-if = "schedule[i+23] == 0" src="tick.png">
                  <img v-if = "schedule[i+23] == 3" src="bluetick.png">
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
                  <img v-if = "schedule[i+35] != 0 && schedule[i+35] != 3" src="cross.png">
                  <img v-if = "schedule[i+35] == 0" src="tick.png">
                  <img v-if = "schedule[i+35] == 3" src="bluetick.png">
                </a>
            </div>
            </td>
          </tr>
          
          </table>
            </div>
            <div  id="StripeForm" v-if="this.startTime != null && this.endTime != null">
                <div id="stripe-form">
                    <form @submit.prevent="charge()" id="payment-form">
                        <div class="form-row">
                            <div class="cc-text">Card Number</div>
                            <input type="text" size="30" autocomplete="off" v-model="cardNumber" class="card-number" />
                        </div>
                        <div class="cc-text">Email</div>
                        <input type="email" size="30" autocomplete="off" v-model="stripeEmail" class="card-number" />

                        <div class="form-row">
                            <div class="cc-text">CVC</div>
                            <input type="text" size="4" autocomplete="off" v-model="cvc" class="card-cvc" />
                        </div>
                        <div class="form-row">
                            <div class="cc-text">Expiration (MM/YYYY)</div>
                            <input type="text" size="2" v-model="expMonth" class="card-expiry-month" />
                            <span> / </span>
                            <input type="text" size="4" v-model="expYear" class="card-expiry-year" />
                        </div>
                        <input type="hidden" name="amount" :value="getPrice" id="cc-amount">
                        <button type="submit" class="submit-button" :disabled="! validate()">Submit Payment</button>
                    </form>
                </div>
            </div>
            
        </div>
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
                cardNumber: null,
                expMonth: null,
                expYear: null,
                cvc: null,
                stripeEmail: null,
                pricePerHour:null,
            }
        },
        methods: {
            handleClick(index){
                if(index <= ((new Date()).getHours())*2)
                {
                    return console.log("You can not book in the past");
                }
                if(this.schedule[index] != 0 && this.schedule[index] !=3)
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
                       /* if(j==0){
                            console.log("Please be here");
                            this.schedule[this.findIndex(this.startTime)]=0;
                            this.startTime = null;
                            this.endTime = null;
                        }
                        */
                        //update the schedule
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
                    if (this.schedule[counter] != 0  && this.schedule[counter] != 3 ){
                        
                        return false;
                    }
                }
                return true;
            },

            validate() {
                
                return Stripe.card.validateCardNumber(this.cardNumber) && Stripe.card.validateExpiry(this.expMonth, this.expYear) && Stripe.card.validateCVC(this.cvc);
            },
            charge() {
                if (!this.validate()) {
                    return window.alert('incorrect Fields');
                }
                var publicStripeApiKeyTesting = "pk_test_H6lyrpudfnkz7h31N8GStX2m";
                Stripe.setPublishableKey(publicStripeApiKeyTesting);
                Stripe.card.createToken({
                    number: this.cardNumber,
                    cvc: this.cvc,
                    exp_month: this.expMonth,
                    exp_year: this.expYear,
                }, this.stripeResposeHandler);
            },
            stripeResposeHandler(status, response) {
                if (response.error) {
                    return window.alert(response.error.message);
                }
                else {
                    axios.post('/charge', querystring.stringify(
                        {
                            chargeAmount: this.getPrice,
                            stripeToken: response.id,
                            stripeTokenType: response.type,
                            stripeEmail: this.stripeEmail
                        }),
                        {
                            headers:
                            {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        }).then(()=> {
                            window.alert("Successfull Payment");
                        }).catch(()=>{
                            window.alert("Reserving ! Sorry for the delay it because of the stripe module");
                            this.bookHours()});
                }
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
            bookHours() {


                axios.post('/arena/' + this.arenaName + '/bookHours', querystring.stringify(
                    {
                        day: this.day,
                        month: this.month,
                        startIndex: this.findIndex(this.startTime),
                        endIndex: this.findIndex(this.endTime) - 1,

                    }),
                    {
                        headers:
                        {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then((data) => this.updateSchedule(data)).catch(error => this.error = true);
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

                Event.$emit('bookingsent', { day: this.day, month: this.month, schedule: this.schedule });
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
            Event.$on('hidedaydetails', () => this.hideMe());
            Event.$on('showagain', (data) => this.assignValues(data));

        }


    }

</script>

<style>
    
</style>