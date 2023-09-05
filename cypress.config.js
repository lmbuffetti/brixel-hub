const { defineConfig } = require("cypress");
const _ = require('lodash');
const getCompareSnapshotsPlugin = require("cypress-image-diff-js/dist/plugin");

module.exports = defineConfig({
  requestTimeout: 480000,
  responseTimeout: 480000,
  pageLoadTimeout: 480000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: 3,
  runMode: 3,
  video: false,
  
  e2e: {
    testIsolation: false,
    // supportFile: './cypress/support/index.js',
    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config)
      require('@cypress/code-coverage/task')(on, config)
      getCompareSnapshotsPlugin(on, config);
      return config;
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('./cypress/plugins/webpack.config'),
      // supportFile: 'cypress/support/component.js',
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
