import { BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setHistory, setModal, setSplashType } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { getBuyerProperties } from '../../actions/MarketActions';
import { setActiveMarketOverlayProperty, setEstimation } from '../../actions/PropertyActions';
import MarketCard from '../../components/Cards/MarketCard';
import Pagination from '../../components/Pagination';
import SearchProfileField from '../../components/SearchProfileField';
import SplashScreen from '../../components/SplashScreen';
import searchProfileDeskImg from '../../images/Market/searchProfileDesk.svg';
import searchProfileMobileImg from '../../images/Market/searchProfileMobile.svg';
import { QuestionsList } from '../../resources/Flows/onBoardingBuyer';
import { getCookie, setCookie } from '../../utils/helpers';
import { titleSearchProfile } from '../../utils/titleCreationSearchProfile';
import translateTo from '../../utils/translation';
import LearnMoreListingsProperty, { stepLearnMoreListingsProperty } from './Buyer/LearnMoreListingsProperty';
const MarketCategoryListBuyer = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSearchProfile, buyerProperties, 
    // filterPropType = [],
    handleGetActiveSingleCompany, handleSetModal, lang, loggedInUser, modalLearnMoreSrchPrf, setSplashScreen, skeleton, splashScreenType, userSearchProfiles, windowDimensions, } = props;
    // STATE
    const [fieldsSearchProfile, setFieldsSearchProfile] = useState([]);
    // const [activeTab, setActiveTab] = useState(filterPropType[0]);
    const [stepLearnMoreSrchPrf, setStepLearnMoreSrchPrf] = useState(1);
    const [changedPage, setChangedPage] = useState(0);
    // URL PARAMS
    const cat = get(match, 'cat', null);
    const page = get(match, 'page', 0);
    useEffect(() => {
        const fields = [...fieldsSearchProfile];
        QuestionsList(lang, 'searchProfile', () => '', 'SearchProfile').forEach((inputs) => {
            if (inputs.inputs) {
                inputs.inputs.forEach((field) => {
                    if (field.name && field.name !== 'location.countryCode') {
                        if (field.name.includes('location'))
                            fields.push('location');
                        else if (!field.name.includes('register'))
                            fields.push(field.name);
                    }
                });
            }
        });
        setFieldsSearchProfile(fields);
    }, []);
    useEffect(() => {
        if (get(loggedInUser, 'id', null)) {
            let cmpID;
            if (get(loggedInUser, 'company.id', null))
                cmpID = get(loggedInUser, 'company.id', '');
            else if (loggedInUser.companies)
                cmpID = loggedInUser.companies[0];
            handleGetActiveSingleCompany({ id: cmpID });
        }
    }, [loggedInUser.id]);
    // Update market card when bestimate changes
    useEffect(() => {
        if (getCookie('brixelSplashHome') === 'buyerWelcome') {
            setSplashScreen('buyerWelcome');
        }
    }, [getCookie('brixelSplashHome')]);
    const onCloseWelcome = () => {
        setCookie('brixelMarketWelcome', true);
        setCookie('brixelSplashHome', null);
        setSplashScreen('');
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
        if (changedPage > 0 && !skeleton?.buyerProperties) {
            setTimeout(() => {
                const element = document.getElementById('searchProfileProperties');
                if (element) {
                    const rect = element.offsetTop;
                    const scrollEl = document.getElementsByClassName('content')[0];
                    scrollEl.scroll({
                        behavior: 'smooth',
                        left: 0,
                        top: rect - 100,
                    });
                }
            }, 100);
        }
    }, [changedPage, skeleton]);
    // useEffect(() => {
    //   const fltProp = filterPropType.find((flt) => flt.value === cat);
    //   if (fltProp) setActiveTab(fltProp);
    // }, [cat]);
    useEffect(() => {
        if (modalLearnMoreSrchPrf.multiActions) {
            const NextLabel = stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? translateTo('Got it', lang) : translateTo('Next', lang);
            const NextIcon = stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? 'tick' : 'arrow-right';
            const step1Translate = translateTo('Step', lang);
            const step2Translate = translateTo('of', lang);
            handleSetModal({
                ...modalLearnMoreSrchPrf,
                component: React.createElement(LearnMoreListingsProperty, { lang, step: stepLearnMoreSrchPrf }),
                title: `${step1Translate} ${stepLearnMoreSrchPrf} ${step2Translate} ${stepLearnMoreListingsProperty}`,
                multiActions: [
                    {
                        ...modalLearnMoreSrchPrf.multiActions[0],
                        name: stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? translateTo('Restart', lang) : translateTo('Skip', lang),
                        rightIcon: stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? 'restart' : '',
                        func: () => {
                            setStepLearnMoreSrchPrf(1);
                            handleSetModal({});
                        },
                    },
                    {
                        ...modalLearnMoreSrchPrf.multiActions[1],
                        disabled: stepLearnMoreSrchPrf === 1,
                        btnType: windowDimensions.width < 768 ? 'Icon' : 'Secondary',
                        leftIcon: windowDimensions.width < 768 ? 'arrow-left' : '',
                        name: windowDimensions.width < 768 ? '' : translateTo('Back', lang),
                        func: () => {
                            if (stepLearnMoreSrchPrf > 1 && stepLearnMoreSrchPrf <= stepLearnMoreListingsProperty)
                                setStepLearnMoreSrchPrf((prev) => prev - 1);
                        },
                    },
                    {
                        ...modalLearnMoreSrchPrf.multiActions[2],
                        leftIcon: windowDimensions.width < 768 ? NextIcon : '',
                        rightIcon: NextIcon,
                        btnType: windowDimensions.width < 768 ? 'Icon' : 'Primary',
                        name: windowDimensions.width < 768 ? '' : NextLabel,
                        func: () => {
                            if (stepLearnMoreSrchPrf < stepLearnMoreListingsProperty)
                                setStepLearnMoreSrchPrf((prev) => prev + 1);
                            else {
                                setStepLearnMoreSrchPrf(1);
                                handleSetModal({});
                            }
                        },
                    },
                ],
            });
        }
    }, [stepLearnMoreSrchPrf, windowDimensions]);
    const onLearnMore = () => {
        const NextLabel = stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? translateTo('Got it', lang) : translateTo('Next', lang);
        const NextIcon = stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? 'tick' : 'arrow-right';
        const step1Translate = translateTo('Step', lang);
        const step2Translate = translateTo('of', lang);
        const title = `${step1Translate} 1 ${step2Translate} ${stepLearnMoreListingsProperty}`;
        handleSetModal({
            className: 'modal-learn-more',
            bodyClassColor: 'white',
            bodyInnerClass: 'h-perc-100',
            layout: 'large',
            onClose: () => {
                setStepLearnMoreSrchPrf(1);
                handleSetModal({});
            },
            small: true,
            component: React.createElement(LearnMoreListingsProperty, { lang, step: stepLearnMoreSrchPrf }),
            state: true,
            titleTop: true,
            titleTopClass: 'ml-2 ml-sm-0 p-sm-0',
            title: title,
            multiActions: [
                {
                    round: true,
                    clr: 'text',
                    rigthIcon: stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? 'restart' : '',
                    btnType: 'Tertiary',
                    className: 'mr-a ml-0',
                    name: stepLearnMoreSrchPrf === stepLearnMoreListingsProperty ? translateTo('Restart', lang) : translateTo('Skip', lang),
                    func: () => {
                        setStepLearnMoreSrchPrf(1);
                        handleSetModal({});
                    },
                },
                {
                    showBrd: true,
                    bgTransparent: true,
                    round: true,
                    clr: 'primary',
                    btnType: windowDimensions.width < 768 ? 'Icon' : 'Secondary',
                    className: 'mr-1',
                    name: windowDimensions.width < 768 ? '' : translateTo('Back', lang),
                    leftIcon: windowDimensions.width < 768 ? 'arrow-left' : '',
                    disabled: stepLearnMoreSrchPrf === 1,
                    func: () => {
                        if (stepLearnMoreSrchPrf > 1 && stepLearnMoreSrchPrf <= stepLearnMoreListingsProperty)
                            setStepLearnMoreSrchPrf((prev) => prev - 1);
                    },
                },
                {
                    round: true,
                    clr: 'primary',
                    name: windowDimensions.width < 768 ? '' : NextLabel,
                    rightIcon: NextIcon,
                    leftIcon: windowDimensions.width < 768 ? NextIcon : '',
                    btnType: windowDimensions.width < 768 ? 'Icon' : 'Primary',
                    func: () => {
                        if (stepLearnMoreSrchPrf < stepLearnMoreListingsProperty)
                            setStepLearnMoreSrchPrf((prev) => prev + 1);
                        else
                            handleSetModal({});
                    },
                },
            ],
        });
    };
    //
    // const onChangeFilter = (val) => {
    //   setActiveTab(val);
    //   history.push(`/buy/searchProfile/${val.value}/1`);
    // }
    return (React.createElement(React.Fragment, null,
        React.createElement(Suspense, { fallback: "" },
            React.createElement("div", { className: "buyerMarket" },
                splashScreenType === 'buyerWelcome' && (React.createElement(SplashScreen, { className: "result-popup centered", closeOutside: false },
                    React.createElement("div", { className: "dis-f jc-fe mb-2" },
                        React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", icon: "close-small", onClick: () => onCloseWelcome() })),
                    React.createElement("div", { className: "dis-fl-col jc-c a-c pb-2" },
                        React.createElement("h3", null, translateTo('Welcome 🖐', lang)),
                        React.createElement("span", { className: "txtText600 pt-2 pb-5" }, translateTo('This is our Brixel market. A place where you can do great things.', lang)),
                        React.createElement("div", { className: "mb-5" },
                            React.createElement("div", { className: "dis-f mb-2" },
                                React.createElement("div", { className: "dis-f a-c min-w-fix-64 jc-fe" },
                                    React.createElement(BrixelIcon, { icon: "favorite-fill", color: "red" })),
                                React.createElement("span", { className: "max-w-fix-424 txtText900 pl-2" }, translateTo('Manage your favorites and buy your new home directly on Brixel.', lang))),
                            React.createElement("div", { className: "dis-f mb-2" },
                                React.createElement("div", { className: "dis-f a-c min-w-fix-64 jc-fe" },
                                    React.createElement("span", { className: "category-tag bgPrimary300" }, translateTo('Pre', lang))),
                                React.createElement("span", { className: "max-w-fix-424 txtText900 pl-2" }, translateTo('Discover exclusive properties which are not on the market yet, but waiting for your first move.', lang))),
                            React.createElement("div", { className: "dis-f" },
                                React.createElement("div", { className: "dis-f a-c min-w-fix-64 jc-fe" },
                                    React.createElement("span", { className: "category-tag bgRed400" }, translateTo('Premium', lang))),
                                React.createElement("span", { className: "max-w-fix-424 txtText900 pl-2" }, translateTo('Explore our Premium properties with 3D tour, detailed documentation and verified informations.', lang)))),
                        React.createElement(BrixelButtonPrimary, { label: translateTo('ok, got it!', lang), rounded: true, onClick: () => onCloseWelcome() })))),
                React.createElement("div", { className: "bgGreen50 mt-3 min-h-fix-320" }, !userSearchProfiles ? (React.createElement("div", { className: "container px-0 py-10" },
                    React.createElement("div", { className: "w-perc-80 ov-h brdRadius h-fix-md-152 mb-4 dis-f" },
                        React.createElement("div", { className: "ml-md-4 ml-2 h-perc-100 dis-fl-col w-perc-100 py-2" },
                            React.createElement("p", { className: "h-fix-40 skeletonBgInner w-perc-70" }, " "),
                            React.createElement("p", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" }, " "),
                            React.createElement("p", { className: "h-fix-16 mt-1 skeletonBgInner w-perc-100" }, " "),
                            React.createElement("p", { className: "h-fix-40 mt-2 skeletonBgInner w-perc-80" }, " "))))) : (React.createElement("div", { className: windowDimensions.width <= 768 && !activeSearchProfile?.id ? '' : 'container' }, activeSearchProfile?.id ? (React.createElement("div", { className: "dis-f jc-b-lg a-c py-10" },
                    React.createElement("div", { className: "w-perc-100 max-w-fix-880 ml-a mr-a ta-c" },
                        React.createElement(Link, { className: "fweight-600 fsize-300 td-u", to: '/buy/searchProfile/list' }, translateTo('Manage Search Profiles', lang)),
                        React.createElement("h3", { className: "txtBlue700 fweight-600 mt-4" }, get(activeSearchProfile, 'name', null) || titleSearchProfile(activeSearchProfile, lang)),
                        React.createElement("p", { className: "mt-1 fsize-300 txtText700" }, translateTo('Search profiles allow you to keep track of the properties that match your needs.', lang)),
                        React.createElement("div", { className: "dis-f flex-wrap a-t jc-c mt-4" },
                            fieldsSearchProfile.map((field, index) => (React.createElement(React.Fragment, { key: `search${index.toString()}` }, field !== 'isDefault' && field !== 'name' && (React.createElement(React.Fragment, null,
                                React.createElement(SearchProfileField, { activeSingleCompany: activeSingleCompany, onClick: () => history.push(`/buy/searchProfile/list/edit/${activeSearchProfile.id}`, { state: { url: `/buy/searchProfile/${cat}/${page}` } }), searchProfile: activeSearchProfile, field: field, lang: lang })))))),
                            React.createElement(BrixelButtonIcon, { icon: "edit-setting", ghost: true, className: "bgWhite", onClick: () => history.push(`/buy/searchProfile/list/edit/${activeSearchProfile.id}`, { state: { url: `/buy/searchProfile/${cat}/${page}` } }) }))))) : (React.createElement("div", { className: "dis-f jc-b-lg a-c flex-wrap" },
                    windowDimensions.width <= 768 && (React.createElement("div", { className: "w-100-vw" },
                        React.createElement("img", { width: "100%", src: searchProfileMobileImg, alt: "Search Profile" }))),
                    React.createElement("div", { className: "max-w-fix-344 w-perc-100 pb-8 pb-md-0 ta-c ta-l-md m-a m-md-0 mt-8-neg mt-md-0-neg" },
                        React.createElement("h3", { className: "txtGreen700 fweight-600 mt-4 mt-md-0 mb-1" }, translateTo('Create your personalized Search', lang)),
                        React.createElement("p", { className: "fsize-300 txtText700" }, translateTo('You can create multiple Search Profiles to apply different filters and find the properties that best match your needs.', lang)),
                        React.createElement(BrixelButtonPrimary, { onClick: () => history.push('/buy/searchProfile/list/create'), className: "mt-3 mx-a mx-md-0", rounded: true, leftIcon: "plus", label: translateTo('Create search profile', lang) })),
                    windowDimensions.width > 768 && (React.createElement("div", { className: "w-perc-50" },
                        React.createElement("img", { className: "min-h-fix-320", src: searchProfileDeskImg, alt: "Search Profile" })))))))),
                React.createElement("div", { className: "container", id: "searchProfileProperties" },
                    React.createElement("div", { className: "dis-fl-col dis-fl-row-sm a-c jc-c jc-b-sm my-5" },
                        React.createElement("div", { className: "ta-l mb-2 mb-sm-0 w-perc-100" },
                            React.createElement("h4", { className: "fweight-600 dis-f jc-b jc-fs-sm a-c" },
                                React.createElement("div", { className: "dis-f" },
                                    React.createElement("span", { className: "mr-1" }, translateTo('Results', lang)),
                                    React.createElement("span", null,
                                        "(",
                                        get(buyerProperties, 'total', 0),
                                        ")")),
                                buyerProperties.total > 0 && (React.createElement("div", { className: "dis-f cur-poi", onClick: () => onLearnMore() },
                                    React.createElement(BrixelIcon, { color: "green", className: "ml-1", icon: "info" }),
                                    React.createElement("span", { className: "txtGreen400 fsize-300 fweight-500 td-u pl-1" }, translateTo('Learn more', lang))))),
                            get(buyerProperties, 'total', null) !== null && (React.createElement(React.Fragment, null, buyerProperties.total === 0 && (React.createElement("div", null,
                                React.createElement("p", { className: "txtText700 fSizePx14" },
                                    React.createElement("span", null, translateTo('Properties could already be for sale.', lang)),
                                    React.createElement("span", null,
                                        React.createElement("button", { className: "ml-1 txtGreen400 td-u fweight-600 no-wrap", onClick: () => onLearnMore() }, translateTo('Learn more.', lang)))))))))),
                    React.createElement("div", { className: "row-cols-1-gut-3 row-cols-sm-2-gut-3 row-cols-md-3-gut-3" }, skeleton.buyerProperties === 'CardImageTextVertical' ? (React.createElement(React.Fragment, null, [...Array(3)].map((_x, i) => (React.createElement("div", { key: `skeleton${i.toString()}`, className: "w-perc-100 ov-h brdRadius pb-2" },
                        React.createElement("div", { className: "h-perc-100 dis-fl-col w-perc-100" },
                            React.createElement("div", { className: "h-fix-208 skeletonBgInner w-perc-100" }),
                            React.createElement("div", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" }),
                            React.createElement("div", { className: "h-fix-16 mt-1 skeletonBgInner w-perc-100" }),
                            React.createElement("div", { className: "h-fix-40 mt-2 skeletonBgInner w-perc-100" }))))))) : (React.createElement(React.Fragment, null, get(buyerProperties, 'data', []).map((property, index) => (React.createElement(MarketCard, { layout: "singleOwnCard", type: "premium", key: `nmCrd_${index.toString()}`, item: property, lang: lang })))))),
                    React.createElement("div", { className: "pb-8" },
                        React.createElement(Pagination, { disableScrollTop: true, className: "mt-5 pb-10", totalItems: buyerProperties.total || 0, itemsPerPage: 9, onChangePage: () => setChangedPage(changedPage + 1), activePage: (+page - 1) * 9, paginate: (_resultsPerPage, _skip, pageNumber) => history.push(`/buy/searchProfile/${cat}/${pageNumber}`), lang: lang })))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSearchProfile: get(state, 'user.activeSearchProfile', null),
    buyerProperties: get(state, 'market.buyerProperties', {}),
    estimation: get(state, 'property.estimation', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    modalLearnMoreSrchPrf: get(state, 'common.modal', {}),
    ownerEstimations: get(state, 'market.ownerEstimations', {}),
    preMarketStats: get(state, 'market.preMarketStats', {}),
    premiumEuropeProperties: get(state, 'market.premiumEuropeProperties', {}),
    premiumProperties: get(state, 'market.premiumProperties', {}),
    skeleton: get(state, 'common.skeleton', {}),
    splashScreenType: get(state, 'common.splashScreenType', ''),
    userSearchProfiles: get(state, 'user.userSearchProfiles', []),
    windowDimensions: get(state, 'common.windowDimensions', {}),
    wishlistProperties: get(state, 'market.wishlistProperties', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetActiveBuyerProperties: bindActionCreators(getBuyerProperties, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
    handleSetHistory: bindActionCreators(setHistory, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
    setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
    setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketCategoryListBuyer);
