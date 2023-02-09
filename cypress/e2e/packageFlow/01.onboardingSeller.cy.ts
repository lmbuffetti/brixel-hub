import Constants from '../../helpers/constants';

const { devices, companies } = Constants;

describe('Seller Onboarding', () => {
  //for each company do the onboarding
  companies.forEach(company => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${company}`, () => {

      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.visit(`http://localhost:5000/packageFlow/getStarted/${company}/propertyType`);

          cy.get('.brixel-radio-button-icon', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });
          cy.get('button[type="submit"]').click();

          cy.get('.brixel-input-step', { timeout: 10000 }).should('be.visible');
          cy.get('button[type="submit"]').click();

          cy.get('input[type="number"]').type('124');
          cy.get('button[type="submit"]').click();

          cy.get('input[type="number"]').type('2000');
          cy.get('button[type="submit"]').click();

          cy.get('input[role="text"]').type('Avenida');
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
          cy.wait(100).then(() => {
            cy.get('button[type="submit"]').click();
          })

          cy.url().should('contain', '/locationInputResume')
          cy.get('button[type="submit"]').click();

          cy.get('.brixel-radio-button', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });

          cy.get('input[name="register.name"]').type('Test Automated');
          cy.get('input[name="register.email"]').type(`jestTest+sellerE2E${device}@brixel.io`);
          cy.get('input[name="register.password"]').type('123456789');
          cy.get('input[name="register.privacy"]').check({ force: true });
          cy.wait(1000).then(() => {
            cy.get('button[type="submit"]').click();
          })
        })

        it('Welcome seller screen', () => {
          cy.get('.welcomeSellerBody', { timeout: 10000 }).should('be.visible');
        })

      });
    });
  });
});
