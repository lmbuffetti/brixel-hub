/**
 * @jest-environment jsdom
 */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  render, fireEvent, screen, waitFor,
} from '../configJest/testUtils';
import App from '../src/App';
import api from '../src/controllers/api/config';

const fakeLocalStorage = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    }
  };
})();

describe('Render Map Sell', () => {
  let token;
  let user;

  beforeAll((done) => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
    const data = {
      username: 'jestTest+testjestSeller@brixel.io',
      password: 'test.99',
    };
    api.user.getToken(data, { rememberMe: true })
      .then((res) => {
        token = res.data.token;
        user = res.data;
        done();
        window.localStorage.setItem('brixelToken', token);
      });
  });

  const categoryMap = [
    'own',
    'wishlist',
    'favorite',
    'new',
    'premium',
    'preMarket',
    'allMap',
  ];

  for (let i = 0; i < categoryMap.length; i += 1) {
    it(`test page ${categoryMap[i]}`, async () => {
      await render(
        <App isTest />, {
          common: {
            test: true,
          },
          user: {
            loggedInUser: user,
          },
        }, `/sell/${categoryMap[i]}`,
      );

      await waitFor(async () => {
        await expect(screen.getAllByRole('heading').length > 0);

      }, { timeout: 2000 });
    });
  }
});
