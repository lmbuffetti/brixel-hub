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

describe('buyer-onboarding', { retries: 4 }, () => {
  before(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.task('log', 'Check the Seller Onboarding')
    cy.visit('http://localhost:5000/packageFlow/getStartedBuyer/brixel_portugal');
  })

  it('select property type', () => {
    cy.get('[type="checkbox"]').check({ force: true });
    cy.get('button[type="submit"]').click();
  })
  
  it('property size', () => {
    cy.get('button[type="submit"]').click();
  })
  
  it('extra features', () => {
    cy.get('[type="checkbox"]').check({ force: true });
    cy.get('button[type="submit"]').click();
  })
  
  it('address autocomplete', () => {
    cy.url().should('contain', '/locationInput');
    cy.get('input[role="search"]').type('Lisboa');
    cy.get('ul.resultAutoComplete li:first-child').should('exist').click();
    cy.get('button[type="submit"]').click();
  })
  
  it('price', () => {
    cy.url().should('contain', '/price');
    cy.get('input[name="finance.price.totalMax"]').type(100000);
    cy.get('button[type="submit"]').click();
  })
  
  it('current situation', () => {
    cy.get('[type="radio"]').first().check({ force: true });
  })
  
  it('user register', () => {
    cy.get('input[name="register.name"]').type('Test Automated');
    cy.get('input[name="register.email"]').type('jestTest+buyerE2E@brixel.io');
    cy.get('input[name="register.password"]').type('123456789');
    cy.get('input[name="register.privacy"]').check({ force: true });
    cy.wait(1000).then(() => {
      cy.get('button[type="submit"]').click();
    })
  })
  
})
