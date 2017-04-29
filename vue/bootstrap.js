import Vue from 'vue';

import VueRouter from 'vue-router';

import VueSession from 'vue-session';

import axios from 'axios';

window.querystring = require('querystring');

window.Vue = Vue;

Vue.use(VueRouter);

Vue.use(VueSession);

window.axios = axios;

window.axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};