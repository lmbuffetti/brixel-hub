// Edit this array to add or change the preset of viewport for the tests
// Complete list: https://docs.cypress.io/api/commands/viewport

import { testData } from '../../helpers/constants';
import Cookies from 'universal-cookie';
const cookie = new Cookies();

const { devices, companies } = testData;

const formTest = [
  {
    financeCertificate: 0,
  },
  {
    financeCertificate: 1,
  },
]

describe('viewport testing', () => {

  Cypress.Cookies.debug(true);

  Object.keys(companies).forEach((key) => {
    describe(`company: ${key}`, () => {
      formTest.forEach((form) => {
        devices.forEach((device) => {
          it('get data', () => {
            const token = cookie.get('brixelToken');
            const dealID = companies[key].propID;
            if (!token) {
              cy.loginViaApi('buyer');
            }
            try {
              cy.log(dealID);
              cy.deleteOffer(dealID);
            }
            catch {
              cy.log('Offer does not exist');
            }
          })

          it('visit url', () => {
            cy.viewport(device);
            cy.visit(`http://localhost:5000/packageFlow/${companies[key].propID}/makeOffer/priceInfo`);
          })

          it('offer price', () => {
            cy.viewport(device);
            cy.get('.brixel-text-input-container div.cur-poi').click();
            cy.get('input[name="amount"]').type('150000');
            cy.get('body', {timeout: 10000}).then($body => {
              if ($body.find('[type="radio"]').length > 0) {
                cy.get('[type="radio"]').eq(form.financeCertificate).check({force: true});
              }
            });
            cy.get('button[type="submit"]').click();
          });

          // TEST WITHOUT FINANCE CERTIFICATE FOR PT AND CH
          it('request credit without certificate', () => {
            cy.reduxValue('brixelForm', 'offerFlow')
              .then(($identifier) => {
                if (key === 'brixel_zurich' && $identifier.values.financeCertificate === 0) {
                  cy.get('.multiStepSlides button.primaryBtn', {timeout: 10000}).click();
                } else if ($identifier.values.financeCertificate === 0) {
                  cy.get('[name="proofConfirm"]').check({force: true});
                  cy.get('.multiStepSlides button[type="button"]').click();
                } else {
                  cy.log('skipped');
                }
              });
          });

          // TEST WITHOUT FINANCE CERTIFICATE FOR PT AND CH
          it('Finacial data', () => {
            cy.reduxValue('brixelForm', 'offerFlow')
              .then(($identifier) => {
                if (key === 'brixel_zurich' && $identifier.values.financeCertificate === 0) {
                  cy.get('input[name="financeBuyer.equity"]').type('140000');
                  cy.get('input[name="financeBuyer.income"]').type('15000');
                  cy.get('button[type="submit"]').click();
                } else {
                  cy.log('skipped');
                }
              });
          });

          // TEST WITH FINANCE CERTIFICATE FOR PT AND CH
          it('buyer details with finance certificate', () => {
            cy.viewport(device);
            cy.reduxValue('brixelForm', 'offerFlow')
              .then(($identifier) => {
                if ($identifier.values.financeCertificate === null) {
                  //file to be uploaded path in project folder
                  const p = './cypress/fixtures/UplaodsFile/dummy.pdf'
                  cy.get('[name="document"]').selectFile(p, {force: true});
                  cy.get('button[type="submit"]').click();
                } else if (key === 'brixel_zurich' && $identifier.values.financeCertificate === 0) {
                  cy.get('button.primaryBtn').click();
                } else {
                  cy.get('input[name="buyer.placeOfOrigin"]').type('Lisboa');
                  cy.get('#fixedDatePicker .cur-poi').click();
                  cy.get('.wrap-select select', {timeout: 10000}).first().select('1980', {force: true})
                  cy.get('.react-datepicker__day', {timeout: 10000}).eq(15).click();

                  cy.get('[name="buyer.maritialStatus"]').select(1, {force: true});
                  cy.get('[name="buyer.typeOfPurchase"]').select(1, {force: true});
                  cy.get('[name="noteByBuyer"]').type('test note');
                  cy.get('button[type="submit"]').click();
                }
              })
          })

          it('buyer location with finance certificate', () => {
            cy.reduxValue('brixelForm', 'offerFlow')
              .then(($identifier) => {
                if ($identifier.values.financeCertificate !== null) {
                  if (key === 'brixel_zurich' && $identifier.values.financeCertificate === 0) {
                    cy.log('skip');
                  } else {
                    cy.get('[name="location.street"]').type('Avenida da Liberdade');
                    cy.get('[name="location.streetNumber"]').type('12');
                    cy.get('[name="location.zipCode"]').type('1100-100');
                    cy.get('[name="location.City"]').type('Lisboa');
                    cy.get('button[type="submit"]').click();
                  }
                }
              });
          });

          it('upload finance with finance certificate', () => {
            cy.reduxValue('brixelForm', 'offerFlow')
              .then(($identifier) => {
                if (key === 'brixel_zurich' && $identifier.values.financeCertificate === 0) {
                  cy.log('skipped');
                } else if ($identifier.values.financeCertificate === 1 && !$identifier.values.skipFinanceTest) {
                  //file to be uploaded path in project folder
                  const p = './cypress/fixtures/UplaodsFile/dummy.pdf'

                  cy.get('[name="document"]').selectFile(p, {force: true});
                  cy.get('button[type="submit"]').click();
                } else {
                  cy.log('skipped');
                }
              });
          });

          it('success screen', () => {
            cy.get('button[type="submit"] .btnLoader', {timeout: 10000}).should('not.be.visible');
          });
        });
      })
    });
  });
});
