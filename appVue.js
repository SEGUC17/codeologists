import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
Vue.use(VueRouter);
window.Vue = Vue;
window.axios = axios;
window.Event = new Vue();
import router from './routeVue';

var app = new Vue({
    el:'#app',
    router
});
