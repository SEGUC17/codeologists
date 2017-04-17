import VueRouter from 'vue-router';
let routes = [
    {
        path:'/viewBookings',
        component:require('./views/viewBookings.vue')
    }
];

export default   new VueRouter(
    routes
);

