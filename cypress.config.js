const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 10000,
  responseTimeout: 60000,
  pageLoadTimeout: 480000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  retries: 3,
  runMode: 3,
  
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
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
