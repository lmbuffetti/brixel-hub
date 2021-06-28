/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
// Import your own reducer
import { configureStorePreload } from '../src/store/index';

function render(
  ui,
  initialState = {},
  path = '',
) {
  // eslint-disable-next-line react/prop-types
  const store = configureStorePreload(initialState);
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
      </Provider>
    );
  }
  if (path === 'getStore') return store;
  return rtlRender(ui, { wrapper: Wrapper });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
