// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

import Cookies from 'universal-cookie';
const cookie = new Cookies();
import ep from '../../src/controllers/endPoints.constant';
import compareSnapshot from 'cypress-image-diff-js/dist/command';

compareSnapshot();

const userTest = Cypress.env('userTest');

Cypress.Commands.add('loginViaApi', (type = 'seller') => {
  const auth = btoa(`${userTest.seller.email}:${userTest[type].password}`);
  const url = `https://dev.api.brixel.io/api/v3${ep.user.getToken()}`;
  cy.request({
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${auth}`,
    },
  })
    .then( (data) => {
      cy.log(`logged user as ${type}`);
      cy.setCookie('brixelToken', data.body.token);
    });
});

Cypress.Commands.add('deleteOffer',  (dealID) => {
  const url = `https://dev.api.brixel.io/api/v3${ep.deal.deleteOffer(dealID)}`;
  const token = cookie.get('brixelToken');
  if (token && dealID) {
    cy.request({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-brixel-token': token,
      },
    })
      .then((res) => {
        console.log(res);
      })
  }
});

Cypress.Commands.add('reduxValue', (state: string, field: string) => {
  return cy.window()
    .its('store')
    .invoke('getState')
    .its(state)
    .its(field)
})
