import VueRouter from 'vue-router';


var routes =[
     {
       path: '/search',
       component: require('./search.vue')

     },
     {
       path:'/edit_profile',
       component : require('./edit_page.vue')
     }

];




export default new VueRouter({routes, linkActiveClass: 'is-active'});
