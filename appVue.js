import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
window.Vue = Vue;
window.axios = axios;
Vue.use(VueRouter);
import router from './routerVue.js';

var app = new Vue({
  el:'#app',
  router,
  data:{
    mess:" Search_from_appVue"
  }
});
  
