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
		path: '/createArena',
		component: require('./views/createArena')
	},

	{
		path: '/editArena',
		component: require('./views/EditArena')
	},

	{
		path: '/cancelBooking',
		component: require('./views/delete_booking')
	},

	{
		path: '/registerPlayer',
		component: require('./views/regPlayer')
	},

	{
		path: '/registerSP',
		component: require('./views/regSP')
	}

];


export default new VueRouter({
	routes ,

	linkActiveClass : 'is-active'

});
