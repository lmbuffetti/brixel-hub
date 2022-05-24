/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  initializeForm,
  change,
  reset,
  destroy,
} from '@brixel/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { setCookie } from '../../utils/helpers';
import { setLanguage, spinnerOff, spinnerOn } from '../../actions/CommonActions';
import { doLogin, validateUser } from '../../actions/UserActions';
import LoginSignup from '../../components/LoginSignup';
import iconCalendar from '../../images/offer-flow/Brixel-Icons-calendar.png';
import iconDocs from '../../images/offer-flow/Brixel-Icons-docs.png';
import iconFinance from '../../images/offer-flow/Brixel-Icons-finance.png';
import iconOffer from '../../images/offer-flow/Brixel-Icons-offer.png';

const cookie = new Cookies();

const Signup = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    changeFieldValue,
    company,
    destroyForm,
    formValue,
    handleDoLogin,
    handleGetActiveSingleCompany,
    handleSetLanguage,
    handleSpinnerOff,
    handleValidateUser,
    isTest,
    lang,
    loggedInUser,
    windowDimensions,
  } = props;
  // STATE
  const [urlData, setUrlData] = useState({ });

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  const sliderInstance = useRef(null);
  const settingSlider = {
    centerMode: true,
    slidesToShow: 1,
    speed: 500,
    autoPlay: true,
    focusOnSelect: true,
    dots: false,
    infinite: true,
    variableWidth: true,
    draggable: true,
    centerPadding: '8px',
  };

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);

  useEffect(() => {
    const url = queryString.parse(get(history, 'location.search', ''));
    if (url.url || url.company) {
      setUrlData(url);
      history.push('/signup');
    }
  }, [get(history, 'location', '')]);

  // IF THE URL IS SUCCESS (SUCCESS CREATE USER) REDIRECT TO SECOND PART
  useEffect(() => {
    if (get(history, 'location.pathname', '').includes('success') && urlData.url) {
      window.location.assign(urlData.url);
    } else if (get(history, 'location.pathname', '').includes('success')) {
      window.location.assign(baseByData.hubUrl);
    }
  }, [get(history, 'location', null)]);

  // FUNCTION TO SAVE DATA
  const saveData = async (page) => {
    const dataForm = cloneDeep(formValue);
    const { login, register, company } = dataForm;
    const data = {
      redirectTo: {
        pathname: '/signup/success',
        state: { hideClose: true },
      },
    };
    if (page === 'login') {
      data.user = {
        username: login.email.toLowerCase(),
        password: login.password,
      };
      // DISPATCH TO DO LOGIN
      await handleDoLogin(data);
    }
    if (page === 'register') {
      delete register.password;
      data.user = {
        ...register,
        email: register.email.toLowerCase(),
        acceptTerms: get(register, 'privacy[0]', true),
        acceptMarketing: get(register, 'acceptMarketing[0]', false),
        name: get(formValue, 'register.name', ''),
        userType: 'seller',
        signupAccept: true,
        signupChannel: get(formValue, 'channel', 'default'),
        signupProduct: null,
        language: lang || 'en',
        createUser: true,
        company,
        ignoreEmail: false,
        seller: true,
        redirectTo: {
          pathname: '/signup/success',
          state: { hideClose: true },
        },
      };
      await handleValidateUser(data);
    }
  };

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({ stub: defComp });
      setCookie('brixelStubCompany', defComp);
    } else if (!isTest) {
      const companyUser = get(loggedInUser, 'users.company.stub', null);
      if (companyUser) handleGetActiveSingleCompany({ stub: companyUser });
      else handleGetActiveSingleCompany({ stub: 'default' });
      changeFieldValue('location.countryCode', 'all');
    }
    if (get(companyByUrl, 'channel', channelCookie)) {
      const defChan = get(companyByUrl, 'channel', channelCookie);
      changeFieldValue('channel', defChan);
      setCookie('brixelChannelSignup', defChan);
    } else {
      changeFieldValue('channel', channelCookie);
    }
  }, []);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(company, 'stub', null)) {
      if (get(company, 'language.code', null)) {
        const companyLang = get(company, 'language.code', 'en');
        handleSetLanguage(companyLang.toLowerCase());
      }
      changeFieldValue('company', company.stub);
    }
  }, [company]);

  const SignupDescription = () => (
    [
      <div className="icon-wrap dis-fl-col a-c" key="Signup_1">
        <div className="icon-circle bgWhite brdCircle as-fc dis-f jc-c">
          <img width="135" src={iconDocs} alt="Icon Docs" />
        </div>
        <p className="pt-2 fsize-500 txtDark700 max-w-fix-192 ta-c">Easy access to all documents</p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c" key="Signup_2">
        <div className="icon-circle bgWhite brdCircle as-fc dis-f jc-c">
          <img width="135" src={iconCalendar} alt="Icon Calendar" />
        </div>
        <p className="pt-2 fsize-500 txtDark700 max-w-fix-192 ta-c">Book an onsite visit</p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c" key="Signup_3">
        <div className="icon-circle bgWhite brdCircle as-fc dis-f jc-c">
          <img width="135" src={iconOffer} alt="Icon offer" />
        </div>
        <p className="pt-2 fsize-500 txtDark700 max-w-fix-192 ta-c">Make an offer to the seller</p>
      </div>,
      <div className="icon-wrap dis-fl-col a-c" key="Signup_4">
        <div className="icon-circle bgWhite brdCircle as-fc dis-f jc-c">
          <img width="135" src={iconFinance} alt="Finance" />
        </div>
        <p className="pt-2 fsize-500 txtDark700 max-w-fix-192 ta-c">Apply directly for financing certificate</p>
      </div>,
    ]
  );

  return (
    <div id="bodyModalWrapper" className="withHeader getStarted bgCardGreen createProfile offerSignup">
      <div
        className="bodyModal container"
      >
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => e.preventDefault()}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className="singleStep pt-5 jc-c ">
              <div className="subcontainer m-a">
                <div id="step-0" className="dis-f flex-wrap pt-3 pt-sm-8">
                  <div className="dis-fl-col w-perc-100 w-perc-md-50 px-0 px-sm-5 a-c">
                    <h3 className="fweight-600 mb-6 max-w-fix-304 mx-a ta-c">Sign up for free and get full access.</h3>
                    {
                      windowDimensions.width > 768 ? (
                        <div className="two-col-grid w-perc-100">
                          {SignupDescription()}
                        </div>
                      ) : (
                        <div className="centerSlider w-perc-100 mb-4">
                          <Slider ref={sliderInstance} {...settingSlider}>
                            {SignupDescription()}
                          </Slider>
                        </div>
                      )
                    }
                  </div>
                  <div className="w-perc-100 w-perc-md-50">
                    <LoginSignup
                      formName="GetStarted"
                      onSubmit={(page) => saveData(page)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

Signup.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleDoLogin: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleSetLanguage: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleValidateUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isTest: PropTypes.bool,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Signup.defaultProps = {
  isTest: false,
  lang: 'en',
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
  formValue: get(state, 'brixelForm.GetStarted.values', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  destroyForm() {
    dispatch(destroy('GetStarted'));
  },
  initForm(value) {
    dispatch(initializeForm('GetStarted', value));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Signup);
