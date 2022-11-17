/* eslint-disable react/forbid-prop-types */
import { BrixelButtonIcon, BrixelDropdown } from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import translateTo from '../utils/translation';

const Pagination = (props) => {
  const {
    activePage,
    className,
    itemsPerPage,
    lang,
    paginate,
    showResultsPerPage,
    totalItems,
  } = props;
  const pageNumbers = [];
  
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i += 1) {
    pageNumbers.push(i);
  }
  
  const processPagination = (val, action) => {
    if (action === 'results') {
      paginate(val.value, activePage);
    } else if (action === 'page') {
      // Creating the pagination offset here, otherwise each page click
      // would get just one new result
      let paginationSkip;
      if (val > 0) {
        paginationSkip = (val * itemsPerPage) - itemsPerPage;
      } else {
        paginationSkip = 0;
      }
      
      paginate(itemsPerPage, paginationSkip);
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
    <>
      <p className={totalItems <= 10 ? 'pb-5 pb-lg-0' : ''}>
        <span>{ processResults() }</span> <span>{translateTo('of', lang)}</span> <strong className="notranslate">{totalItems}</strong> <span>{translateTo('total results', lang)}</span>
      </p>
      {
        totalItems > 10 && (
          <nav className={`pagination ${className} w-perc-100 dis-f ${totalItems > 10 ? 'jc-b pt-2 pb-6 pb-lg-0' : 'jc-fe'}`}>
            {
              totalItems > 10 && showResultsPerPage && (
                <BrixelDropdown
                  compact
                  className="pagination-dropdown"
                  bgTransparent
                  borderColor="light"
                  bodyScrollclass="content"
                  selected={translateTo(`${itemsPerPage} results`, lang)}
                  options={[{
                    label: '10',
                    value: 10,
                  },
                  {
                    label: '20',
                    value: 20,
                  },
                  {
                    label: '50',
                    value: 50,
                  }]}
                  onSelect={(e, value) => processPagination(value, 'results')}
                />
              )
            }
            
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
                            <span onClick={() => processPagination((number - 2), 'page')} className="page-link">
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
                            <span onClick={() => processPagination((number - 1), 'page')} className="page-link">
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
    </>
  );
};

Pagination.propTypes = {
  activePage: PropTypes.any.isRequired,
  className: PropTypes.string,
  itemsPerPage: PropTypes.any.isRequired,
  lang: PropTypes.string.isRequired,
  paginate: PropTypes.func.isRequired,
  showResultsPerPage: PropTypes.bool,
  totalItems: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  className: '',
  showResultsPerPage: true,
};

export default Pagination;
