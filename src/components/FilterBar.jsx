/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  withRouter,
} from 'react-router-dom';
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
  BrixelIcon, BrixelInputText,
  BrixelSelect, BrixelButtonPrimary,
  FactsOptions, BrixelButtonTertiary,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import useDebounce from './DebounceHook';
import ProgressBar from './ProgressBar';
import BrixelSelectTag from './BrixelSelectTag';

const {
  factsOptions,
} = FactsOptions;

const FilterBar = (props) => {
  const {
    activeCompany,
    activeSearchText,
    activeSortDirection,
    activeSortOrderType,
    addButtonLabel,
    addButtonLink,
    applyFilter,
    className,
    companyListings,
    dealsFilter,
    filterDeals,
    filterModalData,
    history,
    isSmallLoading,
    isSuperAdmin,
    propertyFilter,
    sortBarType,
  } = props;

  const [companyOpt, setCompanyOpt] = useState([]);
  const [stringToSearch, setStringToSearch] = useState(activeSearchText);
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

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(propertyFilterRef, {
    action: 'function',
    func: () => {
      if (filterMenu) setFilterMenu(false);
    },
  });

  const debouncedSearchTerm = useDebounce(stringToSearch, 500);

  useEffect(() => {
    if (dealsFilter === true) {
      const status = get(filterDeals, 'status', 'all');
      const index = findIndex(factsOptions.dealsStatus, (el) => el.value === status);
      setActiveData({
        label: get(factsOptions, `dealsStatus[${index}].label`, ''),
        status: get(factsOptions, `dealsStatus[${index}].value`, ''),
      });
    }
  }, [dealsFilter]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany);
    } else if (debouncedSearchTerm.length === 0) {
      processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (companyListings && !history.location.pathname.includes('companies')) {
      const curCompObj = [{
        value: '',
        label: 'All companies',
      }];
      // eslint-disable-next-line array-callback-return
      companyListings.map((item) => {
        let total = item.totalPages;
        if (history.location.pathname.includes('users')) total = item.totalUsers;
        curCompObj.push(
          {
            value: item.id,
            label: `${item.name} (${total})`,
          },
        );
      });
      setCompanyOpt(curCompObj);
    }
  }, [companyListings]);

  useEffect(() => {
    const contentWrapper = document.getElementsByClassName('content-wrapper')[0];
    if (filterMenu && contentWrapper) {
      contentWrapper.classList.add('overlay');
    } else {
      contentWrapper.classList.remove('overlay');
    }
  });

  const countFilter = () => {
    let count = 0;
    if (filterDeals) {
      Object.keys(filterDeals).forEach((key) => {
        if (filterDeals[key].length > 0) count += 1;
      });
    } else {
      Object.keys(activeData).forEach((key) => {
        if (activeData[key].length > 0) count += 1;
      });
    }
    return count > 0 ? `(${count})` : '';
  };

  const isAdministration = () => !history.location.pathname.includes('companies') && !history.location.pathname.includes('packages');

  const isSupAndAdminist = () => (!history.location.pathname.includes('companies') && !history.location.pathname.includes('packages')) && isSuperAdmin;

  const isEitherExist = () => isSupAndAdminist() || isAdministration();

  const getLabel = () => {
    const status = get(filterDeals, 'status', 'all');
    const index = findIndex(factsOptions.dealsStatus, (el) => el.value === status);
    // setActiveData({
    //   label: factsOptions.dealsStatus[index].label,
    //   status: factsOptions.dealsStatus[index].value,
    // });
    return get(factsOptions, `dealsStatus[${index}].label`, 'All Deals');
  };

  return (
    <nav className={`filter-bar ${sortBarType !== 'deals' ? 'mx-2 pb-0 pb-lg-5 pt-2 pt-md-3 dis-fl-col dis-fl-row-sm a-b-sm pos-r w-perc-100' : ''} ${className}`}>
      {
        isEitherExist() && (
          <div className={`topPanel jc-c jc-fs-md w-perc-md-50 w-perc-100 ${sortBarType !== 'deals' ? 'dis-f' : 'hide'}`}>
            <div className="search brixel-search dis-f a-c w-perc-100 flex-280 w-fix-280">
              {
                isAdministration() && sortBarType !== 'deals' && (
                  <>
                    <BrixelIcon
                      icon="search"
                      className="search-icon mr-2"
                    />
                    <BrixelInputText
                      type="text"
                      className="w-perc-100"
                      placeholder={`${sortBarType === 'users' ? 'Search by name' : ''}${sortBarType === 'properties' ? 'Search by title' : ''}`}
                      input={{
                        onChange: (e) => setStringToSearch(e),
                        onBlur: () => '',
                        value: stringToSearch,
                      }}
                      isLoading={isSmallLoading === 'search' && stringToSearch.length > 0}
                    />
                  </>
                )
              }
            </div>
            <div className="companyFilter dis-f ml-2">
              {/* Company general filter */}
              {
                isSupAndAdminist() && sortBarType !== 'deals' && (
                  <BrixelSelect
                    className="type-dropdown zIndex1 min-w-fix-280"
                    input={{
                      onChange: (val) => processFilter(activeSearchText, activeSortOrderType, activeSortDirection, val),
                      name: 'company[]',
                      value: activeCompany,
                    }}
                    options={companyOpt}
                    onSelect={(e) => processFilter(e, activeSortOrderType, activeSortDirection, activeCompany)}
                  />
                )
              }
            </div>
          </div>
        )
      }
      <div className={`type-filter dis-f a-c w-perc-100 jc-c jc-fe-md ${sortBarType !== 'deals' ? 'mt-2 mt-sm-1' : ''}`}>
        {
          propertyFilter && (
            <div className="pos-r as-fe dis-f" ref={propertyFilterRef}>
              {
                filterMenu === false && countFilter() && (
                  <BrixelButtonTertiary
                    label="Reset"
                    onClick={() => {
                      setActiveData({
                        progress: [],
                        status: [],
                      });
                      processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany, {
                        progress: [],
                        status: [],
                      });
                    }}
                  />
                )
              }
              <BrixelButtonPrimary
                className="ml-2 shadow-2dp bgWhite"
                background="white"
                colorTxt="Dark"
                saturationTxt={700}
                rounded
                label={`Filter ${countFilter()}`}
                rightIcon="filter"
                onClick={() => setFilterMenu(!filterMenu)}
              />
              {
                filterMenu && (
                  <div className="filterHolder w-fix-268 brdRadius bgWhite p-2 pos-a x-r zIndex3">
                    <div className="">
                      <div className="body2 fweight-500 txtDark700"> Filter {countFilter()} </div>
                      <i className="icon-close pos-a x-r cur-poi mt-2 mr-2 fsize-400 txtDark700" onClick={() => setFilterMenu(!filterMenu)}> </i>
                    </div>
                    <ProgressBar
                      name="progress"
                      className="mt-1"
                      options={factsOptions.progressBarOptions}
                      progressStateArray={get(activeData, 'progress', '').toString().split(',')}
                      readOnly={false}
                      updateProgressBarFunc={(val) => {
                        setActiveData({
                          ...activeData,
                          progress: val,
                        });
                      }}
                      isArrayValue
                      isActive
                    />
                    <hr className="lighter my-2" />
                    <BrixelSelectTag
                      options={get(factsOptions, 'pageStatus', [])}
                      selectedTag={get(activeData, 'status', '').toString().split(',')}
                      selectedStatus={
                        (val) => {
                          setActiveData({
                            ...activeData,
                            status: val,
                          });
                        }
                      }
                    />

                    <div className="dis-f jc-b mt-4">
                      <BrixelButtonTertiary
                        label="Reset all"
                        onClick={() => {
                          setFilterMenu(!filterMenu);
                          setActiveData({
                            progress: [],
                            status: [],
                          });
                          processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany, {
                            progress: [],
                            status: [],
                          });
                        }}
                      />
                      <BrixelButtonPrimary
                        label="Set"
                        rounded
                        background="green"
                        onClick={() => {
                          setFilterMenu(!filterMenu);
                          processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany, activeData);
                        }}
                      />
                    </div>

                  </div>
                )
              }
            </div>
          )
        }
        {
          sortBarType !== 'deals' && (
            <BrixelButtonPrimary
              className="as-fe ml-2"
              rounded
              label={addButtonLabel}
              rightIcon="plus"
              onClick={() => history.push(addButtonLink)}
            />
          )
        }
        {
          dealsFilter && (
            <div className="deals-filter pos-r as-fe dis-f" ref={propertyFilterRef}>
              {/* {console.log(activeData.value)} */}

              <BrixelButtonPrimary
                className="ml-2"
                background="white"
                colorTxt="Dark"
                saturationTxt={700}
                rounded
                label={`${getLabel()}`}
                leftIcon="filter"
                onClick={() => setFilterMenu(!filterMenu)}
              />
              {
                filterMenu && (
                  <div className="filterHolder w-fix-240 brdRadius bgWhite pos-a x-r zIndex3 shadow-3dp pb-2">
                    <div className="p-2">
                      <div className="body2 fweight-500 txtDark700">Filter</div>
                      <i className="icon-close txtDark700 pos-a x-r cur-poi mt-2 mr-2 fsize-400" onClick={() => setFilterMenu(!filterMenu)}> </i>
                    </div>
                    {/* <BrixelSelectTag
                      options={get(factsOptions, 'dealsStatus', [])}
                      selectedTag={get(filterDeals, 'status', '')}
                      selectedStatus={
                        (val) => {
                          setActiveData({
                            ...activeData,
                            status: val,
                          });
                        }
                      }
                    /> */}

                    {
                      get(factsOptions, 'dealsStatus', []).map((item, i) => (
                        <div className="statusList dis-fl-col" key={i.toString()}>
                          <div
                            className="statusItem p-1 cur-poi dis-fl-row"
                            onClick={() => {
                              setFilterMenu(!filterMenu);
                              setActiveData({
                                label: item.label,
                                status: item.value,
                              });
                              processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany, {
                                label: item.label,
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
                            <span className="statusLabel txtDark700">{item.label}</span>
                          </div>
                        </div>
                      ))
                    }

                    {/* <div className="dis-f jc-b mt-4">
                      <BrixelButtonTertiary
                        label="Reset all"
                        onClick={() => {
                          setFilterMenu(!filterMenu);
                          setActiveData({
                            progress: [],
                            status: [],
                          });
                          processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany, {
                            progress: [],
                            status: [],
                          });
                        }}
                      />
                      <BrixelButtonPrimary
                        label="Set"
                        rounded
                        background="green"
                        onClick={() => {
                          setFilterMenu(!filterMenu);
                          processFilter(debouncedSearchTerm, activeSortOrderType, activeSortDirection, activeCompany, activeData);
                        }}
                      />
                    </div> */}

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
  activeSearchText: PropTypes.string,
  activeSortDirection: PropTypes.string.isRequired,
  activeSortOrderType: PropTypes.string.isRequired,
  addButtonLabel: PropTypes.string,
  addButtonLink: PropTypes.string,
  applyFilter: PropTypes.func.isRequired,
  className: PropTypes.string,
  companyListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  dealsFilter: PropTypes.bool,
  filterDeals: PropTypes.object,
  filterModalData: PropTypes.string,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  propertyFilter: PropTypes.bool,
  sortBarType: PropTypes.string.isRequired,
};

FilterBar.defaultProps = {
  activeCompany: '',
  activeSearchText: '',
  addButtonLabel: '',
  addButtonLink: '',
  dealsFilter: false,
  filterDeals: null,
  className: null,
  filterModalData: '',
  propertyFilter: false,
};

const mapStateToProps = (state) => ({
  companyListings: get(state, 'company.companyListingsSimple.companies', []),
  isSmallLoading: get(state, 'common.isSmallLoading', ''),
  isSuperAdmin: get(state, 'common.superAdmin', false),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(FilterBar);
