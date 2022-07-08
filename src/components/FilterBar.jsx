/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  connect,
} from 'react-redux';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import {
  compose,
} from 'redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  BrixelIcon, BrixelButtonText,
  FactsOptions, useOutsideAlerter, translateTo,
} from '@brixel/brixel-components';

const {
  factsOptions,
} = FactsOptions;

const FilterBar = (props) => {
  const {
    activeCompany,
    activeSortDirection,
    activeSortOrderType,
    applyFilter,
    className,
    dealsFilter,
    filterDeals,
    filterModalData,
    lang,
  } = props;

  const [filterMenu, setFilterMenu] = useState(false);
  const [activeData, setActiveData] = useState(queryString.parse(filterModalData));

  const propertyFilterRef = useRef(null);

  // filter by progress and status
  const processFilter = (text, type, direction, company, filterModal = activeData) => {
    let filterData = filterModal || '';
    if (filterModal && !dealsFilter) {
      filterData = '';
      Object.keys(filterModal).forEach((key, i) => {
        if (key !== '' && key !== null && key) {
          if (i > 0) {
            filterData += `&${key}=${filterModal[key].toString()}`;
          } else {
            filterData += `${key}=${filterModal[key].toString()}`;
          }
        }
      });
    }
    if (filterModal && dealsFilter) {
      if (filterData.status === 'all') applyFilter(text, type, direction, company, '');
      else applyFilter(text, type, direction, company, filterData.status);
    }
    applyFilter(text, type, direction, company, filterData);
  };

  useEffect(() => {
    if (dealsFilter === true) {
      const status = get(filterDeals, 'status', 'all');
      const index = findIndex(factsOptions.dealsStatusHub, (el) => el.value === status);
      setActiveData({
        label: get(factsOptions, `dealsStatusHub[${index}].label`, ''),
        status: get(factsOptions, `dealsStatusHub[${index}].value`, ''),
      });
    }
  }, [dealsFilter]);

  const getLabel = () => {
    const status = get(filterDeals, 'status', 'all');
    const index = findIndex(factsOptions.dealsStatusHub, (el) => el.value === status);
    // setActiveData({
    //   label: factsOptions.dealsStatusHub[index].label,
    //   status: factsOptions.dealsStatusHub[index].value,
    // });
    return get(factsOptions, `dealsStatusHub[${index}].label`, 'All Deals');
  };

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(propertyFilterRef, {
    action: 'function',
    func: () => {
      if (filterMenu) setFilterMenu(false);
    },
  });

  return (
    <nav className={`filter-bar ${className}`}>
      <div className="type-filter dis-f a-c w-perc-100 jc-c jc-fe-md}">
        {
          dealsFilter && (
            <div className="deals-filter pos-r as-fe dis-f" ref={propertyFilterRef}>
              <BrixelButtonText
                className="ml-2"
                theme="Dark"
                rounded
                label={translateTo(`${getLabel()}`, lang)}
                leftIcon="filter"
                onClick={() => setFilterMenu(!filterMenu)}
              />
              {
                filterMenu && (
                  <div className="filterHolder w-fix-240 brdRadius bgWhite pos-a x-r zIndex3 shadow-3dp pb-2">
                    <div className="p-2">
                      <div className="body2 fweight-500 txtDark700">{translateTo('Filter', lang)}</div>
                      <BrixelIcon
                        className="pos-a x-r cur-poi mt-2 mr-2 fsize-400"
                        icon="close"
                        color="dark"
                        saturationTxt={700}
                        onClick={() => setFilterMenu(!filterMenu)}
                      />
                    </div>
                    {
                      get(factsOptions, 'dealsStatusHub', []).map((item, i) => (
                        <div
                          className="statusList dis-fl-col"
                          key={`fctOpt_${i.toString()}`}
                        >
                          <div
                            className="statusItem p-1 cur-poi dis-fl-row"
                            onClick={() => {
                              setFilterMenu(!filterMenu);
                              setActiveData({
                                label: translateTo(item.label, lang),
                                status: item.value,
                              });
                              processFilter('', activeSortOrderType, activeSortDirection, activeCompany, {
                                label: translateTo(item.label, lang),
                                status: item.value,
                              });
                            }}
                          >
                            {
                              (item.value === activeData.status) && (
                                <BrixelIcon
                                  className="statusIcon txtDark700"
                                  icon="check"
                                />
                              )
                            }
                            <span className="statusLabel txtDark700">{translateTo(item.label, lang)}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </nav>
  );
};

FilterBar.propTypes = {
  activeCompany: PropTypes.string,
  activeSortDirection: PropTypes.string.isRequired,
  activeSortOrderType: PropTypes.string.isRequired,
  applyFilter: PropTypes.func.isRequired,
  className: PropTypes.string,
  dealsFilter: PropTypes.bool,
  filterDeals: PropTypes.object,
  filterModalData: PropTypes.string,
  lang: PropTypes.string.isRequired,
};

FilterBar.defaultProps = {
  activeCompany: '',
  dealsFilter: false,
  filterDeals: null,
  className: null,
  filterModalData: '',
};

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', ''),
  isSuperAdmin: get(state, 'common.superAdmin', false),
});

export default compose(
  connect(mapStateToProps, null),
)(FilterBar);
