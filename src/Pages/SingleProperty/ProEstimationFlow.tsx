import React, {useEffect, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, ProgressRing} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {destroy, initializeForm, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import {diff} from 'deep-object-diff';
import {bindActionCreators, compose} from 'redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import {calcPercentageFacts, calcPercentageProEstimation, keyify} from '../../utils/helpers';
import {InputSheets} from '../../resources/SingleProperty/inputSheets';
import {getEstimation, saveActiveSingleProperty} from '../../actions/PropertyActions';
import {preventExitFromScreen, setModal, setSplashType, setUnsavedChangesModal} from '../../actions/CommonActions';
import type {ProEstimationFlowType} from '../../@types/Pages/SingleProperty/ProEstimationFlow';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const ProEstimationFlow = (props: ProEstimationFlowType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleProperty,
    estimation,
    formValue,
    handleDestroy,
    handleGetEstimation,
    handleReset,
    handleSaveActiveSingleProperty,
    handleSetModal,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
  } = props;
  // STATE
  const [Questions, setQuestions] = useState<QuestionsListType[]>([]);
  const [unsavedChange, setUnsavedChange] = useState(false);
  const [percComplete, setPercComplete] = useState(0);
  const [savedBtn, setSavedBtn] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);

  useEffect(() => {
    if (activeSingleProperty.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    if (!isSmallLoading.saveData) {
      setSavedBtn(true);
      setTimeout(() => {
        setUnsavedChange(false);
      }, 2000);
    }
  }, [isSmallLoading.saveData]);

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const objToSave = {properties: formValue.properties};
    if (estimation.id) {
      const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
      set(inputSheet, 'totalComplete', calcPercentageFacts().calcPerc);
      set(objToSave, 'inputSheet', inputSheet);
      const data = {
        id: activeSingleProperty.id,
        smallLoader: 'saveData',
        setSuccessNotification: true,
        ...objToSave,
        sendNotification,
        estimationId: estimation.id,
      };
      // ADD THE ACHIEVEMENT
      handleSaveActiveSingleProperty(data);
    } else {
      const payload = {
        reloadOnwProperties: true,
        type: 'market',
        id: activeSingleProperty.id,
      };
      handleGetEstimation(payload);
    }
  };

  // FUNCTION TO REMOVE ALL SINGLE OBJECT FROM INPUT SHEETS
  useEffect(() => {
    if (formValue.id) {
      const fieldsChanged = diff(initialValues, formValue);
      const toOmit = ['location.geometry', 'progress', 'inputSheet'];
      const changeObj = omit(fieldsChanged, toOmit);
      const keyChanged = keyify(changeObj);
      if (get(initialValues, 'id', null) && formValue.id && Object.keys(changeObj).length > 0) {
        setUnsavedChange(true);
        setSavedBtn(false);
      } else {
        setUnsavedChange(false);
      }
      if (Object.keys(initialValues).length > 0 && Object.keys(formValue).length > 0) {
        keyChanged.forEach((item) => {
          InputSheets('proEstimation', 'formFlow', lang).forEach((singleQuest) => {
            if (singleQuest.inputs) {
              singleQuest.inputs.forEach((input) => {
                if (input.condition) {
                  if (get(input, 'condition.name', null)) {
                    if (get(input, 'condition.name', null) === item) {
                      if (get(input, 'condition.value', null) && get(input, 'condition.value', null) !== get(formValue, item, null)) {
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
            }
          });
        });
      }
      const questList: QuestionsListType[] = [];
      InputSheets('proEstimation', 'formFlow', lang).forEach((singleQuest) => {
        get(singleQuest, 'inputs', []).forEach((input) => {
          if (input.isProEstimation) {
            let mergeCondition: object[] = [];
            if (input.condition && get(input, 'condition.name', null) && get(input, 'condition.value', null)) {
              mergeCondition = [{ name: get(input, 'condition.name', null), value:get(input, 'condition.value', null) }];
            } else if (input.condition && get(input, 'condition.name', null) && get(input, 'condition.noValue', null)) {
              mergeCondition = [{ name: get(input, 'condition.name', null), noValue: get(input, 'condition.noValue', null) }];
            } else if (input.condition) {
              mergeCondition = input.condition;
            }
            if (input.proEstimationConditions) {
              mergeCondition = mergeCondition.concat(input.proEstimationConditions);
            }
            let isValid = true;
            if (mergeCondition.length > 0) {
              mergeCondition.forEach((item) => {
                const name = get(item, 'name', '');
                if (get(item, 'value', null) && get(item, 'value', null) !== get(formValue, name, null)) {
                  isValid = false;
                } else if (get(item, 'noValue', null) && get(item, 'noValue', null) === get(formValue, name, null)) {
                  isValid = false;
                }
              });
            }
            if (isValid) questList.push(input);
          }
        });
      });
      setQuestions(questList);
      const percentageComplete = calcPercentageProEstimation('formFlow', {});
      setPercComplete(percentageComplete.realPerc);
    }
  }, [formValue]);

  useEffect(() => {
    setSendNotification(percComplete >= 100);
  }, [percComplete]);


  // CHECK IF FIELD IS VALID
  const checkValidateField = (act = '') => {
    const isValid = true;
    const isNotEmpty = false;
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  // ON CLOSE WINDOW TWO DIFFERENT ACTION BY SCREEN RESOLUTION
  const closeWindow = (skipModal = false) => {
    if (unsavedChange && !skipModal) {
      handleSetModal({
        state: true,
        type: 'confirmExit',
        saveFunc: () => saveData(),
        formName: 'formFlow',
        onClose: () => closeWindow(true),
      });
    } else {
      handleDestroy();
      history.push(`/${activeSingleProperty.id}/property/price`);
    }
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
                    onClick={() => closeWindow()}
                  />
                </div>
                <div className="mt-4 pb-3">
                  <h4>{translateTo('Pro Estimation inputs', lang)}</h4>
                </div>
                <MultiFileldsReduxForm
                  autofocus={false}
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
                    circleTwoStroke="#004D71"
                    showIcon={false}
                  />
                  <div className="ml-2">
                    <p className="hide dis-b-sm">{translateTo('Inputs', lang)}</p>
                    <p className="ff-mono fweight-700 txtPrimary700">
                      <span className="mr-1 notranslate dis-b dis-ib-sm">
                        {percComplete}%
                      </span>
                      <span>{translateTo('completed', lang)}</span>
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
                              theme="red"
                              label={translateTo('Discard', lang)}
                              onClick={() => (savedBtn ? '' : handleReset(initialValues))}
                            />
                          </>
                        )
                      }
                      <BrixelButtonPrimary
                        rounded
                        className={savedBtn || isSmallLoading.saveData ? 'notranslate' : 'noWrap'}
                        theme={savedBtn ? 'green' : 'primary'}
                        label={translateTo('Save', lang)}
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
                        theme="primary"
                        label={translateTo('Close', lang)}
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

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'brixelForm.formFlow.syncErrors', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.formFlow.values', {}),
  lang: get(state, 'common.language', 'en'),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  packagesProperty: get(state, 'property.packagesProperty', []),
  initialValues: {
    id: get(state, 'property.activeSingleProperty.id', {}),
    location: get(state, 'property.activeSingleProperty.location', {}),
    properties: {
      ...get(state, 'property.activeSingleProperty.properties', {}),
      parking: {
        ...get(state, 'property.activeSingleProperty.properties.parking', {}),
        garage: get(state, 'property.activeSingleProperty.properties.parking.garage', 0),
        outside: get(state, 'property.activeSingleProperty.properties.parking.garage', 0),
        underground: get(state, 'property.activeSingleProperty.properties.parking.garage', 0),
      },
      typology: {
        ...get(state, 'brixelForm.Property.values.properties.typology', {}),
        bathrooms: get(state, 'brixelForm.Property.values.properties.typology.bathrooms', 0),
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
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
  setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ProEstimationFlow);
