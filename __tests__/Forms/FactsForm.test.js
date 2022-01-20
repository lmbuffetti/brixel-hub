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
  let property;

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
        window.localStorage.setItem('brixelToken', token);
        api.property.getProperty(data)
          .then((resProp) => {
            property = resProp.data;
            done();
          });
      });
  });

  it('check notification show', async () => {
    await render(<App isTest />, {
      common: {
        test: true,
      },
      property: {
        activeSingleProperty: property,
      },
      user: {
        loggedInUser: user,
      },
    }, '/100000000000000000000000/property/facts/propertyType');

    await waitFor(async () => {
      // PROPERTY TYPE
      await expect(screen.getAllByRole('heading').length > 0);
    }, { timeout: 5000 });

    await waitFor(async () => {
      // console.log('Package');
      const Package = screen.getAllByRole('number');
      await userEvent.type(Package[1], '1', { allAtOnce: true });
    }, { timeout: 4000 });

    await waitFor(async () => {
      // console.log('Package');
      const Package = screen.getAllByRole('number');
      await userEvent.type(Package[1], '1', { allAtOnce: true });
    }, { timeout: 8000 });

    await waitFor(async () => {
      // console.log('Package');
      await fireEvent.click(screen.getByRole('button', { name: 'save' }));
    }, { timeout: 8000 });

    await waitFor(async () => {
      console.log(screen.getAllByRole('button'));
      // await fireEvent.click(screen.getByRole('button', { name: 'Price & financial' }));
    }, { timeout: 1000 });

    await waitFor(async () => {
      const Package = screen.getAllByRole('number');
      console.log(screen.getAllByRole('button'));
      // await userEvent.type(Package[1], '10000', { allAtOnce: true });
    }, { timeout: 2000 });

    await waitFor(async () => {
      console.log(screen.getAllByRole('button'));
      // await fireEvent.click(screen.getByRole('button', { name: 'save' }));
    }, { timeout: 8000 });
  });
});
