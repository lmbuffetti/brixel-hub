import Constants from '../../helpers/constants';

const { sizes, companies } = Constants;

describe('Buyer Onboarding', () => {
  //for each company do the onboarding
  companies.forEach(company => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${company}`, () => {
      
      sizes.forEach((size) => {
        it('visit url', () => {
          cy.viewport(size);
          cy.visit(`http://localhost:5000/packageFlow/getStartedBuyer/${company}/propertyType`);
        })

        it('select property type', () => {
          cy.viewport(size);
          cy.get('[type="checkbox"]').check({ force: true });
          cy.get('button[type="submit"]').click();
        })
  
        it('property size', () => {
          cy.viewport(size);
          cy.get('button[type="submit"]').click();
        })
  
        it('extra features', () => {
          cy.viewport(size);
          cy.get('[type="checkbox"]').check({ force: true });
          cy.get('button[type="submit"]').not('.disabled').click();
        })
  
        it('address autocomplete', () => {
          cy.viewport(size);
          cy.url().should('contain', '/locationInput');
          cy.get('input[role="search"]').type('Lisboa');
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
          cy.wait(300).then(() => {
            cy.get('button[type="submit"]').not('.disabled').click();
          })
        })
  
        it('price', () => {
          cy.viewport(size);
          cy.url().should('contain', '/price');
          cy.get('input[name="finance.price.totalMax"]').type('100000');
          cy.get('button[type="submit"]').not('.disabled').click();
        })
  
        it('current situation', () => {
          cy.viewport(size);
          cy.get('[type="radio"]').first().check({ force: true });
        })
  
        it('user register', () => {
          cy.viewport(size);
          cy.get('input[name="register.name"]').type('Test Automated');
          cy.get('input[name="register.email"]').type('jestTest+buyerE2E@brixel.io');
          cy.get('input[name="register.password"]').type('123456789');
          cy.get('input[name="register.privacy"]').check({ force: true });
          cy.wait(1000).then(() => {
            cy.get('button[type="submit"]').click();
          })
        })
  
      });
    });
  });
});
