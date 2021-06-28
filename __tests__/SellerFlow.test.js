/**
 * @jest-environment jsdom
 */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '../configJest/testUtils';
import userEvent from '@testing-library/user-event';
import { change } from '@brixel/brixel-components';
import SellerFlow from '../src/Pages/PackageFlow/GetStartedSeller';

describe('Render Register Page', () => {

  let store;
  // set up a fake store for all our tests
  beforeEach(() => {
    store = render(<SellerFlow />, {}, 'getStore');
  });

  const setup = (type, name, text) => {
    const utils = render(
      <SellerFlow />, {
        brixelForm: {
          GetStarted: {
            syncErrors: {
              properties: {
                propertyType: 'Required',
                building: {
                  built: 'Required',
                },
                typology: {
                  bedrooms: 'Required',
                  livingArea: {
                    value: 'Required',
                  },
                },
              },
              register: {
                email: 'Required',
                name: 'Required',
                password: 'Required',
                privacy: 'Required',
              },
            },
          },
        },
      }, '',
    );
    let input;
    if (type && name) input = screen.getAllByRole(type, name)[0];
    if (text) input = screen.getByLabelText(text);
    return {
      input,
      ...utils,
    };
  };

  it('check the show error', async () => {
    const propType = setup('radio', 'Apartment').input;
    await userEvent.click(propType);
    await fireEvent.change(propType, { target: { value: 'Apartment' } });

    const Rooms = setup(null, null, 'Number of rooms').input;
    await userEvent.type(Rooms, 2, { allAtOnce: true });

    await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    const Area = setup(null, null, 'Net living space').input;
    await userEvent.type(Area, 120, { allAtOnce: true });

    // await fireEvent.click(screen.getByRole('button', { name: 'Next' }));*/

    //console.log(inputEl, input);

  });
});
