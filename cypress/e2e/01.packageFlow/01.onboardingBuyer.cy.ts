import { testData } from '../../helpers/constants';

const { devices, companies } = testData;

const userTest = Cypress.env('userTest');

describe('Buyer Onboarding', () => {

  Cypress.Cookies.debug(true);

  //for each company do the onboarding
  Object.keys(companies).forEach((key) => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${key}`, () => {
      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.clearAllCookies();
          cy.visit(`http://localhost:5000/packageFlow/getStartedBuyer/${key}/propertyType`);
        })

        it('select property type', () => {
          cy.viewport(device);
          cy.get('[type="checkbox"]').check({ force: true });
          cy.get('button[type="submit"]').click();
        })

        it('property room & size', () => {
          cy.viewport(device);
          cy.get('button[type="submit"]').click();
        })

        it('extra features', () => {
          cy.viewport(device);
          cy.get('[type="checkbox"]').check({ force: true });
          cy.get('button[type="submit"]').not('.disabled').click();
        });

        it('address autocomplete', () => {
          cy.viewport(device);
          cy.url().should('contain', '/locationInput');
          cy.get('input[role="text"]').type(companies[key].autocompleteCity);
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
          cy.getCookie('brixelToken')
            .then((res) => {
              let {email} = userTest.buyer;
              if (key === 'ubs' || key === 'baloise') {
                email = userTest.buyerPartner.email.replace(':partner', key);
              }
              if (!res) {
                cy.get('input[name="register.name"]').type('Test Automated');
                cy.get('input[name="register.email"]').type(email);
                cy.get('input[name="register.password"]').type(userTest.buyer.password);
                cy.get('input[name="register.privacy"]').check({force: true});
                cy.wait(1000).then(() => {
                  cy.get('button[type="submit"]').click();
                })
                cy.wait(1000).then(() => {
                  cy.get('body', {timeout: 10000}).then($body => {
                    if ($body.find('p.txtRed400').length > 0) {
                      cy.get('input[name="login.password"]').type(userTest.buyer.password);
                      cy.wait(1000).then(() => {
                        cy.get('button[type="submit"]').click();
                      })
                    }
                  });
                });
              } else {
                cy.get('body', {timeout: 10000}).should('be.visible');
              }
            });
        })

      });
    });
  });
});
