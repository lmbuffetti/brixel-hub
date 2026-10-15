/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonText } from '@brixel-io/brixel-components';
import { BrixelLogin, BrixelRegister, BrixelReset, change, Validation } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import Slider from 'react-slick';
import { setFormError } from '../actions/CommonActions';
import { recoverPassword } from '../actions/UserActions';
import { checkBrowser } from '../utils/helpers';
import iconHand from '../images/getstarted/signup/Brixel-Icons-handshake.svg';
import iconCalc from '../images/getstarted/signup/Brixel-Icons-calc.svg';
import iconCalendar from '../images/getstarted/signup/Brixel-Icons-calendar.svg';
import valuationIcon from '../images/getstarted/signup/Brixel-Icons-valuation.svg';
import iconFinance from '../images/getstarted/signup/Brixel-Icons-finance.svg';
import iconOffer from '../images/getstarted/signup/Brixel-Icons-offer.svg';
import iconExperts from '../images/getstarted/signup/Brixel-Icons-experts.svg';
import iconMarketing from '../images/getstarted/signup/Brixel-Icons-marketing.svg';
import iconPresentation from '../images/getstarted/signup/Brixel-Icons-presentation.svg';
import translateTo from '../utils/translation';
// COMPONENT FOR THE LOGIN/SIGN UP ON ONBOARDING
const LoginSignup = (props) => {
    // PROPS
    const { changeFieldValue, company, disableEmailRegister = false, errorValue, formError, formName, formValue, handleRecoverPassword, handleSetFormError, isSmallLoading, lang, loggedInUser, notification, onChangeLogin = () => '', onDisableValidation = () => '', onSubmit = () => '', pageType, skipPhone = false, windowDimensions, } = props;
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // STATE
    const [isDesktop, setIsDesktop] = useState(false);
    const [loginPage, setLoginPage] = useState('register');
    const [showErrors, setShowErrors] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    /*  const sliderInstance = useRef(null);
    const settingSlider = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 4000,
      speed: 500,
      slidesToShow: 1,
      arrows: false,
      slidesToScroll: 1,
      draggable: false,
      centerPadding: '8px',
    }; */
    useEffect(() => {
        onDisableValidation(true);
    }, []);
    useEffect(() => {
        if (get(windowDimensions, 'width', 0) > 768)
            setIsDesktop(true);
        else
            setIsDesktop(false);
    }, [get(windowDimensions, 'width', 0)]);
    useEffect(() => {
        document.body.classList.add('flowProfile');
        return () => {
            //  clean up
            document.body.classList.remove('flowProfile');
        };
    }, []);
    // FUNCTION TO SAVE ON REDUX FORM THE CURRENT PAGE (LOGIN OR REGISTER)
    useEffect(() => {
        if (typeof loggedInUser.token === 'undefined') {
            changeFieldValue(formName, 'signup', !loginPage);
        }
        changeFieldValue(formName, 'signupScreen', loginPage);
        onChangeLogin(loginPage);
    }, [loginPage]);
    useEffect(() => {
        if (loginPage === 'register' && get(formError, 'state', false) && !get(formError, 'noRedirect', false)) {
            setShowErrors(true);
        }
    }, [formError]);
    useEffect(() => {
        // this changes the scrolling behavior to "smooth"
        if (typeof window !== 'undefined' && window.innerHeight > 50) {
            if (checkBrowser() > 0) {
                // @ts-ignore
                if (window.scrollTop)
                    window.scrollTop = 0;
            }
            else if (window.scrollTo)
                window.scrollTo({ top: 0 });
        }
    }, []);
    // FUNCTION TO SAVE THE DATA, IF NOT VALID SHOW THE ERROR
    const onSubmitForm = () => {
        let isValid = true;
        Object.keys(get(errorValue, loginPage, {})).forEach((subKey) => {
            const curErr = get(errorValue[loginPage], subKey, true);
            if (curErr !== true && curErr !== null) {
                setShowErrors(true);
                isValid = false;
            }
        });
        if (loginPage === 'reset') {
            const email = get(formValue, 'login.email', '');
            if (Validation.isEmail(email) === true && Validation.required(email) === true) {
                handleRecoverPassword({
                    email: email.toLowerCase(),
                    smallLoader: 'recoverPassword',
                });
            }
        }
        else if (isValid) {
            setShowErrors(false);
            onSubmit(loginPage);
        }
    };
    // CHANGE PAGE
    const changeScreen = (page) => {
        changeFieldValue(formName, 'signupScreen', page);
        setLoginPage(page);
        handleSetFormError({});
    };
    useEffect(() => {
        if (disabledButton) {
            setTimeout(() => {
                setDisabledButton(false);
            }, 2000);
        }
    }, [disabledButton]);
    // FUNCTION TO MANAGE THE ONLCIK FUNCTION AND LABEL OF PRIMARY BUTTON (center)
    const PrimaryButton = () => {
        switch (loginPage) {
            case 'not_sure':
                return {
                    action: () => {
                        setDisabledButton(true);
                        changeScreen('register');
                    },
                    label: translateTo('Ok, save now', lang),
                };
            case 'support':
                return {
                    action: () => changeScreen('register'),
                    label: translateTo('Ok, save now', lang),
                };
            case 'login':
                return {
                    action: () => {
                        setDisabledButton(true);
                        onSubmitForm();
                    },
                    label: 'Login',
                };
            case 'reset':
                // eslint-disable-next-line no-case-declarations
                const checkDoneStatus = notification.filter((item) => item.type === 'done');
                if (checkDoneStatus.length > 0) {
                    return {
                        action: () => changeScreen('login'),
                        label: translateTo('Go to login', lang),
                    };
                }
                return {
                    action: () => {
                        setDisabledButton(true);
                        onSubmitForm();
                    },
                    label: translateTo('Reset Password', lang),
                };
            default:
                return {
                    action: () => {
                        setDisabledButton(true);
                        onSubmitForm();
                    },
                    label: pageType === 'boutique' ? translateTo('Register here', lang) : translateTo('Sign up', lang),
                };
        }
    };
    const SignupDescription = (langVal, companyVal, isDesktopVal, isBuyerVal) => {
        const sliderInstance = useRef(null);
        // Define icons for buyers and non-buyers
        const icons = {
            baloise: isBuyerVal ? {
                icon1: iconOffer,
                icon2: valuationIcon,
                icon3: iconCalendar,
                icon4: iconFinance,
            } : {
                icon1: iconOffer,
                icon2: iconHand,
                icon3: iconCalc,
            },
            ubs: isBuyerVal ? {
                icon1: valuationIcon,
                icon2: iconCalendar,
                icon3: iconOffer,
            } : {
                icon1: iconOffer,
                icon2: iconHand,
                icon3: iconCalc,
            },
            default: isBuyerVal ? {
                icon1: iconOffer,
                icon2: valuationIcon,
                icon3: iconCalendar,
                icon4: iconFinance,
            } : {
                icon1: pageType === 'boutique' ? iconPresentation : iconOffer,
                icon2: pageType === 'boutique' ? iconMarketing : iconHand,
                icon3: pageType === 'boutique' ? iconExperts : iconCalc,
            },
        };
        // Define texts for buyers and non-buyers
        const texts = {
            baloise: isBuyerVal ? {
                text1: 'Mortgage offer with exclusive benefits from Baloise',
                text2: 'Independent valuation of the property by Baloise',
                text3: 'Request a visit appointment directly',
                text4: 'Access to the most relevant documents',
            } : {
                text1: 'You receive a CHF 2,000 discount',
                text2: 'You only pay if the sale is successful',
                text3: 'You will get advised on your existing mortgage',
            },
            ubs: isBuyerVal ? {
                text1: 'Support on all financial questions',
                text2: '10-days of exclusive access to new properties',
                text3: 'Benefit from a 0.30% interest rate reduction',
            } : {
                text1: 'CHF 2,000 discount',
                text2: 'Payment only in case of successful sale',
                text3: 'Verification of the sales price',
            },
            default: isBuyerVal ? {
                text1: 'Make an offer to the seller',
                text2: 'Apply for a financing certificate',
                text3: 'Request a visit appointment directly',
                text4: 'Access to the most relevant documents',
            } : {
                text1: pageType === 'boutique' ? 'Unique presentation' : 'Get personal support from A to Z',
                text2: pageType === 'boutique' ? 'Bespoken marketing' : 'Stay in the loop with your customer portal',
                text3: pageType === 'boutique' ? 'Your personal experts' : 'Sell without an exclusive brokerage contract',
            },
        };
        const getIconsAndTexts = (companyName) => {
            return {
                icons: icons[companyName] || icons.default,
                texts: texts[companyName] || texts.default,
            };
        };
        const { icons: companyIcons, texts: companyTexts } = getIconsAndTexts(companyVal);
        const sections = [
            {
                icon: companyIcons.icon1,
                text: companyTexts.text1,
                key: '1',
            },
            {
                icon: companyIcons.icon2,
                text: companyTexts.text2,
                key: '2',
            },
            {
                icon: companyIcons.icon3,
                text: companyTexts.text3,
                key: '3',
            },
        ];
        if (isBuyerVal && (companyVal === 'baloise' || companyVal === 'default')) {
            sections.push({
                icon: companyIcons.icon4,
                text: companyTexts.text4,
                key: '4',
            });
        }
        const settingSlider = {
            rtl: false,
            infinite: true,
            centerMode: true,
            variableWidth: true,
            slidesToShow: 1,
            focusOnSelect: true,
            dots: false,
            speed: 500,
            draggable: true,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: false,
        };
        return (React.createElement(React.Fragment, null, isDesktopVal ? (
        // Static layout for desktop
        React.createElement(React.Fragment, null, sections.map(section => (React.createElement("div", { className: "icon-wrap dis-f a-c pb-2", key: section.key },
            section.icon && (React.createElement("div", { className: "icon-circle bgWhite brdCircle as-fc dis-f jc-c p-2" },
                React.createElement("img", { src: section.icon, alt: `Icon ${section.text.split(' ')[0]}`, width: '48px', height: '48px' }))),
            React.createElement("p", { className: "fsize-400 pl-2 max-w-fix-280" }, translateTo(section.text, langVal))))))) : (
        // Slider layout for mobile
        React.createElement("div", { className: 'centerSlider' },
            React.createElement(Slider, { ref: sliderInstance, ...settingSlider }, sections.map(section => (React.createElement("div", { className: "icon-wrap dis-f a-c pb-2", key: section.key },
                section.icon && (React.createElement("div", { className: "icon-circle bgWhite brdCircle as-fc dis-f jc-c p-2" },
                    React.createElement("img", { src: section.icon, alt: `Icon ${section.text.split(' ')[0]}`, width: '48px', height: '48px' }))),
                React.createElement("p", { className: "fsize-400 pl-sm-2" }, translateTo(section.text, langVal))))))))));
    };
    if (!formValue) {
        return (React.createElement("div", null));
    }
    const contentMap = (companyStub, isBuyer) => {
        const content = {
            ubs: {
                true: {
                    topTitle: 'Activate your UBS advantages',
                    topSubtitle: '',
                    footnoteTitle: '',
                    footnoteDescription: 'In order for you to benefit from these advantages, we need your consent to transfer your personal data to UBS.',
                },
                false: {
                    topTitle: 'Activate your UBS advantages',
                    topSubtitle: '',
                    footnoteTitle: '',
                    footnoteDescription: 'In order for you to benefit from these advantages, we need your consent to transfer your personal data to UBS.',
                },
            },
            baloise: {
                true: {
                    topTitle: 'What are my advantages?',
                    topSubtitle: '',
                    footnoteTitle: 'Why do I have to register?',
                    footnoteDescription: 'Due to our privacy policy, only registered users have access to sensitive documents and data.',
                },
                false: {
                    topTitle: 'What are my advantages?',
                    topSubtitle: '',
                    footnoteTitle: '',
                    footnoteDescription: '',
                },
            },
            default: {
                true: {
                    topTitle: 'What are my advantages?',
                    topSubtitle: '',
                    footnoteTitle: 'Why do I have to register?',
                    footnoteDescription: 'Due to our privacy policy, only registered users have access to sensitive documents and data.',
                },
                false: {
                    topTitle: pageType === 'boutique' ? 'What are my benefits?' : 'What are my advantages?',
                    topSubtitle: '',
                    footnoteTitle: '',
                    footnoteDescription: '',
                },
            },
        };
        const companyContent = content[companyStub] || content.default;
        return companyContent[isBuyer.toString()] || companyContent[false];
    };
    const companyStub = get(company, 'stub', '');
    const isBuyer = history.location.pathname.includes('Buyer/');
    const { topTitle, topSubtitle, footnoteTitle, footnoteDescription } = contentMap(companyStub, isBuyer);
    return (React.createElement("div", { className: "signUpScreen ov-h brdRadius flex-wrap dis-f m-a max-w-fix-1120 jc-c" },
        React.createElement("div", { className: "w-perc-100 bgWhite w-perc-md-55 p-2 p-sm-4 p-lg-8" }, (loginPage === 'register' || loginPage === 'login' || loginPage === 'reset') && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "innerBox bgWhite" },
                loginPage === 'login' && (React.createElement(React.Fragment, null,
                    React.createElement(BrixelLogin, { company: company, formName: formName, showErrors: showErrors, lang: lang }),
                    React.createElement("p", { className: "mt-1" },
                        React.createElement(BrixelButtonText, { label: translateTo('Forgot password?', lang), onClick: () => changeScreen('reset') })))),
                loginPage === 'register' && (React.createElement(React.Fragment, null,
                    React.createElement(BrixelRegister, { disableEmailRegister: disableEmailRegister, baseURL: baseByData?.apiRoot, showGeneratePassword: false, company: company, formName: formName, isBuyer: isBuyer, showErrors: showErrors, lang: lang, pageType: pageType, 
                        // validateEmail
                        skipPhone: skipPhone }))),
                loginPage === 'reset' && (React.createElement("div", { className: "mb-2" },
                    React.createElement(BrixelReset, { company: company, formName: formName, showErrors: showErrors, lang: lang }),
                    get(notification[0], 'label', null) && (React.createElement(React.Fragment, null,
                        React.createElement("p", { className: "fsize-300 mt-1 txtGreen400" }, notification[0].label),
                        React.createElement(BrixelButtonText, { className: "mt-2 ml-a mr-a", label: translateTo('Resend password', lang), onClick: () => onSubmitForm() }))))),
                React.createElement(BrixelButtonPrimary, { rounded: true, className: "ml-a mr-a mt-2 mb-2 minimum-w-210", label: translateTo(PrimaryButton().label, lang), onClick: !disabledButton ? PrimaryButton().action : () => '', isLoading: isSmallLoading.recoverPassword || isSmallLoading.savingData, type: "submit" }),
                get(formError, 'state', false) && (React.createElement("p", { className: "txtRed400 fsize-300 ta-c mb-2 mt-1" }, translateTo(get(formError, 'message', ''), lang))),
                get(notification[0], 'state', false) && get(notification[0], 'type', '') === 'done' && (React.createElement("p", { className: "txtGreen400" }, translateTo('Registration complete.', lang)))),
            React.createElement("div", { className: "topBar fsize-400 ta-c" },
                (loginPage === 'register' || loginPage === 'reset') && (React.createElement("p", { className: "" },
                    pageType === 'boutique' ? (React.createElement("span", null, translateTo('Do you already have an account?', lang))) : (React.createElement("span", null, translateTo('Already have an account?', lang))),
                    React.createElement("span", null, "\u00A0"),
                    React.createElement("span", { className: "cur-poi ", onClick: () => changeScreen('login') },
                        React.createElement("span", { className: 'td-u' }, translateTo('Login here', lang))))),
                loginPage === 'login' && (React.createElement("p", { className: "txtWhite" },
                    React.createElement("span", null, translateTo('Login or', lang)),
                    React.createElement("span", { className: "cur-poi td-u txtWhite ml-small-4", onClick: () => changeScreen('register') },
                        React.createElement("span", null, translateTo('create profile here', lang))))))))),
        React.createElement("div", { className: "dis-fl-col w-perc-100 w-perc-md-45 bgGreen25 a-c a-bl-md p-2 py-4 p-sm-4 p-lg-8 benifitSlider" },
            React.createElement("div", { className: "topPart ta-c ta-l-md pb-2 pb-md-4" },
                topTitle && (React.createElement("span", { className: "fsize-500 fsize-sm-600 fweight-600 boutiqueFont" },
                    " ",
                    translateTo(topTitle, lang),
                    " ")),
                topSubtitle && (React.createElement("p", { className: 'fsize-400 fsize-sm-500 pt-1' }, translateTo(topSubtitle, lang)))),
            SignupDescription(lang, companyStub, isDesktop, isBuyer),
            React.createElement("div", { className: `footNote w-perc-100 bgGreen50 brdRadius p-1 px-2 mt-3 ${footnoteDescription !== '' || footnoteTitle !== '' ? '' : 'hide'}` },
                React.createElement("p", { className: "fweight-600 fsize-300" },
                    " ",
                    translateTo(footnoteTitle, lang),
                    " "),
                React.createElement("p", { className: "pt-small-4 fsize-300" }, translateTo(footnoteDescription, lang))))));
};
const mapStateToProps = (state, ownProps) => ({
    company: get(state, 'companies.activeSingleCompany', undefined),
    errorValue: get(state, `brixelForm.${ownProps.formName}.syncErrors`, {}),
    formError: get(state, 'common.formError', {}),
    formValue: get(state, `brixelForm.${ownProps.formName}.values`, {}),
    isSmallLoading: get(state, 'common.isSmallLoading', ''),
    lang: get(state, 'common.language', {}),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    notification: get(state, 'common.notification', []),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(formName, field, value) {
        dispatch(change(formName, field, value));
    },
    handleSetFormError: bindActionCreators(setFormError, dispatch),
    handleRecoverPassword: bindActionCreators(recoverPassword, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(LoginSignup);
