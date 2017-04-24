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
		path: '/createArena',
		component: require('./views/createArena')
	},

	{
		path: '/cancelBooking',
		component: require('./views/delete_booking')
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
    },

    {
    	path : '/SearchPlayer',
    	component : require('./views/playerSearch')
    },

    

    {
    	path:'/schedule/:arenaName',
    	components : {
    		default:require('./views/reserveTime'),
    		daypanel:require('./views/dayDetails')
    			},
    	children:
    	[
    	 
    	{
        path:'dayDetail/:dayIndex',
        component:require('./views/dayDetails')
        
    	},
    	 
    	]

    },

    {
    	path:'/editSchedule/:arenaName',
    	components : {
    		default:require('./views/reserveTime2'),
    		daypanel:require('./views/dayDetails2')
    			},
    	children:
    	[
    	 
    	{
        path:'dayDetail2/:dayIndex',
        component:require('./views/dayDetails2')
        
    	},
    	 
    	]
    }

];


export default new VueRouter({
	routes,

	linkActiveClass: 'is-active'

});
