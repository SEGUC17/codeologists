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
        bookings: [{id: '2', arena: '123'],
    }
  },
    created(){

		},

    methods: {
      cancel(booking){
        if(confirm('Are you sure you want to delete this booking?'))
        {
          axios.post('/cancelBooking/'+booking.id,querystring.stringify({arenaID: booking.arena}),{headers : { "Content-Type": "application/x-www-form-urlencoded" }})
              .then(response => {
                alert('Successfully deleted');
              })
              .catch(error => {
                alert('Error occured');
              });
        }
      }
    }
  })
</script>
