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

const pageToCheck = [
  {url: 'sell', classToCheck: 'market-container'},
  {url: 'buy/searchProfile/published/1', classToCheck: 'buyerMarket'},
  {url: 'buy/searchProfile/pre-market/1', classToCheck: 'buyerMarket'},
  {url: 'buy/searchProfile/all/1', classToCheck: 'buyerMarket'},
  {url: 'buy/favorites/list', classToCheck: 'buyerPage'},
  {url: 'buy/estimations', classToCheck: 'buyerPage'},
]

describe('viewport testing', { retries: 1 }, () => {
  
  pageToCheck.forEach((page) => {
    
    it('take viewport screenshot', () => {
      cy.visit(`http://localhost:5000/${page.url}`);
      cy.get(`.${page.classToCheck}`, { timeout: 10000 }).should('be.visible');
      const preset = ['ipad-2', 'iphone-6', 'macbook-15'];
      preset.forEach((prs) => {
        cy.viewport(prs);
        cy.screenshot(`./examples/${page.url}-${prs}`, { overwrite: true })
      })
    })
    
  })
})
