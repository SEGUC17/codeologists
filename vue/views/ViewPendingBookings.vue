<template>
    <div id="root">
        <button v-for="arena in arenas" @click="selectArena(arena.name)">{{arena.name}}</button>
        <ul>
            <li v-for="booking in bookings">
                Booking at {{booking.arena}} on {{booking.bookDay}}/{{booking.bookMonth}} from {{hour(booking.start_index)}}:{{minute(booking.start_index)}}
                to {{hour(booking.end_index)}}:{{minute(booking.end_index)}}
                <button type="button" @click="accept(booking)">Accept</button>
                <button type="button" @click="reject(booking)">Reject</button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default ({
        data() {
            return {
                bookings: [],
                arenas: [],
                curArena :''
            }
        },
        created() {
            axios.get('/getArenas').then(res => this.arenas = (res.data)).catch(err => console.log(err));
        },
        methods: {
            hour(index) {
                return Math.floor(index / 2);
            },
            minute(index) {
                return (index % 2) == 0 ? '00' : '30';
            },

            selectArena(arenaName) {
                axios.get('/arena/' + arenaName + '/viewBookings')
                    .then((res) => {
                        this.curArena = arenaName;
                        console.log(arenaName);
                        this.bookings = res.data;
                        console.log(res.data);
                    })
                    .catch(err => this.Bookings = []);
            },

            accept(booking) {
                if (confirm('Are you sure you want to accept this booking? If you accepted it, It will reject all conflicting bookings')) {
                    axios.post('/acceptBooking/' + booking._id, querystring.stringify({ arena: booking.arena }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
                        .then(response => {
                            if (response.error) {
                                alert(response.error);
                            }
                            else {
                                alert('Successfully accepted');
                                axios.get('/arena/' + this.curArena + '/viewBookings')
                                    .then((res) => {
                                        this.bookings = res.data;
                                    })
                                    .catch(err => this.Bookings = []);
                            }
                        })
                        .catch(err => {
                            alert(err);
                        });
                }
            },

            reject(booking) {
                if (confirm('Are you sure you want to reject this booking?')) {
                    axios.post('/rejectBooking/' + booking._id, querystring.stringify({ arena: booking.arena }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
                        .then(response => {
                            if (response.error) {
                                alert(response.error);
                            }
                            else {
                                alert('Successfully rejected');
                                axios.get('/arena/' + this.curArena + '/viewBookings')
                                    .then((res) => {
                                        this.bookings = res.data;
                                    })
                                    .catch(err => this.Bookings = []);
                            }
                        })
                        .catch(err => {
                            alert(err);
                        });
                }
            }

        }
    })

</script>