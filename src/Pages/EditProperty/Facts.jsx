/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelIcon,
  BrixelProgressBar,
  BrixelButtonIcon,
  BrixelButtonTertiary,
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
import last from 'lodash/last';

const Facts = (props) => {
  const {
    changeFieldValue,
    formValue,
    history,
    isSmallLoading,
    match,
  } = props;

  // STATE
  const [Questions] = useState(InputSheets('en'));
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [changeSection, setChangeSection] = useState(false);
  // PARAMS URL
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

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
          else if (get(formValue, item.name, false) !== false) {
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
    const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
    const calPerc = Math.floor(countDone * countTotal / 100);
    const savedPerc = Math.floor(get(formValue, `inputSheet.totalComplete`, 0) || 0);
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

  useEffect(() => {
    if (history && !selectedQuest && getFact() !== 'facts') {
      const quest = Questions.find(item => item.history === getFact());
      setSelectedQuest(quest);
    } else if (getFact() === 'facts') {
      setSelectedQuest(null);
    }
  }, [history, getFact()]);

  const onSelectQuest = (quest) => {
    //TODO
    setTimeout(() => {
      history.push(`/${propID}/property/facts/${quest.history}`);
      setSelectedQuest(quest)
    }, 0);
  };

  const onNextSection = (act) => {
    const findCurrentId = Questions.findIndex(quest => quest.history === selectedQuest.history);
    if (findCurrentId > -1 && Questions[findCurrentId + 1]) {
      if (act === 'label') {
        return Questions[findCurrentId + 1].title;
      }
      if (act === 'click') {
        onSelectQuest(Questions[findCurrentId + 1]);
        const scrollElement = document.getElementById('bodyScroll');
        scrollElement.scrollTo({top: 0, behavior: 'smooth'});
      }
    }
  };

  return (
    <div className="factsWrapper dis-f h-perc-100">
      <div className="secondLevel dis-fl-col w-perc-100 h-perc-100">
        <div className="dis-fl-col max-h-perc-100">
          <div className="headerSection pos-r">
            <BrixelButtonIcon
              className="shadow-2dp"
              icon="close-small"
              color="primary"
              saturationTxt={400}
              bgTransparent
              noBorder
              onClick={() => history.push(`/${propID}/property`)}
            />
            <h5>Facts</h5>
          </div>
          <div className="mt-3 mb-3">
            <BrixelProgressBar
              rounded
              saturation={700}
              large
              barBackground="Red"
              backgroundSaturation={100}
              progressValue={get(formValue, 'inputSheet.totalComplete', 0)}
            />
            <h6 className="mt-1 ff-mono txtPrimary700">{get(formValue, 'inputSheet.totalComplete', 0)}% complete</h6>
          </div>
          <div className="inputSheet">
            {
              Questions.map((quest, i) => (
                <div
                  className={`accordWrap cur-poi ${selectedQuest && selectedQuest.history === quest.history ? 'active' : ''}`}
                  key={i.toString()}
                  onClick={() => onSelectQuest(quest)}
                >
                  <div className="accordControl dis-f a-c jc-b py-small-14">
                    <div className="accordTitle dis-f a-c">
                      <BrixelIcon
                        icon="check"
                        bgTransparent
                        color="green"
                        saturationTxt={400}
                        className={`${checkSectionDone(quest) ? 'opacity10' : 'opacity0'} mx-1 dis-b`}
                      />
                      <h4 className={`body ml-1 fweight-400 ${checkSectionDone(quest) ? 'txtGreen400 td-lt' : 'txtDark200'}`}>
                        {quest.title}
                      </h4>
                    </div>
                    <BrixelIcon
                      icon="arrow-simple-right"
                      color={`${selectedQuest && selectedQuest.history === quest.history ? 'dark' : 'light'}`}
                      saturationTxt={selectedQuest && selectedQuest.history === quest.history ? 70 : 200}
                      bgTransparent
                      className={'mr-1'}
                    />
                  </div>

                </div>
              ))
            }
          </div>
        </div>
      </div>
      {
        selectedQuest && getFact() !== 'facts' && (
          <div className="thirdLevel inputSheet dis-fl-col w-perc-100 ml-md-2">
            <div className="p-3">
              <div className="">
                <FactsQuestion quest={selectedQuest} />
                <div className="dis-f jc-fe mb-1">
                  {
                    onNextSection('label') && (
                      <BrixelButtonTertiary
                        rightIcon="arrow-right"
                        onClick={() => onNextSection('click')}
                        label={onNextSection('label')}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

Facts.propTypes = {
  isLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  initial: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  singleUserPropertyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  isUnsavedChangesModal: PropTypes.object,
};

Facts.defaultProps = {
  isUnsavedChangesModal: {},
  isLoading: false,
};

const mapStateToProps = (state) => {
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
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setNotification: bindActionCreators(setScreenNotification, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Facts);
