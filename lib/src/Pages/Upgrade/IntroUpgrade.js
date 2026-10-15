import React, { useEffect, useRef, useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelButtonText, BrixelIcon, Helpers, } from '@brixel-io/brixel-components';
import { SkeletonPackages } from '@brixel-io/brixel-components/dist/skeleton';
import get from 'lodash/get';
import set from 'lodash/set';
import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { getActiveSingleCompany, getActiveSingleCompanyPackages } from '../../actions/CompanyActions';
import { getPackageProperty } from '../../actions/PropertyActions';
import lazyWithRetry from '../../components/LazyWithRetry';
import EmptyHubImg from '../../images/emptyHub.svg';
import Testimonial1CH from '../../images/getstarted/testimonial-1_CH.jpeg';
import Testimonial2CH from '../../images/getstarted/testimonial-2_CH.jpeg';
import Testimonial3CH from '../../images/getstarted/testimonial-3_CH.jpeg';
import BookOnlineImg from '../../images/Upgrade/bookOnline.svg';
import CallUsImg from '../../images/Upgrade/callUs.svg';
import NotNowImg from '../../images/Upgrade/notNow.svg';
import WrireUsImg from '../../images/Upgrade/writeUs.svg';
import { CompaniesData } from '../../resources/Companies/Companies';
import translateTo from '../../utils/translation';
const PackagesComparePlans = lazyWithRetry(() => import('../../components/PackagesComparePlans'));
const BoxTrialTestDirve = lazyWithRetry(() => import('../../components/BoxTrialTestDirve'));
const IntroUpgrade = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleCompanyPackages, activeSingleProperty, companyListings, handleGetActiveCompanyPackages, activeSinglePropertyPackage, handleGetActiveSingleCompany, lang, loggedInUser, ownerProperties, packages, scrollHash, } = props;
    // STATE
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [packageName, setPackageName] = useState();
    const propID = get(match, 'propID', null);
    const [activeCompanyData, setActiveCompanyData] = useState({});
    // SLIDER
    const sliderInstance = useRef(null);
    const settingSlider = {
        dots: false,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 4000,
        speed: 500,
        slidesToShow: 3,
        arrows: false,
        slidesToScroll: 3,
        draggable: false,
        centerPadding: '8px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    swipeToSlide: true,
                    draggable: true,
                },
            },
        ],
    };
    useEffect(() => {
        if (CompaniesData[activeSingleCompany.stub])
            setActiveCompanyData(CompaniesData[activeSingleCompany.stub].footer);
        else
            setActiveCompanyData(CompaniesData.default.footer);
    }, [activeSingleCompany.id]);
    const bookNow = () => {
        if (activeSingleProperty.id) {
            localStorage.setItem('backUrl', history.location.pathname);
            history.push(`/${activeSingleProperty.id}/trialRequest`);
        }
    };
    const scrollTo = (id) => {
        document.body.classList.add('scrollSmooth');
        setTimeout(() => {
            const scrollPage = document.getElementsByClassName('flowScrollWrap')[0];
            const scrollEl = document.getElementById(id);
            if (scrollPage && scrollEl) {
                scrollPage.scrollTop = scrollEl.getBoundingClientRect().top + scrollPage.scrollTop;
            }
        }, 100);
    };
    useEffect(() => {
        if (propID === 'company' && loggedInUser.id) {
            const company = get(loggedInUser, 'company.id', loggedInUser.company) || loggedInUser.companies[0];
            handleGetActiveSingleCompany({ id: company });
        }
    }, [propID, loggedInUser.id]);
    useEffect(() => {
        if (get(activeSingleProperty, 'id', null)) {
            handleGetActiveCompanyPackages({ id: get(activeSingleProperty, 'company.id', activeSingleProperty.company), smallLoader: 'getPackages' });
        }
    }, [activeSingleProperty.id]);
    useEffect(() => {
        const basicPackage = activeSingleCompanyPackages.find((pkg) => pkg.type === 'basic');
        if (activeSinglePropertyPackage && packages.length > 0) {
            const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
            const activePackage = activeSinglePropertyPackage.find((item) => item.started);
            if (activePackage) {
                setPackageName({
                    name: get(activePackage, 'servicePackage.name', ''),
                    type: get(activePackage, 'servicePackage.type', ''),
                    stub: get(activePackage, 'servicePackage.stub', ''),
                });
            }
            else if (sortedPackage[0]) {
                setPackageName({
                    name: get(sortedPackage[0], 'servicePackage.name', ''),
                    type: get(sortedPackage[0], 'servicePackage.type', ''),
                    stub: get(sortedPackage[0], 'servicePackage.stub', ''),
                });
            }
            else {
                setPackageName(basicPackage);
            }
            if (scrollHash)
                scrollTo(scrollHash.replace('#', ''));
        }
    }, [activeSinglePropertyPackage, packages]);
    useEffect(() => {
        // TODO check servicePackageType error
        let filtPkg = packages.filter((pkg) => pkg.availableToCustomer);
        filtPkg.map((pkg) => set(pkg, 'price.total', +get(pkg, 'price.total', 0)));
        filtPkg = orderBy(filtPkg, ['price.total'], ['asc']);
        setFilteredPackages(filtPkg);
    }, [packages]);
    const openNewFlow = (url) => {
        localStorage.setItem('backUrlBis', `/${activeSingleProperty.id}/upgrade`);
        history.push(url);
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
        document.body.classList.add('packageBody');
        return () => {
            //  clean up
            document.body.classList.remove('packageBody');
        };
    }, []);
    const partners = get(activeSingleCompany, 'stub') === 'ubs' || get(activeSingleCompany, 'stub') === 'baloise';
    return (React.createElement("main", { id: "rewards", className: "introScanFlow pt-2 pt-sm-4 pb-2 pb-sm-4 h-perc-100 txtText900" },
        React.createElement("section", { className: "max-w-fix-1200 intro container" },
            React.createElement("h2", { className: "mb-3 mb-lg-5 fsize-600 fsize-md-800 fweight-600" },
                React.createElement("span", null, translateTo('Boost your private sale with an upgrade.', lang)),
                React.createElement("br", null),
                React.createElement("span", null, translateTo('by Brixel.', lang)))),
        React.createElement("section", { className: "max-w-fix-1200 container packages py-6" },
            filteredPackages.length === 0 ? (React.createElement("div", { className: "dis-fl-col dis-fl-row-md pb-3 jc-c a-c" },
                React.createElement(SkeletonPackages, { className: "mr-lg-2 w-perc-100 max-w-fix-400", type: "big" }),
                partners && (React.createElement(SkeletonPackages, { className: "w-perc-100 max-w-fix-400", type: "big" })),
                React.createElement(SkeletonPackages, { className: "ml-lg-2 w-perc-100 max-w-fix-400", type: "big" }))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "packageWrap a-s partnerPackage dis-fl-col dis-fl-row-lg pb-3 jc-c" },
                    React.createElement(React.Fragment, null, filteredPackages.map((pkg, i) => (React.createElement("div", { className: `packageBox bgWhite mb-2 mb-lg-0 w-perc-100 ${pkg.type} ${partners ? 'partners' : ''} ${partners && i === 1 ? 'packageTwo' : ''} dis-fl-col jc-b pos-r`, key: `fltPkg_${i.toString()}` },
                        React.createElement("div", { className: "p-4 pb-4 pb-sm-5" },
                            React.createElement("div", { className: "dis-f jc-b a-c" },
                                React.createElement("h5", { className: `fweight-600 fSizePx18 ${i === 1 ? 'txtGreen400' : ''}` }, pkg.name),
                                !partners && get(pkg, 'stub', '') === get(packageName, 'stub', '') && (React.createElement("div", { className: "bgText800 py-small-4 px-1 brdRadius txtWhite" }, translateTo('Your plan', lang)))),
                            pkg.description && (React.createElement("p", { className: "mt-4 txtText900 min-h-fix-md-80" }, translateTo(pkg.description, lang))),
                            get(pkg, 'price.total', 0) > 0 ? (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "min-h-fix-sm-80 dis-fl-col jc-fe my-1" },
                                    get(pkg, 'price.discountTotal', 0) > 0 && (React.createElement(React.Fragment, null,
                                        React.createElement("span", { className: "dis-b txtText400 fsize-300 mt-2 mt-sm-0 lh-in" },
                                            React.createElement("span", { className: "" }, translateTo('Original price', lang)),
                                            React.createElement("span", { className: "td-lt ml-2 dis-ib" },
                                                React.createElement("span", null,
                                                    get(pkg, 'price.currency', ''),
                                                    " "),
                                                React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))))))),
                                    React.createElement("h3", { className: "dis-f fweight-600 fsize-800" },
                                        React.createElement("span", null,
                                            React.createElement("span", { className: "mr-1" }, get(pkg, 'price.currency', '')),
                                            get(pkg, 'price.discountTotal', 0) > 0 ? (React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.discountTotal', 0), get(pkg, 'price.currency', '')))) : (React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))))),
                                        React.createElement("span", { className: "fsize-300 pl-1 mt-a dis-ib mb-small-4" }, translateTo('incl. VAT', lang)))),
                                partners && (React.createElement(BrixelButtonPrimary, { rounded: true, fullWidth: true, label: translateTo('Try now for free', lang), onClick: () => openNewFlow(`/${activeSingleProperty.id}/trialRequest`) })))) : (React.createElement("h3", { className: "fweight-600 h-fix-80 mb-1 dis-f a-b fsize-800" }, translateTo('Free', lang))),
                            React.createElement("ul", { className: "checked mt-4 txtText900" }, pkg.details && get(pkg, 'details', []).map((detail, f) => (React.createElement("li", { key: `pkgDtl_${f.toString()}`, className: i > 0 && f === 0 ? 'fweight-600' : '' }, translateTo(detail.description, lang)))))),
                        partners && get(pkg, 'price.total', 0) > 0 && (React.createElement("div", { className: "p-4 pb-4 pb-sm-5 bgGreen50 dis-fl-col jc-c pos-r" },
                            React.createElement(BrixelIcon, { icon: "plus", color: "green", className: "bgWhite pos-a-sm y-c w-fix-48 h-fix-48 large ml-sm-3-neg mobilePos", rounded: true }),
                            get(activeSingleCompany, 'stub') === 'ubs' && (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "fweight-600 fsize-500 dis-b" }, translateTo('Exclusive benefits for UBS clients', lang)),
                                React.createElement("span", { className: "fweight-600 mt-1 dis-b p-2 bgBlue50" }, translateTo('You only pay if the property is sold.', lang)),
                                React.createElement("ul", { className: "checked mt-2 txtText900" },
                                    React.createElement("li", null, translateTo('Support in terminating or transferring the mortgage', lang)),
                                    React.createElement("li", null, translateTo('Pension and investment advice', lang)),
                                    React.createElement("li", null, translateTo('Advice on the tax implications of selling real estate', lang)),
                                    React.createElement("li", null, translateTo('Information on inheritance and estate planning', lang)),
                                    React.createElement("li", null, translateTo('Checking the selling price', lang))),
                                React.createElement("div", null,
                                    React.createElement("span", { className: "dis-b ml-4 mt-4 txtText400 fsize-300 mb-1" }, translateTo('Your partner for financial questions', lang)),
                                    get(activeCompanyData, 'logos', []).length > 0 && (React.createElement("div", { className: "dis-f ml-4" }, get(activeCompanyData, 'logos', []).map((logo, x) => (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "h-fix-24 dis-b" },
                                            React.createElement("img", { loading: "lazy", key: `logo${x.toString()}`, src: logo, alt: `${activeSingleCompany.name} logo ${x}`, className: `${x > 0 ? 'ml-2 brdSmallLeft brdText200 pl-2' : ''} h-perc-100` })))))))))),
                            get(activeSingleCompany, 'stub') === 'baloise' && (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "fweight-600 fsize-500 dis-b" }, translateTo('Exclusive benefits for Baloise clients', lang)),
                                React.createElement("span", { className: "fweight-600 mt-1 dis-b p-2 bgBlue50" }, translateTo('You only pay if the property is sold.', lang)),
                                React.createElement("ul", { className: "checked mt-2 txtText900" },
                                    React.createElement("li", null, translateTo('Assistance with resolving or transferring the mortgage', lang)),
                                    React.createElement("li", null, translateTo('Baloise gives you as a customer CHF 2,000 as a gift', lang)),
                                    React.createElement("li", null, translateTo('Pension and investment advice', lang)))))))))))),
                get(activeSingleCompany, 'stub') === 'ubs' && get(activeSingleCompany, 'stub') === 'baloise' && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "hide packageWrap a-s dis-fl-col dis-fl-row-lg pb-3 jc-c" },
                        React.createElement(React.Fragment, null, filteredPackages.map((pkg, i) => (React.createElement("div", { className: `packageBox bgWhite mb-2 mb-lg-0 w-perc-100 ${pkg.type} ${i === 1 ? 'packageTwo' : ''} dis-fl-col jc-b pos-r`, key: `fltPkg_${i.toString()}` },
                            React.createElement("div", { className: "p-4 pb-4 pb-sm-5" },
                                React.createElement("div", { className: "dis-f jc-b a-c" },
                                    React.createElement("h5", { className: `fweight-600 fSizePx18 ${i === 1 ? 'txtGreen400' : ''}` }, pkg.name)),
                                React.createElement("p", { className: "mt-4 txtText900 min-h-fix-md-80" }, translateTo(pkg.description || '', lang)),
                                get(pkg, 'price.total', 0) > 0 ? (React.createElement(React.Fragment, null,
                                    React.createElement("div", { className: "min-h-fix-sm-80 dis-fl-col jc-fe my-1" },
                                        get(pkg, 'price.discountTotal', 0) > 0 && (React.createElement(React.Fragment, null,
                                            React.createElement("span", { className: "dis-b txtText400 fsize-300 mt-2 mt-sm-0 lh-in" },
                                                React.createElement("span", null, translateTo('Original price', lang)),
                                                React.createElement("span", { className: "td-lt ml-2 dis-ib" },
                                                    React.createElement("span", { className: "mr-1" }, get(pkg, 'price.currency', '')),
                                                    React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))))))),
                                        React.createElement("h3", { className: "fweight-600 fsize-800" },
                                            React.createElement("span", null,
                                                React.createElement("span", { className: "mr-1" }, get(pkg, 'price.currency', '')),
                                                get(pkg, 'price.discountTotal', 0) > 0 ? (React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.discountTotal', 0), get(pkg, 'price.currency', '')))) : (React.createElement("span", null, Helpers.formatNumberValue(get(pkg, 'price.total', 0), get(pkg, 'price.currency', ''))))),
                                            React.createElement("sup", { className: "fsize-300 pl-1" }, translateTo('incl. VAT', lang)))),
                                    React.createElement(BrixelButtonPrimary, { rounded: true, fullWidth: true, label: translateTo('Try now for free', lang), onClick: () => scrollTo('#') }))) : (React.createElement(React.Fragment, null,
                                    React.createElement("h3", { className: "fweight-600 h-fix-80 mb-1 dis-f a-b" }, translateTo('Free', lang)),
                                    React.createElement(BrixelButtonSecondary, { rounded: true, theme: "text", themeSat: 900, fullWidth: true, label: translateTo('Try now for free', lang), onClick: () => scrollTo('#') }))),
                                React.createElement("ul", { className: "checked mt-4 txtText900" }, pkg.details && get(pkg, 'details', []).map((detail, f) => (React.createElement("li", { key: `pkgDtl_${f.toString()}`, className: i > 0 && f === 0 ? 'fweight-600' : '' }, translateTo(detail.description, lang)))))),
                            get(pkg, 'price.total', 0) > 0 && (React.createElement("div", { className: "p-4 pb-4 pb-sm-5 bgGreen50 dis-fl-col jc-c pos-r" },
                                React.createElement(BrixelIcon, { icon: "plus", color: "green", className: "bgWhite pos-a-sm y-c w-fix-48 h-fix-48 large ml-sm-3-neg mobilePos", rounded: true }),
                                get(activeSingleCompany, 'stub') === 'ubs' && (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "fweight-600 fsize-500 dis-b" }, translateTo('Exclusive benefits for UBS clients', lang)),
                                    React.createElement("span", { className: "fweight-600 mt-1 dis-b p-2 bgBlue50" }, translateTo('You only pay if the property is sold.', lang)),
                                    React.createElement("ul", { className: "checked mt-2 txtText900" },
                                        React.createElement("li", null, translateTo('Support in terminating or transferring the mortgage', lang)),
                                        React.createElement("li", null, translateTo('Pension and investment advice', lang)),
                                        React.createElement("li", null, translateTo('Advice on the tax implications of selling real estate', lang)),
                                        React.createElement("li", null, translateTo('Information on inheritance and estate planning', lang)),
                                        React.createElement("li", null, translateTo('Checking the selling price', lang))))),
                                get(activeSingleCompany, 'stub') === 'baloise' && (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "fweight-600 fsize-500 dis-b" }, translateTo('Exclusive benefits for Baloise clients', lang)),
                                    React.createElement("span", { className: "fweight-600 mt-1 dis-b p-2 bgBlue50" }, translateTo('You only pay if the property is sold.', lang)),
                                    React.createElement("ul", { className: "checked mt-2 txtText900" },
                                        React.createElement("li", null, translateTo('Assistance with resolving or transferring the mortgage', lang)),
                                        React.createElement("li", null, translateTo('Baloise gives you as a customer CHF 1,000 as a gift', lang)),
                                        React.createElement("li", null, translateTo('Pension and investment advice', lang)))))))))))))))),
            !partners && (React.createElement("div", { className: "dis-f jc-c mt-5" },
                React.createElement(BrixelButtonSecondary, { rounded: true, theme: "text", label: translateTo('Compare all details', lang), onClick: () => scrollTo('comparePlan') })))),
        React.createElement("section", { className: "max-w-fix-1200 container contact-section py-3 py-md-6" },
            React.createElement("h3", { className: "ta-c fweight-600 fsize-600 fsize-sm-700" }, translateTo('Do you want to upgrade or change plans?', lang)),
            React.createElement("div", { className: "dis-fl-col dis-fl-row-md a-fs jc-b mt-3 mt-sm-8 max-w-fix-928 m-a" },
                propID !== 'company' && (React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: BookOnlineImg, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3" },
                        React.createElement("h6", null, translateTo('Book Online', lang)),
                        React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => bookNow(), className: "ml-a mr-a", label: translateTo('Request Now', lang) })))),
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: CallUsImg, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3" },
                        React.createElement("h6", null, translateTo('Call us', lang)),
                        React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true)), className: "ml-a mr-a", label: Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', '')) }))),
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: WrireUsImg, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3" },
                        React.createElement("h6", null, translateTo('Write us', lang)),
                        React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`), className: "ml-a mr-a", label: get(activeSingleCompany, 'contact.email', '') }))),
                propID !== 'company' && (React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-md" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: NotNowImg, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-3" },
                        React.createElement("h6", null, translateTo('Not Sure', lang)),
                        React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => openNewFlow(`/${activeSingleProperty.id}/trialRequest`), className: "ml-a mr-a", label: translateTo('Test drive our service', lang) })))))),
        React.createElement("hr", { className: "lighter my-2 my-ms-5" }),
        React.createElement("section", { className: "max-w-fix-1200 container testimonial py-3 py-md-6 pb-8" },
            React.createElement("h3", { className: "ta-c fweight-600 mb-3 mb-md-8 fsize-600 fsize-sm-700" }, translateTo('You’re in good company', lang)),
            React.createElement("div", { className: "w-perc-100 ml-a mr-a testimonialsSlide" }, get(activeSingleProperty, 'location.countryCode', '') === 'CH' && (React.createElement(Slider, { ref: sliderInstance, ...settingSlider },
                React.createElement("div", { className: "ta-c ml-a mr-a mb-2 max-w-fix-304" },
                    React.createElement("img", { loading: "lazy", src: Testimonial1CH, alt: "Fabian Testimonial", className: "max-w-fix-96 ml-a mr-a mb-3" }),
                    React.createElement("h2", { className: "ta-c mb-2 fweight-600 fsize-600 fsize-sm-700" },
                        " ",
                        React.createElement("i", null, translateTo('"Absolutely perfect and uncomplicated"', lang))),
                    React.createElement("h5", { className: "ta-c txtPrimary400 fweight-600" }, translateTo('M. Hardegger', lang)),
                    React.createElement("p", { className: "ta-c txtPrimary400 fsize-500" }, translateTo('House sold', lang))),
                React.createElement("div", { className: "ta-c ml-a mr-a mb-2 max-w-fix-304" },
                    React.createElement("img", { loading: "lazy", src: Testimonial2CH, alt: "Fabian Testimonial", className: "max-w-fix-96 ml-a mr-a mb-3" }),
                    React.createElement("h2", { className: "ta-c mb-2 fweight-600 fsize-600 fsize-sm-700" },
                        " ",
                        React.createElement("i", null, translateTo('"We would sell with Brixel again anytime."', lang))),
                    React.createElement("h5", { className: "ta-c txtPrimary400 fweight-600" }, translateTo('F. Pfiffner', lang)),
                    React.createElement("p", { className: "ta-c txtPrimary400 fsize-500" }, translateTo('Saved CHF 30\'700', lang))),
                React.createElement("div", { className: "ta-c ml-a mr-a mb-2 max-w-fix-304" },
                    React.createElement("img", { loading: "lazy", src: Testimonial3CH, alt: "Fabian Testimonial", className: "max-w-fix-96 ml-a mr-a mb-3" }),
                    React.createElement("h2", { className: "ta-c mb-2 fweight-600 fsize-600 fsize-sm-700" },
                        " ",
                        React.createElement("i", null, translateTo('"Excellent service with flexible fees."', lang))),
                    React.createElement("h5", { className: "ta-c txtPrimary400 fweight-600" }, translateTo('M. Callaghan', lang)),
                    React.createElement("p", { className: "ta-c txtPrimary400 fsize-500" }, translateTo('Saved CHF 44\'050', lang))))))),
        get(activeSingleCompany, 'stub') === 'ubs' || get(activeSingleCompany, 'stub') === 'baloise' ? (React.createElement(React.Fragment, null)) : (React.createElement(React.Fragment, null,
            React.createElement("section", { className: "compairePlans bgText25 py-3 py-md-9", id: "comparePlan" },
                React.createElement("div", { className: "container" },
                    React.createElement("h3", { className: "ta-c mb-3 mb-md-7 fweight-600 fsize-600 fsize-sm-700" }, translateTo('Compare all plans', lang)),
                    React.createElement(PackagesComparePlans, { lang: lang, packages: filteredPackages }))))),
        React.createElement("section", { className: "testdrive-teaser dis-f jc-c bgWhite pb-2" }, propID === 'company' ? (React.createElement("div", { className: "px-2 px-md-0 mt-5 mt-sm-3" },
            React.createElement("div", { className: "p-2 px-sm-3 bgWhite min-h-fix-240 max-w-fix-800 ml-a mr-a pos-r mb-8 py-5 py-3" },
                React.createElement("img", { loading: "lazy", className: "ml-a mr-a dis-b", width: "80", src: EmptyHubImg, alt: "Emtpy Hub" }),
                React.createElement("h4", { className: "ta-c mt-3 mb-2 fweight-700 mb-2" }, translateTo('Anybody home?', lang)),
                React.createElement("h5", { className: "ta-c fSizePx18 mb-2 m-a" }, translateTo('For using the Brixel Hub you need at least one property.', lang)),
                React.createElement(BrixelButtonPrimary, { rounded: true, className: "m-a mt-3", label: translateTo('+ Add new', lang), onClick: () => history.push(`/packageFlow/getStarted?company=${getCompanyStub()}`) })))) : (React.createElement(BoxTrialTestDirve, { lang: lang, isLarge: true })))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleCompanyPackages: get(state, 'companies.activeSingleCompanyPackages', []),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyPackage: get(state, 'property.activeSinglePropertyPackage', []),
    companyListings: get(state, 'companies.companyListings.data', []),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    ownerProperties: get(state, 'market.ownerProperties', {}),
    packages: get(state, 'companies.activeSingleCompanyPackages', []),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
    handleGetActiveCompanyPackages: bindActionCreators(getActiveSingleCompanyPackages, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(IntroUpgrade);
