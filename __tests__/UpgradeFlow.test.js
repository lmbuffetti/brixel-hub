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

describe('Render Seller Flow', () => {
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

  it('check via phone', async () => {
    await render(
      <App isTest />, {
        common: {
          test: true,
        },
        user: {
          loggedInUser: user,
        },
      }, '/100000000000000000000000/upgrade',
    );

    await waitFor(async () => {
      // PROPERTY TYPE
      const Package = screen.getByRole('checkbox');
      await userEvent.click(Package[0]);
    }, { timeout: 2000 });
    /*
    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Book via phone' }));
    }, { timeout: 2000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    }, { timeout: 3000 });
     */
  });
});
