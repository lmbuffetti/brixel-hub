import React, { useEffect, lazy, useRef, useState } from 'react';
import { BrixelButtonSecondary, FactsOptions, useOutsideAlerter, } from '@brixel-io/brixel-components';
import logoMobile from '@brixel-io/brixel-components/dist/configuration/images/logo_colors_icon_new.svg';
import logoScribble from '@brixel-io/brixel-components/dist/configuration/images/logoScribble.svg';
import logoBoutique from '@brixel-io/brixel-components/dist/configuration/images/logoBoutique.svg';
import logo from '@brixel-io/brixel-components/dist/configuration/images/logo_colors_v2.svg';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { BrixelSelect, destroy } from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { setLanguage, setModal } from '../../actions/CommonActions';
import { getPackageProperty, getPackagesProperty, setActiveSingleProperty, setActiveSinglePropertyActivePackage, } from '../../actions/PropertyActions';
import { saveActiveSingleUser, setUserTypes } from '../../actions/UserActions';
import { sidebarNavigationBuyer, sidebarNavigationSeller } from '../../resources/Utilities/navigationRoutes';
import { setCookie } from '../../utils/helpers';
import translateTo from '../../utils/translation';
import lazyWithRetry from '../LazyWithRetry';
import isEmpty from 'lodash/isEmpty';
import SectionMobileTitle from '../SectionMobileTitle';
const Support = lazy(() => import('../../components/Support'));
const RightFlowHeader = lazyWithRetry(() => import('./RightHeaderFlow'));
const AccountDropdown = lazyWithRetry(() => import('../AccountDropdown'));
const MenuSidebar = lazyWithRetry(() => import('./MenuSidebar'));
const ProgressSellerStage = lazyWithRetry(() => import('../ProgressSellerStage'));
const { factsOptions } = FactsOptions;
function PageHeader(props) {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { activeCompanyPackages, activeSingleProperty, activeSingleCompany, handleSaveActiveSingleUser, handleSetActiveSinglePropertyActivePackage, handleSetLanguage, isFlow = false, isSecondLevelClass = false, lang = 'en', languages, loggedInUser = {}, onClose, ownerProperties, packagesProperty, handleSetModal, userType, windowDimensions, } = props;
    // STATE
    const [langMenu, setLangMenu] = useState([]);
    // const [openMenu, setOpenMenu] = useState(false);
    // const [langSel, setSelLang] = useState(lang);
    const [packageName, setPackageName] = useState('Basic');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProgressStage, setShowProgressStage] = useState(false);
    const [stepIndexProgrss, setIndexProgrss] = useState(0);
    const isBuyer = history.location.pathname.includes('buyer');
    // REF
    const profileMenu = useRef(null);
    // URL PARAMS
    let propID = history.location.pathname.split('/')[1];
    if (propID === 'buyer')
        propID = history.location.pathname.split('/')[2];
    if (propID === 'home' || propID === 'seller')
        propID = null;
    useEffect(() => {
        if (get(activeSingleProperty, 'id', null)) {
            const defState = factsOptions.progressBarOptions.find((item) => item.value === get(activeSingleProperty, 'progress.state', ''));
            if (defState) {
                const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === get(activeSingleProperty, 'progress.state', null));
                if (defState.label === 'Sales Lead')
                    defState.label = 'Onboarding';
                setIndexProgrss(defIndexState);
            }
            if (get(activeSingleProperty, 'sellerStatus', null) === 'success')
                setIndexProgrss(5);
        }
    }, [get(activeSingleProperty, 'id', null)]);
    useEffect(() => {
        // TODO check servicePackageType error
        const activeSinglePropertyPackage = cloneDeep(packagesProperty);
        setPackageName('Basic');
        const basicPackage = activeCompanyPackages.find((pkg) => pkg.type === 'basic');
        handleSetActiveSinglePropertyActivePackage(basicPackage);
        if (activeSinglePropertyPackage.length > 0) {
            const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
            const getActivePackage = sortedPackage.find((pkg) => pkg.started);
            if (getActivePackage && get(getActivePackage, 'servicePackage', null)) {
                handleSetActiveSinglePropertyActivePackage(getActivePackage.servicePackage);
                setPackageName(getActivePackage?.servicePackage?.name || '');
            }
            else if (get(sortedPackage[0], 'servicePackage', null)) {
                handleSetActiveSinglePropertyActivePackage(sortedPackage[0].servicePackage);
                setPackageName(sortedPackage[0]?.servicePackage?.name || '');
            }
        }
    }, [packagesProperty.length]);
    // GET LANGUAGE LISTS
    useEffect(() => {
        const langHeader = [];
        languages.forEach((lng) => {
            langHeader.push({
                value: lng.code,
                shortLabel: lng.code,
                label: lng.name,
            });
        });
        setLangMenu(langHeader);
    }, [languages]);
    // FUNCTION TO CHANGE  THE LANGUAGE
    const newLang = (langCode) => {
        const defLangCode = get(langCode, 'value', null) ? langCode.value : langCode;
        if (defLangCode)
            setCookie('brixelLang', defLangCode);
        handleSetLanguage(defLangCode);
        if (get(loggedInUser, 'id', null) && !isEmpty(defLangCode)) {
            const userData = {
                id: get(loggedInUser, 'id', null),
                language: defLangCode,
                setLoggedInUser: true,
                smallLoader: 'saveData',
            };
            document.documentElement.lang = defLangCode;
            handleSaveActiveSingleUser(userData);
        }
    };
    // FUNCTION LOADED WHEN SCREEN RESIZED
    const screenResize = () => {
        if (window.innerWidth >= 1024) {
            document.body.classList.remove('ov-h');
        }
    };
    const openMobileSupport = () => {
        handleSetModal({
            component: React.createElement(Support, { isMobile: windowDimensions.width <= 1024 }),
            state: true,
            small: true,
            title: translateTo('How can we help?', lang),
            titleTop: true,
            classTitle: 'mr-2-neg',
            titleTopClass: 'fweight-600 fsize-500 brdSmallBottom brdText50 ta-c',
            bodyClassColor: 'dis-f',
            bodyInnerClass: 'flex-1 dis-f',
            className: 'mobileSupportModal',
            layout: 'xxlarge',
        });
    };
    // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => screenResize());
        }
    }, []);
    // ON CHANGE PAGE
    useEffect(() => {
        if (windowDimensions.width > 1024 && ((!isFlow &&
            get(activeSingleProperty, 'id', null) &&
            propID &&
            propID.length > 9 &&
            userType === 'seller') || (history.location.pathname.includes('welcomeSeller')))) {
            setShowProgressStage(true);
        }
        else {
            setShowProgressStage(false);
        }
        setShowMobileMenu(false);
    }, [get(history, 'location.pathname', null), isFlow, userType, propID, get(activeSingleProperty, 'id', null), windowDimensions?.width]);
    useEffect(() => {
        document.body.classList.remove('ov-h');
    }, [history.location.pathname]);
    // SHOW/HIDE MOBILE MENU
    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
        if (showMobileMenu)
            document.body.classList.remove('ov-h');
        else
            document.body.classList.add('ov-h');
    };
    // WHEN CLICK ON UPGRADE BUTTON
    const onUpgrade = () => {
        const propertyID = get(activeSingleProperty, 'id', get(activeSingleProperty, 'customID', ''));
        localStorage.setItem('backUrl', history.location.pathname);
        history.push(`/${propertyID || 'company'}/upgrade`);
    };
    // FUNCTION TO GET CURRENT URL LOCATION
    const getCurrentRoute = () => {
        const path = history.location.pathname;
        const currentPath = sidebarNavigationSeller.concat(sidebarNavigationBuyer(activeSingleCompany)).find((item) => path.includes(item.name) && item.name !== 'Prospects');
        return currentPath || { name: '', path: '', title: '' };
    };
    useEffect(() => {
        // this changes the scrolling behavior to "smooth"
        const dashContentEl = document.getElementsByClassName('hubDasContent')[0];
        if (dashContentEl && !history?.location?.pathname?.includes('buy/searchProfile')) {
            dashContentEl.scrollTop = 0;
        }
    }, [history.location]);
    // Function to close the drawer menus when we click outside
    useOutsideAlerter(profileMenu, {
        action: 'function',
        func: () => {
            setShowProfileMenu(false);
        },
    });
    // add shadow header on body scroll
    useEffect(() => {
        const dashContentEl = document.getElementsByClassName('hubDasContent')[0];
        if (dashContentEl) {
            dashContentEl.addEventListener('scroll', () => {
                if (showMobileMenu) {
                    dashContentEl.classList.add('menuOn');
                    dashContentEl.style.overflowY = 'hidden';
                }
                else {
                    dashContentEl.style.overflowY = '';
                    dashContentEl.classList.remove('menuOn');
                }
            });
        }
    }, [showMobileMenu]);
    return (React.createElement(React.Fragment, null,
        React.createElement("header", { className: `bgOverlay hubDasHeader ${showMobileMenu ? 'menu-active' : ''} bgWhite` },
            React.createElement("div", { className: "dasHeaderContainer" },
                React.createElement("div", { className: "wrapperHeader pl-2 pl-lg-0 dis-f a-c pr-2 pr-lg-3 jc-b pos-r w-perc-100" },
                    React.createElement("div", { className: 'header-section dis-fl-row a-c jc-b' },
                        React.createElement("div", { className: `dis-f a-c pl-0 pl-lg-3 logoWrapper w-fit min-w-fix-40 ${(propID === 'sell' || propID === 'buy' || isFlow || isBuyer || windowDimensions.width <= 590) ? '' : 'brdSmallRight brdText100 w-fix-lg-232'} w-fit` }, activeSingleCompany.stub === 'brixel_boutique' && history?.location?.pathname?.toLowerCase()?.includes('packageflow') ? (React.createElement("button", { className: "min-w-88 w-perc-100 h-fix-72 dis-f a-c pr-2", onClick: () => '' },
                            React.createElement("img", { loading: "lazy", className: "max-w-fix-32", src: logoScribble, alt: "Brixel Logo", id: "logo" }))) : (React.createElement("button", { className: "min-w-88 w-perc-100 h-fix-72 dis-f a-c pr-2", onClick: () => history.push(isBuyer ? '/buy' : '/sell') },
                            React.createElement("img", { loading: "lazy", className: `${windowDimensions.width <= 590 ? 'max-w-fix-32' : ''} pos-r cur-poi`, src: windowDimensions.width <= 590 ? logoMobile : logo, alt: "Brixel Logo", id: "logo" })))),
                        showProgressStage && (React.createElement("div", { className: "quickNav mr-a dis-f fsize-300 fsize-sm-400 pl-2 pl-md-4" },
                            React.createElement(ProgressSellerStage, { smallLayout: windowDimensions.width < 1025 ? isFlow : !isFlow, xSmallMobile: windowDimensions.width < 480, stepIndexProgress: history.location.pathname.includes('welcomeSeller') ? 0 : stepIndexProgrss, lang: lang }))),
                        !showMobileMenu && windowDimensions.width <= 1024 && propID !== 'buy' && propID !== 'sell' && !isFlow && history.location.pathname.includes('home') && (React.createElement(BrixelButtonSecondary, { className: "ml-2 delayFadeIn", label: translateTo(isBuyer ? 'Back to Buy' : 'Back to Sell', lang), leftIcon: "arrow-simple-left", onClick: () => {
                                setShowMobileMenu(false);
                                history.push(isBuyer ? '/buy' : '/sell');
                            }, rounded: true, theme: "text", themeSat: 900 }))),
                    activeSingleCompany.stub === 'brixel_boutique' && history?.location?.pathname?.toLowerCase()?.includes('packageflow') && (React.createElement("div", null,
                        React.createElement("img", { src: logoBoutique, alt: "logo boutique" }))),
                    ((propID === 'buy' || propID === 'sell') && !showMobileMenu) && (React.createElement("div", { className: "hubMenu delayFadeIn" },
                        React.createElement("nav", null,
                            React.createElement("ul", null,
                                React.createElement("li", { className: `${propID === 'sell' ? 'active' : ''}` },
                                    React.createElement(Link, { to: "/sell" }, translateTo('Sell', lang))),
                                React.createElement("li", { className: `${propID === 'buy' ? 'active' : ''}` },
                                    React.createElement(Link, { to: "/buy" }, translateTo('Buy', lang))))))),
                    isFlow ? (React.createElement(RightFlowHeader, { onClose: onClose ? () => onClose() : undefined, languages: langMenu })) : (React.createElement("div", { className: "dis-f a-c" },
                        (propID !== 'buy' && propID !== 'sell' && !get(history, 'location.pathname', '').includes('buyer/')) && (React.createElement(React.Fragment, null, windowDimensions.width > 1024 && (React.createElement("div", { className: "ws-nw flex-nowrap a-c txtText900 pb-sm-1 pr-0 pr-sm-1 pr-lg-0 pb-lg-0 pr-lg-4 dis-f" },
                            React.createElement("span", { className: "" }, translateTo('Your Plan:', lang)),
                            has(ownerProperties, 'total') || get(activeSingleProperty, 'id', null) ? (React.createElement("span", { className: "fweight-600 td-u dis-f cur-poi ml-1", onClick: () => onUpgrade() }, translateTo(packageName, lang))) : (React.createElement("span", { className: "fweight-600 dis-f cur-poi txtText200 bgText200" }, translateTo('Loading...', lang))))))),
                        windowDimensions.width > 1024 && (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "dis-f-md a-c cur-poi pos-r zIndex0", onClick: () => setShowProfileMenu(!showProfileMenu), ref: profileMenu },
                                React.createElement(AccountDropdown, null)))),
                        windowDimensions.width <= 1024 && (React.createElement("div", { className: "ml-1 ml-sm-2 h-fix-72 dis-f a-c" },
                            React.createElement("button", { type: "button", className: "brixel-page-toggle pos-r zIndex5", onClick: () => toggleMobileMenu() },
                                React.createElement("span", null),
                                React.createElement("span", null),
                                React.createElement("span", null)),
                            showMobileMenu && (React.createElement("div", { className: `mobile-menu w-perc-100 dis-fl-col a-c zIndex3 ${showMobileMenu ? 'active' : ''}`, style: { height: showMobileMenu ? windowDimensions.height - 72 : '0px' } },
                                React.createElement("div", { className: "links dis-fl-col as-b jc-fe w-perc-100 ov-a" },
                                    React.createElement("hr", { className: "lighter" }),
                                    React.createElement("div", { className: "mini-menu whiteBg dis-fl-col px-3 px-lg-0" },
                                        (propID === 'sell' || propID === 'buy') ? (React.createElement("div", { className: "dis-fl-col a-t pos-r p-3" },
                                            React.createElement(Link, { className: `${propID === 'sell' ? 'txtText900' : 'txtText200'} link fweight-600 fsize-600 mb-2`, to: "/sell" }, translateTo('Sell', lang)),
                                            React.createElement(Link, { className: `${propID === 'buy' ? 'txtText900' : 'txtText200'} link fweight-600 fsize-600`, to: "/buy" }, translateTo('Buy', lang)))) : (React.createElement(MenuSidebar, { activePackageName: propID && userType === 'seller' ? translateTo(packageName, lang) : undefined, isBuyer: isBuyer, onClickLink: () => setShowMobileMenu(false) })),
                                        React.createElement("hr", { className: 'lighter' }),
                                        (propID !== 'sell' && propID !== 'buy' && !isBuyer) && (React.createElement("div", null,
                                            React.createElement("div", { className: "px-3 py-4 ws-nw flex-nowrap dis-f a-c txtText900" },
                                                React.createElement("span", null, translateTo('Your Plan:', lang)),
                                                React.createElement("span", { className: "fweight-400 td-u txtGreen400 dis-f cur-poi ml-1", onClick: () => onUpgrade() }, translateTo(packageName, lang))),
                                            React.createElement("hr", { className: 'lighter' }))),
                                        React.createElement("div", { className: "py-3 px-3 pos-r" },
                                            React.createElement("div", { className: "dis-f mb-2" },
                                                React.createElement(BrixelSelect, { options: langMenu, input: {
                                                        value: lang,
                                                        name: 'lang',
                                                        onChange: (val) => newLang(val),
                                                    } })),
                                            React.createElement("div", { className: "dis-fl-col a-t pos-r" },
                                                React.createElement("a", { className: "link txtText900 fweight-400 fsize-400 mb-2", href: `${baseByData?.loginBasePath}/account/preferences?url=${get(window, 'location.href', '')}` }, translateTo('Your account', lang)),
                                                React.createElement("a", { className: "link txtText900 cur-poi fweight-400 fsize-400 mb-2", onClick: () => { openMobileSupport(); } }, translateTo('Contact support', lang)),
                                                React.createElement("a", { className: "link txtRed400 fweight-400 fsize-400", href: `${baseByData?.loginBasePath}/logout?url=${get(window, 'location.href', '')}` }, translateTo('Logout', lang))))))))))))))),
        windowDimensions.width <= 1024 && !history.location.pathname.includes('home') && !history.location.pathname.includes('/buyer/') && getCurrentRoute().title && getCurrentRoute().title !== 'Prospects' && !history.location.pathname.includes('closing/') && !history.location.pathname.includes('/offer') && !isFlow && !isSecondLevelClass && (React.createElement("div", { className: "mobileTitle dis-f jc-b a-c px-2 py-1" }, getCurrentRoute().title && (React.createElement(SectionMobileTitle, { title: getCurrentRoute().title }))))));
}
const mapStateToProps = (state) => ({
    activeCompanyPackages: get(state, 'companies.activeSingleCompany.servicePackages', []),
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
    formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
    lang: get(state, 'common.language', 'en'),
    languages: get(state, 'common.languages', []),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    ownerProperties: get(state, 'market.ownerProperties', {}),
    packagesProperty: get(state, 'property.activeSinglePropertyPackage', []),
    property: get(state, 'property.activeSingleProperty', {}),
    userType: get(state, 'user.userTypes', ''),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    destroyForm() {
        dispatch(destroy('Property'));
    },
    handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
    handleGetPackagesProperty: bindActionCreators(getPackagesProperty, dispatch),
    handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
    handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
    handleSetActiveSinglePropertyActivePackage: bindActionCreators(setActiveSinglePropertyActivePackage, dispatch),
    handleSetLanguage: bindActionCreators(setLanguage, dispatch),
    handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
