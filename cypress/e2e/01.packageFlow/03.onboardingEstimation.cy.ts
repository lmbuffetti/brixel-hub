import Constants from '../../helpers/constants';

const { devices, companies } = Constants;

describe('Seller Onboarding', () => {

  Cypress.Cookies.debug(true);

  //for each company do the onboarding
  companies.forEach(company => {
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${company}`, () => {

      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.visit('http://localhost:5000/packageFlow/getStartedEstimation/brixel_portugal/estimationType');
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
          cy.get('input[role="search"]').type('Avenida');
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
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
          cy.get('button[type="submit"]').click();
        })

        it('user register', () => {
          cy.viewport(device);
          cy.getCookie('brixelToken')
            .then((res) => {
              if (!res) {
                cy.get('input[name="register.name"]').type('Test Automated');
                cy.get('input[name="register.email"]').type(`jestTest+sellerE2E${device}@brixel.io`);
                cy.get('input[name="register.password"]').type('123456789');
                cy.get('input[name="register.privacy"]').check({force: true});
                cy.wait(1000).then(() => {
                  cy.get('button[type="submit"]').click();
                })
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
