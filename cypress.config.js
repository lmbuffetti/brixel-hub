const { defineConfig } = require("cypress");
const _ = require('lodash')

module.exports = defineConfig({
  requestTimeout: 480000,
  responseTimeout: 480000,
  pageLoadTimeout: 480000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: 3,
  runMode: 3,
  
  e2e: {
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = _.some(results.tests, (test) => {
            return _.some(test.attempts, { state: 'failed' })
          })
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            return delete results.video;
          }
        }
      })
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('./cypress/plugin/webpack.config'),
      supportFile: 'cypress/support/component.js',
      specPattern: 'cypress/**/**/*.cy.{js,ts,jsx,tsx}',
      setupNodeEvents(on) {
        on('file:preprocessor', () => {
          on(
            'file:preprocessor',
            require('@cypress/code-coverage/use-babelrc')
          );
        });
      },
    },
  },
});
