var Vue = require('vue');
var axios = require('axios');
window.Vue = Vue;
window.axios = axios;
window.Event =new Vue();
import vueRouter from 'vue-router';
import router from './router.js'
import booking from './components/booking.vue';
import day from './components/day.vue';
import calender from './components/calender.vue';
import calenderHeader from './components/calenderHeader.vue';
import month from './components/month.vue';
import dayDetails from './views/dayDetails';
Vue.component('day',day);
Vue.component('calender',calender);
Vue.component('calenderHeader',calenderHeader);
Vue.component('month',month);
Vue.component('dayDetails',dayDetails);
Vue.use(vueRouter);
//handle errors
var viewBookings = new Vue({
    el: "#viewBookingsRoot",
    data: {
        //remove hard coded bookings
        Bookings: [],
        myArenas: [],
    },
    components: {'booking': booking},
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

var bookHours = new Vue({
    el:"#schedlueRoot",
    components:{day,calender,dayDetails},
    router:router,
    methods:{
        hideDayDetails:function(){
            this.dayDetailsShown=false;
        },
        showDayDetails:function(){
            
            this.dayDetailsShown=true;
        }
    },
    data:{
        dayDetailsShown:true,
    },
    created(){
        Event.$on('showagain',this.showDayDetails);
        Event.$on('hide',this.hideDayDetails);
    }
})

