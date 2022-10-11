/// <reference types="cypress" />

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

describe('viewport testing', { retries: 1 }, () => {
  before(() => {
    cy.visit('http://localhost:5000/packageFlow/getStarted/brixel_portugal/propertyType');
  })

  it('take viewport screenshot', () => {
    cy.get('form', { timeout: 10000 }).should('be.visible');
    const preset = ['ipad-2', 'ipad-mini', 'iphone-6', 'iphone-6+', 'iphone-7', 'iphone-8', 'iphone-x', 'iphone-xr', 'iphone-se2', 'macbook-11', 'macbook-13', 'macbook-15', 'macbook-16', 'samsung-note9', 'samsung-s10',];
    preset.forEach((prs) => {
      cy.viewport(prs);
      cy.screenshot(`./examples/${prs}`, { overwrite: true })
    })
  })
})
