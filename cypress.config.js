const { defineConfig } = require("cypress");
const webpackPreprocessor = require('@cypress/webpack-preprocessor')

module.exports = defineConfig({
  requestTimeout: 10000,
  responseTimeout: 60000,
  viewportHeight: 1080,
  viewportWidth: 1920,
  
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        // send in the options from your webpack.config.js, so it works the same
        // as your app's code
        webpackOptions: require('./cypress/plugin/webpack.config'),
        watchOptions: {},
      }
      on('file:preprocessor', webpackPreprocessor(options))
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
      setupNodeEvents(on, _) {
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
