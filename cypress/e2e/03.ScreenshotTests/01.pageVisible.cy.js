// Edit this array to add or change the preset of viewport for the tests
// Complete list: https://docs.cypress.io/api/commands/viewport

const preset = ['macbook-15'];

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
  
  before(async () => {
    cy.loginViaApi('loadSingleProp');
  });
  
  pageToCheck.forEach((page) => {
    
    it('take viewport screenshot', () => {
      cy.getCookie('userPageID')
        .then((res) => {
          const pageURL = page.url.replace(':pageID', res?.value || '');
          cy.visit(`http://localhost:5000/${pageURL}`);
          cy.get(`.${page.classToCheck}`, { timeout: 10000 }).should('be.visible');
          cy.window()
            .its('store')
            .invoke('getState')
            .its('common')
            .its('isSmallLoading')
            .then(($identifier) => {
              cy.log($identifier);
              const filterData = Object.keys($identifier).filter((key) => $identifier[key] === false);
              expect(filterData.length).to.equal(0);
  
              preset.forEach((prs) => {
                cy.viewport(prs);
                cy.screenshot(`./examples/${page.url}-${prs}`, { overwrite: true })
              })
            });
        })
    })
    
  })
})
