/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelTabs } from '@brixel/brixel-components';
import { destroy } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { getAllProperties, getOwnedEstimations, getWishlistProperties } from '../../actions/MarketActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import lazyWithRetry from '../../components/LazyWithRetry';
import '../../styles/SCSS/pages/market.scss';
import translateTo from '../../utils/translation';
import SearchProfileModal from './SearchProfile/SearchProfileModal';

const MarketCategoryListBuyer = lazyWithRetry(() => import('./MarketCategoryListBuyer'));
const FavoritesProperty = lazyWithRetry(() => import('./Buyer/FavoritesProperty'));
const EstimationsPropertyList = lazyWithRetry(() => import('./Buyer/EstimationsPropertyList'));

// MAIN NAVIGATION
const topTab = [
  {
    label: 'Search',
    value: 'searchProfile',
  },
  {
    label: 'Saved properties',
    value: 'favorites',
  },
  {
    label: 'Estimations',
    value: 'estimations',
  },
];

// FILTER BY PROP TYPE
const filterPropType = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Pre-Market',
    value: 'pre-market',
  }]


const MarketBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSearchProfile,
    destroyForm,
    handleGetActiveSingleCompany,
    handleGetAllProperties,
    handleGetOwnedEstimations,
    handleGetUserSearchProfiles,
    handleGetWishlistProperties,
    handleSpinnerOff,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  const [activeTab, setActiveTab] = useState(filterPropType[0].value);
  const [activeTopTab, setActiveTopTab] = useState('searchProfile');

  // URL PARAMS
  const [page, setPage] = useState(1);

  useEffect(() => { destroyForm(); }, [history.location.pathname]);

  useEffect(() => {
    if (get(loggedInUser, 'id', null)) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        ownerId: loggedInUser.id,
        isBuyer: true,
      };
      handleGetUserSearchProfiles(loggedInUser.id);
      handleGetOwnedEstimations(data);
      data.resultsPerPage = 50;
      handleGetWishlistProperties(data);
      handleSpinnerOff();
      if (get(loggedInUser, 'companies[0]', null)) {
        handleGetActiveSingleCompany({ id: get(loggedInUser, 'companies[0]', null) });
      }
    }
  }, [loggedInUser.id]);

  const getPropertiesPage = (pageNumber = page) => {
    const url = get(history, 'location.pathname', '').split("/");
    const type = url[url.length - 2];
    const curPage = url[url.length - 1];
    if (activeSearchProfile !== null) {
      const data = {
        resultsPerPage: 9,
        offset: (curPage - 1) * 9,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        overlayCard: true,
        resultType: 'buyer',
        searchProfileId: get(activeSearchProfile, '.id', null),
      };
      switch (type) {
        case 'all':
          handleGetAllProperties(data);
          break;
        case 'preMarket':
          handleGetAllProperties(data);
          break;
        case 'published':
          handleGetAllProperties(data);
          break;
        default:
          return null;
      }
      if (type) {
        setActiveTab(type);
        setPage({... page, [type]: pageNumber });
      }
    }
  }

  useEffect(() => {
    if (activeSearchProfile !== null) {
      const url = get(history, 'location.pathname', '').split("/");
      const actPage = url[url.length - 1];
      getPropertiesPage(actPage);
      handleSpinnerOff();
    }
  }, [activeSearchProfile, get(history, 'location.pathname', null)]);

  useEffect(() => {
    getPropertiesPage(activeTab);
  }, [isSmallLoading]);

  useEffect(() => {
    const activeListMap = topTab.map((tb) => {
      const url = history.location.pathname || '';
      tb.active = url.includes(tb.value);
      return tb;
    });
    const actMenu = activeListMap.find((itm) => itm.active);
    if(actMenu) setActiveTopTab(actMenu.value);
  }, [get(history, 'location.pathname', null)]);


  const onClickOnTopTab = (tab) => {
    history.push(`/buy/${tab}`);
    setActiveTopTab(tab)
  }

  return (
    <div className="dis-fl-col h-perc-100 market-container buyerPage" id="market">
      {/* premarket overlay */}
      <Suspense fallback="">
        <BrixelTabs
          className="mb-2 mx-a ta-c"
          clicksList={topTab.map((item) => item.value)}
          labels={topTab.map((item) => translateTo(item.label, lang))}
          activeTab={activeTopTab}
          onClick={(tab) => onClickOnTopTab(tab)}
        />
        <Routes>
          <Route path="/searchProfile/list/*" element={<SearchProfileModal />} />
          {
            filterPropType.map((nav, i) => (
              <Route
                key={`route${i.toString()}`}
                path={`/searchProfile/:cat/:page`}
                element={
                  <MarketCategoryListBuyer
                    filterPropType={filterPropType}
                    onPageChange={(resultsPerPage, pageNumber, type) => getPropertiesPage(type, pageNumber)}
                    page={page}
                  />
                }
              />
            ))
          }
          <Route path="/favorites/*" element={<FavoritesProperty />} />
          <Route path="/estimations/*" element={<EstimationsPropertyList />} />
          <Route path="*" element={<Navigate to="/buy/searchProfile/published/1" />} />
        </Routes>
      </Suspense>
    </div>
  );
};

MarketBuyer.propTypes = {
  activeSearchProfile: PropTypes.object,
  destroyForm: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetAllProperties: PropTypes.func.isRequired,
  handleGetOwnedEstimations: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleGetWishlistProperties: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

MarketBuyer.defaultProps = {
  activeSearchProfile: null,
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  activeSearchProfile: get(state, 'user.activeSearchProfile', null),
  favoritesProperties: get(state, 'market.wishlistProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  preMarketProperties: get(state, 'market.preMarketProperties.data', []),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetAllProperties: bindActionCreators(getAllProperties, dispatch),
  handleGetOwnedEstimations: bindActionCreators(getOwnedEstimations, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketBuyer);
