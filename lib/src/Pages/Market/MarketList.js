import React, { Suspense, useEffect, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText } from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import set from 'lodash/set';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setSplashType, setWindowDimensions } from '../../actions/CommonActions';
import { getAllProperties, getLastViewedProperties, getNewProperties, getOwnedProperties, getPremarketProperties, getPremiumProperties, getWishlistProperties, } from '../../actions/MarketActions';
import { setActiveMarketOverlayProperty } from '../../actions/PropertyActions';
import MarketCardMap from '../../components/Cards/MarketCardMap';
import lazyWithRetry from '../../components/LazyWithRetry';
import Pagination from '../../components/Pagination';
import translateTo from '../../utils/translation';
const MarketMap = lazyWithRetry(() => import('./MarketMap'));
const MarketList = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { allProperties, companyListings, handleGetAllProperties, handleGetwishlistProperties, handleGetLastViewedProperties, handleGetNewProperties, handleGetPreMarketProperties, handleGetPremiumProperties, handleGetSellerProperties, handleGetWishlistProperties, lang, lastViewedProperties, loggedInUser, newProperties, ownerProperties, preMarketProperties, premiumProperties, 
    // setMarketOverlayProperty,
    // setSplashScreen,
    userSearchProfiles, windowDimensions, wishlistProperties, } = props;
    // URL PARAMS
    const catName = get(match, 'cat', null);
    const propID = get(match, 'id', null);
    // STATE
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrderType, setSortOrderType] = useState('updatedAt');
    const [sortDirection, setSortDirection] = useState('DESC');
    const [activeProperty, setActiveProperty] = useState(propID);
    const [propertyListings, setPropertyListings] = useState([]);
    const [openMap, setOpenMap] = useState(false);
    const [marker, setMarker] = useState([]);
    useEffect(() => {
        if (windowDimensions.width <= 1024) {
            if (history.location.state === 'showMap')
                setOpenMap(true);
        }
    }, [windowDimensions]);
    useEffect(() => {
        if (loggedInUser.id) {
            const profileID = get(userSearchProfiles, '[0].id', null);
            const data = {
                resultsPerPage: itemsPerPage,
                offset: currentPage,
                order: sortOrderType,
                direction: sortDirection,
                setAsSingle: true,
                multiLoader: true,
            };
            switch (catName) {
                case 'own': {
                    handleGetSellerProperties(data);
                    break;
                }
                case 'all': {
                    if (profileID)
                        set(data, 'searchProfileId', profileID);
                    handleGetAllProperties(data);
                    break;
                }
                case 'wishlist': {
                    handleGetWishlistProperties(data);
                    break;
                }
                case 'favorites': {
                    handleGetwishlistProperties(data);
                    break;
                }
                case 'lastViewed': {
                    handleGetLastViewedProperties();
                    break;
                }
                case 'radar': {
                    if (profileID)
                        set(data, 'searchProfileId', profileID);
                    handleGetNewProperties(data);
                    break;
                }
                case 'premium': {
                    if (profileID)
                        set(data, 'searchProfileId', profileID);
                    handleGetPremiumProperties(data);
                    break;
                }
                case 'preMarket': {
                    if (profileID)
                        set(data, 'searchProfileId', profileID);
                    handleGetPreMarketProperties(data);
                    break;
                }
                default:
                    history.push('./');
            }
        }
    }, [itemsPerPage, currentPage, sortOrderType, sortDirection, get(loggedInUser, 'id', null), get(userSearchProfiles, '[0].id', null)]);
    // eslint-disable-next-line max-params
    const updatePagination = (resultsPerPage, pageNumber, type, direction) => {
        setItemsPerPage(resultsPerPage);
        setCurrentPage(pageNumber);
        setSortOrderType(type);
        setSortDirection(direction);
    };
    useEffect(() => {
        switch (catName) {
            case 'own': {
                setPropertyListings(ownerProperties.data || []);
                break;
            }
            case 'wishlist': {
                setPropertyListings(wishlistProperties.data || []);
                break;
            }
            case 'favorites': {
                setPropertyListings(wishlistProperties.data || []);
                break;
            }
            case 'premium': {
                setPropertyListings(premiumProperties.data || []);
                break;
            }
            case 'preMarket': {
                setPropertyListings(preMarketProperties.data || []);
                break;
            }
            case 'all': {
                setPropertyListings(allProperties.data || []);
                break;
            }
            default:
                setPropertyListings([]);
        }
    }, [ownerProperties,
        wishlistProperties,
        lastViewedProperties,
        premiumProperties,
        preMarketProperties,
        newProperties,
        allProperties]);
    const handleMapClose = () => {
        // eslint-disable-next-line react/prop-types
        if (windowDimensions.width <= 1024) {
            if (openMap) {
                setOpenMap(false);
            }
            else {
                history.push('../');
            }
        }
        else {
            history.push('../');
        }
    };
    // eslint-disable-next-line consistent-return
    const getTitle = () => {
        switch (catName) {
            case 'own': {
                return 'Your properties';
            }
            case 'all': {
                return 'All properties';
            }
            case 'wishlist': {
                return 'Wishlist';
            }
            case 'favorites': {
                return 'Bookmarks';
            }
            case 'lastViewed': {
                return 'Last viewed properties';
            }
            case 'radar': {
                return 'Properties in your radar';
            }
            case 'premium': {
                return 'Premium properties';
            }
            // case 'preMarket': {
            //   return 'Pre-market properties';
            // }
            default:
                return '';
        }
    };
    // eslint-disable-next-line consistent-return
    const getTotal = () => {
        switch (catName) {
            case 'own': {
                return ownerProperties.total;
            }
            case 'all': {
                return allProperties.total;
            }
            case 'wishlist': {
                return wishlistProperties.total;
            }
            case 'favorites': {
                return wishlistProperties.total;
            }
            case 'radar': {
                return newProperties.total;
            }
            case 'premium': {
                return premiumProperties.total;
            }
            case 'preMarket': {
                return preMarketProperties.total;
            }
            default:
                return 0;
        }
    };
    const openCard = (item) => {
        if (catName === 'own') {
            history.push(`/${item.id}/home`, { state: { section: 'Market' } });
        }
        else if (catName === 'favorite' || catName === 'wishlist') {
            history.push(`/buyer/${item.id}/property/page`, { state: { section: 'Market' } });
        }
        else
            window.open(`${baseByData?.pageUrl}${item.stub}`, '_blank');
    };
    const getCompanyStub = () => {
        // TODO: Company management for "Add new" property flow
        if (ownerProperties.total === 0)
            return get(loggedInUser, 'company.stub', '');
        else {
            const company = companyListings.find((cmp) => cmp.id === get(ownerProperties, 'data[0].company', ''));
            if (company)
                return company.stub;
        }
    };
    useEffect(() => {
        const catList = document.getElementsByClassName('market-container')[0];
        const scrollEl = document.getElementsByClassName('hubDasContent')[0];
        // @ts-ignore
        if (scrollEl)
            scrollEl.scrollTo = 0;
        if (catList)
            catList.classList.add('dis-f');
        if (catList)
            catList.classList.add('map-view');
        return () => {
            if (catList)
                catList.classList.remove('dis-f');
            if (catList)
                catList.classList.remove('map-view');
        };
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "maplink hide-lg pos-a x-c bt mb-3 zIndex1" },
                React.createElement(BrixelButtonPrimary, { label: translateTo('Map View', lang), rounded: true, theme: "text", leftIcon: "roadmap", className: openMap ? 'slideOut' : '', onClick: () => { setOpenMap(true); } })),
            React.createElement("div", { className: "firstLevel dis-f" },
                React.createElement("div", { className: "property-list pb-md-3" },
                    React.createElement("div", { className: "mb-3 dis-fl-col" },
                        React.createElement("div", { className: "dis-fl-col pos-r" },
                            React.createElement(BrixelButtonIcon, { ghost: true, small: true, theme: "text", themeSat: 300, onClick: () => handleMapClose(), icon: "arrow-simple-left", className: "pos-r" }),
                            React.createElement("div", { className: "mt-2 pr-0 pr-lg-3" },
                                React.createElement("div", { className: "dis-f jc-b a-b" },
                                    React.createElement("div", null,
                                        React.createElement("h4", { className: "dis-b fweight-700 pb-small-4" }, translateTo(getTitle(), lang)),
                                        React.createElement("span", { className: "fsize-300" },
                                            React.createElement("span", null, translateTo('There are', lang)),
                                            React.createElement("span", { className: "fweight-600 notranslate ml-small-4" }, getTotal() ? getTotal() : '-'),
                                            React.createElement("span", { className: "fweight-600 ml-small-4" }, translateTo('properties', lang)),
                                            React.createElement("span", { className: "ml-small-4" }, translateTo('available', lang)))),
                                    React.createElement(BrixelButtonText, { className: "fsize-300 show-all pos-r", label: translateTo('+ Add new', lang), onClick: () => history.push(`/packageFlow/getStarted?company=${getCompanyStub()}`) }))))),
                    propertyListings.map((page, i) => (React.createElement(MarketCardMap, { lang: lang, type: "own", key: `prop_${i.toString()}`, item: page, onClick: () => openCard(page), onHover: (val) => setActiveProperty(val !== null ? page.id : null) }))),
                    propertyListings.length > 0 && (React.createElement(Pagination, { lang: lang, className: "pr-3", totalItems: getTotal(), itemsPerPage: itemsPerPage, activePage: currentPage, paginate: (resultsPerPage, pageNumber) => updatePagination(resultsPerPage, pageNumber, sortOrderType, sortDirection) }))),
                React.createElement("div", { className: `secondLevel p-0 map-wrapper ${openMap ? 'map-on' : ''}` },
                    windowDimensions.width <= 1024 && !activeProperty && (React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", onClick: () => handleMapClose(), icon: "close-small", className: "pos-a-fix x-r-0 zIndex1 mt-10 mr-2" })),
                    React.createElement(Suspense, { fallback: "" },
                        React.createElement(MarketMap, { type: catName, activeProperty: activeProperty, onActiveProperty: (val) => setActiveProperty(val), properties: propertyListings, onMarker: (val) => setMarker(val), parentMarker: marker })))))));
};
const mapStateToProps = (state) => ({
    allProperties: get(state, 'market.allProperties', {}),
    companyListings: get(state, 'companies.companyListings.data', []),
    lang: get(state, 'common.language', 'en'),
    lastViewedProperties: get(state, 'market.lastViewedProperties', {}),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    newProperties: get(state, 'market.newProperties', {}),
    ownerProperties: get(state, 'market.ownerProperties', {}),
    preMarketProperties: get(state, 'market.preMarketProperties', {}),
    premiumProperties: get(state, 'market.premiumProperties', {}),
    userSearchProfiles: get(state, 'user.userSearchProfiles', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
    wishlistProperties: get(state, 'market.wishlistProperties', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetAllProperties: bindActionCreators(getAllProperties, dispatch),
    handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
    handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
    handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
    handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
    handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
    handleGetWishlistProperties: bindActionCreators(getWishlistProperties, dispatch),
    handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
    setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketList);
