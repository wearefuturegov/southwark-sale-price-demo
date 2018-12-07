module.exports = {
  data: function() {
    return {
      results: window.localStorage.getItem('results'),
      expected: null
    }
  },
  template: `<div id="results">
    <div v-if="expected">
      <div class="govuk-panel govuk-panel--confirmation">
        <h1 class="govuk-panel__title">
          Everything looks fine
        </h1>
        <div class="govuk-panel__body">
          Your reference number
          <br><strong>HDJ2123F</strong>
        </div>
      </div>
    </div>
    <div v-if="!expected">
      Red flag
    </div>
  </div>
  `,
  mounted: function() {
    if (this.results !== null) {
      this.results = JSON.parse(this.results);
      this.expected = this.results.expected;
      console.log(this.results);
    }
  }
}