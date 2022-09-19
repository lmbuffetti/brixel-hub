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

describe('seller-onboarding', () => {
  before(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('https://wide:LXlovesZH@dev-hub.brixel.io/packageFlow/getStarted/brixel_portugal');
  })

  it('select property type', () => {
    cy.get('[type="radio"]').first().check({ force: true });
  })
  
  it('rooms number', () => {
    cy.get('button[type="button"]').click();
  })
  
  it('living area', () => {
    cy.get('input[type="text"]').type(124)
  })
  
})
