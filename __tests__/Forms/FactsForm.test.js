/**
 * @jest-environment jsdom
 */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React from 'react';
import userEvent from '@testing-library/user-event';
import get from 'lodash/get';
import {
  render, fireEvent, screen, waitFor,
} from '../../configJest/testUtils';
import App from '../../src/App';
import api from '../../src/controllers/api/config';
import { fakeLocalStorage } from '../../src/utils/helpers.test';

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
        token = get(res, 'data.token', null);
        user = res.data;
        done();
        window.localStorage.setItem('brixelToken', token);
      });
  });

  it('check notification show', async () => {
    await render(
      <App isTest />, {
        common: {
          test: true,
        },
        user: {
          loggedInUser: user,
        },
      }, '/100000000000000000000000/property/facts/propertyType',
    );

    await waitFor(async () => {
      // PROPERTY TYPE
      await expect(screen.getAllByRole('heading').length > 0);
    }, { timeout: 2000 });

    await waitFor(async () => {
      // console.log('Package');
      const Package = screen.getAllByRole('number');
      console.log(Package[1]);
      await userEvent.type(Package[1], 140, { allAtOnce: true });
    }, { timeout: 5000 });

    await waitFor(async () => {
      // console.log('Notification');
      await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    }, { timeout: 6000 });
  });
});
