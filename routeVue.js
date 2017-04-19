import VueRouter from 'vue-router';

var routes=[
    {
    	path:'/view',
    	component: require('./components/view_arenas.vue')
    },
    {
    	path:'/arena_details',
    	component: require('./components/view_details_of_arena.vue')
    }
]

export default new VueRouter({
	routes
});