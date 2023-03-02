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

Cypress.Commands.add('loginViaApi', async (actionAfterLogin) => {
  const auth = btoa(`${userTest.seller.email}:${userTest.seller.password}`);
  const url = 'https://dev.api.brixel.io/api/v3/authentication/getToken';
  await fetch(url, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${auth}`,
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      cy.setCookie('brixelToken', data.token);
      if (actionAfterLogin.loadSingleProp) {
        const urlPAGES = 'https://dev.api.brixel.io/api/v3/market/list/ownedPages/10/0?order=updatedAt&direction=DESC';
        await fetch(urlPAGES, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-brixel-token': data.token,
          },
        })
          .then((response) => response.json())
          .then(async(pageData) => {
            cy.setCookie('userPageID', pageData.data[0].id);
            if (actionAfterLogin.loadDeal) {
              const urlDEAL = `https://dev.api.brixel.io/api/v3/page/${pageData.data[0].id}/deal/buyer`;
              await fetch(urlDEAL, {
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'x-brixel-token': data.token,
                },
              })
                .then((response) => response.json())
                .then((deal) => {
                  cy.setCookie('dealUserID', deal.id);
                })
            }
          })
      }
    });
})


Cypress.Commands.add('reduxValue', (state, field) => {
  return cy.window()
    .its('store')
    .invoke('getState')
    .its(state)
    .its(field)
})
