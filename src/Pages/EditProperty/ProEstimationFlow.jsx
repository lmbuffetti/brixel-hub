/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  initializeForm,
  MultiFileldsReduxForm,
  BrixelButtonIcon,
  ProgressRing,
  destroy,
  reset,
} from '@brixel/brixel-components';
import { diff } from 'deep-object-diff';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import unset from 'lodash/unset';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import {
  keyify, calcPercentageProEstimation, calcPercentageFacts,
} from '../../utils/helpers';
import { InputSheets } from '../../resources/inputSheets';
import { saveActiveSingleProperty } from '../../actions/PropertyActions';
// import PageHeaderAchievement from '../../components/PageHeaderAchievement';

const ProEstimationFlow = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    formValue,
    handleDestroy,
    handleReset,
    handleSaveActiveSingleProperty,
    history,
    initForm,
    initialValues,
    isSmallLoading,
  } = props;
  // STATE
  const [Questions, setQuestions] = useState([]);
  const [unsavedChange, setUnsavedChange] = useState(false);
  const [percComplete, setPercComplete] = useState(0);
  const [savedBtn, setSavedBtn] = useState(false);

  useEffect(() => {
    if (initialValues.id) {
      initForm(initialValues);
    }
  }, [initialValues.id]);

  useEffect(() => {
    if (!isSmallLoading.saveData) {
      setSavedBtn(true);
      setTimeout(() => {
        setUnsavedChange(false);
      }, 2000);
    }
  }, [isSmallLoading.saveData]);

  // ON CLOSE WINDOW TWO DIFFERENT ACTION BY SCREEN RESOLUTION
  const closeWindow = () => {
    handleDestroy();
    history.push(`/${activeSingleProperty.id}/property/price`);
  };

  // FUNCTION TO SAVE DATA AND DO ALL CALC OF ASSESSOR BY AGE
  const saveData = () => {
    const changeObj = diff(initialValues, formValue);
    const objToSave = {};
    Object.keys(changeObj).map((key) => {
      objToSave[key] = get(formValue, key, {});
      return null;
    });
    const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
    inputSheet.totalComplete = calcPercentageFacts().calcPerc;
    objToSave.inputSheet = inputSheet;
    const data = {
      id: activeSingleProperty.id,
      smallLoader: 'saveData',
      setSuccessNotification: true,
      ...objToSave,
    };
    // ADD THE ACHIEVEMENT
    handleSaveActiveSingleProperty(data);
  };

  // FUNCTION TO REMOVE ALL SINGLE OBJECT FROM INPUT SHEETS
  useEffect(() => {
    const fieldsChanged = diff(initialValues, formValue);
    const toOmit = ['location.geometry', 'progress', 'inputSheet'];
    const changeObj = omit(fieldsChanged, toOmit);
    const keyChanged = keyify(changeObj);
    if (initialValues.id && formValue.id && Object.keys(changeObj).length > 0) {
      setUnsavedChange(true);
      setSavedBtn(false);
    } else {
      setUnsavedChange(false);
    }
    if (Object.keys(initialValues).length > 0 && Object.keys(formValue).length > 0) {
      keyChanged.forEach((item) => {
        InputSheets('proEstimation').forEach((singleQuest) => {
          singleQuest.inputs.forEach((input) => {
            if (input.condition) {
              if (input.condition.name) {
                if (input.condition.name === item) {
                  if (input.condition.value && input.condition.value !== get(formValue, item, null)) {
                    unset(formValue, input.name);
                  }
                }
              } else {
                input.condition.forEach((condition) => {
                  if (condition.name === item) {
                    if (condition.value && condition.value !== get(formValue, item, null)) {
                      unset(formValue, input.name);
                    }
                  }
                });
              }
            }
          });
        });
      });
    }
    const questList = [];
    InputSheets('proEstimation').forEach((singleQuest) => {
      singleQuest.inputs.forEach((input) => {
        if (input.isProEstimation) {
          let mergeCondition = [];
          if (input.condition && input.condition.name && input.condition.value) {
            mergeCondition = [{ name: input.condition.name, value: input.condition.value }];
          } else if (input.condition && input.condition.name && input.condition.noValue) {
            mergeCondition = [{ name: input.condition.name, noValue: input.condition.noValue }];
          } else if (input.condition) {
            mergeCondition = input.condition;
          }
          if (input.proEstimationConditions) {
            mergeCondition = mergeCondition.concat(input.proEstimationConditions);
          }
          let isValid = true;
          if (mergeCondition.length > 0) {
            mergeCondition.forEach((item) => {
              if (item.value && item.value !== get(formValue, item.name, null)) {
                isValid = false;
              } else if (item.noValue && item.noValue === get(formValue, item.name, null)) {
                isValid = false;
              }
            });
          }
          if (isValid) questList.push(input);
        }
      });
    });
    setQuestions(questList);
    const percentageComplete = calcPercentageProEstimation('formFlow');
    setPercComplete(percentageComplete.realPerc);
  }, [formValue]);

  // CHECK IF FIELD IS VALID
  const checkValidateField = (act) => {
    const isValid = true;
    const isNotEmpty = false;
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  if (!formValue.id) {
    return (
      <div />
    );
  }

  return (
    <div id="bodyModalWrapper" className="achievementFlow ProEstimationFlow">
      <div className="bodyModal">
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
          className="dis-fl-col jc-b formFlow"
        >
          <div className="multiStepSlides">
            <div className="singleStep jc-c">
              <div className="subcontainer m-a">
                <div className="pos-a max-w-fix-768 w-perc-100 x-c jc-fe dis-f pr-2 pt-2 pr-md-3 pt-md-3">
                  <BrixelButtonIcon
                    icon="close-small"
                    ghost
                    theme="dark"
                    onClick={() => history.push(`/${activeSingleProperty.id}/property/price`)}
                  />
                </div>
                <div className="mt-4 pb-3">
                  <h4>Pro Estimation inputs</h4>
                </div>
                <MultiFileldsReduxForm
                  showCheckMark
                  hintMessage
                  disableNextBtn={false}
                  formValue={formValue}
                  form="formFlow"
                  inputs={Questions}
                  onClick={() => ''}
                />
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-lg-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="container pos-r">
              <div
                className="w-perc-100 a-c dis-fl-row jc-b m-a"
              >
                <div className="dis-f a-c">
                  <ProgressRing
                    progress={percComplete}
                    size={45}
                    strokeWidth={6}
                    circleOneStroke="#DCDDDE"
                    circleTwoStroke="#1E1491"
                    showIcon={false}
                  />
                  <div className="ml-2">
                    <p className="hide dis-b-sm">Inputs</p>
                    <p className="ff-mono fweight-700 txtPrimary700">
                      <span className="mr-1 notranslate dis-b dis-ib-sm">
                        {percComplete}%
                      </span>
                      <span>completed</span>
                    </p>
                  </div>
                </div>
                {
                  unsavedChange ? (
                    <div className="dis-f a-c">
                      {
                        !isSmallLoading.saveData && !savedBtn && (
                          <>
                            <BrixelButtonIcon
                              secondary
                              className="hide-sm mr-2"
                              theme="red"
                              icon="close-small"
                              onClick={() => (savedBtn ? '' : closeWindow())}
                            />
                            <BrixelButtonSecondary
                              rounded
                              className="noWrap mr-2 hide dis-b-sm"
                              saturation={400}
                              theme="red"
                              label="Discard"
                              onClick={() => (savedBtn ? '' : handleReset(initialValues))}
                            />
                          </>
                        )
                      }
                      <BrixelButtonPrimary
                        rounded
                        className="noWrap"
                        saturation={400}
                        theme={savedBtn ? 'green' : 'primary'}
                        label="Save"
                        onClick={() => (savedBtn ? '' : saveData())}
                        isLoading={isSmallLoading.saveData}
                        isSaved={savedBtn}
                      />
                    </div>
                  ) : (
                    <>
                      <BrixelButtonSecondary
                        rounded
                        className="noWrap"
                        saturation={400}
                        theme="primary"
                        label="Close"
                        onClick={() => closeWindow()}
                      />
                    </>
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

ProEstimationFlow.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleDestroy: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'brixelForm.formFlow.syncErrors', {}),
  formValue: get(state, 'brixelForm.formFlow.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
  initialValues: {
    ...get(state, 'brixelForm.Property.values', {}),
    properties: {
      ...get(state, 'brixelForm.Property.values.properties', {}),
      parking: {
        ...get(state, 'brixelForm.Property.values.parking', {}),
        garage: get(state, 'brixelForm.Property.values.parking.garage', 0),
        outside: get(state, 'brixelForm.Property.values.parking.garage', 0),
        underground: get(state, 'brixelForm.Property.values.parking.garage', 0),
      },
      typology: {
        ...get(state, 'brixelForm.Property.values.typology', {}),
        bathrooms: get(state, 'brixelForm.Property.values.bathrooms', 0),
      },
    },
  },
});

const mapDispatchToProps = (dispatch) => ({
  handleDestroy() {
    dispatch(destroy('formFlow'));
  },
  handleReset(value) {
    dispatch(reset('formFlow', value));
  },
  initForm(value) {
    dispatch(initializeForm('formFlow', value));
  },
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ProEstimationFlow);
