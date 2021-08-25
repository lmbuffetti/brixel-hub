/* eslint-disable max-len */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Helpers,
} from '@brixel/brixel-components';
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
        nextButton.style.display = 'none';
        nextButton.setAttribute('class', 'secondaryBtn  brdDark400 txtDark400 icnDark400 transHoverRed400 bgWhite rounded withIcon iconOnRight ');

        nextButton.innerHTML = `
            <span class="null btnLabel">Compare Next</span><span class="brixelIcon  normal rightIcon  brdRadius  "><i class="icon-arrow-right  "><svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="arrow-right" fill="#32373C"><path d="M12,2 C12.4023265,2 12.7284765,2.33164093 12.7284765,2.74074074 L12.7284765,2.74074074 L12.728,19.575 L20.7792697,12.0712438 C21.0488848,11.8199358 21.4542304,11.8139265 21.7299552,12.0414845 L21.8085187,12.1167472 C22.0803806,12.4183168 22.0603453,12.8868852 21.7637687,13.1633241 L21.7637687,13.1633241 L12.4922495,21.8052994 C12.4865527,21.8106094 12.4807935,21.8158108 12.4749746,21.8209036 C12.4583887,21.8354351 12.4410223,21.849305 12.4230475,21.8623648 C12.4109592,21.871153 12.3986046,21.8795594 12.3860648,21.8875409 C12.3690439,21.8983812 12.3514334,21.9085889 12.3333838,21.9180522 C12.3218533,21.9240652 12.3104071,21.9296703 12.2988542,21.9349536 C12.276679,21.9451601 12.2537325,21.9542893 12.2302549,21.9622365 C12.2210786,21.9652494 12.2123103,21.9680205 12.2035036,21.9706192 C12.1795292,21.9778035 12.1546256,21.9837555 12.1292671,21.9883732 C12.1200805,21.989968 12.111363,21.991388 12.1026276,21.9926466 C12.0693033,21.9974989 12.0349389,22 12,22 C11.9650611,22 11.9306967,21.9974989 11.8970705,21.9926632 C11.8886558,21.9913911 11.8799289,21.9899697 11.8712247,21.9883864 C11.8453744,21.9837555 11.8204708,21.9778035 11.7960951,21.9705912 C11.7876897,21.9680205 11.7789214,21.9652494 11.7701966,21.962306 C11.7462675,21.9542893 11.723321,21.9451601 11.7009738,21.9349182 C11.6895929,21.9296703 11.6781467,21.9240652 11.6668203,21.9181381 C11.6485666,21.9085889 11.6309561,21.8983812 11.6138238,21.887469 C11.5767384,21.8638653 11.5411719,21.8364515 11.5077505,21.8052994 L11.5769525,21.8623648 C11.5589777,21.849305 11.5416113,21.8354351 11.5249049,21.8208074 L11.5077505,21.8052994 L2.23623128,13.1633241 C1.93965466,12.8868852 1.91961942,12.4183168 2.19148133,12.1167472 C2.46334323,11.8151776 2.9241537,11.794805 3.22073032,12.0712438 L3.22073032,12.0712438 L11.271,19.575 L11.2715235,2.74074074 C11.2715235,2.36573258 11.5455801,2.0558114 11.9011501,2.00676209 Z" id="🎨-icon-color" transform="translate(12.000000, 12.000000) rotate(-90.000000) translate(-12.000000, -12.000000) "></path></g></g></svg></i></span>
          `;

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
