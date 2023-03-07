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

import { userTest } from '../helpers/constants';
import Cookies from 'universal-cookie';
const cookie = new Cookies();
import ep from '../../src/controllers/endPoints.constant';

Cypress.Commands.add('loginViaApi', () => {
  const auth = btoa(`${userTest.seller.email}:${userTest.seller.password}`);
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
      cy.setCookie('brixelToken', data.body.token);
    });
})

Cypress.Commands.add('propertyListings',  () => {
  const url = `https://dev.api.brixel.io/api/v3${ep.market.ownedProperties(1, 0, '?order=updatedAt&direction=DESC')}`;
  const token = cookie.get('brixelToken');
  if (token) {
    cy.request({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-brixel-token': token,
      },
    })
      .then((pageData) => {
        cy.setCookie('userPageID', pageData.body.data[0].id);
      });
  }
});

Cypress.Commands.add('getBuyerDeal',  () => {
  const pageID = cookie.get('userPageID');
  const url = `https://dev.api.brixel.io/api/v3${ep.deal.buyerDeal(pageID)}`;
  const token = cookie.get('brixelToken');
  if (token) {
    cy.request({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-brixel-token': token,
      },
    })
      .then((pageData) => {
        console.log(pageData);
        cy.setCookie('dealPageID', pageData.body.id);
      });
  }
});

Cypress.Commands.add('deleteOffer',  () => {
  const dealID = cookie.get('dealPageID');
  const url = `https://dev.api.brixel.io/api/v3${ep.deal.deleteOffer(dealID)}`;
  const token = cookie.get('brixelToken');
  if (token) {
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
