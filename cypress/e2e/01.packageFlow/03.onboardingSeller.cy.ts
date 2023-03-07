import { testData, userTest } from '../../helpers/constants';

const { devices, companies } = testData;

describe('Seller Onboarding', () => {

  Cypress.Cookies.debug(true);

  before(() => {
    cy.clearAllCookies();
  });

  //for each company do the onboarding
  Object.keys(companies).forEach((key: any) => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${key}`, () => {

      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.visit(`http://localhost:5000/packageFlow/getStarted/${key}/propertyType`);
        })

        it('select property type', () => {
          cy.viewport(device);
          cy.get('.brixel-radio-button-icon', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });
        })

        it('rooms number', () => {
          cy.viewport(device);
          cy.get('.brixel-input-step', { timeout: 10000 }).should('be.visible');
          cy.get('button[type="submit"]').click();
        })

        it('living area', () => {
          cy.viewport(device);
          cy.get('input[type="number"]').type('124');
          cy.get('button[type="submit"]').click();
        })

        it('construction year', () => {
          cy.viewport(device);
          cy.get('input[type="number"]').type('2000');
          cy.get('button[type="submit"]').click();
        })

        it('address autocomplete', () => {
          cy.viewport(device);
          cy.get('input[role="text"]').type(companies[key].autocomplete);
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
          cy.wait(100).then(() => {
            cy.get('button[type="submit"]').click();
          })
        })

        it('location recap', () => {
          cy.viewport(device);
          cy.url().should('contain', '/locationInputResume')
          cy.get('button[type="submit"]').click();
        })

        it('condition property', () => {
          if (key !== 'ubs' && key !== 'baloise') {
            cy.viewport(device);
            cy.get('[type="radio"]').first().check({force: true});
          }
        })

        it('user register', () => {
          cy.viewport(device);
          cy.getCookie('brixelToken')
            .then((res) => {
              if (!res) {
                cy.get('input[name="register.name"]').type('Test Automated');
                cy.get('input[name="register.email"]').type(userTest.seller.email);
                cy.get('input[name="register.password"]').type(userTest.seller.password);
                cy.get('input[name="register.privacy"]').check({force: true});
                cy.wait(1000).then(() => {
                  cy.get('button[type="submit"]').click();
                });
                cy.wait(1000).then(() => {
                  cy.get('body', {timeout: 10000}).then($body => {
                    if ($body.find('p.txtRed400').length > 0) {
                      cy.get('input[name="login.password"]').type(userTest.seller.password);
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

        it('Welcome seller screen', () => {
          if (key === 'ubs' || key === 'baloise') {
            cy.get('.rewards-container', { timeout: 10000 }).should('be.visible');
          } else {
            cy.get('.welcomeSellerBody', {timeout: 10000}).should('be.visible');
          }
          cy.url().then((url) => {
            cy.log('Current URL is: ' + url);
            const splitURL = url.split('/');
            const indexURL = splitURL.findIndex((link) => link === 'packageFlow');
            if (indexURL >= 0) {
              cy.log('PAGE ID URL is: ' + splitURL[indexURL + 1]);
              cy.setCookie('userPageID', splitURL[indexURL + 1]);
            }
          })
        })

      });
    });
  });
});
