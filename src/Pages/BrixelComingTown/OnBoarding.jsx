/* global Transifex */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  withRouter,
} from 'react-router-dom'
import { change, isValid, Field, reduxForm } from 'redux-form';
import Cookies from 'universal-cookie';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelInputText, BrixelCheckbox,
} from '@brixel/brixel-components';
import { getToken, setAwards, setBrixelPoint, validateUser } from '../../actions/UserActions';
import { addProperty } from '../../actions/PropertyActions';
import { errorMessage, setPageData } from '../../actions/CommonActions';
import { Questions } from '../../resources/brixelComintTownPropertyQuestion.js';
import { setCookie } from '../../utils/helpers';
import Maps from '../../components/Map/Maps';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';

const cookie = new Cookies;

function OnBoarding(props) {
  // PROPS
  const {
    changeFieldValue,
    checkValid,
    errorValue,
    formValue,
    handleCreatePage,
    handleCreateUser,
    handleGetToken,
    handleSetAwards,
    handleSetBrixelPoint,
    language,
    loggedUser,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const [hideNextBtn, setHideNextBtn] = useState(true);
  const [disablePrevBtn, setDisablePrevBtn] = useState(true);
  const [hidePrevBtn, setHidePrevBtn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loginPage, setLoginPage] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  const extractTitle = (title) => {
    if (typeof title === 'object') {
      return title.House;
    }
    return title;
  };

  useEffect(() => {
    let invalidField = false;
    if (Questions[currentIndex] && Questions[currentIndex].inputs) {
      Questions[currentIndex].inputs.map((inp) => {
        const curVal = get(errorValue, inp.name, true);
        if (curVal !== true) invalidField = true;
      });
    }
    setDisableNextBtn(invalidField);
  }, [errorValue, currentIndex]);

  useEffect(() => {
    const company = get(props, 'match.params.stubCompany', null);
    if (company) setCookie('brixelStubCompany', company);
  });

  useEffect(() => {
    if (formValue && formValue.location && !formValue.pageTitle) {
      var titleAdjectives = [
        'Beautiful',
        'Charming',
        'Elegant',
        'Prestigious',
        'One-of-a-kind',
        'Exquisite',
        'Spacious',
        'Gorgeous',
        'Wonderful',
        'Lovely',
        'Superb',
        'Amazing',
        'Stunning',
        'Sophisticated',
        'Modern',
        'Incredible'
      ];
      // Create the title of the page
      let pageTitle = `${titleAdjectives[Math.floor(Math.random() * titleAdjectives.length)]} ${formValue.propertyType}`;

      // Try to add location to the title
      if (formValue.location.city) {
        pageTitle += ' in ' + formValue.location.city;
      } else if (formValue.location.state) {
        pageTitle += ' in ' + formValue.location.state;
      } else if (formValue.location.country) {
        pageTitle += ' in ' + formValue.location.country;
      } else {
        pageTitle += ' in ' + formValue.location.address;
      }
      changeFieldValue('pageTitle', pageTitle);
    }
  }, [formValue]);

  const validateSlide = (val, name, quest) => {
    changeFieldValue(name, val);
    checkValid();
    const curIndex = Questions.findIndex((item) => quest.history === item.history);
    setCurrentIndex(curIndex);
  };

  const changeStep = (act) => {
    let newPosition = position;
    if (act === 'back') {
      setDisableNextBtn(false);
      newPosition = position - 1;
    }
    else {
      setDisableNextBtn(true);
      newPosition = position + 1;
    }
    setPosition(newPosition);
    setCurrentIndex(newPosition);
    if (newPosition > 0) setHidePrevBtn(false);
    else setHidePrevBtn(true);
    if (Questions[newPosition] && Questions[newPosition].cardType && Questions[newPosition].cardType === 'RewardsStep') {
      handleSetBrixelPoint([{desc: "First Award", point: 50}]);
      handleSetAwards([{desc: "First Award", point: 1}]);
    }
    if (Questions[newPosition] && Questions[newPosition].cardType && Questions[newPosition].cardType === 'LastStep' && loggedUser.user && loggedUser.user.id) {
      saveData();
    }
    setProgressBar(newPosition * 100 / Questions.length);
  };

  const saveData = (e) => {
    const data = {
      language: language || 'en',
      title: formValue.pageTitle,
      status: "on-request",
      listed: false,
      active: true,
      published: false,
      properties: {
        propertyType: formValue.propertyType,
        typology: {
          bedrooms: formValue.bedrooms,
          livingArea: { value: +formValue.livingSpace, unit: "sqm" }
        },
        building: {
          build: formValue.constructionYear,
        }
      },
      location: formValue.location,
      ownerType: "seller",
      getEstimation: false,
      addProperty: true,
      redirectToUserFlow: true,
    };
    if (loggedUser.user && loggedUser.user.id) {
      changeFieldValue('owner', loggedUser.user.id);
      data.owner = loggedUser.user.id;
      handleCreatePage(data);
    } else if (loginPage) {
      data.user = {
        username: formValue.email,
        password: formValue.password,
      };
      handleGetToken(data);
    } else {
      data.user = {
        email: formValue.email,
        name: `${formValue.firstName} ${formValue.lastName}`,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        userType: "seller",
        phone: formValue.phone,
        signupAccept: true,
        signupChannel: "default",
        signupProduct: null,
        language: language || 'en',
        createUser: true,
        company: get(props, 'match.params.stubCompany', cookie.get('brixelStubCompany') || null),
      };
      handleCreateUser(data);
    }
  };

  return (
    <main id="onBoarding">
      <div id="progressBar"><span className="activeProgBar" style={{ width: `${progressBar}%` }} /></div>
      <form id="multiStepForm" onSubmit={(e) => e.preventDefault()} autocomplete="off">
        <div className="slideMultiStepForm" style={{ transform: `translate(-${position * 100}vw, 0)` }}>
          {
            Questions.map((quest, i) => (
              <div id={`step-${i}`} className="singleStep" key={i.toString()}>
                <div className="container">
                  {
                    quest.inputs && (
                      <>
                        {
                          quest.titleGreen && (
                            <h5 className="txtGreen400">{quest.titleGreen}</h5>
                          )
                        }
                        <h5>{extractTitle(quest.title)}</h5>
                        {
                          quest.inputs.map((input, f) => (
                              <div key={f.toString()}>
                                {
                                  input.type === 'Map' ? (
                                    <>
                                      <div className="mb-2 pos-r zIndex3">
                                        <Field
                                          name={input.name}
                                          label={input.label}
                                          component={() => (
                                            <Maps
                                              zoom={14}
                                              scrollZoom
                                              moveMarker
                                              draggable
                                              showSearchLocation
                                              showSelectCountry
                                              showMap={false}
                                              isShowZip={false}
                                            />
                                          )}
                                          options={input.options}
                                          validate={input.validation}
                                          type={input.type}
                                          onChange={(e) => validateSlide(e, input.name, quest)}
                                        />
                                      </div>
                                      {
                                        formValue.location && formValue.location.address && (
                                          <>
                                            <div className="dis-f jc-b pos-r zIndex2 my-2 w-perc-100">
                                              <p>Is this the place?</p>
                                              <button onClick={() => changeFieldValue('location', {})}>Change</button>
                                            </div>
                                            <div className="pos-r zIndex1">
                                              <div className="curAdr">{formValue.location.address}</div>
                                              <Maps
                                                zoom={14}
                                                scrollZoom
                                                moveMarker
                                                draggable
                                                showMap
                                                isShowZip={false}
                                              />
                                            </div>
                                          </>
                                        )
                                      }
                                    </>
                                  ) : (
                                    <div className="dis-f a-t jc-b">
                                      <div className="dis-f a-c jc-b w-perc-100">
                                        <Field
                                          className="mb-2 w-perc-100"
                                          name={input.name}
                                          label={input.label}
                                          icons={quest.icons}
                                          component={quest.component}
                                          fluid={true}
                                          options={quest.options}
                                          validate={input.validation}
                                          type={input.type}
                                          step={+input.step}
                                          min={input.min}
                                          onChange={(e) => validateSlide(e, input.name, quest)}
                                          deactivable={false}
                                          meta={{
                                            dirty: formValue[input.name] && errorValue[input.name] !== true,
                                            invalid: formValue[input.name] && errorValue[input.name] !== true,
                                          }}
                                        />
                                        {
                                          input.unit && (
                                            <span className="pl-2">{input.unit}</span>
                                          )
                                        }
                                      </div>
                                      {
                                        quest.inputs.length === 1 && (input.type === 'number' || input.type === 'text') && !input.step && (
                                          <BrixelButtonPrimary
                                            rounded
                                            label="Ok"
                                            className="ml-2"
                                            background="primary"
                                            onClick={() => changeStep()}
                                            disabled={disableNextBtn}
                                            type="submit"
                                          />
                                        )
                                      }
                                    </div>
                                  )
                                }
                                <p className="body2">{input.help}</p>
                              </div>
                            )
                          )
                        }
                      </>
                    )
                  }
                  {
                    quest.cardType && (
                      <>
                        {
                          quest.cardType === 'Resume' && (
                            <div>
                              <div className="bgRed100 brdRadius shadow-4dp">
                                <img src={quest.img} />
                                <div className="py-2 px-2">
                                  {
                                    formValue.location && <p className="body2 cutRow txtPrimary400">{formValue.location.address}</p>
                                  }
                                  <h6 className="txtRed700 mt-2 mb-4">{formValue.pageTitle}</h6>
                                  <div className="dis-f jc-b a-c">
                                    <p className="dis-f a-c">
                                      <BrixelIcon icon="bed" className="mr-1" />
                                      <span className="ff-mono body2">{formValue.rooms}</span>
                                    </p>
                                    <p className="dis-f a-c">
                                      <BrixelIcon icon="plans" className="mr-1" />
                                      <span className="ff-mono body2">{formValue.livingSpace} m</span>
                                    </p>
                                    <p className="dis-f a-c">
                                      <BrixelIcon icon="house-built" className="mr-1" />
                                      <span className="ff-mono body2">{formValue.constructionYear}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <h5 className="mt-5 ta-c" dangerouslySetInnerHTML={{ __html: quest.title}} />
                            </div>
                          )
                        }
                        {
                          (quest.cardType === 'RewardsStep' || quest.cardType === 'LastStep') && (
                            <div>
                              <img src={quest.img} />
                              <h5 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.title}} />
                              {quest.subtitle && (<h6 className="mt-2 ta-c" dangerouslySetInnerHTML={{ __html: quest.subtitle}} />)}
                            </div>
                          )
                        }
                        {
                          quest.cardType === 'createProfile' && (
                            <div>
                              <h5>{quest.title}</h5>
                              {
                                loginPage ? (
                                  <>
                                    <p>
                                      <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>You don't already have a profile?</span>
                                    </p>
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label="Email"
                                      name="email"
                                      placeholder=""
                                      type="email"
                                    />
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label="Password"
                                      name="password"
                                      placeholder=""
                                      type="password"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <p>
                                      <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(true)}>You already have a profile?</span>
                                    </p>
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label="First name"
                                      name="firstName"
                                      placeholder=""
                                      type="text"
                                    />
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label="Last name"
                                      name="lastName"
                                      placeholder=""
                                      type="text"
                                    />
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label="Email address"
                                      name="email"
                                      placeholder=""
                                      type="email"
                                    />
                                    <Field
                                      className="mt-2"
                                      component={BrixelInputText}
                                      label="Phone number"
                                      name="phone"
                                      placeholder=""
                                      type="text"
                                    />
                                    <div className="mt-2">
                                      <Field
                                        component={BrixelCheckbox}
                                        options={[{label: `I hereby confirm that I have read, understand and accept the <a href="${CompanyInfo.link.terms_and_condition}" target="_blank">terms</a> and <a href="${CompanyInfo.link.terms_and_condition}" target="_blank">privacy policy</a> of Brixel.`, value: 'privacy'}]}
                                        name="privacy"
                                        className="body2 w-perc-100 max-w-perc-100"
                                      />
                                    </div>
                                  </>
                                )
                              }
                            </div>
                          )
                        }
                      </>
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
        <div className={`footerAction p-1  shadow-1dp-top ${disableNextBtn ? 'disabledNext' : `${Questions[currentIndex].inputs ? 'successNext' : 'normStep'}`}`}>
          {
            !disableNextBtn && Questions[currentIndex] && Questions[currentIndex].inputs && Questions[currentIndex].successMessage && (
              <p className="txtGreen700 ta-r mb-2">
                {Questions[currentIndex].successMessage}
                <BrixelIcon icon="check" className="ml-1" />
              </p>
            )
          }
          <div className={`dis-f a-c ${hidePrevBtn ? 'jc-fe' : `${Questions[currentIndex].inputs ? 'jc-b' : 'jc-c'}`}`}>
            {
              Questions[currentIndex].inputs && (
                <BrixelButtonIcon
                  className={`${hidePrevBtn ? 'hide' : ''} shadow-2dp`}
                  icon="arrow-simple-left"
                  onClick={() => changeStep('back')}
                  background="white"
                  saturation={0}
                  color="primary"
                  saturationTxt={400}
                  noBorder
                />
              )
            }
            {
              Questions[currentIndex + 1] ? (
                <BrixelButtonPrimary
                  rounded
                  label={!Questions[currentIndex + 2] ? "Create Profile" : "Continue"}
                  background={Questions[currentIndex].inputs ? "green" : "primary"}
                  onClick={() => changeStep()}
                  rightIcon="arrow-simple-right"
                  disabled={disableNextBtn}
                />
              ) : (
                <BrixelButtonPrimary
                  rounded
                  label="Save"
                  background="primary"
                  onClick={() => saveData()}
                  rightIcon="arrow-simple-right"
                  disabled={disableNextBtn}
                />
              )
            }
          </div>
        </div>
      </form>
    </main>
  );
}

OnBoarding.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
  handleCreatePage: PropTypes.func.isRequired,
  handleGetToken: PropTypes.func.isRequired,
  handleSetAwards: PropTypes.func.isRequired,
  handleSetBrixelPoint: PropTypes.func.isRequired,
  language: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
};

OnBoarding.defaultProps = {

};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, 'form.OnBoarding.syncErrors', {}),
  formValue: get(state, 'form.OnBoarding.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
  language: get(state, 'common.language', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('OnBoarding', field, value));
  },
  checkValid() {
    dispatch(isValid('OnBoarding'))
  },
  handleCreateUser: bindActionCreators(validateUser, dispatch),
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
  handleSetPage: bindActionCreators(setPageData, dispatch),
  handleSetAwards: bindActionCreators(setAwards, dispatch),
  handleSetBrixelPoint: bindActionCreators(setBrixelPoint, dispatch),
});

const OnBoardingForm = reduxForm({
  form: 'OnBoarding', // a unique identifier for this form
})(OnBoarding);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OnBoardingForm);
