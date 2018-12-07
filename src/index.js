const Vue = require('vue/dist/vue.js');
const VueRouter = require('vue-router/dist/vue-router.js');

Vue.use(VueRouter)

require('./components/map');
require('./components/error-messages');

const Index = require('./pages/index.js')
const Results = require('./pages/results.js')

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Index },
    { path: '/results', component: Results }
  ]
})

var app = new Vue({
  router,
  template: `<router-view class="view"></router-view>`
}).$mount('#app')