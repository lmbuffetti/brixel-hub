/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonIcon, BrixelButtonPrimary, MultiFileldsReduxForm, reset, initializeForm,
} from '@brixel/brixel-components';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { UpgradeQuestions } from '../../resources/Upgrade';
import InfoImg from '../../images/Upgrade/info.svg';
import { getPackagesProperty, saveUpgradePlan } from '../../actions/PropertyActions';

const Support = Loadable({
  loader: () => import('../../components/Support' /* webpackChunkName: "Support" */),
  loading: Loading,
});

const Upgrade = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    errorValue,
    formValue,
    handleSaveUpgradePlan,
    history,
    initialValues,
    initForm,
    match,
    packagesProperty,
    reset,
  } = props;
  // STATE
  const locationQuest = get(formValue, 'location', {});
  const [questions, setQuestions] = useState(UpgradeQuestions('en', packagesProperty, locationQuest));
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(UpgradeQuestions('en', packagesProperty, locationQuest)[0]);
  const [isEnter, setIsEnter] = useState(true);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  // ON CHANGE STEP LOAD THE ENTER EFFECT
  useEffect(() => {
    setIsEnter(true);
  }, [currentIndex]);

  useEffect(() => {
    initForm(initialValues);
  }, [activeSingleProperty]);

  // LOAD THE QUESTIONS
  useEffect(() => {
    if (packagesProperty.length > 0) {
      setQuestions(UpgradeQuestions('en', packagesProperty, get(formValue, 'location', {})));
      setQuest(UpgradeQuestions('en', packagesProperty, get(formValue, 'location', {}))[0]);
    }
  }, [packagesProperty]);

  // ON CLOSE WINDOW GO BACK TO ORIGIN URL
  const closeWindow = () => {
    reset('GamingFlow');
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/${propID}`);
  };

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const data = {
      page: propID,
      smallLoader: true,
      data: formValue.packageUpgrade,
    };
    handleSaveUpgradePlan(data);
  };

  // FUNCTION TO CHANGE STEP - BACK-FORWARD
  const changeStep = (act) => {
    setIsEnter(false);
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }
    if (questions[currentIndex + 1].toSave) {
      saveData();
    }
    setCurrentIndex(newIndex);
    // setPosition(newIndex);
    setQuest(questions[newIndex]);
  };

  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    if (formValue.id) {
      const newQuest = [];
      UpgradeQuestions('en').map((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(quests);
        } else {
          newQuest.push(quests);
        }
        return null;
      });
      setQuestions(newQuest);
    }
  }, [formValue]);

  // CHECK IF FIELD IS VALID
  const checkValidateField = () => {
    let isValid = true;
    if (questions[currentIndex].inputs) {
      questions[currentIndex].inputs.forEach((input) => {
        const err = get(errorValue, input.name, null);
        if (input.condition) {
          input.condition.map((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
            return null;
          });
        } else if (err !== true && err !== false && isValid) isValid = false;
      });
    }
    return isValid;
  };

  // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
  const buttonLabel = () => {
    let label;
    if (currentIndex === 0) label = 'Order now';
    else if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else label = 'Next';
    return label;
  };

  return (
    <div id="bodyModalWrapper" className="modalFlow">
      <div className={`bodyModal dis-fl-col upgradeModal stepNo${currentIndex}`}>
        <header className="max-w-fix-760 ml-a mr-a dis-f w-perc-100 jc-fe">
          <div className="dis-f a-c p-1 p-md-2">
            <BrixelButtonIcon
              icon="close-small"
              color="primay"
              saturationTxt={400}
              bgTransparent
              noBorder
              className="shadow-2dp as-c"
              onClick={() => closeWindow()}
            />
          </div>
        </header>
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className="multiStepSlides">
            <div
              className={`singleStep jc-c ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a">
                {
                  quest.inputs ? (
                    <div>

                      <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'}`}>{quest.title}</h3>
                      {quest.subtitle && (<p className="mb-5 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)}

                      <MultiFileldsReduxForm
                        disableNextBtn={false}
                        formValue={formValue}
                        form="GamingFlow"
                        inputs={quest.inputs}
                        onClick={() => ''}
                      />
                    </div>
                  ) : (
                    <div className="ta-c">
                      <div className="h-fix-248">
                        <img src={quest.img} alt={quest.title} />
                      </div>
                      <h3
                        className="mt-5"
                        dangerouslySetInnerHTML={{ __html: quest.title }}
                      />
                      <p
                        className="m-a mt-2 max-w-fix-400"
                        dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                      />
                    </div>
                  )
                }
                {
                  currentIndex === 0 && (
                    <div className="max-w-fix-360 shadow-1dp mt-3 m-a">
                      <Support hideClose expanded />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-md-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'}`}
          >
            <div className="container pos-r">
              <div className={`w-perc-100 a-c ${currentIndex === 0 ? 'dis-fl-col dis-fl-row-md jc-c-md' : 'dis-fl-row jc-b'} m-a ${currentIndex === questions.length - 1 ? 'jc-c' : 'jc-b'}`}>
                {
                  currentIndex === 0 && (
                    <div className="dis-fl-col dis-fl-row-md a-c w-perc-100">
                      <img src={InfoImg} alt="Info" className="mb-1 mb-md-0" />
                      <p className="body2 ml-1 mb-1 mb-md-0 ta-c ta-l-md  max-w-fix-384">
                        Don&apos;t worry. You will not be charged for now. Get the result first. Pay later.
                      </p>
                    </div>
                  )
                }
                {
                  currentIndex > 0 && questions[currentIndex].inputs && (
                    <BrixelButtonIcon
                      className="shadow-2dp backBtn"
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
                <BrixelButtonPrimary
                  className="noWrap"
                  disabled={!checkValidateField()}
                  rounded
                  background={questions[currentIndex - 1] ? 'primary' : 'red'}
                  saturation={400}
                  label={buttonLabel()}
                  rightIcon="arrow-right-small"
                  onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

Upgrade.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveUpgradePlan: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.GamingFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.GamingFlow.values', {}),
    packagesProperty: get(state, 'companies.activeSingleCompany.servicePackages', []),
    initialValues: {
      id: get(state, 'property.activeSingleProperty.id', null),
      packageUpgrade: {
        contactPhone: {
          prefix: get(state, 'property.activeSingleProperty.owner.phone.prefix', countryPhoneCode.dial_code),
          number: get(state, 'property.activeSingleProperty.owner.phone.number', ''),
        },
      },
      contactEmail: get(state, 'property.activeSingleProperty.owner.email', null),
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('GamingFlow', value));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleGetPackagesProperty: bindActionCreators(getPackagesProperty, dispatch),
  handleSaveUpgradePlan: bindActionCreators(saveUpgradePlan, dispatch),

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Upgrade);
