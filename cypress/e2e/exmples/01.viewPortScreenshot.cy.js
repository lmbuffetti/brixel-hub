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
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.task('log', 'Check the Seller Onboarding')
    cy.visit('http://localhost:5000/packageFlow/getStarted/brixel_portugal/propertyType');
  })

  it('take viewport screenshot', () => {
    const preset = ['ipad-2', 'ipad-mini', 'iphone-6', 'iphone-6+', 'iphone-7', 'iphone-8', 'iphone-x', 'iphone-xr', 'iphone-se2', 'macbook-11', 'macbook-13', 'macbook-15', 'macbook-16', 'samsung-note9', 'samsung-s10',];
    preset.forEach((preset) => {
      cy.viewport(preset);
      cy.screenshot(`./exmples/${preset}`, { overwrite: true })
    })
  })
})
