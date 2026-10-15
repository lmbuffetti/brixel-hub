/* eslint-disable max-len */
import React, { useEffect } from 'react';
import get from 'lodash/get';
import { BrixelIcon, Helpers } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import { PackagesComparePlansTable } from '../resources/Dashboard/PackagesComparePlans';
export const PackagesComparePlans = (props) => {
    const { lang, packages, } = props;
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
                        cell.style.display = 'flex';
                        cell.style.alignItems = 'flex-start';
                    });
                }
                // Show Row Headers
                rowHeaders.forEach((head) => {
                    head.style.display = 'block';
                });
            };
            const createButtons = () => {
                nextButton.style.display = 'none';
                nextButton.setAttribute('class', 'hide-md iconBtn txtText200  icnText200  brdText200 brdSmall txtText400 icnText400 brdText400 secondary small  secondary dis-f pos-a-fix x-r-2 mt-2 compare-btn-mobile');
                nextButton.innerHTML = `
            <span class="brixelIcon normal leftIcon  brdRadius  "><i class="icon-arrow-simple-right  "><svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icons/arrow-simple-right" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M6.30073008,21.3108287 C5.92317843,21.6737117 5.89767292,22.2888045 6.24376194,22.6846769 C6.58985095,23.0805494 7.17647762,23.1072925 7.55402928,22.7444095 L17.4954809,13.1892027 C17.8149636,12.8825699 18,12.4536403 18,12 C18,11.5463597 17.8149636,11.1174301 17.4949958,10.8103314 L7.55402928,1.25559052 C7.17647762,0.892707483 6.58985095,0.919450649 6.24376194,1.31532305 C5.89767292,1.71119545 5.92317843,2.32628827 6.30073008,2.6891713 L15.9879254,12 L6.30073008,21.3108287 Z" id="🎨-icon-color" fill="#32373C" transform="translate(12.000000, 12.000000) rotate(-360.000000) translate(-12.000000, -12.000000) "></path></g></svg></i></span>
          `;
                if (table && table.parentNode) {
                    table.parentNode.insertBefore(nextButton, table);
                }
                nextButton.setAttribute('type', 'button');
                nextButton.addEventListener('click', () => {
                    currentVisibleColumn = currentVisibleColumn + 1 > columnHeaders.length ? 1 : currentVisibleColumn + 1;
                    showCurrentlyVisible();
                });
            };
            const updateTable = () => {
                // Get the Table's Width. Might as well go FULL Container Query over here.
                const tableWidth = table.getBoundingClientRect().width;
                // If the table explodes off the viewport or is wider than the target breakpoint
                if (tableWidth > window.innerWidth || tableWidth < targetBreakpoint) {
                    // if (window.innerWidth < targetBreakpoint) {
                    if (table.getAttribute('data-comparing') !== 'active') {
                        // Set the comparison state to "Active"
                        table.setAttribute('data-comparing', 'active');
                        // Show Next Button
                        nextButton.style.display = 'flex';
                        // Show the currently visible column
                        showCurrentlyVisible();
                    }
                }
                else if (table.getAttribute('data-comparing') === 'active') {
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
    return (React.createElement("div", { className: "comparePlans pos-r" },
        React.createElement("table", null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("td", null),
                    extractTable('basic').map((pkg, i) => (React.createElement("th", { key: `xtrTbl_${i.toString()}` },
                        React.createElement("span", { className: "txGreen400" }, translateTo(pkg.name || '', lang)),
                        get(pkg, 'price.total', 0) > 0 ? (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" },
                            React.createElement("span", null,
                                pkg?.price?.currency,
                                " ",
                                Helpers.formatNumberValue(pkg?.price?.total || 0, pkg?.price?.currency || '')),
                            React.createElement("span", { className: "fsize-300 ml-1" }, translateTo('incl. VAT', lang)))) : (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" }, translateTo('Free', lang)))))),
                    extractTable('private').map((pkg, i) => (React.createElement("th", { key: `tblPrv_${i.toString()}` },
                        React.createElement("span", { className: "txtBlue400" }, pkg.name),
                        get(pkg, 'price.total', 0) > 0 ? (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" },
                            React.createElement("span", null,
                                get(pkg, 'price.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))),
                            React.createElement("span", { className: "fsize-300 ml-1" }, translateTo('incl. VAT', lang)))) : (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" }, translateTo('Free', lang)))))),
                    extractTable('premium').map((pkg, i) => (React.createElement("th", { key: `tblPrm_${i.toString()}` },
                        React.createElement("span", { className: "txtRed400" }, pkg.name),
                        get(pkg, 'price.total', 0) > 0 ? (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" },
                            React.createElement("span", null,
                                get(pkg, 'price.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))),
                            React.createElement("span", { className: "fsize-300 ml-1" }, translateTo('incl. VAT', lang)))) : (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" }, translateTo('Free', lang)))))),
                    extractTable('one').map((pkg, i) => (React.createElement("th", { key: `one_${i.toString()}` },
                        React.createElement("span", { className: "txtText900" }, pkg.name),
                        get(pkg, 'price.total', 0) > 0 ? (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" },
                            React.createElement("span", null,
                                get(pkg, 'price.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))),
                            React.createElement("span", { className: "fsize-300 ml-1" }, translateTo('incl. VAT', lang)))) : (React.createElement("span", { className: "fsize-500 dis-f a-b fweight-400" }, translateTo('Free', lang)))))))),
            React.createElement("tbody", null, PackagesComparePlansTable.map((table, i) => (React.createElement("tr", { key: `tbl_${i.toString()}` },
                React.createElement("th", null, translateTo(table.title, lang)),
                extractTable('basic').map((_pkg, f) => (React.createElement("td", { key: `bsc_${f.toString()}` }, table.td.basic && (React.createElement("div", { className: 'dis-f' },
                    React.createElement(BrixelIcon, { icon: 'check', color: table.td.basic.color }),
                    table.td.basic.desc && (React.createElement("span", { className: "pl-1" }, translateTo(table.td.basic.desc, lang)))))))),
                extractTable('private').map((_pkg, f) => (React.createElement("td", { key: `prv_${f.toString()}` }, table.td.private && (React.createElement("div", { className: 'dis-f' },
                    React.createElement(BrixelIcon, { icon: 'check', color: table.td.private.color }),
                    table.td.private.desc && (React.createElement("span", { className: "pl-1" }, translateTo(table.td.private.desc, lang)))))))),
                extractTable('premium').map((_pkg, f) => (React.createElement("td", { key: `prm_${f.toString()}` }, table.td.premium && (React.createElement("div", { className: 'dis-f' },
                    React.createElement(BrixelIcon, { icon: 'check', color: table.td.premium.color }),
                    table.td.premium.desc && (React.createElement("span", { className: "pl-1" }, translateTo(table.td.premium.desc, lang)))))))),
                extractTable('one').map((_pkg, f) => (React.createElement("td", { key: `one_${f.toString()}` }, table.td.one && (React.createElement("div", { className: 'dis-f' },
                    React.createElement(BrixelIcon, { icon: 'check', color: table.td.one.color }),
                    table.td.one.desc && (React.createElement("span", { className: "pl-1" }, translateTo(table.td.one.desc, lang)))))))))))))));
};
export default PackagesComparePlans;
