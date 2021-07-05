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

  it('check via phone', async () => {
    await render(
      <App isTest />, {
        common: {
          test: true,
        },
        user: {
          loggedInUser: user,
        },
      }, '/100000000000000000000000/trialRequest/introScanFlow',
    );

    await waitFor(async () => {
      // PROPERTY TYPE
      await fireEvent.click(screen.getByRole('button', { name: 'Book your test drive' }));
      const propType = screen.getAllByRole('radio');
      await userEvent.click(propType[0]);
    }, { timeout: 2000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Book via phone' }));
    }, { timeout: 2000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    }, { timeout: 3000 });
  });

  it('check online', async () => {
    await render(
      <App isTest />, {
        common: {
          test: true,
        },
        user: {
          loggedInUser: user,
        },
      }, '/100000000000000000000000/trialRequest/introScanFlow',
    );

    await waitFor(async () => {
      // PROPERTY TYPE
      await fireEvent.click(screen.getByRole('button', { name: 'Book your test drive' }));
      const propType = screen.getAllByRole('radio');
      await userEvent.click(propType[0]);
    }, { timeout: 2000 });

    await waitFor(async () => {
      const InputText = screen.getAllByRole('text');
      await userEvent.type(InputText[0], '03-07-2021');
      await userEvent.type(InputText[1], '910234567');
      await expect(InputText);
      let Calendar = screen.getAllByText('30');
      Calendar = Calendar[Calendar.length - 1];
      await fireEvent.click(Calendar);
      const Select = screen.getAllByRole('select');
      userEvent.selectOptions(Select[0], ['08:00']);
      // await fireEvent.click(screen.getByRole('button', { name: 'Book via phone' }));
    }, { timeout: 4000 });

    await waitFor(async () => {
      await fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    }, { timeout: 6000 });
  });
});
