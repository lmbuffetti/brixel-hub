import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';

export const PackagesComparePlans = (props) => {
  const {
    windowDimensions,
  } = props;

  const tableMobile = () => {
    // CONFIGS
    const tableSelector = 'table';
    const targetBreakpoint = 768;
    let currentVisibleColumn = 2;
    const nextButtonText = 'Compare Next';

    // SETUP/SELECT REUSABLE ELEMENTS
    const table = document.querySelector(tableSelector);

    if (table) {
      const allCells = table.querySelectorAll('th, td');
      const columnHeaders = table.querySelectorAll('thead th:not(:empty)');
      const rowHeaders = table.querySelectorAll('tbody th');
      const nextButton = document.createElement('button');

      const showCurrentlyVisible = () => {
        // Get the Items we're going to show. The :not(:empty) query here is because sometimes you have empty <th>s in <thead>
        const currentlyVisibleColHeader = document.querySelector(`thead th:not(:empty):nth-of-type( ${currentVisibleColumn})`);
        const currentlyVisibleCells = document.querySelectorAll(`tbody td:nth-of-type(${currentVisibleColumn})`);

        // Hide All The Cells
        allCells.forEach((cell) => {
          cell.style.display = 'none';
        });

        // Show Currently Visible Col Header
        currentlyVisibleColHeader.style.display = 'block';

        // Show Currently Visible Cells
        currentlyVisibleCells.forEach((cell) => {
          cell.style.display = 'block';
        });

        // Show Row Headers
        rowHeaders.forEach((head) => {
          head.style.display = 'block';
        });
      };

      const createButtons = () => {
        nextButton.textContent = nextButtonText;
        nextButton.style.display = 'none';

        table.parentNode.insertBefore(nextButton, table.nextSibling);

        nextButton.addEventListener('click', () => {
          currentVisibleColumn = currentVisibleColumn + 1 > columnHeaders.length ? 1 : currentVisibleColumn + 1;
          showCurrentlyVisible();
        });
      };

      const updateTable = () => {
        // Get the Table's Width. Might as well go FULL Container Query over here.
        const tableWidth = table.getBoundingClientRect().width;

        // If the table explodes off the viewport or is wider than the target breakpoint
        // if (tableWidth > windowDimensions.width || tableWidth < targetBreakpoint) {
        if (windowDimensions.width < targetBreakpoint) {
          if (table.getAttribute('data-comparing') !== 'active') {
            // Set the comparison state to "Active"
            table.setAttribute('data-comparing', 'active');

            // Show Next Button
            nextButton.style.display = 'block';

            // Show the currently visible column
            showCurrentlyVisible();
          }
        } else if (table.getAttribute('data-comparing') === 'active') {
          // Turn off comparing
          table.setAttribute('data-comparing', '');

          // Hide the next button
          nextButton.style.display = 'none';
          // Remove styles from all cells, ergo, show all the cells
          for (var i = 0; i < allCells.length; i++) {
            allCells[i].style.display = '';
          }

          // Remove styles from all row headers
          for (var i = 0; i < rowHeaders.length; i++) {
            rowHeaders[i].style.display = '';
          }
        }
      };
      createButtons();
      updateTable();
    }
  };
  useEffect(() => {
    tableMobile();
    // window.addEventListener('resize', tableMobile);
  }, []);

  return (
    <div className="comparePlans">
      <table>
        <thead>
          <tr>
            <td />
            <th>Private <span>CHF 950 inc VAT</span></th>
            <th>Premium <span>CHF 3&apos;900 inc VAT</span></th>
            <th>One <span>CHF 9&apos;900 inc VAT</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Brixel Hub</th>
            <td>✔</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <th>Pre-market</th>
            <td>❌</td>
            <td>✔</td>
            <td>✔</td>
          </tr>
          <tr>
            <th>Brixel Page</th>
            <td>❌</td>
            <td>❌</td>
            <td>✔</td>
          </tr>
          <tr>
            <th>Listings</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Support</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Full estimation</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Property scan</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>3D tour</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>PDF factsheet</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Prospects management</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Negotiating support</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Contract handling</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
          <tr>
            <th>Support up to the notary</th>
            <td>❌</td>
            <td>❌</td>
            <td>❌</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

PackagesComparePlans.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default connect(mapStateToProps, null)(PackagesComparePlans);
