import Constants from '../../helpers/constants';

const { sizes, companies } = Constants;

describe('Seller Onboarding', () => {
  //for each company do the onboarding
  companies.forEach(company => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${company}`, () => {
      
      sizes.forEach((size) => {
        it('visit url', () => {
          cy.viewport(size);
          cy.visit(`http://localhost:5000/packageFlow/getStarted/${company}/propertyType`);
        })
        
        it('select property type', () => {
          cy.viewport(size);
          cy.get('.brixel-radio-button-icon', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });
        })
  
        it('rooms number', () => {
          cy.viewport(size);
          cy.get('button[type="submit"]').click();
        })
  
        it('living area', () => {
          cy.viewport(size);
          cy.get('input[type="number"]').type('124');
          cy.get('button[type="submit"]').click();
        })
  
        it('construction year', () => {
          cy.viewport(size);
          cy.get('input[type="number"]').type('2000');
          cy.get('button[type="submit"]').click();
        })
  
        it('address autocomplete', () => {
          cy.viewport(size);
          cy.get('input[role="search"]').type('Avenida');
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
        })
  
        it('location recap', () => {
          cy.viewport(size);
          cy.url().should('contain', '/locationInputResume')
          cy.get('button[type="submit"]').click();
        })
  
        it('condition property', () => {
          cy.viewport(size);
          cy.get('[type="radio"]').first().check({ force: true });
        })
  
        it('user register', () => {
          cy.viewport(size);
          cy.get('input[name="register.name"]').type('Test Automated');
          cy.get('input[name="register.email"]').type(`jestTest+sellerE2E${size}@brixel.io`);
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
