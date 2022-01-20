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

describe('Render Upgrade Flow', () => {
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

  it('check steps', async () => {
    await render(<App isTest />, {
      common: {
        test: true,
      },
      user: {
        loggedInUser: user,
      },
    }, '/100000000000000000000000/upgrade');

    await waitFor(async () => {
      // PROPERTY TYPE
      await expect(screen.getAllByRole('heading').length > 0);
    }, { timeout: 2000 });

    await waitFor(async () => {
      console.log('Package');
      const Package = screen.getAllByRole('checkbox');
      await userEvent.click(Package[0]);
      await userEvent.click(Package[1]);
    }, { timeout: 3000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Order now' }));
      console.log('Want Start');
      const Start = screen.getAllByRole('radio');
      await userEvent.click(Start[0]);
    }, { timeout: 4000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      console.log('Current Situation');
      const Situation = screen.getAllByRole('radio');
      await userEvent.click(Situation[0]);
      await userEvent.click(Situation[1]);
      await userEvent.click(Situation[2]);
    }, { timeout: 1000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      console.log('Contact Checkbox');
      const Contact = screen.getAllByRole('checkbox');
      await userEvent.click(Contact[0]);
      await userEvent.click(Contact[5]);

      console.log('Contact Detail');
      const Phone = screen.getAllByRole('text');
      await userEvent.type(Phone[0], '910123456', { allAtOnce: true });
    }, { timeout: 1000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    }, { timeout: 1000 });

    await waitFor(async () => {
      await expect(screen.getByRole('button', { name: 'Back to Hub' }));
    }, { timeout: 1000 });
  });
});
