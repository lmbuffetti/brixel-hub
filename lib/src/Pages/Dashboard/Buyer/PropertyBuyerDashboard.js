import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import get from 'lodash/get';
import { BrixelButtonBox, BrixelButtonIcon } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';
import SectionMobileTitle from '../../../components/SectionMobileTitle';
const PageBuyer = lazyWithRetry(() => import('./PageBuyer'));
const ContactBuyer = lazyWithRetry(() => import('./ContactBuyer'));
const PropertyBuyerDashboard = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleDeal, formValue, lang, windowDimensions, } = props;
    // STATE
    // const [userType, setUserType] = useState();
    // URL PARAMS
    const propID = get(match, 'propID', null);
    const getFact = () => last(history.location.pathname.split('/'));
    // ON DESKTOP REDIREECT TO /LISTINGS/PAGE
    useEffect(() => {
        if (windowDimensions && windowDimensions.width > 1024 && (getFact() === propID || getFact() === 'property')) {
            history.push({ pathname: `/buyer/${propID}/property/contact` });
        }
    }, [windowDimensions, getFact()]);
    // CLASS FOR OPEN/CLOSE COLUMNS
    const openCloseColumn = () => {
        if ((history.location.pathname.includes('facts') && getFact() !== 'facts') ||
            (history.location.pathname.includes('edit'))) {
            return 'closed';
        }
        return 'opened';
    };
    // FUNCTION TO CALC NUMBER OF PHOTOS - FLOORPLANS - DOCUMENTS
    const calcLenght = (val) => {
        if (val)
            return val.length;
        return 0;
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(SectionMobileTitle, { title: "Property" }),
        React.createElement("div", { className: "property-container dis-f jc-fs h-perc-lg-100 pos-r a-t", id: "propertyDashboard" },
            React.createElement("div", { className: "flex-1" },
                windowDimensions.width <= 1024 && (React.createElement("div", { className: `firstLevel expandableColumn ${openCloseColumn() === 'opened' ? 'mr-lg-2' : 'collapsed'}` },
                    React.createElement("div", { className: "dis-f min-h-fix-136" },
                        React.createElement(BrixelButtonBox, { verticalView: true, bgTransparent: true, icon: "copy-link", label: translateTo('Page', lang), labelClass: "fweight-400", subtitle: "", subtitleClass: "fsize-200 pt-small-6", className: `w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'page' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`, colorIcon: "primary700", backIcon: "primary100", onClick: () => history.push(`/buyer/${propID}/property/page`) }),
                        React.createElement(BrixelButtonBox, { verticalView: true, bgTransparent: true, icon: "folder", label: translateTo('Docubox', lang), labelClass: "fweight-400", subtitle: `<span>${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate))}</span>&nbsp;<span>${translateTo(calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate)) !== 1 ? 'Files' : 'File', lang)}</span>`, subtitleClass: `fsize-200 pt-small-6 ${calcLenght(get(formValue, 'documents', []).filter((i) => !i.isPrivate)) >= 1 ? 'txtPrimary700' : 'txtText600'}`, className: `w-perc-100 shadow-1dp ml-1 brdMedium ${getFact() === 'docubox' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`, colorIcon: "primary700", backIcon: "primary100", onClick: () => history.push(`/buyer/${propID}/docubox`) })),
                    React.createElement("div", { className: "dis-f mt-1 pr-lg-2 min-h-fix-136" },
                        React.createElement(BrixelButtonBox, { verticalView: true, bgTransparent: true, icon: "calendar", label: translateTo('Showings', lang), labelClass: `fweight-400 ${windowDimensions.width <= 1024 ? 'w-perc-50' : 'w-perc-25'}`, subtitle: "", subtitleClass: "fsize-200 pt-small-6", className: `w-perc-100 w-perc-lg-50 shadow-1dp ml-1 brdMedium ${getFact() === 'showings' ? 'brdPrimary400 bgWhite' : 'brdTrans'} p-2`, colorIcon: "primary700", backIcon: "primary100", onClick: () => history.push(`/buyer/${propID}/property/showings`) }),
                        windowDimensions.width <= 1024 && (React.createElement(BrixelButtonBox, { verticalView: true, bgTransparent: true, icon: "money", label: translateTo('Closing', lang), labelClass: "fweight-400 w-perc-50", subtitle: "", subtitleClass: "fsize-200 pt-small-6", className: `w-perc-100 min-h-fix-136 shadow-1dp brdMedium ${getFact() === 'deals' ? 'brdPrimary400 bgWhite' : 'brdTrans'} ml-1 p-2`, colorIcon: "primary700", backIcon: "primary100", onClick: () => history.push(`/buyer/${propID}/closing/${activeSingleDeal.id}`) }))))),
                React.createElement("div", { className: `backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}` },
                    React.createElement(BrixelButtonIcon, { bgTransparent: true, icon: "arrow-simple-left", onClick: () => history.push('../page') }))),
            getFact() !== 'property' && (React.createElement("div", { className: `levelsWrapper w-perc-100 zIndex2 ${openCloseColumn() === 'opened' ? 'ml-lg-1 closed' : 'opened'}` },
                React.createElement(Suspense, { fallback: React.createElement(Loading, { isLoading: true }) },
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/page/*", element: React.createElement(PageBuyer, null) }),
                        React.createElement(Route, { path: "/contact/*", element: React.createElement(ContactBuyer, null) }),
                        React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: `/buyer/${propID}/property/page` }) }))))))));
};
const mapStateToProps = (state) => ({
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    formValue: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    property: get(state, 'property.activeSingleProperty', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
export default compose(connect(mapStateToProps, null))(PropertyBuyerDashboard);
