/// <reference types='cypress' />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

import api from '../../../src/controllers/api/config';

describe('viewport testing', { retries: 1 }, () => {
  before(async () => {
    const data = {
      username: 'jesttest+sellere2emacbook-15@brixel.io',
      password: '123456789',
    }
    const auth = btoa(`${data.username}:${data.password}`);
    const url = 'https://dev.api.brixel.io/api/v3/authentication/getToken'
    await fetch(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${auth}`,
      },
    })
  });

  it('take viewport screenshot', () => {
    cy.get('form', { timeout: 10000 }).should('be.visible');
    const preset = ['ipad-2', 'ipad-mini', 'iphone-6', 'iphone-6+', 'iphone-7', 'iphone-8', 'iphone-x', 'iphone-xr', 'iphone-se2', 'macbook-11', 'macbook-13', 'macbook-15', 'macbook-16', 'samsung-note9', 'samsung-s10'];
    preset.forEach((prs) => {
      cy.viewport(<'macbook-16' | 'macbook-15' | 'macbook-13' | 'macbook-11' | 'ipad-2' | 'ipad-mini' | 'iphone-xr' | 'iphone-x' | 'iphone-6+' | 'iphone-se2' | 'iphone-8' | 'iphone-7' | 'iphone-6' | 'iphone-5' | 'iphone-4' | 'iphone-3' | 'samsung-s10' | 'samsung-note9'>prs);
      cy.screenshot(`./examples/${prs}`, { overwrite: true })
    })
  })
})
