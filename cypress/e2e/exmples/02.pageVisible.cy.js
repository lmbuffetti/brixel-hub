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
  // SELL DASHBOARD
  {url: 'sell', classToCheck: 'market-container'},
  // BUY DASHBOARD
  {url: 'buy/searchProfile/published/1', classToCheck: 'buyerMarket'},
  {url: 'buy/searchProfile/pre-market/1', classToCheck: 'buyerMarket'},
  {url: 'buy/searchProfile/all/1', classToCheck: 'buyerMarket'},
  {url: 'buy/favorites/list', classToCheck: 'buyerPage'},
  {url: 'buy/estimations', classToCheck: 'buyerPage'},
  // SELLER SINGLE PROPERTY
  {url: ':pageID/home', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/price', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/price/proEstimation', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/propertyType', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/extraFeature', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/locationInput', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/condition', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/secondaryRooms', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/parking', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/facilitiesMaterials', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/landRegister', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/priceAndFinacials', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/salesStrategy', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/facts/description', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/photos', classToCheck: 'dashboardContainer'},
  {url: ':pageID/property/floorPlans', classToCheck: 'dashboardContainer'},
  {url: ':pageID/docubox', classToCheck: 'dashboardContainer'},
  {url: ':pageID/marketing', classToCheck: 'dashboardContainer'},
  {url: ':pageID/prospects', classToCheck: 'dashboardContainer'},
  {url: ':pageID/prospects/newDeal', classToCheck: 'dashboardContainer'},
  {url: ':pageID/closing', classToCheck: 'dashboardContainer'},
  {url: ':pageID/closing/sample', classToCheck: 'dashboardContainer'},
  // BUYER SINGLE PROPERTY
  {url: 'buyer/:pageID/home', classToCheck: 'dashboardContainer'},
  {url: 'buyer/:pageID/property/contact', classToCheck: 'dashboardContainer'},
  {url: 'buyer/:pageID/property/page', classToCheck: 'dashboardContainer'},
  {url: 'buyer/:pageID/financing', classToCheck: 'dashboardContainer'},
  {url: 'buyer/:pageID/scheduleVisit', classToCheck: 'bodyModal'},
  {url: 'buyer/:pageID/docubox', classToCheck: 'dashboardContainer'},
  {url: 'buyer/:pageID/closing', classToCheck: 'dashboardContainer'},
]

describe('viewport testing', () => {
  
  Cypress.Cookies.debug(true);
  
  pageToCheck.forEach((page) => {
    
    it('take viewport screenshot', () => {
      cy.getCookie('userPageID')
        .then((res) => {
          const pageURL = page.url.replace(':pageID', res.value);
          cy.visit(`http://localhost:5000/${pageURL}`);
          cy.get(`.${page.classToCheck}`, { timeout: 10000 }).should('be.visible');
          const preset = ['ipad-2', 'iphone-6', 'macbook-15'];
          preset.forEach((prs) => {
            cy.viewport(prs);
            cy.screenshot(`./examples/${page.url}-${prs}`, { overwrite: true })
          })
        })
    })
    
  })
})
