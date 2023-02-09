import React, {useEffect, useRef, useState} from 'react';
import {change, destroy, MultiFileldsReduxForm} from '@brixel/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import queryString from 'query-string';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import Cookies from 'universal-cookie';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {spinnerOff} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {createActiveSingleProperty, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {createUserSearchProfile} from '../../actions/SearchProfileActions';
import {doLogin, validateUser} from '../../actions/UserActions';
import {QuestionsList} from '../../resources/Flows/onBoarding';
import {setCookie} from '../../utils/helpers';
import type {GetStartedType} from '../../@types/Pages/PackageFlow/GetStarted';

const cookie = new Cookies();

const GetStarted = (props: GetStartedType) => {
  const isOpenTransifex = cookie.get('transifex_sidebar');
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();

  // PROPS
  const {
    changeFieldValue,
    destroyForm,
    formValue,
    handleGetActiveSingleCompany,
    handleSpinnerOff,
    lang = 'en',
    loggedInUser,
    translations,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [companyURL, setCompanyURL] = useState('');
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState(QuestionsList(lang)[0]);
  // const [roomValue, setRoomValue] = useState('');
  const companyStub = get(match, 'companyStub', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm();
  }, []);

  useEffect(() => {
    setQuest(QuestionsList(lang)[0]);
  }, [lang, translations]);


  // FUNCTION TO SAVE DATA
  useEffect(() => {
    const dataForm = cloneDeep(formValue);
    const userType = get(dataForm, 'userType', null);
    if (userType === 'buyer') {
      history.push(`/packageFlow/getStartedBuyer?company=${companyURL}`);
    }
    if (userType === 'estimation') {
      history.push(`/packageFlow/getStartedEstimation?company=${companyURL}`);
    }
    if (userType === 'seller') {
      history.push(`/packageFlow/getStarted?company=${companyURL}`);
    }
  }, [formValue]);

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null)) changeFieldValue('owner', get(loggedInUser, 'user.id', null));
  }, [get(loggedInUser, 'user.id', null)]);

  // ON DID MOUNT I GET THE COMPANY DATA
  useEffect(() => {
    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    const channelCookie = cookie.get('brixelChannelSignup') || null;
    let defComp = get(companyByUrl, 'company', companyCookie);
    if (companyStub) defComp = companyStub;
    if (defComp) {
      handleGetActiveSingleCompany({ stub: defComp });
      setCookie('brixelStubCompany', defComp);
      history.push(`/packageFlow/${defComp}`);
    } else {
      handleGetActiveSingleCompany({ stub: 'default' });
      // changeFieldValue('location.countryCode', 'all');`
    }
    if (get(companyByUrl, 'channel', channelCookie)) {
      const defChan = get(companyByUrl, 'channel', channelCookie);
      changeFieldValue('channel', defChan);
      setCookie('brixelChannelSignup', defChan);
    } else {
      changeFieldValue('channel', channelCookie);
    }
    setCompanyURL(defComp);
  }, []);

  // REMOVE FADEIN CLASS TO INITIATE ANIMATION FOR EVERY STEP
  const getStartedEl = document.querySelector('.getStarted');
  useEffect(() => {
    setTimeout(() => {
      if (getStartedEl) getStartedEl.classList.remove('slideUpTrans');
    }, 350);
  }, [quest]);

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted slideUpTrans buyerHub  ${isOpenTransifex ? '' : 'notranslate'}`}>
      <div
        className={`bodyModal ${get(quest, 'history', '')}`}
      >
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => e.preventDefault()}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className={`singleStep pt-6 jc-c ${get(quest, 'vCentered', null) ? 'vertCentered' : ''}`}>
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && (
                    <div id="step-0" className="dis-f flex-wrap">
                      <div className="ta-c max-w-fix-456 m-a">
                        {
                          quest.title && (
                            <h3
                              className={`${quest.subtitle ? 'mb-1' : 'mb-5'} fsize-600 fsize-sm-800 fweight-600 txtText900 px-1 px-sm-0`}
                              dangerouslySetInnerHTML={{ __html: quest.title }}
                            />
                          )
                        }
                      </div>
                      {
                        quest.subtitle && (
                          <p className="mb-5 txtText900" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                      }

                      <MultiFileldsReduxForm
                        baseByData={baseByData}
                        form="GetStarted"
                        className="w-perc-100"
                        disableNextBtn={false}
                        formValue={formValue}
                        inputs={quest.inputs}
                        onClick={() => ''}
                        onCloseGoBack={() => ''}
                        onSubmit={() => ''}
                        showSendButton
                        disableDelay
                      />
                    </div>

                  )
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const urlSearch = queryString.parse(get(ownProps.history, 'location.search', ''));
  const channel = get(urlSearch, 'channel', 'default');
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    initialValues: {
      channel,
      changeCountry: get(state, 'companies.activeSingleCompany.country.code', 'all'),
      company: get(state, 'companies.activeSingleCompany.stub', null),
      owner: get(state, 'user.loggedInUser.user.id', null),
    },
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.GetStarted', null),
    translations: get(state, 'translations', { }),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  destroyForm() {
    dispatch(destroy('GetStarted'));
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleDoLogin: bindActionCreators(doLogin, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleValidateUser: bindActionCreators(validateUser, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(GetStarted);
