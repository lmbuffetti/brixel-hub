const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
