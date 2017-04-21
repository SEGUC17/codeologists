<template>

  <div>
    <!-- <div class="message-header">
    <p> Player </p>
    <p> Comment </p>
    <p>Time Stamp</p>
  </div> -->
  <div class="message-header" v-for="(booking, index) in bookings">
    <p>{{	booking.bookingArena }}</p>
    <p v-if="">{{ playerNames[index] }}</p>
    <p>{{ dates[index] }}	 </p>

    <div>
      <input type="radio" name="star" v-model="rate" value="1"/>
      <!-- <label for="star-5"></label> -->
      <input type="radio" name="star" v-model="rate" value="2"/>
      <!-- <label for="star-4"></label> -->
      <input type="radio" name="star" v-model="rate" value="3"/>
      <!-- <label for="star-3"></label> -->
      <input type="radio" name="star" v-model="rate" value="4"/>
      <!-- <label for="star-2"></label> -->
      <input type="radio" name="star" v-model="rate" value="5"/>
      <!-- <label for="star-1"></label> -->
      <div class="control">
        <button @click="editClicked(booking, index)" class="button is-primary">
          Rate
        </button>
      </div>
    </div>
  </div>
</div>

</template>

<script>
export default{

  data() {
    return {
      rate: '1',
      bookings : [],
      playerNames: [],
      dates: []
    }
  },

  created(){
    axios.get('/getUnratedBookings')
    .then(res => {
      this.bookings = res.data.remBooking;
      this.playerNames = [];
      this.dates = [];
      for (var i = 0; i < this.bookings.length; i++) {
        var date = new Date(this.bookings[i].date);
        this.dates.push(date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate()
        + " " + date.getHours() + ":" + date.getMinutes());
        let playerID = this.bookings[i].playerID;
        axios.get('/getNameOfPlayer/' + playerID)
        .then(res => {this.playerNames.push(res.data.player.name);})
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
  },

  methods: {

    editClicked(booking, index){
      axios.post('/rateBooking/'+booking.bookingID, querystring.stringify({
        "rating" : this.rate,
        }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        // this.bookings.splice(index, 1);
        // this.playerNames.splice(index, 1);
        axios.get('/getUnratedBookings')
        .then(res => {
          this.bookings = res.data.remBooking;
          this.playerNames = [];
          this.dates = [];
          for (var i = 0; i < this.bookings.length; i++) {
            var date = new Date(this.bookings[i].date);
            this.dates.push(date.getFullYear() + "/" + (date.getMonth()+1) +
            "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes());
            let playerID = this.bookings[i].playerID;
            axios.get('/getNameOfPlayer/' + playerID)
            .then(res => {this.playerNames.push(res.data.player.name);})
            .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
      })
      .catch(err => {
        console.log(err.response);
      });
    }
  }
}
</script>
