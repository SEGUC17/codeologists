<template>
    <div>
        <div v-if="shown">

            <a v-on:click="hideMe">&#10799; </a>
            <div class="Content">
                <span class="tag is-primary is-medium">Booking Start Time</span>
                <select v-model="startTime" @change="nullifyEndTime()">
   <option v-for="(freeSlot,index) in freeSlots" :key="index">{{freeSlot}}</option>
   </select>
            </div>
            <div v-if="startTime != null">
                <span class="tag is-primary is-medium">Booking End Time</span>
                <select v-model="endTime">
   <option v-if="startTime != null" v-for="n in (findIndex(maxAllowedEndTime) - findIndex(startTime))" :key="n">{{findTime(n+findIndex(startTime))}}</option>
   </select>
            </div>
            <div>
                <span class="tag is-danger is-large">Please Note that the arena is already booked/unavailable in the following times</span>
                <table class="table is-bordered is-striped" id="unavailable">
                    <tr>
                        <th>Start </th>
                        <td v-for="reserved in reservedSlots"> {{reserved.start}}</td>
                    </tr>
                    <tr>
                        <th>End</th>
                        <td v-for="reserved in reservedSlots">{{reserved.end}}</td>
                    </tr>
                </table>
            </div>
            <button v-on:click="bookHours" v-if="startTime != null && endTime != null" class="button is-black">book</button>
            <div v-if="this.startTime != null && this.endTime != null">
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
        <div id="error">
            <label v-if="error">Sorry Could not complete your booking</label>
        </div>

    </div>

</template>
<script>
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
                pricePerHour:null
            }
        },
        methods: {
            validate() {
                console.log(Stripe.card.validateCardNumber(this.cardNumber) + ' ' + Stripe.card.validateExpiry(this.expMonth, this.expYear) + ' ' + Stripe.card.validateCVC(this.cvc));

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
            maxAllowedEndTime() {
                var index = this.findIndex(this.startTime);
                while ((this.schedule[index] == 0) && index < this.schedule.length) {
                    index++;
                }
                return this.findTime(index);
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
    select {
        -webkit-appearance: button;
        -moz-appearance: button;
        -webkit-user-select: none;
        -moz-user-select: none;
        -webkit-padding-end: 20px;
        -moz-padding-end: 20px;
        -webkit-padding-start: 2px;
        -moz-padding-start: 2px;
        background-color: #F07575;
        /* fallback color if gradients are not supported */
        background-image: url(../images/select-arrow.png), -webkit-linear-gradient(top, #E5E5E5, #F4F4F4);
        /* For Chrome and Safari */
        background-image: url(../images/select-arrow.png), -moz-linear-gradient(top, #E5E5E5, #F4F4F4);
        /* For old Fx (3.6 to 15) */
        background-image: url(../images/select-arrow.png), -ms-linear-gradient(top, #E5E5E5, #F4F4F4);
        /* For pre-releases of IE 10*/
        background-image: url(../images/select-arrow.png), -o-linear-gradient(top, #E5E5E5, #F4F4F4);
        /* For old Opera (11.1 to 12.0) */
        background-image: url(../images/select-arrow.png), linear-gradient(to bottom, #E5E5E5, #F4F4F4);
        /* Standard syntax; must be last */
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