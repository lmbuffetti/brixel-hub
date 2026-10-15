import React, { useEffect, useState } from 'react';
import { BrixelDropdown } from '@brixel-io/brixel-components';
import BrixelButtonIcon from '@brixel-io/brixel-components/dist/components/BrixelButtonIcon';
import get from 'lodash/get';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { setLanguage } from '../../actions/CommonActions';
import { checkBrowser, redirectUrl, setCookie } from '../../utils/helpers';
import isEmpty from 'lodash/isEmpty';
function RightHeaderFlow(props) {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { handleSetLanguage, lang = 'en', languages = [], loggedInUser, onClose, userType, } = props;
    // STATE
    const [hideLang, setHideLang] = useState(false);
    // GET URL PARAMS
    const isBuyer = userType === 'buyer';
    const fullURL = get(history, 'location.pathname', '').split('/');
    const propID = get(history, 'location.pathname', '').toLocaleLowerCase().includes('contactflow') && !isBuyer ? fullURL[1] : fullURL[2];
    const dealID = fullURL[3];
    // STATE
    const [currentLang, setCurrentLang] = useState(lang);
    const [dropLang, setDropLang] = useState([]);
    useEffect(() => {
        if (get(history, 'location.search', null) && get(history, 'location.search', '').includes('?url=')) {
            const urlParams = queryString.parse(get(history, 'location.search', ''));
            const url = get(urlParams, 'url', '') || '';
            localStorage.setItem('backUrl', url.toString());
            localStorage.setItem('backUrlBis', url.toString());
        }
        if (history.location.pathname.includes('visitFeedbackss') || history.location.pathname.toLowerCase().includes('brixelboutique') || history.location.pathname.toLowerCase().includes('offer') || history.location.pathname.toLowerCase().includes('prospect')) {
            setHideLang(true);
        }
        else {
            setHideLang(false);
        }
    }, [history]);
    // FUNCTION TO CHECK IF USER IS LOGGED IN
    useEffect(() => {
        if (loggedInUser?.id) {
            const langUsr = loggedInUser.language;
            setCurrentLang(lang);
            if (!isEmpty(langUsr))
                setCookie('brixelLang', langUsr);
        }
    }, [loggedInUser, lang]);
    // FUNCTION TO POPULATE THE DROPDOWN LANGUAGE MENU
    useEffect(() => {
        const capitalize = (item) => item.charAt(0).toUpperCase() + item.slice(1);
        const newLang = languages.map((lng) => ({ ...lng, label: lng.shortLabel ? capitalize(lng.shortLabel) : 'en' }));
        setDropLang(newLang);
    }, [languages]);
    // FUNCTION TO TRANSLATE THE CONTENT USING TRANSIFEX
    useEffect(() => {
        setCurrentLang(lang);
    }, [lang]);
    // FUNCTION TO INITIALIZE THE EVENT LISTENER FOR SCREEN RESIZE
    useEffect(() => {
        document.body.classList.add('flowBody');
        return () => {
            //  clean up
            document.body.classList.remove('flowBody');
        };
    }, []);
    useEffect(() => {
        // this changes the scrolling behavior to "smooth"
        if (window.innerWidth < 590) {
            if (checkBrowser() > 0) {
                // @ts-ignore
                window.scrollTop = 0;
            }
            else {
                window.scrollTo({ top: 0 });
            }
        }
    }, []);
    // FUNCTION TO SET THE LANGUAGE WHEN SELECTED
    const newLang = (e, langCode) => {
        e.stopPropagation();
        if (langCode.value) {
            setCurrentLang(langCode.value);
            handleSetLanguage(langCode.value);
            setCookie('brixelLang', langCode.value);
        }
    };
    const closeOverlay = () => {
        if (onClose) {
            onClose();
        }
        else {
            const linkToRedirect = redirectUrl(history.location.pathname, { propID, dealID, isBuyer, userType });
            if (linkToRedirect.includes('http')) {
                window.location.assign(linkToRedirect);
            }
            else {
                history.push(linkToRedirect);
            }
        }
    };
    return (React.createElement("div", { className: "dis-f a-c" },
        React.createElement("div", { className: "" }, !hideLang && (React.createElement(BrixelDropdown, { noBorder: true, className: "langMenu", color: "text", saturationTxt: 700, keyType: "label", selected: currentLang || 'en', options: dropLang, onSelect: (e, keys) => newLang(e, keys), liClass: "tt-low" }))),
        (loggedInUser?.id || history.location.pathname.toLowerCase().includes('brixelboutique')) && (React.createElement("div", { className: "ml-1" },
            React.createElement(BrixelButtonIcon, { ghost: true, className: "zIndex11", theme: "text", icon: "close-small", onClick: () => closeOverlay() })))));
}
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    lang: get(state, 'common.language', ''),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    pageState: get(state, 'common.setPageData', {}),
    property: get(state, 'property.activeSingleProperty', {}),
    userType: get(state, 'user.userTypes', ''),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetLanguage: bindActionCreators(setLanguage, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(RightHeaderFlow);
