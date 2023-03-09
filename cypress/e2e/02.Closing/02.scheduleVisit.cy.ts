// Edit this array to add or change the preset of viewport for the tests
// Complete list: https://docs.cypress.io/api/commands/viewport

import { testData } from '../../helpers/constants';
import Cookies from 'universal-cookie';
const cookie = new Cookies();

const { devices, companies } = testData;

const singleCompany = 'brixel_portugal';

const linkToVisit = [
  'http://localhost:5000/buyer/:propID/scheduleVisit',
  'http://localhost:5000/buyer/:propID/scheduleVisit?showBookings',
]

describe('viewport testing', () => {

  Cypress.Cookies.debug(true);

  describe(`company: ${singleCompany}`, () => {

    linkToVisit.forEach((link, f) => {
      devices.forEach((device) => {
        it('get data', () => {
          const token = cookie.get('brixelToken');
          if (!token) {
            cy.loginViaApi('buyer');
          }
        })

        it('visit url', () => {
          cy.viewport(device);
          const url = link.replace(':propID', companies[singleCompany].propID);
          cy.visit(url);
        })

        for (let i = 0; i < 3; i++) {
          it('Select Date', () => {
            cy.viewport(device);
            if (link.includes('showBooking')) {
              cy.get('button.icnRed400').eq(0).click();
            }
            cy.get('.react-datepicker__day', {timeout: 1000}).eq(10 + i + (f * 4)).click();
          });

          it('Select Time', () => {
            cy.viewport(device);
            cy.get('button[type="submit"]').click();
          });

          it('Recap Date', () => {
            cy.viewport(device);
            if (i < 2) {
              cy.get('button.textBtn').click();
            } else {
              cy.get('button[type="submit"]').click();
            }
          });
        }

        it('send message', () => {
          cy.viewport(device);
          cy.get('textarea[name="message"]').type('Test Message');
          cy.get('button[type="submit"]').click();
        })

        it('success screen', () => {
          cy.get('button[type="submit"] .btnLoader', {timeout: 10000}).should('not.be.visible');
        });
      });
    });
  });
});
