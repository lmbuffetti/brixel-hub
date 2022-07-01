/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelProgressLineDots,
} from '@brixel/brixel-components';
import {
  MultiFileldsReduxForm,
  reset,
  initializeForm,
  change,
} from '@brixel/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import queryString from 'query-string';
import { BestimateQuestions } from '../../resources/Flows/Bestimate';
import { saveActiveSingleProperty } from '../../actions/PropertyActions';

const Bestimate = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    changeFieldValue,
    errorValue,
    formValue,
    handleSaveActiveSingleProperty,
    initForm,
    initialValues,
    initialValuesPage,
    handleReset,
  } = props;
  // STATE
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEnter, setIsEnter] = useState(true);
  const [numberQuestions, setNumberQuestions] = useState(0);
  const [quest, setQuest] = useState(BestimateQuestions('en')[0]);
  const [questions, setQuestions] = useState(BestimateQuestions('en'));
  // GET URL PARAMS
  const getAchievement = () => history.location.pathname.split('/')[4];
  const urlData = queryString.parse(get(history, 'location.search', ''));
  const propID = get(match, 'propID', null);

  // INITIALIZE FORM
  useEffect(() => {
    initForm(cloneDeep(initialValues));
    if (activeSingleProperty.id && initialValues.id && get(initialValues, 'location.countryCode', 'CH') === 'PT') {
      if (get(initialValues, 'parking.garage', 0) === 0) {
        changeFieldValue('properties.parking.garage', 0);
      }
      if (get(initialValues, 'parking.outside', 0) === 0) {
        changeFieldValue('properties.parking.outside', 0);
      }
    }
  }, [activeSingleProperty]);
  
  useEffect(() => {
    const redirectURL = get(urlData, 'url', null);
    if (redirectURL) localStorage.setItem('backUrl', redirectURL);
  }, []);
  

  // ON CHANGE STEP LOAD THE ENTER EFFECT AND IF HAS TO REDO
  useEffect(() => {
    setIsEnter(true);
    if (questions[currentIndex].history) {
      const redo = get(history, 'location.state.redo', false);
      if (getAchievement()) {
        history.push({
          pathname: `/${propID}/singleFlow/achievement/${getAchievement()}/${questions[currentIndex].history}`,
          state: {
            redo,
          },
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (get(formValue, 'properties.extraFeaturesBestimatePT', null)) {
      changeFieldValue('properties.extraFeatures.equippedKitchen', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('equippedKitchen'));
      changeFieldValue('properties.building.blinds.blindsElectric', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('electricBlinds'));
      let windowsMaterials = [];
      if (get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('doubleGlazedWindows')) {
        windowsMaterials = ['doubleGlazed'];
      }
      if (windowsMaterials[0] !== get(formValue, 'properties.building.windows.materials', [])[0]) changeFieldValue('properties.building.windows.materials', windowsMaterials);
      changeFieldValue('properties.extraFeatures.suite', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('masterBedroom'));
      changeFieldValue('properties.extraFeatures.wardrobe', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('wardrobe'));
      changeFieldValue('properties.energy.ac', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('airConditioning'));
      let centralHeating = [];
      if (get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('heatingSystem')) {
        centralHeating = ['centralHeating'];
      }
      if (centralHeating[0] !== get(formValue, 'properties.energy.heatingSystem', [])[0]) changeFieldValue('properties.energy.heatingSystem', centralHeating);
      changeFieldValue('properties.extraFeatures.fireplace', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('fireplace'));
      changeFieldValue('properties.extraFeatures.swimmingPool', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('pool'));
      changeFieldValue('properties.extraFeatures.gym', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('gym'));
      changeFieldValue('properties.extraFeatures.elevator', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('elevator'));
      changeFieldValue('properties.typology.storeroom', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('storageRoom'));
      changeFieldValue('properties.typology.basement', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('basement'));
      changeFieldValue('properties.extraFeatures.seaView', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('seaView'));
      changeFieldValue('properties.extraFeatures.cityView', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('cityView'));
      changeFieldValue('properties.typology.pantry', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('pantry'));
      changeFieldValue('properties.extraFeatures.videoSecurity', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('dorbellVideo'));
      changeFieldValue('properties.extraFeatures.alarm', get(formValue, 'properties.extraFeaturesBestimatePT', []).includes('alarm'));
      const efficiencyCertified = get(formValue, 'properties.energy.efficiency', null) !== null ? 'yes' : null;
      changeFieldValue('properties.energy.efficiencyCertified', efficiencyCertified);
    }
  }, [get(formValue, 'properties.extraFeaturesBestimatePT', null)]);

  // ON CLOSE WINDOW TWO DIFFERENT ACTION BY SCREEN RESOLUTION
  const closeWindow = () => {
    const redirectURL = localStorage.getItem('backUrl');
    if (redirectURL) history.push(redirectURL);
    else history.push(`/${propID}/home`);
    localStorage.removeItem('backUrl');
  };

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const data = {
      id: propID,
      properties: get(formValue, 'properties', {}),
    };
    handleSaveActiveSingleProperty(data);
    handleReset('Property', initialValuesPage);
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
    if (questions[newIndex].toSave) {
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
      let numQuest = 0;
      BestimateQuestions().map((questData) => {
        if (questData.condition) {
          let isValid = true;
          questData.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) {
            numQuest += 1;
            newQuest.push(questData);
          }
        } else {
          if (questData.inputs) numQuest += 1;
          newQuest.push(questData);
        }
        return null;
      });
      setNumberQuestions(numQuest);
      setQuestions(newQuest);
    }
  }, [formValue]);

  // CHECK IF FIELD IS VALID
  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.map((input) => {
        const err = get(errorValue, input.name, null);
        const noEmpty = get(formValue, input.name, 'ayc');
        if (noEmpty !== 'ayc') isNotEmpty = true;
        if (input.condition) {
          input.condition.map((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
            return null;
          });
        } else if (input.validation) {
          if (err !== true && err !== false && isValid) isValid = false;
        }
        return null;
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else if (get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else if (currentIndex === 0) label = 'Next';
    else label = 'Next';
    return label;
  };

  if (!formValue.id) {
    return (
      <div />
    );
  }

  return (
    <div id="bodyModalWrapper" className="achievementFlow">
      <div className="bodyModal">
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className="dis-f jc-fe a-c mx-a max-w-fix-736 w-perc-100 mb-2 mt-2">
            <BrixelButtonIcon
              icon="close-small"
              onClick={() => closeWindow()}
            />
          </div>
          <div className="multiStepSlides">
            <div
              className={`singleStep jc-c ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer mt-0 m-a h-perc-100">
                {
                  quest.inputs && (
                    <>
                      <div className="mt-2 mb-5">
                        <BrixelProgressLineDots
                          color="Primary"
                          backgroundSaturation={100}
                          saturation={600}
                          activeStep={currentIndex}
                          steps={numberQuestions}
                        />
                      </div>
                      <div>
                        <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'}`}>{quest.title}</h3>
                        {quest.subtitle && (
                          <p className="mb-5 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)}
                        <MultiFileldsReduxForm
                          disableNextBtn={false}
                          formValue={formValue}
                          form="GamingFlow"
                          inputs={quest.inputs}
                          onClick={() => ''}
                        />
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-lg-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="container pos-r">
              <div className={`w-perc-100 a-c dis-fl-row jc-b m-a ${currentIndex === questions.length - 1 ? 'jc-c' : 'jc-b'}`}>
                {
                  questions[currentIndex] && questions[currentIndex].inputs && (
                    <BrixelButtonIcon
                      className={`backBtn ${currentIndex === 0 ? 'hide' : ''}`}
                      icon="arrow-simple-left"
                      onClick={() => changeStep('back')}
                      ghost
                    />
                  )
                }

                {
                  buttonLabel().toLowerCase() === 'skip' ? (
                    <BrixelButtonText
                      className={`noWrap ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''} ${currentIndex === 0 ? 'ml-a' : ''}`}
                      disabled={!checkValidateField()}
                      saturation={400}
                      color="light"
                      label={buttonLabel()}
                      rightIcon="arrow-right-small"
                      onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                    />
                  ) : (
                    <BrixelButtonPrimary
                      className={`noWrap ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''} ${currentIndex === 0 ? 'ml-a' : ''}`}
                      disabled={!checkValidateField()}
                      rounded
                      label={buttonLabel()}
                      rightIcon="arrow-right-small"
                      onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                    />
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

Bestimate.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  initialValuesPage: PropTypes.object.isRequired,
  handleReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'property.activeSingleProperty', {});
  const defaultStatusCondition = get(formValue, 'location.countryCode', '').toLowerCase() !== 'ch' ? 'used' : '';
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    errorValue: get(state, 'brixelForm.GamingFlow.syncErrors', {}),
    formValue: get(state, 'brixelForm.GamingFlow.values', {}),
    initialValuesPage: get(state, 'brixelForm.Property.initialValues', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    initialValues: {
      id: get(state, 'property.activeSingleProperty.id', null),
      properties: {
        ...get(state, 'property.activeSingleProperty.properties', null),
        building: {
          ...get(state, 'property.activeSingleProperty.properties.building', null),
          conditionStatus: get(state, 'property.activeSingleProperty.properties.building.conditionStatus', defaultStatusCondition),
        },
        parking: {
          ...get(state, 'property.activeSingleProperty.properties.parking', null),
          garage: get(formValue, 'properties.parking.garage', 0),
          outside: get(formValue, 'properties.parking.outside', 0),
        },
        typology: {
          ...get(state, 'property.activeSingleProperty.properties.typology', null),
          bedrooms: get(formValue, 'properties.typology.bedrooms', 3),
          bathrooms: get(formValue, 'properties.typology.bathrooms', 1),
        },
      },
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GamingFlow', field, value));
  },
  handleReset(form, data) {
    (dispatch(reset(form, data)));
  },
  initForm(value) {
    dispatch(initializeForm('GamingFlow', value));
  },
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Bestimate);
