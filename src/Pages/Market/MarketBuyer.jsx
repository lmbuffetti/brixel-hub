/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelTabs } from '@brixel/brixel-components';
import { destroy } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import {
  getAllProperties,
  getFavoritesProperties,
  getOwnedEstimations,
  getWishlistProperties,
} from '../../actions/MarketActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import lazyWithRetry from '../../components/LazyWithRetry';
import '../../styles/SCSS/pages/market.scss';
import translateTo from '../../utils/translation';

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
  const match = useParams();
  // PROPS
  const {
    activeSearchProfile,
    destroyForm,
    handleGetActiveSingleCompany,
    handleGetAllProperties,
    handleGetFavoritesProperties,
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
  const catName = get(match, 'cat', null);
  const [page, setPage] = useState({
    all: 0,
    published: 0,
    preMarket: 0,
  });

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
      if (!catName) handleGetFavoritesProperties(data);
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
  
  const getPropertiesPage = (pageNumber = page[activeTab]) => {
    const url = get(history, 'location.pathname', '').split("/");
    const type = url[url.length - 1];
    if (activeSearchProfile !== null) {
      const data = {
        resultsPerPage: 9,
        offset: pageNumber,
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
          data.offset = 0;
          handleGetAllProperties(data);
          break;
        case 'preMarket':
          data.offset = 0;
          handleGetAllProperties(data);
          break;
        case 'published':
          data.offset = 0;
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
      const actUrl = url[url.length - 1];
      getPropertiesPage('all', 0, actUrl);
      // getPropertiesPage('preMarket', page['preMarket']);
      // getPropertiesPage('published', page['published']);
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
          {
            filterPropType.map((nav, i) => (
              <Route
                key={`route${i.toString()}`}
                path={`/searchProfile/${nav.value}`}
                element={
                  <MarketCategoryListBuyer
                    activeFilter={nav.value}
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
          <Route path="*" element={<Navigate to="/buy/searchProfile/all" />} />
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
  handleGetFavoritesProperties: PropTypes.func.isRequired,
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
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
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
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetOwnedEstimations: bindActionCreators(getOwnedEstimations, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketBuyer);
