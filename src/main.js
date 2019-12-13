// The Vue build version to load with the `import` command987654321
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from "mint-ui"
import "mint-ui/lib/style.css"

import App from './App'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import '../static/css/main.css'
import '../static/js/rem'
import 'swiper/dist/css/swiper.css';
import { Toast, MessageBox } from 'mint-ui';

import Vant from 'vant';
import 'vant/lib/index.css';


Vue.config.productionTip = true
Vue.use(MintUI);
// vuePrototype.use(Vant)
Vue.use(Vant)


var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})

Vue.prototype.Toast = Toast;
Vue.prototype.MessageBox = MessageBox ;

import * as vuePrototype from '../src/api/index.js';
for (let key in vuePrototype) {
  Vue.prototype[key] = vuePrototype[key];
}

router.beforeEach((to, from, next) => { if (to.meta.title) {document.title = to.meta.title } next() })


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
