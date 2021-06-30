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

describe('Render Seller Flow', () => {
  let token;
  let user;

  beforeAll((done) => {
    const data = {
      username: 'jestTest+testjestBuyer@brixel.io',
      password: 'test.99',
    };
    api.user.getToken(data, { rememberMe: true })
      .then((res) => {
        token = res.data.token;
        user = res.data;
        done();
      });
  });

  it('check the success save user/page', async () => {
    render(
      <App isTest />, {
        user: {
          loggedInUser: user,
        },
      }, '/100000000000000000000000/trialRequest/introScanFlow',
    );

    // PROPERTY TYPE
    console.log(token);
    const propType = screen.getAllByRole('checkbox');
    await expect(propType);
  });
});
