const Vue = require('vue/dist/vue.js');

Vue.component('error-messages', {
  props: {
    errors: Array
  },
  template: `<div v-if="errors">
    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          <li v-for="error in errors">
              <a v-bind:href="error.target">{{ error.message }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>`,
})
