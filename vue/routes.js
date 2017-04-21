import VueRouter from 'vue-router';

let routes=[
	{
		path : '/',
		component : require('./views/Home')
	},

	{
		path : '/about',
		component : require('./views/About')
	},

	{
		path : '/myArenas',
		component : require('./views/MyArenas')
	},

	{
		path : '/login',
		component : require('./views/Login')
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
	}

];


export default new VueRouter({
	routes ,

	linkActiveClass : 'is-active'

});