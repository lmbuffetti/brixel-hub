/**
 * @jest-environment jsdom
 */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  render, fireEvent, screen, waitFor
} from '../../configJest/testUtils';
import SellerFlow from '../../src/Pages/PackageFlow/GetStartedSeller';

describe('Render Seller Flow', () => {
  render(<SellerFlow isTest />, {
    brixelForm: {
      companies: {
        activeSingleCompany: {
          country: {
            code: 'PT',
          },
          stub: 'brixel_portugal',
        },
      },
      GetStarted: {
        values: {
          id: '100000000000000000000000',
          company: {
            stub: 'brixel_portugal'
          },
          pageID: '100000000000000000000000',
          test: true,
          location: {
            address: 'Av. da Liberdade, 1250-096 Lisboa, Portugal',
            city: 'Lisboa',
            cityZip: '1250-096 Lisboa',
            country: 'Portugal',
            countryCode: 'PT',
            geometry: {},
            latitude: 38.7205373,
            longitude: -9.1459023,
            name: 'Avenida da Liberdade',
            searchAddress: 'Av. da Liberdade, 1250-096 Lisboa, Portugal',
            state: 'Lisboa',
            stateCode: 'Lisboa',
            vicinity: null,
            zip: '1250-096',
          },
        },
      },
    },
  }, '');

  it('check the success save user/page', async () => {
    // PROPERTY TYPE
    console.log('propertyType');
    const propType = screen.getAllByRole('radio')[0];
    await userEvent.click(propType);
    console.log(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => fireEvent.click(screen.getByRole('button', { name: 'Next' })), { timeout: 5000 });

    // BEDROOMS
    console.log('bedrooms');
    await waitFor(() => screen.getByLabelText('Number of rooms'), { timeout: 5000 });
    const Rooms = screen.getByLabelText('Number of rooms');
    await userEvent.type(Rooms, '2');
    await fireEvent.click(screen.getAllByRole('button', { name: 'Next' })[0]);

    // LIVING AREA
    console.log('living area');
    const Area = screen.getByRole('number');
    await userEvent.type(Area, '120');
    await fireEvent.click(screen.getAllByRole('button', { name: 'Next' })[0]);

    // YEAR CONSTRUCTION
    console.log('year construction');
    const Year = screen.getByLabelText('Construction year');
    await userEvent.type(Year, '2000');
    await fireEvent.click(screen.getAllByRole('button', { name: 'Next' })[0]);

    // SKIP LOCATION
    console.log('location');
    await fireEvent.click(screen.getAllByRole('button', { name: 'Next' })[0]);
    await fireEvent.click(screen.getAllByRole('button', { name: 'Save' })[0]);

    // SIGN UP
    console.log('signup');
    const Name = screen.getByLabelText('Full Name');
    await userEvent.type(Name, 'Jest Test', { allAtOnce: true });
    const Email = screen.getByLabelText('Email address');
    await userEvent.type(Email, 'jestTest+testjestSeller@brixel.io', { allAtOnce: true });
    const Password = screen.getByLabelText('Password');
    await userEvent.type(Password, 'test.99', { allAtOnce: true });
    const Privacy = screen.getAllByRole('checkbox')[0];
    await userEvent.click(Privacy);

    // screen.getByRole('button', { name: 'Sign up' });
    console.log('save');
    await fireEvent.click(screen.getAllByRole('button', { name: 'Sign up' })[0]);

    await waitFor(async () => {
      await expect(screen.getByText(/Registration complete/i));
    }, { timeout: 10000 });
  });
});
