/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
  BrixelIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  setModal, setScreenNotification,
} from '../../actions/CommonActions';
import { uploadDocument, deleteDocument } from '../../actions/UploadActions';
import { InputSheets } from '../../resources/inputSheets';

// COMPONENTS
import { saveActiveSingleProperty } from '../../actions/PropertyActions';
import FactsQuestion from './FactsQuestion';

const InputSheet = (props) => {
  const {
    changeFieldValue,
    formValue,
    handleSaveProperty,
    isSmallLoading,
    match,
  } = props;

  // STATE
  const [Questions] = useState(InputSheets('en'));
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [changeSection, setChangeSection] = useState(false);
  // PARAMS URL
  const propID = get(match, 'params.propId', null);

  const checkSectionDone = (val, act = 'section') => {
    let sectionDone = true;
    val.inputs.map((item) => {
      if (item.validation) {
        if (sectionDone) {
          if (get(formValue, `inputSheet.skipSection[${item.name}]`, true) !== true) {
            sectionDone = false;
          }
          else if (get(formValue, item.name, false) === false) {
            sectionDone = false;
          }
        }
      }
      return null;
    });
    if (act === 'section') return sectionDone;
  };

  const calcPercentage = () => {
    let countTotal = 0;
    let countDone = 0;
    Questions.map((val) => {
      val.inputs.map((item) => {
        const name = get(item, 'condition.name', '');
        const valA = get(formValue, name, 'a');
        if (item.validation && (!item.condition || (item.condition && valA === item.condition.value))) {
          if (get(formValue, `inputSheet.skipSection[${item.name}]`, false)) {
            countTotal += 1;
            countDone += 1;
          }
          else if (get(formValue, item.name, false)) {
            countTotal += 1;
            countDone += 1;
          } else {
            countTotal += 1;
          }
        }
        return null;
      });
      return null;
    });
    const inputSheet = get(formValue, 'inputSheet', {});
    const calPerc = countDone * countTotal / 100;
    const savedPerc = get(formValue, `inputSheet.totalComplete`, 0);
    if (calPerc !== savedPerc) {
      inputSheet.totalComplete = calPerc;
      changeFieldValue('inputSheet', inputSheet);
    }
    return calPerc;
  };

  useEffect(() => {
    calcPercentage();
  }, [formValue]);

  useEffect(() => {
    if (changeSection) {
      const selectEl = Questions.findIndex(item => item.history === selectedQuest.history);
      setSelectedQuest(Questions[selectEl + 1]);
      setChangeSection(false);
    }
  }, [isSmallLoading]);

  const saveData = async () => {
    const dataToSend = formValue;
    delete dataToSend.owner;
    delete dataToSend.favoritedByUsers;
    const data = {
      id: propID,
      smallLoader: true,
      ...dataToSend,
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)
    // const dataInputSheet = {
    //   skipSection: skipSection,
    // totalComplete: getCalcSectionInputSheets(Questions, formValue, accordion,'getPercentage', null),
    // };

    // await handleSaveProperty({id: propID, inputSheet: dataInputSheet});
    setChangeSection(true);
    await handleSaveProperty(data);
  };

  return (
    <div className="dis-f h-perc-100 ov-h">
      <div className="h-perc-100 ov-a w-perc-100">
        {
          Questions.map((quest, i) => (
            <div
              className={`accordWrap cur-poi px-0 px-md-2 ${selectedQuest && selectedQuest.history === quest.history ? 'active' : ''}`}
              key={i.toString()}
              onClick={() => setSelectedQuest(quest)}
            >
              {
                quest.group && (
                  <span className="accordGroup fweight-600 dis-b pt-3 pb-2 txtDark700 px-2 px-md-0">
                    {quest.group || ''}
                  </span>
                )
              }
              <div className="accordControl dis-f a-c jc-b pl-1 pr-1 pl-md-0">
                <div
                  className="accordTitle dis-f a-c pt-2 pb-2"
                >
                  <BrixelIcon
                    icon="check"
                    background={checkSectionDone(quest) ? "green" : "white"}
                    saturation={checkSectionDone(quest) ? 400 : 0}
                    color={checkSectionDone(quest) ? "white" : "dark"}
                    saturationTxt={checkSectionDone(quest) ? 0 : 200}
                    bgTransparent={!checkSectionDone(quest)}
                    className={`brdSmall ml-1 dis-b p-small-4 ${checkSectionDone(quest) ? 'border-green' : ''}`}
                    rounded
                    iconSize="small"
                  />
                  <h4 className={`body ml-1 txtDark400 fweight-500`}>
                    {quest.title}
                  </h4>
                </div>
              </div>

            </div>
          ))
        }
      </div>
      {
        selectedQuest && (
          <div className="dis-fl-col h-perc-100 w-perc-100">
            <div className="h-perc-100 ov-a p-2">
              <FactsQuestion quest={selectedQuest} />
            </div>
            <div className="dis-f p-2">
              <BrixelButtonPrimary
                label='Cancel'
                background="white"
                saturation={0}
                color="dark"
                saturationTxt={400}
                rounded
                className="shadow-3dp"
                onClick={() => setSelectedQuest(null)}
              />
              <BrixelButtonPrimary
                label='Save & Next'
                background="primary"
                saturation={400}
                rounded
                onClick={() => saveData()}
                isLoading={isSmallLoading}
              />
            </div>
          </div>
        )
      }
    </div>
  );
};

InputSheet.propTypes = {
  isLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  initial: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  singleUserPropertyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  isUnsavedChangesModal: PropTypes.object,
};

InputSheet.defaultProps = {
  isUnsavedChangesModal: {},
  isLoading: false,
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'property.singleUserActiveProperty', {});
  if (formValue.price) {
    delete formValue.history;
    delete formValue.owner;
    delete formValue.price.history;
  }
  return ({
    errorValue: get(state, 'form.Property.syncErrors', {}),
    formValue: get(state, 'form.Property.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
    activeSingleUser: get(state, 'user.activeSingleUser', {}),
    singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
    notification: get(state, 'common.notification', {}),
    initial: get(state, 'form.Property.initial', {}),
    loggedInUser: get(state, 'user.loggedInUser', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleSaveProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setNotification: bindActionCreators(setScreenNotification, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(InputSheet);
