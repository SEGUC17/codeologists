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
    	path:'/viewArenas',
    	component: require('./views/Arenas.vue')
    },

    {
    	path:'/arenaDetails',
    	component: require('./views/ArenaDetails.vue')
    }

];


export default new VueRouter({
	routes,

	linkActiveClass: 'is-active'

});