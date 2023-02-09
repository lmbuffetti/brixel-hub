import Constants from '../../helpers/constants';

const { devices, companies } = Constants;

describe('Buyer Onboarding', () => {
  //for each company do the onboarding
  companies.forEach(company => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${company}`, () => {

      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.visit(`http://localhost:5000/packageFlow/getStartedBuyer/${company}/propertyType`);
        })

        it('select property type', () => {
          cy.viewport(device);
          cy.get('[type="checkbox"]').check({ force: true });
          cy.get('button[type="submit"]').click();
        })

        it('property device', () => {
          cy.viewport(device);
          cy.get('button[type="submit"]').click();
        })

        it('extra features', () => {
          cy.viewport(device);
          cy.get('[type="checkbox"]').check({ force: true });
          cy.get('button[type="submit"]').not('.disabled').click();
        })

        it('address autocomplete', () => {
          cy.viewport(device);
          cy.url().should('contain', '/locationInput');
          cy.get('input[role="text"]').type('Lisboa');
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
          cy.wait(300).then(() => {
            cy.get('button[type="submit"]').not('.disabled').click();
          })
        })

        it('price', () => {
          cy.viewport(device);
          cy.url().should('contain', '/price');
          cy.get('input[name="finance.price.totalMax"]').type('100000');
          cy.get('button[type="submit"]').not('.disabled').click();
        })

        it('current situation', () => {
          cy.viewport(device);
          cy.get('[type="radio"]').first().check({ force: true });
        })

        it('user register', () => {
          cy.viewport(device);
          cy.get('input[name="register.name"]').type('Test Automated');
          cy.get('input[name="register.email"]').type('jestTest+buyerE2E@brixel.io');
          cy.get('input[name="register.password"]').type('123456789');
          cy.get('input[name="register.privacy"]').check({ force: true });
          cy.wait(1000).then(() => {
            cy.get('button[type="submit"]').click();
          })
        })

        it('Welcome buyer screen', () => {
          cy.get('.result-popup', { timeout: 10000 }).should('be.visible');
        })

      });
    });
  });
});
