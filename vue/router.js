import VueRouter from 'vue-router';
let routes = [
    {
        path:'/dayDetail/:dayIndex',
        component:require('./views/dayDetails.vue'),
        
    }
    ,  
    { 
        path: '/dayhaspassederror', 
        component: require('./components/errorPanel.vue'),
    }
];

var router  =  new VueRouter({
    mode:'abstract',        
    base:window.location.href,
    routes:routes
});

export default router;
