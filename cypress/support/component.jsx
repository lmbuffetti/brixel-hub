// ***********************************************************
import { mount } from 'cypress/react18';
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../src/store';
import '../../src/styles/SCSS/general/componentsLoad.scss';
// Import commands.js using ES2015 syntax:
import '../../src/styles/SCSS/general/main.scss';
import '../../src/styles/SCSS/styleguide/boxModel.scss';
import '../../src/styles/SCSS/styleguide/container.scss';
import '../../src/styles/SCSS/styleguide/fontStyle.scss';
import '../../src/styles/SCSS/styleguide/grid.scss';
import '../../src/styles/SCSS/styleguide/helpers.scss';
import '../../src/styles/SCSS/styleguide/mainStyleguide.scss';
import '../../src/styles/SCSS/styleguide/spacing.scss';

import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add('mount', (component, options = {}) => {
  // Use defailt store if none are provided.
  const { reduxStore = store, ...mountOptions } = options;
  
  const wrappedComponent = <React.Fragment><Provider store={reduxStore}><BrowserRouter>{component}</BrowserRouter></Provider></React.Fragment>;
  return mount(wrappedComponent, mountOptions);
});

// expose store when run in Cypress
if (window.Cypress) {
  window.store = store
}

// Example use:
// cy.mount(<MyComponent />)
