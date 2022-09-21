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

describe('seller-onboarding', { retries: 4 }, () => {
  before(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.task('log', 'Check the Seller Onboarding')
    cy.visit('http://localhost:5000/packageFlow/getStarted/brixel_portugal/propertyType');
  })

  it('select property type', () => {
    cy.get('[type="radio"]').first().check({ force: true });
  })
  
  it('rooms number', () => {
    cy.get('button[type="submit"]').click();
  })
  
  it('living area', () => {
    cy.get('input[type="number"]').type('124');
    cy.get('button[type="submit"]').click();
  })
  
  it('construction year', () => {
    cy.get('input[type="number"]').type('2000');
    cy.get('button[type="submit"]').click();
  })
  
  it('address autocomplete', () => {
    cy.get('input[role="search"]').type('Avenida');
    cy.get('ul.resultAutoComplete li:first-child').should('exist').click();
  })
  
  it('location recap', () => {
    cy.url().should('contain', '/locationInputResume')
    cy.get('button[type="submit"]').click();
  })
  
  it('condition property', () => {
    cy.get('[type="radio"]').first().check({ force: true });
  })
  
  it('user register', () => {
    cy.get('input[name="register.name"]').type('Test Automated');
    cy.get('input[name="register.email"]').type('jestTest+sellerE2E@brixel.io');
    cy.get('input[name="register.password"]').type('123456789');
    cy.get('input[name="register.privacy"]').check({ force: true });
    cy.wait(1000).then(() => {
      cy.get('button[type="submit"]').click();
    })
  })
  
})
