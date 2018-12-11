module.exports = {
  data: function() {
    return {
      errors: null,
      size: null,
      price: null,
      lat: null,
      lng: null,
      isLoading: false,
      success: false,
      axios: require('axios')
    }
  },
  template: `
    <div id="index">
      <h1 class="govuk-heading-xl">Check property price</h1>

      <error-messages :errors="errors"></error-messages>

      <div class="govuk-form-group">
        <label class="govuk-label" for="name">
          Development size (sq metres)
        </label>
        <input class="govuk-input govuk-input--width-10" id="size" name="size" type="text" v-model="size">
      </div>
      
      <div class="govuk-form-group">
        <label class="govuk-label" for="price">
          Expected price (£)
        </label>
        <input class="govuk-input govuk-input--width-10" id="price" name="price" type="text" v-model="price">
      </div>
      
      <site-map @update-latlng="updateLatLng"></site-map>

      <input type="hidden" name="lat" id="lat" v-model="lat">
      <input type="hidden" name="lng" id="lng" v-model="lng">

      <button id="submit" class="govuk-button" v-on:click="submitForm">
        Submit
        <i 
          class="fas fa-spinner fa-spin"
          v-bind:class="{ 'govuk-visually-hidden': !isLoading }"
        ></i>
      </button>
    </div>
  `,
  mounted: function() {
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
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

      if (this.errors.length > 0) { 
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
      } else {
        this.errors = null;
      }
    },
    updateLatLng: function(latlng) {
      this.lat = latlng[0];
      this.lng = latlng[1];
    },
    submitForm: function() {
      this.validateForm();
      
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

        return this.axios.get(url, { params: params })
                    .then(this.handleResponse)
      }
    },
    handleResponse: function(response) {
      this.isLoading = false;
      window.localStorage.setItem('sale_price', parseFloat(this.price));
      window.localStorage.setItem('size', parseFloat(this.size));
      window.localStorage.setItem('results', JSON.stringify(response.data));
      this.$router.push({ path: '/results' });
    }
  }
}