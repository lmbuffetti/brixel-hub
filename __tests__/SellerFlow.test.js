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
import SellerFlow from '../src/Pages/PackageFlow/GetStartedSeller';

describe('Render Register Page', () => {
  render(
    <SellerFlow />, {
      brixelForm: {
        GetStarted: {
          values: {
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
    }, '',
  );

  it('check the show error', async () => {
    // PROPERTY TYPE
    const propType = screen.getAllByRole('radio', { name: 'Apartment' })[0];
    await userEvent.click(propType);

    // BEDROOMS
    const Rooms = screen.getByLabelText('Number of rooms');
    await userEvent.type(Rooms, 2, { allAtOnce: true });
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // LIVING AREA
    const Area = screen.getByLabelText('Net living space');
    await userEvent.type(Area, 120, { allAtOnce: true });
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // YEAR CONSTRUCTION
    const Year = screen.getByLabelText('Construction year');
    await userEvent.type(Year, 2000, { allAtOnce: true });
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // SKIP LOCATION
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // RESUME CARD
    await fireEvent.click(screen.getAllByRole('button', { name: 'Continue' })[0]);

    // SIGN UP
    const Name = screen.getByLabelText('Full Name');
    await userEvent.type(Name, 'Jest Test', { allAtOnce: true });
    const Email = screen.getByLabelText('Email address');
    await userEvent.type(Email, 'user+testjestSeller@brixel.io', { allAtOnce: true });
    const Password = screen.getByLabelText('Password');
    await userEvent.type(Password, 'test.99', { allAtOnce: true });
    const Privacy = screen.getAllByRole('checkbox')[0];
    await userEvent.click(Privacy);

    // screen.getByRole('button', { name: 'Sign up' });
    await fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(async () => {
      await expect(screen.getByText(/Registration complete/i));
    }, { timeout: 20000 });
  });
});
