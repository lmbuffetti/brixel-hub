import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, BrixelButtonText, Helpers, } from '@brixel-io/brixel-components';
import { SkeletonPackages } from '@brixel-io/brixel-components/dist/skeleton';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setHistory, setSplashType } from '../../actions/CommonActions';
import { getActiveSingleCompany, getActiveSingleCompanyPackages, getCompanyListing, setActiveSingleCompany, } from '../../actions/CompanyActions';
import { getEstimation, getPackageProperty, setActiveMarketOverlayProperty, setActiveSingleProperty, setEstimation, } from '../../actions/PropertyActions';
import BestimateCardOverlay from '../../components/BestimateCardOverlay';
import MarketCard from '../../components/Cards/MarketCard';
import lazyWithRetry from '../../components/LazyWithRetry';
import SplashScreen from '../../components/SplashScreen';
import generatingBestimate from '../../images/Bestimate/generatingBestimate.svg';
import startBestimate from '../../images/Bestimate/startBestimate.svg';
import EmptyHubImg from '../../images/emptyHub.svg';
import marketSkeltonMobile from '../../images/Market/skeletonCardMobile.svg';
// images
import skeletonOwnCard from '../../images/Market/skeletonOwnCard.svg';
import { getCookie, setCookie } from '../../utils/helpers';
import translateTo from '../../utils/translation';
const CarouselWrapper = lazyWithRetry(() => import('../../components/CarouselWrapper'));
const MarketCategoryListSeller = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { activeSingleCompany, activeMarketOverlayProperty, activeSingleCompanyPackages, activeSinglePropertyActivePackage, activeSinglePropertyPackage, bestimate, 
    // companyListings,
    estimation, handleGetActiveSingleCompany, handleGetActiveCompanyPackages, 
    // handleGetCompanyListing,
    handleGetEstimation, handleGetPackageProperty, 
    // handleSetActiveSingleCompany,
    handleSetActiveSingleProperty, handleSetHistory, isSmallLoading, lang, loggedInUser, notification, ownerProperties, premiumProperties, setMarketOverlayProperty, setPropertyEstimation, setSplashScreen, skeleton, splashScreenType, } = props;
    const marketCookie = getCookie('brixelMarketBestimate');
    const [bestimateMessage, setBestimateMessage] = useState(marketCookie === 'true');
    const [propertyId, setPropertyId] = useState();
    const [activeCompanyId, setActiveCompanyId] = useState();
    const [filteredPackages, setFilteredPackages] = useState([]);
    useEffect(() => {
        setBestimateMessage(marketCookie === 'true');
    }, [marketCookie]);
    useEffect(() => {
        // handleGetCompanyListing();
    }, []);
    useEffect(() => {
        if (propertyId) {
            const indexOwn = ownerProperties.data.findIndex((page) => page.id === propertyId);
            handleSetActiveSingleProperty({ customID: propertyId, setID: indexOwn });
            handleGetPackageProperty({ id: propertyId, smallLoader: 'package' });
        }
        else
            handleSetActiveSingleProperty({});
    }, [propertyId]);
    useEffect(() => {
        if (activeSingleCompanyPackages.length > 0) {
            const packages = activeSingleCompanyPackages;
            // TODO check servicePackageType error
            let filtPkg = [];
            if (packages) {
                filtPkg = packages.filter((pkg) => pkg.availableToCustomer);
            }
            filtPkg.map((pkg) => set(pkg, 'price.total', +get(pkg, 'price.total', 0)));
            filtPkg = orderBy(filtPkg, ['price.total'], ['asc']);
            setFilteredPackages(filtPkg);
        }
    }, [activeSingleCompanyPackages, activeSinglePropertyPackage]);
    // Update market card when bestimate changes
    useEffect(() => {
        if (getCookie('brixelSplashHome') === 'bestimateResult' && get(ownerProperties, 'data', []).length > 0) {
            if (ownerProperties.data[0].location.countryCode === 'CH') {
                if (!has(ownerProperties.data[0], 'estimation.result')) {
                    const payload = {
                        type: 'market',
                        id: ownerProperties.data[0].id,
                    };
                    handleGetEstimation(payload);
                }
                setCookie('brixelMarketBestimate', false);
                setCookie('brixelSplashHome', null);
                setSplashScreen('bestimateResult');
                setPropertyEstimation(get(ownerProperties.data[0], 'estimation', {}));
            }
            else {
                setCookie('brixelMarketBestimate', false);
                setCookie('brixelSplashHome', null);
                setSplashScreen('bestimateTeaser');
            }
        }
        if (getCookie('brixelSplashHome') === 'bestimateTeaser') {
            setCookie('brixelMarketBestimate', false);
            setCookie('brixelSplashHome', null);
            setSplashScreen('bestimateTeaser');
        }
        if (getCookie('brixelSplashHome') === 'sellerWelcome' && get(ownerProperties, 'data', []).length === 1) {
            setSplashScreen('sellerWelcome');
        }
        if (ownerProperties.total > 0) {
            setPropertyId(ownerProperties.data[0].id);
        }
    }, [getCookie('brixelSplashHome'), ownerProperties, notification]);
    useEffect(() => {
        if (has(ownerProperties, 'total')) {
            if (ownerProperties.total === 0) {
                let cmpID;
                if (get(loggedInUser, 'company', null))
                    cmpID = get(loggedInUser, 'company.id', '');
                else if (loggedInUser.companies)
                    cmpID = loggedInUser.companies[0];
                handleGetActiveSingleCompany({ id: cmpID });
                setActiveCompanyId(cmpID);
            }
            else {
                handleGetActiveSingleCompany({ id: get(ownerProperties, 'data[0].company.id', ownerProperties.data[0].company) });
                setActiveCompanyId((get(ownerProperties, 'data[0].company.id', ownerProperties.data[0].company) || '').toString());
            }
        }
    }, [ownerProperties, loggedInUser]);
    const onCloseBestimateResult = () => {
        setCookie('brixelMarketBestimate', true);
        setBestimateMessage(true);
        setSplashScreen('');
        setPropertyEstimation({});
    };
    const onCloseBestimateTeaser = () => {
        setCookie('brixelMarketBestimate', true);
        setBestimateMessage(true);
        setSplashScreen('');
    };
    const onBestimateFlow = () => {
        history.push(`/${activeMarketOverlayProperty.id}/singleFlow/achievement/bestimate/step1`);
        setMarketOverlayProperty({});
        setSplashScreen('');
        handleSetHistory({ source: '/sell' });
    };
    const openSupport = (e) => {
        e.preventDefault();
        // @ts-ignore TODO check history
        history.push({ state: { showSupport: true } });
        setSplashScreen('');
        setCookie('brixelSplashHome', null);
    };
    useEffect(() => {
        const catList = document.getElementsByClassName('market-container')[0];
        if (catList)
            catList.classList.add('market-listings');
        return () => {
            if (catList)
                catList.classList.remove('market-listings');
        };
    }, []);
    useEffect(() => {
        if (activeCompanyId && !isSmallLoading.pkgComapny) {
            const dataCompany = {
                id: activeCompanyId,
                smallLoader: 'pkgComapny',
            };
            handleGetActiveCompanyPackages(dataCompany);
        }
    }, [activeCompanyId]);
    return (React.createElement(Suspense, { fallback: "" },
        !bestimateMessage && splashScreenType === 'bestimateResult' && bestimate.higherValue !== 0 && get(estimation, 'status', null) !== 'pending' && (React.createElement(BestimateCardOverlay, { setBestimateMessage: (val) => setBestimateMessage(val), lang: lang, clearEstimation: true })),
        (!bestimateMessage && splashScreenType === 'bestimateTeaser') && (React.createElement(SplashScreen, { className: "result-popup centered", closeOutside: false }, (get(activeMarketOverlayProperty, 'location.countryCode', null) !== 'CH') ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dis-f jc-fe mb-2" },
                React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", icon: "close-small", onClick: () => onCloseBestimateTeaser() })),
            React.createElement("div", { className: "dis-fl-col jc-c a-c pb-2" },
                React.createElement("h3", null, translateTo('Generating your estimation...', lang)),
                React.createElement("span", { className: "max-w-fix-448 ta-c txtText900 py-2" }, translateTo('Our experts are validating the data and generating an estimation report just for you.', lang)),
                React.createElement("img", { src: generatingBestimate, alt: "Generating Bestimate", className: "w-fix-160 my-5" }),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100" },
                    React.createElement("span", null, translateTo('If you have any questions please contact our', lang)),
                    React.createElement("span", { className: "cur-poi link txtPrimary400", onClick: (e) => {
                            openSupport(e);
                        } },
                        React.createElement("span", { className: "ml-small-4" }, translateTo('support', lang))))))) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "dis-f jc-fe mb-2 mb-sm-1 my-1" },
                React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", icon: "close-small", onClick: () => onCloseBestimateTeaser() })),
            React.createElement("div", { className: "dis-fl-col jc-c a-c pb-2" },
                React.createElement("h3", { className: "ta-c" }, translateTo('Get a free price indication.', lang)),
                React.createElement("span", { className: "max-w-fix-448 ta-c txtText900 py-2" }, translateTo('Compare your property to real transaction data to better define the pricing.', lang)),
                React.createElement("img", { src: startBestimate, alt: "Generating Bestimate", className: "w-fix-96 my-5" }),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100" },
                    React.createElement("span", { className: "pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi", onClick: () => {
                            setCookie('brixelMarketBestimate', true);
                            setBestimateMessage(true);
                        } },
                        React.createElement("span", null, translateTo('Thanks, not now', lang))),
                    React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Get free Bestimate®', lang), className: "m-a", onClick: () => onBestimateFlow(), rightIcon: "arrow-right" }))))))),
        (!bestimateMessage && splashScreenType === 'bestimateResult' && (bestimate.higherValue === 0 || get(estimation, 'status', null) === 'pending')) && (React.createElement(SplashScreen, { className: "result-popup centered", closeOutside: false },
            React.createElement("div", { className: "dis-f jc-fe mb-2" },
                React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", icon: "close-small", onClick: () => onCloseBestimateResult() })),
            React.createElement("div", { className: "dis-fl-col jc-c a-c pb-2" },
                React.createElement("h3", null, translateTo('Bestimate® is missing 🙁', lang)),
                React.createElement("span", { className: "max-w-fix-448 ta-c txtText900 py-2" }, translateTo('We could not calculate your Bestimate®. No problem. Our support team will do it for you manually.', lang)),
                React.createElement("img", { src: startBestimate, alt: "Generating Bestimate", className: "w-fix-96 my-5" }),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100" },
                    React.createElement("span", { className: "pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi", onClick: () => {
                            onCloseBestimateResult();
                        } },
                        React.createElement("span", null, translateTo('Thanks, not now', lang))),
                    React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Contact support', lang), className: "m-a", onClick: (e) => openSupport(e), rightIcon: "arrow-right" }))))),
        ownerProperties.total === 0 ? (React.createElement("div", { className: "px-2 px-md-0 mb-5 mb-sm-3" },
            React.createElement("div", { className: "p-2 px-sm-3 brdRadius brdSmall brdText50 bgWhite shadow-2dp min-h-fix-240 max-w-fix-800 ml-a mr-a pos-r mb-8 py-5 py-3" },
                React.createElement("img", { className: "ml-a mr-a dis-b", width: "80", src: EmptyHubImg, alt: "Emtpy Hub" }),
                React.createElement("h4", { className: "ta-c mt-3 mb-2 fweight-700 mb-2" }, translateTo('Anybody home?', lang)),
                React.createElement("h5", { className: "ta-c fSizePx18 mb-2 m-a" }, translateTo('For using the Brixel Hub you need at least one property.', lang)),
                React.createElement(BrixelButtonPrimary, { rounded: true, className: "m-a mt-3", label: translateTo('+ Add new', lang), onClick: () => history.push(`/packageFlow/getStarted?company=${activeSingleCompany.stub}`) })))) : (React.createElement("div", { className: "mb-5 mb-sm-3 container" },
            React.createElement("div", { className: "dis-f a-c jc-b" },
                React.createElement("h1", { className: "fsize-400 fsize-sm-700" },
                    React.createElement("span", null, ownerProperties.total),
                    React.createElement("span", { className: "ml-small-4" }, translateTo(`${ownerProperties.total === 1 ? 'Property' : 'Properties'} added by you`, lang))),
                React.createElement(BrixelButtonText, { label: translateTo('+ Add new', lang), theme: "text", labelClass: "ws-nw", themeSat: 900, onClick: () => history.push(`/packageFlow/getStarted?company=${activeSingleCompany.stub}`) })),
            ownerProperties.total > 0 && (React.createElement(React.Fragment, null, ownerProperties.data.map((prop, i) => (React.createElement("div", { className: "shadow-3dp p-2 mt-3 brdRadiusSmall", key: `ownProp_${i.toString()}` }, ownerProperties.total > 0 ? (React.createElement(MarketCard, { companyDetail: activeSingleCompany, index: i, layout: "singleOwnCard", type: "own", item: prop, onSetActiveProperty: (id) => setPropertyId(id), lang: lang })) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "m-a w-perc-100" },
                    React.createElement("div", { className: 'w-perc-100 dis-f brdRadius skeletonBg h-fix-md-152 mb-4 ov-h' },
                        React.createElement("div", { className: "w-fix-216 hide dis-b-md skeletonBgInner" }),
                        React.createElement("div", { className: "ml-md-4 ml-2 h-perc-100 dis-fl-col w-perc-100 py-2" },
                            React.createElement("p", { className: "h-fix-40 skeletonBgInner w-perc-60" }, " "),
                            React.createElement("p", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-30" }, " "),
                            React.createElement("p", { className: "h-fix-16 mt-a-md mt-2 skeletonBgInner w-perc-50" }, " "))),
                    React.createElement("img", { className: "hide dis-b-sm", src: skeletonOwnCard, alt: "marketSkelton" }),
                    React.createElement("hr", { className: "lighter hide dis-b-sm pos-a-fix mt-4-neg max-w-perc-97" }),
                    React.createElement("img", { className: "hide-sm m-a dis-b", src: marketSkeltonMobile, alt: "marketSkelton" }))))))))),
            (ownerProperties.total !== 0 && ownerProperties.total === undefined) && (React.createElement("div", { className: "marketSellBanner mb-10" },
                React.createElement("div", { className: "m-a w-perc-100" },
                    React.createElement("div", { className: "brdRadius shadow-3dp p-2 mb-3 mt-3 pb-4" },
                        React.createElement("div", { className: 'w-perc-100 ov-h dis-f brdRadius skeletonBg h-fix-md-152 mb-4' },
                            React.createElement("div", { className: "w-fix-216 hide dis-b-md skeletonBgInner" }),
                            React.createElement("div", { className: "ml-md-4 ml-2 h-perc-100 dis-fl-col w-perc-100 py-2" },
                                React.createElement("p", { className: "h-fix-40 skeletonBgInner w-perc-60" }, " "),
                                React.createElement("p", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-30" }, " "),
                                React.createElement("p", { className: "h-fix-16 mt-a-md mt-2 skeletonBgInner w-perc-50" }, " "))),
                        React.createElement("img", { className: "hide dis-b-sm", src: skeletonOwnCard, alt: "marketSkelton" }),
                        React.createElement("hr", { className: "lighter hide dis-b-sm pos-a-fix mt-4-neg max-w-perc-97" }),
                        React.createElement("img", { className: "hide-sm m-a dis-b", src: marketSkeltonMobile, alt: "marketSkelton" }))))),
            ownerProperties.total > 0 && (React.createElement(BrixelButtonSecondary, { label: translateTo('View all', lang), rounded: true, rightIcon: "arrow-simple-right", className: "m-a mt-3", onClick: () => history.push('/sell/own') })))),
        React.createElement("div", { className: "bgText25 pt-6 pt-sm-8 pb-4 pb-sm-7" },
            React.createElement("div", { className: "container" },
                React.createElement("h3", { className: "ta-c mb-7 max-w-fix-416 fsize-600 fsize-sm-800 fweight-600 m-a" }, translateTo('Boost your private sale with an upgrade.', lang)),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-c pkgsWrap" }, (filteredPackages.length === 0 && (isSmallLoading.loadPackages !== false || skeleton.own)) ? (React.createElement(React.Fragment, null,
                    React.createElement(SkeletonPackages, { className: "mx-sm-2 max-w-fix-400 w-perc-100", type: "small" }),
                    React.createElement(SkeletonPackages, { className: "my-2 my-sm-0 mx-sm-2 max-w-fix-400 w-perc-100", type: "small" }),
                    React.createElement(SkeletonPackages, { className: "mx-sm-2 max-w-fix-400 w-perc-100", type: "small" }))) : (React.createElement(React.Fragment, null, filteredPackages.map((pkg, i) => (React.createElement("div", { onClick: () => window.location.assign(`/${propertyId || 'company'}/upgrade`), key: `fltPkg_${i.toString()}`, className: `${pkg.type} bgWhite txtText900 mb-2 mb-sm-0 mx-0 mx-sm-2 w-perc-100 brdSmall brdRadius py-3 px-4 min-h-fix-248 cur-poi max-w-fix-400 w-perc-100` },
                    React.createElement("div", { className: "dis-f jc-b a-c" },
                        React.createElement("h4", { className: "fweight-500 txtText900" }, translateTo(pkg.name || '', lang)),
                        (activeSinglePropertyActivePackage.stub === pkg.stub || (!activeSinglePropertyActivePackage.stub && pkg.type === 'basic')) && (React.createElement("div", { className: "bgText800 py-small-4 px-1 brdRadius txtWhite" }, translateTo('Your plan', lang)))),
                    get(pkg, 'price.total', 0) > 0 ? (React.createElement("div", { className: "mt-1 mb-3 fsize-500 txtText900 dis-fl-col" },
                        get(pkg, 'price.discountTotal', 0) > 0 && (React.createElement(React.Fragment, null,
                            React.createElement("span", { className: "dis-b txtText400 fsize-300 mt-2 mt-sm-0" },
                                React.createElement("span", { className: "" }, translateTo('Original price', lang)),
                                React.createElement("span", { className: "td-lt lh-in ml-2 dis-ib pt-small-2" },
                                    React.createElement("span", null, get(pkg, 'price.currency', '')),
                                    " ",
                                    React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))))))),
                        React.createElement("div", { className: "dis-f" },
                            get(pkg, 'price.discountTotal', 0) > 0 ? (React.createElement("span", null,
                                get(pkg, 'price.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(pkg, 'price.discountTotal', 0), get(pkg, 'price.currency', '')))) : (React.createElement("span", null,
                                get(pkg, 'price.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', '')))),
                            React.createElement("span", { className: "ml-1 fsize-300 txtText900 dis-f as-fe" }, translateTo('incl. VAT', lang))))) : (React.createElement("p", { className: "mt-1 mb-3 fsize-500 dis-f a-b txtText900" }, translateTo('Free', lang))),
                    React.createElement("p", { className: "txtText900" }, translateTo(pkg.description || '', lang)))))))),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-c a-c mt-4" },
                    React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Upgrade your plan', lang), onClick: () => window.location.assign(`/${get(ownerProperties, 'data[0].id', 'company')}/upgrade`) }),
                    React.createElement("span", { className: "mx-sm-1 mt-2 my-sm-0" }, translateTo('or', lang)),
                    React.createElement(BrixelButtonText, { rounded: true, label: translateTo('compare all plans', lang), onClick: () => window.location.assign(`/${get(ownerProperties, 'data[0].id', 'company')}/upgrade#comparePlan`), theme: "text" })))),
        React.createElement("div", { className: "my-5 mb-sm-10" },
            React.createElement("div", { className: "container" }, premiumProperties.total > 0 && (React.createElement(CarouselWrapper, { title: "Others selling with Brixel", className: "market-category-carousel", type: "premium", items: premiumProperties.data, total: premiumProperties.total }))))));
};
const mapStateToProps = (state) => ({
    activeMarketOverlayProperty: get(state, 'property.activeMarketOverlayProperty', {}),
    activeSingleCompanyPackages: get(state, 'companies.activeSingleCompanyPackages', []),
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyActivePackage: get(state, 'property.activeSinglePropertyActivePackage', {}),
    activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
    bestimate: get(state, 'property.estimation.result', {}),
    companyListings: get(state, 'companies.companyListings.data', []),
    estimation: get(state, 'property.estimation', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    notification: get(state, 'common.notification', []),
    ownerProperties: get(state, 'market.ownerProperties', {}),
    premiumProperties: get(state, 'market.premiumProperties', {}),
    skeleton: get(state, 'common.skeleton', {}),
    splashScreenType: get(state, 'common.splashScreenType', ''),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetActiveCompanyPackages: bindActionCreators(getActiveSingleCompanyPackages, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
    handleGetCompanyListing: bindActionCreators(getCompanyListing, dispatch),
    handleGetEstimation: bindActionCreators(getEstimation, dispatch),
    handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
    handleSetActiveSingleCompany: bindActionCreators(setActiveSingleCompany, dispatch),
    handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
    handleSetHistory: bindActionCreators(setHistory, dispatch),
    setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
    setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketCategoryListSeller);
