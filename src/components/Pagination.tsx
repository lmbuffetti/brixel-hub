import React, {Fragment} from 'react';
import {BrixelButtonIcon} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import type {PaginationType} from '../@types/components/Pagination';

const Pagination = (props: PaginationType) => {
  const {
    activePage,
    className = '',
    itemsPerPage,
    lang,
    paginate,
    totalItems,
  } = props;
  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i += 1) {
    pageNumbers.push(i);
  }

  const processPagination = (val, action) => {
    if (action === 'results') {
      paginate(val.value, activePage, (activePage / itemsPerPage) + 1);
    } else if (action === 'page') {
      // Creating the pagination offset here, otherwise each page click
      // would get just one new result
      let paginationSkip;
      if (val > 0) {
        paginationSkip = (val * itemsPerPage) - itemsPerPage;
      } else {
        paginationSkip = 0;
      }
      paginate(itemsPerPage, paginationSkip, (paginationSkip / itemsPerPage) + 1);
    }
    const scrollEl = document.getElementsByClassName('content')[0];
    scrollEl.scroll({
      behavior: 'smooth',
      left: 0,
      top: 0,
    });
  };

  const processResults = () => {
    if (totalItems > 10) {
      if (activePage === '0') {
        if (itemsPerPage > totalItems) return `1 - ${totalItems}`;
        return `1 - ${itemsPerPage}`;
      }
      const itemsNum = itemsPerPage > totalItems ? totalItems : itemsPerPage;
      return `${((pageNumbers[(activePage / itemsNum)] - 1) * itemsNum) + 1} - ${pageNumbers[(activePage / itemsNum)] * itemsNum}`;
    }
    return totalItems;
  };

  return (
    <div className={`dis-f a-c jc-b w-perc-100 pb-5 ${className}`}>
      <p className="w-perc-50">
        <span>{processResults()}</span>
        <span className="mx-small-4">{translateTo('of', lang)}</span>
        <strong className="notranslate">{totalItems}</strong>
        <span className="ml-small-4">{translateTo('total results', lang)}</span>
      </p>
      {
        totalItems > 10 && (
          <nav className="pagination w-perc-50 dis-f jc-fe">
            <ul className="page-number dis-f a-c">
              {
                activePage !== 0 && (
                  <span onClick={() => processPagination(pageNumbers[(activePage / itemsPerPage)] - 1, 'page')} className="first-link mr-1">
                    <BrixelButtonIcon
                      ghost
                      small
                      theme="dark"
                      icon="arrow-simple-left"
                    />
                  </span>
                )
              }
              {
                pageNumbers.map((number) => (
                  (number === pageNumbers[(activePage / itemsPerPage)]) && (
                    <Fragment key={number.toString()}>
                      {
                        (number - 2) >= 1 && (
                          <li
                            key={(number - 2)}
                            className={pageNumbers[(activePage / itemsPerPage)] === (number - 2) ? 'page-item mr-1 active' : 'page-item mr-1'}
                          >
                            <span onClick={() => processPagination((number - 2), 'page')} className="page-link ff-mono">
                              {(number - 2)}
                            </span>
                          </li>
                        )
                      }
                      {
                        (number - 1) >= 1 && (
                          <li
                            key={(number - 1)}
                            className={pageNumbers[(activePage / itemsPerPage)] === (number - 1) ? 'page-item mr-1 active' : 'page-item mr-1'}
                          >
                            <span onClick={() => processPagination((number - 1), 'page')} className="page-link ff-mono">
                              {(number - 1)}
                            </span>
                          </li>
                        )
                      }
                      <li
                        key={number}
                        className={pageNumbers[(activePage / itemsPerPage)] === number ? 'page-item mr-1 active' : 'page-item mr-1'}
                      >
                        <span onClick={() => processPagination(number, 'page')} className="page-link">
                          {number}
                        </span>
                      </li>
                      {
                        (number + 1) <= pageNumbers.length && (
                          <li
                            key={(number + 1)}
                            className={pageNumbers[(activePage / itemsPerPage)] === (number + 1) ? 'page-item mr-1 active' : 'page-item mr-1'}
                          >
                            <span onClick={() => processPagination((number + 1), 'page')} className="page-link">
                              {(number + 1)}
                            </span>
                          </li>
                        )
                      }
                      {
                        (number + 2) <= pageNumbers.length && (
                          <li
                            key={(number + 2)}
                            className={pageNumbers[(activePage / itemsPerPage)] === (number + 2) ? 'page-item mr-1 active' : 'page-item mr-1'}
                          >
                            <span onClick={() => processPagination((number + 2), 'page')} className="page-link">
                              {(number + 2)}
                            </span>
                          </li>
                        )
                      }
                    </Fragment>
                  )
                ))
              }
              {
                activePage !== ((pageNumbers.length - 1) * itemsPerPage) && (
                  <span onClick={() => processPagination(pageNumbers[(activePage / itemsPerPage)] + 1, 'page')} className="last-link">
                    <BrixelButtonIcon
                      small
                      ghost
                      theme="dark"
                      icon="arrow-simple-right"
                      bgTransparent
                    />
                  </span>
                )
              }
            </ul>
          </nav>
        )
      }
    </div>
  );
};

export default Pagination;
