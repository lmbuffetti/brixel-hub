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

describe('buyer-onboarding', { retries: 1 }, () => {
  before(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.task('log', 'Check the Seller Onboarding')
    cy.visit('http://localhost:5000/packageFlow/getStartedEstimation/brixel_portugal/estimationType');
  })

  it('select intention', () => {
    cy.get('.estimationType', { timeout: 10000 }).should('be.visible');
    cy.get('[type="radio"]').first().check({ force: true });
  })
  
  it('select property type', () => {
    cy.get('.propertyType', { timeout: 10000 }).should('be.visible');
    cy.get('.brixel-radio-button-icon', { timeout: 10000 }).should('be.visible');
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
    cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
  })
  
  it('location recap', () => {
    cy.url().should('contain', '/locationInputResume')
    cy.get('button[type="submit"]').click();
  })
  
  it('property detail', () => {
    cy.get('select[name="properties.building.conditionStatus"]').select('new', { force: true })
    cy.get('input[name="properties.typology.grossArea.value"]').type('120');
    cy.get('button[type="submit"]').click();
  })
  
  it('secondary room', () => {
    cy.get('button.inc').click();
    cy.get('input[name="properties.typology.balconyArea.value"]').type('20')
    cy.get('input[name="properties.typology.terraceArea.value"]').type('30');
    cy.get('input[name="properties.typology.gardenArea.value"]').type('100');
    cy.get('button[type="submit"]').click();
  })
  
  it('more detail', () => {
    cy.get('button.inc').click({ multiple: true });
    cy.get('input[name="properties.building.solarOrientarion"]').check({ force: true });
    cy.get('button[type="submit"]').click();
  })
  
  it('extra features', () => {
    cy.get('input[name="properties.extraFeaturesBestimatePT"]').check({ force: true });
    cy.get('button[type="submit"]').click();
  })
  
  it('user register', () => {
    cy.get('input[name="register.name"]').type('Test Automated');
    cy.get('input[name="register.email"]').type('jestTest+estimationE2E@brixel.io');
    cy.get('input[name="register.password"]').type('123456789');
    cy.get('input[name="register.privacy"]').check({ force: true });
    cy.wait(1000).then(() => {
      cy.get('button[type="submit"]').click();
    })
  })
  
})
