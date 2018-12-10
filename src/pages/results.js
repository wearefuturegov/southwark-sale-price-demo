module.exports = {
  data: function() {
    return {
      results: window.localStorage.getItem('results'),
      sale_price: window.localStorage.getItem('sale_price'),
      size: window.localStorage.getItem('size'),
      expected: null
    }
  },
  template: `<div id="results">
    <h1 class="govuk-heading-xl">Results</h1>
    <div v-if="expected">
      <p>
        Based on the data we have, the proposed sale price of your property looks
        feasable.  
      </p>
    </div>
    <div v-if="!expected">
      <p>
        Based on the data we have, the proposed sale price of your property does <strong>not</strong>
        look feasable.  
      </p>
    </div>
    <p>
      We use data from the <a href="https://www.gov.uk/government/collections/price-paid-data">HM
      Land Registry Price Paid Dataset</a>, together with property square meterage from the
      <a href="https://epc.opendatacommunities.org/">MHCLG Energy Performance Dataset</a> to work out
      the range of prices per square metre in a mile radius around your proposed site area.
    </p>
    <p>
      The maximum price paid per square metre in this area was <strong>£{{ this.results.max_price_per_sq_mt}}</strong>
    </p>
    <p>
      The minimum price paid per square metre in this area was <strong>£{{ this.results.min_price_per_sq_mt}}</strong>
    </p>
    <p>
      From your submission, it looks like you expect your property to sell for <strong>£{{ this.sale_price / this.size }}</strong>
      per square metre.
    </p>
    <div v-if="expected">
      <p>
        This puts your property in the xx percentile.
      </p>
    </div>
    <div v-if="!expected">
      <p>
        This puts your property outside the expected range.
      </p>
    </div>
    <p>
      <button id="submit" class="govuk-button" v-on:click="tryAgain">
        Try another submission
      </button>
    </p>
  </div>
  `,
  mounted: function() {
    if (this.results !== null) {
      this.results = JSON.parse(this.results);
      this.expected = this.results.expected;
    } else {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    tryAgain: function() {
      window.localStorage.setItem('sale_price', null);
      window.localStorage.setItem('size', null);
      window.localStorage.setItem('results', null);
      this.$router.push({ path: '/' })
    }
  }
}