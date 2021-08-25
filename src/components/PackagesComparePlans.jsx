import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helpers } from '@brixel/brixel-components';
import { PackagesComparePlansTable } from '../resources/PackagesComparePlans';

export const PackagesComparePlans = (props) => {
  const {
    packages,
  } = props;

  const tableMobile = () => {
    // CONFIGS
    const tableSelector = 'table';
    const targetBreakpoint = 768;
    let currentVisibleColumn = 1;
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
        if (currentlyVisibleColHeader) {
          // Show Currently Visible Col Header
          currentlyVisibleColHeader.style.display = 'block';

          // Show Currently Visible Cells
          currentlyVisibleCells.forEach((cell) => {
            cell.style.display = 'block';
          });
        }
        // Show Row Headers
        rowHeaders.forEach((head) => {
          head.style.display = 'block';
        });
      };

      const createButtons = () => {
        nextButton.textContent = nextButtonText;
        nextButton.style.display = 'none';

        table.parentNode.insertBefore(nextButton, table.nextSibling);
        nextButton.setAttribute('type', 'button');
        nextButton.addEventListener('click', () => {
          currentVisibleColumn = currentVisibleColumn + 1 > columnHeaders.length ? 1 : currentVisibleColumn + 1;
          showCurrentlyVisible();
        });
      };

      const updateTable = () => {
        // Get the Table's Width. Might as well go FULL Container Query over here.
        //        const tableWidth = table.getBoundingClientRect().width;

        // If the table explodes off the viewport or is wider than the target breakpoint
        // if (tableWidth > windowDimensions.width || tableWidth < targetBreakpoint) {
        if (window.innerWidth < targetBreakpoint) {
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
          allCells.forEach((cell) => {
            cell.style.display = '';
          });

          // Remove styles from all row headers
          rowHeaders.forEach((row) => {
            row.style.display = '';
          });
        }
      };
      createButtons();
      updateTable();
    }
  };

  useEffect(() => {
    if (packages.length > 0) {
      tableMobile();
      window.addEventListener('resize', () => tableMobile());
    }
  }, [packages]);

  const extractTable = (pack) => packages.filter((pkg) => pkg.type === pack);

  return (
    <div className="comparePlans">
      <table>
        <thead>
          <tr>
            <td />
            {
              extractTable('private').map((pkg, i) => (
                <th key={i.toString()}>
                  <span className="txtAltColor900">{pkg.name}</span>
                  <span className="fsize-500 dis-f a-b fweight-400">
                    <span>
                      {pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}
                    </span>
                    <span className="fsize-300 ml-1">inc VAT</span>
                  </span>
                </th>
              ))
            }
            {
              extractTable('premium').map((pkg, i) => (
                <th key={i.toString()}>
                  <span className="txtAltColor400">{pkg.name}</span>
                  <span className="fsize-500 dis-f a-b fweight-400">
                    <span>
                      {pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}
                    </span>
                    <span className="fsize-300 ml-1">inc VAT</span>
                  </span>
                </th>
              ))
            }
            {
              extractTable('one').map((pkg, i) => (
                <th key={i.toString()}>
                  <span className="txtAltColor100">{pkg.name}</span>
                  <span className="fsize-500 dis-f a-b fweight-400">
                    <span>
                      {pkg.price.currency} {Helpers.formatNumberValue(pkg.price.total, pkg.price.currency)}
                    </span>
                    <span className="fsize-300 ml-1">inc VAT</span>
                  </span>
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            PackagesComparePlansTable.map((table, i) => (
              <tr key={i.toString()}>
                <th>{table.title}</th>
                {
                  extractTable('private').map((pkg, f) => (
                    <td key={f.toString()}>
                      {
                        table.td.private && (
                          <>
                            <img className="pt-small-6" src={table.td.private.img} alt="" />
                            {table.td.private.desc && (
                              <span className="pl-1">{table.td.private.desc}</span>
                            )}
                          </>
                        )
                      }
                    </td>
                  ))
                }
                {
                  extractTable('premium').map((pkg, f) => (
                    <td key={f.toString()}>
                      {
                        table.td.premium && (
                          <>
                            <img className="pt-small-6" src={table.td.premium.img} alt="" />
                            {table.td.premium.desc && (
                              <span className="pl-1">{table.td.premium.desc}</span>
                            )}
                          </>
                        )
                      }
                    </td>
                  ))
                }
                {
                  extractTable('one').map((pkg, f) => (
                    <td key={f.toString()}>
                      {
                        table.td.one && (
                          <>
                            <img className="pt-small-6" src={table.td.one.img} alt="" />
                            {table.td.one.desc && (
                              <span className="pl-1">{table.td.one.desc}</span>
                            )}
                          </>
                        )
                      }
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

PackagesComparePlans.propTypes = {
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PackagesComparePlans;
