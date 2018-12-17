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
        Based on the data we have, the proposed sale price of your property looks typical of the current market.
      </p>
    </div>
    <div v-if="!expected">
      <p>
        Based on the data we have, the proposed sale price of your property does <strong>not</strong> look typical of the current market.
      </p>
    </div>
    <p>
      We use data from the <a href="https://www.gov.uk/government/collections/price-paid-data">HM
      Land Registry Price Paid Dataset</a>, together with property square meterage from the
      <a href="https://epc.opendatacommunities.org/">MHCLG Energy Performance Dataset</a> to work out
      the range of prices per square metre in a 1 kilometre radius around your proposed site area.
    </p>
    <p>
      We expect properties in this area to fetch, on average, somewhere 
      in the region of <strong>£{{ this.min_price }}</strong> to 
      <strong>£{{ this.max_price }}</strong> per square metre.
    </p>
    <p>
      From your submission, it looks like you expect your property to sell for <strong>£{{ this.per_sq_mt }}</strong>
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
      this.min_price = this.results.min_price_per_sq_mt.toLocaleString();
      this.max_price = this.results.max_price_per_sq_mt.toLocaleString();
      this.per_sq_mt = (this.sale_price / this.size).toLocaleString();
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
    },
    range: function(start, end) {
      size = end - start;
      return [...Array(size).keys()].map(i => i + start);
    },
    drawChart: function() {
      var ctx = document.getElementById('chart');
      var keys = Object.keys(this.results.histogram);
      var values = Object.values(this.results.histogram);
      var expected = this.range(this.results.min_price_per_sq_mt, this.results.max_price_per_sq_mt);

      var inRange = [];
      var outsideRange = [];

      keys.forEach(function(key, i) {
        start = Number(key.split('..')[0])

        if (expected.includes(start)) {
          inRange.push(values[i])
          outsideRange.push(0)
        } else {
          outsideRange.push(values[i])
          inRange.push(0)
        }

      })

      var chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: keys,
          datasets: [
            {
              label: 'Developments inside expected range',
              data: inRange,
              backgroundColor: 'rgba(0, 0, 255, 0.1)'
            },
            {
              label: 'Developments outside expected range',
              data: outsideRange,
            },
        ]
        },
        options: {
          responsive: true,
          legend: {
              display: true
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Number of Developments'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Price per m²',
              },
              stacked: true
            }]
          }
        }
      });
    }
  }
}