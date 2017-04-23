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
		path : '/createGame',
		component : require('./views/CreateGame')
	},
	{
		path : '/changeMode',
		component : require('./views/changeMode')
	},
	
	{
		path : '/ViewPendingBookings',
		component : require('./views/ViewPendingBookings')
	},

	{
		path : '/comment',
		component : require('./views/commentOnArena')
	},

	{
		path : '/rating',
		component : require('./views/NonRatedBookings')
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
     },

     {
        path: '/blackList',
        component: require('./views/Blacklist')
    },
    
    {
        path: '/whiteList',
        component: require('./views/Whitelist')
    },

    {
    	path : '/profile',
    	component : require('./views/Profile')
    }


];


export default new VueRouter({
	routes,

	linkActiveClass: 'is-active'

});
