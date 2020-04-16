/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import MultiStepForm from '../../components/MultiStepReduxForm';
import { UpgradeQuestions } from '../../resources/Upgrade';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import InfoImg from '../../images/Upgrade/info.svg';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { reset } from 'redux-form';
import { getPackagesProperty, saveUpgradePlan } from '../../actions/PropertyActions';

const Support = Loadable({
  loader: () => import('../../components/Support' /* webpackChunkName: "Support" */),
  loading: Loading,
});

const Upgrade = (props) => {
  // PROPS
  const {
    errorValue,
    formValue,
    handleGetPackagesProperty,
    handleSaveUpgradePlan,
    history,
    match,
    packagesProperty,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(UpgradeQuestions('en', packagesProperty, get(formValue, 'location', {})));
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(UpgradeQuestions('en', packagesProperty, get(formValue, 'location', {})[0]));
  const [isEnter, setIsEnter] = useState(true);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  useEffect(() => {
    const data = {
      smallLoader: true,
    };
    handleGetPackagesProperty(data);
    return () => {
      setCurrentIndex(0);
      reset('Property');
    };
  }, []);

  useEffect(() => {
    setIsEnter(true);
  }, [currentIndex]);

  useEffect(() => {
    if (packagesProperty.length > 0) {
      setQuestions(UpgradeQuestions('en', packagesProperty, get(formValue, 'location', {})));
      setQuest(UpgradeQuestions('en', packagesProperty, get(formValue, 'location', {}))[0]);
    }
  }, [packagesProperty]);

  const closeWindow = () => {
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url || `/${propID}`);
  };

  const saveData = () => {
    const data = {
      page: propID,
      smallLoader: true,
      data: formValue.packageUpgrade
    };
    handleSaveUpgradePlan(data);
  };

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

  useEffect(() => {
    if (formValue.id) {
      let newQuest = [];
      UpgradeQuestions('en').map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false
            }
            return null;
          });
          if (isValid) newQuest.push(quest);
        } else {
          newQuest.push(quest);
        }
        return null;
      });
      setQuestions(newQuest);
    }
  }, [formValue]);

  const valideConditionInput = (quest) => {
    let isVerified = true;
    if (quest.condition) {
      quest.condition.map((item) => {
        if (get(formValue, item.name, null) !== item.value) {
          isVerified = false;
        }
        return null;
      });
    }
    return isVerified;
  };

  const checkValidateField = () => {
    let isValid = true;
    if (questions[currentIndex].inputs) {
      questions[currentIndex].inputs.map((input) => {
        const err = get(errorValue, input.name, null);
        console.log(input.name, err);
        if (input.condition) {
          input.condition.map((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
            return null;
          });
        } else {
          if (err !== true && err !== false && isValid) isValid = false;
        }
        return null;
      });
    }
    return isValid;
  };

  const buttonLabel = () => {
    let label;
    if (currentIndex === 0) label = 'Order now';
    else if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else label = 'Next';
    return label;
  };

  return (
    <div id="achievementSection">
      <div className={`bodyModal dis-fl-col upgradeModal stepNo${currentIndex}`}>
        <div className="dis-f jc-fe p-1 p-md-2 h-fix-72">
          <BrixelButtonIcon
            icon="close-small"
            color="primary"
            saturationTxt={400}
            bgTransparent
            noBorder
            className="shadow-1dp as-c"
            onClick={() => closeWindow()}
          />
        </div>
        <form
          id="multiStepForm"
          // onSubmit={(e) => {e.preventDefault(); changeStep()}}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className={`slideMultiStepForm`}>
            <div
              className={`singleStep jc-c ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a">
                {
                  quest.inputs ? (
                    <div>
                      <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'}`}>{quest.title}</h3>
                      {quest.subtitle && ( <p className="mb-5 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle}} /> )}
                      {
                        quest.inputs.map((input, f) => (
                          <React.Fragment key={f.toString()}>
                            {
                              valideConditionInput(input) && (
                                <MultiStepForm
                                  disableNextBtn={false}
                                  formValue={formValue}
                                  onClick={() => ''}
                                  input={input}
                                  className={input.className}
                                />
                              )
                            }
                          </React.Fragment>
                        ))
                      }
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
                    <div className="max-w-fix-272 shadow-1dp mt-3 m-a">
                      <Support hideClose />
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
                        Don't worry. You will not be charged for now. Get the result first. Pay later.
                      </p>
                    </div>
                  )
                }
                {
                  currentIndex > 0 && questions[currentIndex].inputs && (
                    <BrixelButtonIcon
                      className={`shadow-2dp backBtn`}
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
                  className="noWrap w-perc-100 max-w-fix-160"
                  disabled={!checkValidateField()}
                  rounded
                  background={questions[currentIndex -1] ? 'primary' : 'red'}
                  saturation={400}
                  label={buttonLabel()}
                  rightIcon="arrow-right-small"
                  onClick={() => questions[currentIndex +1] ? changeStep() : closeWindow()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

Upgrade.propTypes = {
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  handleGetPackagesProperty: PropTypes.func.isRequired,
  handleSaveUpgradePlan: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorValue: get(state, 'form.Property.syncErrors', {}),
  formValue: get(state, 'form.Property.values', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
});

const mapDispatchToProps = (dispatch) => ({
  reset(form) {
    (dispatch(reset(form)))
  },
  handleGetPackagesProperty: bindActionCreators(getPackagesProperty, dispatch),
  handleSaveUpgradePlan: bindActionCreators(saveUpgradePlan, dispatch),

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Upgrade);
