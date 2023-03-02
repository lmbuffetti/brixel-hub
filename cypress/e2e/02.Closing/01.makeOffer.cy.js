// Edit this array to add or change the preset of viewport for the tests
// Complete list: https://docs.cypress.io/api/commands/viewport

import { testData } from '../../helpers/constants';
const { devices } = testData;
import ep from '../../../src/controllers/endPoints.constant';

const multiofferTest = [

]

describe('viewport testing', () => {
  
  Cypress.Cookies.debug(true);
  
  before(async () => {
    cy.loginViaApi({loadSingleProp: true, loadDeal: true});
  });
  
  devices.forEach((device) => {
    it('visit url', () => {
      cy.viewport(device);
      cy.getCookie('userPageID')
        .then((res) => {
          console.log('test', ep.deal.deleteOffer(123));
          cy.visit(`http://localhost:5000/packageFlow/${res.value}/makeOffer/priceInfo`);
        });
    })
  
    it('offer price', () => {
      cy.viewport(device);
      cy.get('.brixel-text-input-container div.cur-poi').click();
      cy.get('input[name="amount"]').type('150000');
      cy.get('[type="radio"]').eq(1).check({ force: true });
      cy.get('button[type="submit"]').click();
    });
  
    // TEST WITHOUT FINANCE CERTIFICATE FOR PT AND CH
    it('request credit without certificate', () => {
      cy.reduxValue('brixelForm', 'offerFlow')
        .then(($identifier) => {
          console.log($identifier);
          if ($identifier.values.financeCertificate === 0) {
            cy.get('[name="proofConfirm"]').check( { force: true });
            cy.get('.multiStepSlides button[type="button"]').click();
          } else {
            cy.log('skipped');
          }
        });
    });
    
    // TEST WITH FINANCE CERTIFICATE FOR PT AND CH
    it('buyer details with finance certificate', () => {
      cy.viewport(device);
      cy.reduxValue('brixelForm', 'offerFlow')
        .then(() => {
          cy.get('input[name="buyer.placeOfOrigin"]').type('Lisboa');
          cy.get('#fixedDatePicker .cur-poi').click();
          cy.get('.wrap-select select', {timeout: 10000}).first().select('1980', { force: true })
          cy.get('.react-datepicker__day', {timeout: 10000}).eq(15).click();
  
          cy.get('[name="buyer.maritialStatus"]').select(1, { force: true });
          cy.get('[name="buyer.typeOfPurchase"]').select(1, { force: true });
          cy.get('[name="noteByBuyer"]').type('test note');
  
          cy.get('button[type="submit"]').click();
        })
    })
  
    it('buyer location with finance certificate', () => {
      cy.reduxValue('brixelForm', 'offerFlow')
        .then(() => {
          cy.get('[name="location.street"]').type('Avenida da Liberdade');
          cy.get('[name="location.streetNumber"]').type('12');
          cy.get('[name="location.zipCode"]').type('1100-100');
          cy.get('[name="location.City"]').type('Lisboa');
          cy.get('button[type="submit"]').click();
        });
    });
  
    it('upload finance with finance certificate', () => {
      cy.reduxValue('brixelForm', 'offerFlow')
        .then(($identifier) => {
          if ($identifier.values.financeCertificate === 1 && !$identifier.values.skipFinanceTest) {
            //file to be uploaded path in project folder
            const p = './cypress/fixtures/UplaodsFile/dummy.pdf'
    
            cy.get('[name="document"]').selectFile(p, { force: true });
            cy.get('button[type="submit"]').click();
          } else {
            cy.log('skipped');
          }
        });
    });
  
    it('success screen', () => {
      cy.get('button[type="submit"] .btnLoader', {timeout: 10000}).should('not.be.visible')
        .then(() => {
          console.log(ep.deal.deleteOffer(123));
        })
    });
  });
})
