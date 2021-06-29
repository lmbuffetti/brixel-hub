/**
 * @jest-environment jsdom
 */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  render, fireEvent, screen,
} from '../configJest/testUtils';
import SellerFlow from '../src/Pages/PackageFlow/GetStartedSeller';

describe('Render Register Page', () => {

  const setup = (type, name, text) => {
    const utils = render(
      <SellerFlow />, {
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

    // await fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // const Area = setup(null, null, 'Net living space').input;
    // await userEvent.type(Area, 120, { allAtOnce: true });

    // await fireEvent.click(screen.getByRole('button', { name: 'Next' }));*/

    // console.log(inputEl, input);

  });
});
