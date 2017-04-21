import VueRouter from 'vue-router';

let routes = [
	{
		path: '/',
		component: require('./views/Home')
	},

	{
		path: '/about',
		component: require('./views/About')
	},

	{
		path: '/myArenas',
		component: require('./views/MyArenas')
	},

	{
		path: '/login-signup',
		components:{
			default : require('./views/Home'),
			loginModal : require('./views/LoginSignup')
		},

		children: [
        {
          path: 'login',
          component: require('./views/Login')
        },
        {
          path: 'signup',
          component: require('./views/Signup')
        }
      ]

	},

	{
		path : '/editArena',
		component : require('./views/EditArena')
	},
  
	{
		path:'/myrequests',
		component : require('./views/Myrequests')

	},
  
	{
		path:'/games',
		component: require('./views/Games')
	},
  
	{
		path:'/notifications',
		component: require('./views/Notifications')
	},

	{
    	path:'/viewArenas',
    	component: require('./views/Arenas.vue')
    },

    {
    	path:'/arenaDetails',
    	component: require('./views/ArenaDetails.vue')
    },

    {
       path: '/search',
       component: require('./views/Search.vue')

     },

     {
       path:'/edit_profile',
       component : require('./views/EditPage.vue')
     }

];


export default new VueRouter({
	routes,

	linkActiveClass: 'is-active'

});