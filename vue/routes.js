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
		path : '/createGame',
		component : require('./views/CreateGame')
	},
	{
		path : '/changeMode',
		component : require('./views/changeMode')
	}

];


export default new VueRouter({
	routes ,

	linkActiveClass : 'is-active'

});