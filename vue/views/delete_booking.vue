<template>
    <div id = "root">
      <ul>
        <li v-for = "booking in bookings">{{booking}}
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
      .catch(err => alert(err));
    },

    methods: {
      cancel(booking){
        if(confirm('Are you sure you want to delete this booking?'))
        {
          axios.post('/cancelBooking/'+booking._id,querystring.stringify({arena: booking.arena}),{headers : { "Content-Type": "application/x-www-form-urlencoded" }})
              .then(response => {
                alert('Successfully deleted');
                axios.get('/viewPlayerBookings')
                .then(res => this.bookings=res.data)
                .catch(err => alert(err));
              })
              .catch(err => {
                if(err.error)
                  alert(err.error)
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
