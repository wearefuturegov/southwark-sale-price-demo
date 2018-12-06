const Vue = require('vue/dist/vue.js');

require('./components/map');
require('./components/error-messages');

const Index = require('./pages/index.js')
const Results = require('./pages/results.js')

const routes = {
  '/': Index,
  '/results': Results
}

var app = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})