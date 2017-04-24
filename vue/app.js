var Vue = require('vue');
var axios = require('axios');
window.Vue = Vue;
window.axios = axios;
window.Event = new Vue();
window.querystring = require('querystring');
import vueRouter from 'vue-router';
import router from './router.js'
import booking from './components/booking.vue';
import calender2 from './components/calender2.vue';
import dayDetails2 from './views/dayDetails2';
import reserveTime2 from './views/reserveTime2.vue';
import ElementUI from 'element-ui';
Vue.component('calender2', calender2);
Vue.component('dayDetails2', dayDetails2);
Vue.component('reservetime2',reserveTime2);   
Vue.use(vueRouter);
//handle errors
var viewBookings = new Vue({
    el: "#viewBookingsRoot",
    data: {
        //remove hard coded bookings
        Bookings: [],
        myArenas: [],
    },
    components: { 'booking': booking },
    created() {
        this.getArenas();

    },
    methods: {
        selectArena: function (arenaName) {
            //Service provider slects an arena to view pending bookings in that arena
            axios.get('/arena/' + arenaName + '/viewBookings').then((res) => this.Bookings = res.data).catch(err => this.Bookings = []);//if not logged in redirect to log in page



        },
        getArenas: function () {
            axios.get('/getArenas').then(res => this.myArenas = (res.data)).catch(err => console.log(err));

        },

    }


});

var setUnavailable = new Vue({
    el: "#schedlueRoot",
    components: { calender2, dayDetails2,reserveTime2 },
    router: router,
    methods: {
        redirect2() {
            
               router.replace('/dayDetail2/-1');
        
        },
    },
    data: {



    },
    created() {
        Event.$on('calendercreated2', () => this.redirect2());
    }
})

