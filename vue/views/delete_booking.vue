<template>
    <div id = "root">
      <ul>
        <li v-for = "booking in bookings">
          Booking at {{booking.arena}} on {{booking.bookDay}}/{{booking.bookMonth}} from {{hour(booking.start_index)}}:{{minute(booking.start_index)
          }} to {{hour(booking.end_index)}}:{{minute(booking.end_index)
          }}
        <button type="button" @click = 'cancel(booking)'>Delete</button></li>
      </ul>
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
      .catch(err => alert(err.response.data.error));
    },

    methods: {
      hour(index){
        return Math.floor(index/2);
      },

      minute(index){
        return (index%2) == 0?'00':'30';
      },

      cancel(booking){
        if(confirm('Are you sure you want to delete this booking?'))
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
