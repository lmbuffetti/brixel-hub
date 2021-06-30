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
import BuyerFlow from '../src/Pages/PackageFlow/GetStartedBuyer';

describe('Render Seller Flow', () => {
  render(
    <BuyerFlow isTest />, {
      companies: {
        activeSingleCompany: {
          country: {
            code: 'PT',
          },
          stub: 'brixel_portugal',
        },
      },
      brixelForm: {
        GetStarted: {
          values: {
            test: true,
            locations: [{
              address: 'Lisboa,  Portugal,  Portugal',
              city: 'Lisboa',
              cityZip: '1250-096 Lisboa',
              country: 'Portugal',
              countryCode: 'PT',
              geometry: {},
              latitude: 38.7205373,
              longitude: -9.1459023,
              name: 'Avenida da Liberdade',
              searchAddress: 'Lisboa,  Portugal,  Portugal',
              state: 'Lisboa',
              stateCode: 'Lisboa',
              vicinity: null,
              zip: null,
            }],
          },
        },
      },
    }, '',
  );

  it('check the success save user/page', async () => {
    // PROPERTY TYPE
    console.log('propertyType');
    const propType = screen.getAllByRole('checkbox');
    await userEvent.click(propType[0]);
    await userEvent.click(propType[1]);
    await userEvent.click(propType[2]);
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // BEDROOMS
    console.log('bedrooms');
    expect(screen.getByText('Number of rooms'));
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Extra Feature
    console.log('living area');
    const Extra = screen.getAllByRole('checkbox')[0];
    await userEvent.click(Extra);
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // SKIP LOCATION
    console.log('location');
    const location = screen.getByText('You can add multiple addresses.');
    await expect(location);
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // PRICE
    console.log('Price');
    const Price = screen.getAllByRole('text');
    await userEvent.type(Price[0], '200000');
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // CURRENT SITUATION
    console.log('Current Situation');
    const Situation = screen.getAllByRole('radio');
    await userEvent.click(Situation[0]);

    // SIGN UP
    console.log('signup');
    const Text = screen.getAllByRole('text');
    await userEvent.type(Text[0], 'Jest Test');
    const Email = screen.getAllByRole('email');
    await userEvent.type(Email[0], 'jestTest+testjestBuyer@brixel.io',);
    const Password = screen.getAllByRole('password');
    await userEvent.type(Password[0], 'test.99', { allAtOnce: true });
    const Privacy = screen.getAllByRole('checkbox')[0];
    await userEvent.click(Privacy);

    // screen.getByRole('button', { name: 'Sign up' });
    console.log('save');
    await fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(async () => {
      await expect(screen.getByText(/Registration complete/i));
    }, { timeout: 10000 });
  });
});
