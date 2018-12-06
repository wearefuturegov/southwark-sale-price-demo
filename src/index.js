const Vue = require('vue/dist/vue.js');
const axios = require('axios');

require('./map');

var app = new Vue({
  el: '#app',
  data: {
    errors: null,
    size: null,
    price: null,
    lat: null,
    lng: null,
    isLoading: false,
    success: false
  },
  methods: {
    addError: function(message, target) {
      this.errors.push(
        {
          message: message,
          target: '#' + target
        }
      )
    },
    validateForm: function() {
      this.errors = [];
      if (this.size == null) this.addError('You must specify a size for the development', '#size');
      if (this.price == null) this.addError('You must specify an estimated price for the development', '#price');
      if (this.lat == null || this.lng == null) this.addError('You must choose a location for the site', '#map');

      if (this.errors.length == 0) { 
        return null
      } else {
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
        return this.errors;
      }
    },
    updateLatLng: function(latlng) {
      this.lat = latlng[0];
      this.lng = latlng[1];
    },
    submitForm: function() {
      this.errors = this.validateForm();
      
      if (this.errors == null) {
        var vue = this;
        this.isLoading = true;
        var url = 'https://southwark-sale-price-viability.herokuapp.com/expected_range.json';
        var params = {
          lat: this.lat,
          lng: this.lng,
          sale_price: this.price,
          size: this.size
        }

        return axios.get(url, { params: params })
                    .then(function(response) {
                            vue.isLoading = false;
                            if (response.data.expected == true) { 
                              vue.success = true
                            } else {
                              vue.errors = [];
                              vue.addError('The price is outside the expected range', '#price');
                              window.scroll({top: 0, left: 0, behavior: 'smooth' });
                              return vue.errors;
                            }
                          })
      }
    }
  }
})
