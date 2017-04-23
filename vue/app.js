import './bootstrap';

import router from './routes';

import calender from './components/calender.vue';
import dayDetails from './views/dayDetails';
import reserveTime from './views/reserveTime.vue';
Vue.component('calender', calender);
Vue.component('dayDetails', dayDetails);
Vue.component('reservetime',reserveTime);

window.Event = new Vue();

class Errors {

    constructor() {
        this.errors = {};
    }

    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    any() {
        return Object.keys(this.errors).length > 0;
    }

    get(field) {
        if (this.errors[field]) {
            return this.errors[field];
        }
    }

    record(errors) {
        this.errors = errors;
    }

    clear(field) {
        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};
    }
}


window.Form = class Form {

    constructor(data) {
        this.originalData = data;

        for (let field in data) {
            this[field] = data[field];
        }
        
        this.errors = new Errors();
    }

    data() {
        let data = {};

        for (let property in this.originalData) {
            data[property] = this[property];
        }

        return data;
    }

    reset() {
        for (let field in this.originalData) {
            this[field] = '';
        }

        this.errors.clear();
    }

    submit(requestType, url) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, querystring.stringify(this.data()), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
                .then(response => {
                    this.onSuccess(response.data);

                    resolve(response.data);
                })
                .catch(error => {
                    this.onFail(error.response.data);

                    reject(error.response.data);
                });
        });
    }

    onSuccess(data) {

        this.reset();
    }

    onFail(errors) {
        var errs = [];
        for (var i = 0; i < errors.length; i++) {
            var e = errors[i];
            var param = e.param;
            errs[e.param] = e.msg;
        }
        this.errors.record(errs);
    }
}


new Vue({

    el: '#app',

	router,

    data:{
        showLogin:false,
        user : false,
        type : 'visitor',
    },

    mounted(){
        window.user=false;
        window.type='visitor';
        Event.$on('loggedIn', data => {
            window.user = data.user;
            window.type = data.type;
            this.user = data.user;
            this.type = data.type;
            this.showLogin = false;
        })
    },

    methods:{
        logout(){
            axios.get('/logout').then(res =>{
                window.user=false;
                window.type='visitor';
                this.user = false;
                this.type = 'visitor';
            }).catch(err => {
                console.log(err);
            });
        },
        redirect() {
            
               router.replace('/dayDetail/-1');
           
        },
    },
    created(){
        Event.$on('calendercreated', () => this.redirect());
    },
    components: {reserveTime},

});

