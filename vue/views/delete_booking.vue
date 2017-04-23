<template>
  <div id = "root" style=" margin-left: 2cm;" >


    <br>
    <h2>Your current bookings:</h2>
    <br><br>
    <div class="" v-for = "booking in bookings">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px; font-size: 20px; font-weight: bold;">{{booking.arena}}</span>
          <el-button style="float: right;" type="danger" @click = 'cancel(booking)'>Cancel</el-button>
        </div>
        <div>
          <table>
            <tr style="font-size: 12px">
              <td>Date: {{month(booking.bookMonth)}} {{booking.bookDay}}</td>
              <td>From: {{hour(booking.start_index)}}:{{minute(booking.start_index)}}</td>
              <td>To: {{hour(booking.end_index)}}:{{minute(booking.end_index)}}</td>
            </tr>
          </table>
        </div>
      </el-card>
      <br><br>
    </div>
    </div>
</template>


<script>
  export default({
    data() {
      return {
        bookings: []
      }
		},
    created(){
      axios.get('/viewPlayerBookings')
      .then(res => this.bookings=res.data)
      .catch(err => {
        alert(err.response.data.error),
        this.$router.push('/');
    });
    },

    methods: {
      hour(index){
        return Math.floor(index/2);
      },

      minute(index){
        return (index%2) == 0?'00':'30';
      },

      month(i)
      {
        switch(i){
          case 1: return 'January';
          case 2: return 'February';
          case 3: return 'March';
          case 4: return 'April';
          case 5: return 'May';
          case 6: return 'June';
          case 7: return 'July';
          case 8:  return 'August';
          case 9: return 'September';
          case 10: return 'October';
          case 11: return 'November';
          case 12: return 'December';
          default: return '';
        }
      },

      cancel(booking){
        if(confirm('Are you sure you want to cancel this booking?'))
        {
          axios.post('/cancelBooking/'+booking._id,querystring.stringify({arena: booking.arena}),{headers : { "Content-Type": "application/x-www-form-urlencoded" }})
              .then(response => {
                if(response.error)
                {alert(response.error);}
                else {
                  alert('Successfully deleted');
                  axios.get('/viewPlayerBookings')
                  .then(res => this.bookings=res.data)
                  .catch(err => alert(err.response.data.error));
                }
              })
              .catch(err => {
                if(err.response.data.error)
                  alert(err.response.data.error)
                else
                  if(err.message)
                    alert(err.message);
                  else {
                    alert(err);
                  }
              });
        }
      }
    }
  })
</script>
