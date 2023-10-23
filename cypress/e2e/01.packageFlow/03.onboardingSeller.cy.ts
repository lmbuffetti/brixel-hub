import { testData } from '../../helpers/constants';

const { devices, companies } = testData;

describe('seller Onboarding', () => {

  const partner = ['ubs', 'baloise'];

  Cypress.Cookies.debug(true);

  before(() => {
    cy.clearAllCookies();
  });

  //for each company do the onboarding
  Object.keys(companies).forEach((key: any) => {
    const isPartner = partner.includes(key);
    //This gives you some feedback in the Cypress side bar console on what URL you're at
    describe(`company: ${key}`, () => {

      devices.forEach((device) => {
        it('visit url', () => {
          cy.viewport(device);
          cy.clearAllCookies();
          cy.visit(`http://localhost:5000/packageFlow/getStarted/${key}/propertyType`);
        })

        it('select property type', () => {
          cy.viewport(device);
          cy.wrap('#step-propertyType').compareSnapshot(`sellerPropertyType${key}`, 0.05);
          cy.get('.brixel-radio-button-icon', { timeout: 10000 }).should('be.visible');
          cy.get('[type="radio"]').first().check({ force: true });
        })

        it('rooms number', () => {
          cy.viewport(device);
          cy.wrap('#step-allRooms').compareSnapshot(`sellerRoomsNumber${key}`, 0.05);
          cy.get('.brixel-input-step', { timeout: 10000 }).should('be.visible');
          cy.get('button[type="submit"]').click();
        })

        it('living area', () => {
          cy.viewport(device);
          cy.wrap('#step-livingSpace').compareSnapshot(`sellerLivingArea${key}`, 0.05);
          cy.get('input[type="number"]').type('124');
          cy.get('button[type="submit"]').click();
        })

        it('construction year', () => {
          cy.viewport(device);
          cy.wrap('#step-constructionYear').compareSnapshot(`sellerConstructionYear${key}`, 0.05);
          cy.get('input[type="number"]').type('2000');
          cy.get('button[type="submit"]').click();
        })

        it('address autocomplete', () => {
          cy.viewport(device);
          cy.wrap('#step-locationInput').compareSnapshot(`sellerAddressAutocomplete${key}`, 0.05);
          cy.get('input[role="text"]').type(companies[key].autocomplete);
          cy.get('ul.resultAutoComplete li:first-child', { timeout: 10000 }).should('be.visible').click();
          cy.wait(100).then(() => {
            cy.get('button[type="submit"]').click();
          })
        })

        it('location recap', () => {
          cy.viewport(device);
          cy.wrap('#step-locationInputResume').compareSnapshot(`sellerLocationRecap${key}`, 0.05);
          cy.url().should('contain', '/locationInputResume')
          cy.get('button[type="submit"]').click();
        })

        it('user register', () => {
          cy.viewport(device);
          cy.getCookie('brixelToken')
            .then((res) => {
              cy.register(res, key);
            });
        })

        it('Terms & Condition', () => {
          if (key === 'ubs') {
            cy.url().should('include', 'termsConditionFlow')
            cy.get('button[type="submit"]', { timeout: 10000 }).click();
          }
          if (key === 'baloise') {
            cy.url().should('include', 'termsConditionFlow');
            cy.get('[type="radio"]').first().check({force: true});
            cy.get('button[type="submit"]', {timeout: 10000}).click();
            cy.wait(1000).then(() => {
              cy.get('button[type="submit"]', {timeout: 10000}).click();
            })
          }
        })

        it('Welcome seller screen', () => {
          if (isPartner) {
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
        });
      });
    });
  });
});
