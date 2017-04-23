<template>

  <div>
    <table class="table">
      <tr>
        <th>Arena</th>
        <th v-if="type==='ServiceProvider'">Player</th>
        <th>Time</th>
          <th>Rating</th>
          <th>&nbsp</th>
        </tr>
        <!-- <div > -->
          <tr v-for="(booking, index) in bookings">
            <td>{{	booking.bookingArena }}</td>
            <td v-if="type==='ServiceProvider'">{{ playerNames[index] }}</td>
            <td>{{ dates[index] }}	 </td>

            <td>
              <div class="block">
                <span class="demonstration"></span>
                <el-rate
                v-model="value[index]"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
              </el-rate>
            </div>

          </td>
          <td>
            <div class="control">
              <button @click="editClicked(booking, index)" class="button is-primary">
                Rate
              </button>
            </div>
          </td>
        </tr>
      <!-- </div> -->
    </table>
  </div>

</template>

<style>
p {
  indent: {
    padding-left: 1.8em
  };
}
</style>
<script>
export default{

  data() {
    return {
      value: [],
      bookings : [],
      playerNames: [],
      dates: []
    }
  },

  created(){
    axios.get('/getUnratedBookings')
    .then(res => {
      this.bookings = res.data.remBooking;
      this.render();
    })
    .catch(err => console.log(err));
  },

  computed : {
      type: function () { return window.type; }
    },

  methods: {

    render(){
      this.playerNames = [];
      this.dates = [];
      this.value = [];
      for (var i = 0; i < this.bookings.length; i++) {
        var date = new Date(this.bookings[i].date);
        this.dates.push(date.getFullYear() + "/" + (date.getMonth()+1) +
        "/" + date.getDate() + "(" + date.getHours() + ":" + date.getMinutes()+')');
        this.value.push(1);
        let playerID = this.bookings[i].playerID;
        axios.get('/getNameOfPlayer/' + playerID)
        .then(res => {
          this.playerNames.push(res.data.player.name);
        })
        .catch(err => console.log(err));
      }
    },

    editClicked(booking, index){
      axios.post('/rateBooking/'+booking.bookingID, querystring.stringify({
        "rating" : this.value[index],
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        axios.get('/getUnratedBookings')
        .then(res => {
          this.bookings = res.data.remBooking;
          this.render();
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
