import { testData, userTest } from '../../helpers/constants';

const { devices, companies } = testData;

describe('Seller Onboarding', () => {

  Cypress.Cookies.debug(true, { verbose: false })

  //for each company do the onboarding
  Object.keys(companies).forEach((key) => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${key}`, () => {

      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.clearAllCookies();
          cy.visit(`http://localhost:5000/packageFlow/getStartedEstimation/${key}/estimationType`);
        })

        it('select intention', () => {
          cy.viewport(device);
          cy.get('.estimationType', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });
        })

        it('select property type', () => {
          cy.viewport(device);
          cy.get('.propertyType', { timeout: 10000 }).should('be.visible');
          cy.get('.brixel-radio-button-icon', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });
        })

        it('rooms number', () => {
          cy.viewport(device);
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

        it('property detail', () => {
          cy.viewport(device);
          cy.get('select[name="properties.building.conditionStatus"]').select('used', { force: true })
          cy.get('input[name="properties.typology.grossArea.value"]').type('120');
          cy.get('button[type="submit"]').click();
        })

        it('secondary room', () => {
          cy.viewport(device);
          cy.get('button.inc').click();
          cy.get('input[name="properties.typology.balconyArea.value"]').type('20')
          cy.get('input[name="properties.typology.terraceArea.value"]').type('30');
          cy.get('input[name="properties.typology.gardenArea.value"]').type('100');
          cy.get('button[type="submit"]').click();
        })

        it('more detail', () => {
          cy.viewport(device);
          cy.get('button.inc').click({ multiple: true });
          cy.get('input[name="properties.building.solarOrientarion"]').check({ force: true });
          cy.get('button[type="submit"]').click();
        })

        it('extra features', () => {
          cy.viewport(device);
          cy.get('input[name="properties.extraFeaturesBestimatePT"]').check({ force: true });
          cy.wait(100).then(() => {
            cy.get('button[type="submit"]').click();
          })
        })

        it('user register', () => {
          cy.viewport(device);
          cy.getCookie('brixelToken')
            .then((res) => {
              if (!res) {
                cy.get('input[name="register.name"]').type('Test Automated');
                let {email} = userTest.estimation;
                if (key === 'ubs' || key === 'baloise') {
                  email = userTest.estimationPartner.email.replace(':partner', key);
                }
                cy.get('input[name="register.email"]').type(email);
                cy.get('input[name="register.password"]').type(userTest.estimation.password);
                cy.get('input[name="register.privacy"]').check({force: true});
                cy.wait(1000).then(() => {
                  cy.get('button[type="submit"]').click();
                })
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

        it('Welcome estimation screen', () => {
          cy.get('.result-popup', { timeout: 10000 }).should('be.visible');
        })

      });
    });
  });
});
