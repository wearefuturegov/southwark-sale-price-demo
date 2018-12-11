module.exports = {
  data: function() {
    return {
      results: window.localStorage.getItem('results'),
      sale_price: window.localStorage.getItem('sale_price'),
      size: window.localStorage.getItem('size'),
      expected: null,
      chartjs: require('chart.js')
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
      Given the data we have, we expect properties in this area to fetch, on average, somewhere 
      in the region of <strong>£{{ this.results.min_price_per_sq_mt}}</strong> to 
      <strong>£{{ this.results.max_price_per_sq_mt}}</strong> per square metre.
    </p>
    <p>
      From your submission, it looks like you expect your property to sell for <strong>£{{ this.sale_price / this.size }}</strong>
      per square metre.
    </p>
    <div v-if="expected">
      <p>
        This puts your property within the expected range.
      </p>
    </div>
    <div v-if="!expected">
      <p>
        This puts your property outside the expected range.
      </p>
    </div>
    <canvas id="chart"></canvas>
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
      this.drawChart();
    } else {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    tryAgain: function() {
      window.localStorage.removeItem('sale_price');
      window.localStorage.removeItem('size');
      window.localStorage.removeItem('results');
      this.$router.push({ path: '/' });
      window.scroll({top: 0, left: 0, behavior: 'smooth' });
    },
    range: function(start, end) {
      size = end - start;
      return [...Array(size).keys()].map(i => i + start);
    },
    drawChart: function() {
      var ctx = document.getElementById('chart');
      var keys = Object.keys(this.results.histogram);
      var values = Object.values(this.results.histogram);
      var colours = [];
      var colour = 'rgba(0, 0, 0, 0.1)';
      var expected = this.range(this.results.min_price_per_sq_mt, this.results.max_price_per_sq_mt);

      keys.forEach(function(key) {
        start = Number(key.split('..')[0])

        if (expected.includes(start)) {
          colour = 'rgba(0, 0, 255, 0.1)'
        } else {
          colour = 'rgba(0, 0, 0, 0.1)'
        }

        colours.push(colour)
      })

      console.log(colours);

      var chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: keys,
          datasets: [{
            label: 'Number of properties in price band',
            data: values,
            backgroundColor: colours
          }]
        },
        options: {
          responsive: true,
          legend: {
              display: false
          }
        }
      });
    }
  }
}