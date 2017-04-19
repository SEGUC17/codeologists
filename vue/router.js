import VueRouter from 'vue-router';
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
    </div>
  `
}
let routes = [
    {
        path:'/dayDetail/:dayIndex',
        component:require('./views/dayDetails.vue'),
        
    }
    ,  
    { 
        path: '/user/:id', component: User,
    }
];

export default   new VueRouter({
    mode:'abstract',        
    base:window.location.href,
    routes:routes
});

