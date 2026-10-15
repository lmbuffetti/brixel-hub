import { destroy } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { getFavoritesProperties, getOwnedProperties, getPremiumProperties } from '../../actions/MarketActions';
import { updateFavorite } from '../../actions/UserActions';
import lazyWithRetry from '../../components/LazyWithRetry';
import '../../styles/SCSS/pages/market.scss';
const MarketCategoryListSeller = lazyWithRetry(() => import('./MarketCategoryListSeller'));
const MarketList = lazyWithRetry(() => import('./MarketList'));
const MarketSeller = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { destroyForm, handleGetFavoritesProperties, handleGetPremiumProperties, handleGetSellerProperties, handleSpinnerOff, loggedInUser, } = props;
    useEffect(() => { destroyForm(); }, [history.location.pathname]);
    useEffect(() => {
        if (loggedInUser.id) {
            const data = {
                resultsPerPage: 10,
                offset: 0,
                order: 'updatedAt',
                direction: 'DESC',
                setAsSingle: true,
                multiLoader: true,
                resultType: 'seller',
                allCountry: false,
            };
            handleGetFavoritesProperties(data);
            handleGetSellerProperties(data);
            data.allCountry = true;
            handleGetPremiumProperties(data);
            handleSpinnerOff();
        }
    }, [loggedInUser]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Suspense, { fallback: "" },
            React.createElement("div", { className: "market-container sellerPage", id: "market" },
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/", element: React.createElement(MarketCategoryListSeller, null) }),
                    React.createElement(Route, { path: "/:cat", element: React.createElement(MarketList, { isSeller: true }) }),
                    React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: "/sell" }) }))))));
};
const mapStateToProps = (state) => ({
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    splashScreenType: get(state, 'common.splashScreenType', ''),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    destroyForm() {
        dispatch(destroy('Property'));
    },
    handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
    handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
    handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
    handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketSeller);
