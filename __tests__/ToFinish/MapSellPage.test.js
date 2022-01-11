/**
 * @jest-environment jsdom
 */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
/* eslint-disable no-loop-func */

import React from 'react';
import get from 'lodash/get';
import {
  render, screen, waitFor,
} from '../../configJest/testUtils';
import App from '../../src/App';
import api from '../../src/controllers/api/config';
import { fakeLocalStorage } from '../../src/utils/helpers.test';

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
        token = get(res, 'data.token', null);
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
      await render(<App isTest />, {
        common: {
          test: true,
        },
        user: {
          loggedInUser: user,
        },
      }, `/sell/${categoryMap[i]}`);

      await waitFor(async () => {
        await expect(screen.getAllByRole('heading').length > 0);
      }, { timeout: 2000 });
    });
  }
});
