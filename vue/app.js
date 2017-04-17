var Vue = require('vue');
var axios = require('axios');
window.Vue = Vue;
window.axios = axios;
import booking from './components/booking.vue';
//handle errors
new Vue({
    el: "#viewBookingsRoot",
    data: {

        Bookings: [],
        myArenas: [],
    },
    components: { booking },
    created() {
        this.getArenas();

    },
    methods: {
        selectArena: function (arenaName) {
            //get Bookings
            
            
                axios.get('/arena/' + arenaName + '/viewBookings').then(function (res) {
                    this.Bookings = res.data;
                    window.alert("finished");
                 }).catch(err => this.Bookings = []);

                
            
        },
        getArenas: function () {
            axios.get('/getArenas').then(res => this.myArenas = (res.data)).catch(err => console.log(err));

        },
        
    }


});
