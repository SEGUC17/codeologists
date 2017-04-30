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
              <td>To: {{hour(booking.end_index+1)}}:{{minute(booking.end_index+1)}}</td>
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
        this.$notify({title:"", message: err.response.data.error ,type:"error"});
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
          case 0: return 'January';
          case 1: return 'February';
          case 2: return 'March';
          case 3: return 'April';
          case 4: return 'May';
          case 5: return 'June';
          case 6: return 'July';
          case 7:  return 'August';
          case 8: return 'September';
          case 9: return 'October';
          case 10: return 'November';
          case 11: return 'December';
          default: return '';
        }
      },

      cancel(booking){
        if(confirm('Are you sure you want to cancel this booking?'))
        {
          axios.post('/cancelBooking/'+booking._id,querystring.stringify({arena: booking.arena}),{headers : { "Content-Type": "application/x-www-form-urlencoded" }})
              .then(response => {
                if(response.error)
                  {this.$notify({title:"", message: response.error ,type:"error"});}
                else {
                  this.$notify({title:"", message: "Successfully deleted!" ,type:"success"});
                  axios.get('/viewPlayerBookings')
                  .then(res => this.bookings=res.data)
                  .catch(err => this.$notify({title:"", message: err.response.data.error ,type:"error"}));
                }
              })
              .catch(err => {
                if(err.response.data.error)
                  this.$notify({title:"", message: err.response.data.error ,type:"error"});
                else
                  if(err.message)
                    this.$notify({title:"", message: err.message ,type:"error"});
                  else {
                    this.$notify({title:"", message: err ,type:"error"});
                  }
              });
        }
      }
    }
  })
</script>
