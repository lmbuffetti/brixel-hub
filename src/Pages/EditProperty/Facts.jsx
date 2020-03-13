/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset, Field } from 'redux-form';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  setModal, setScreenNotification,
} from '../../actions/CommonActions';
import LoadingSimple from '../../components/LoadingSimple';
import { uploadDocument, deleteDocument } from '../../actions/UploadActions';
import { InputSheets } from '../../resources/inputSheets';
import { getCalcSectionInputSheets } from '../../utils/helpers';

// COMPONENTS
import { saveActiveSingleProperty } from '../../actions/PropertyActions';
import FactsQuestion from './FactsQuestion';
import { diff } from 'deep-object-diff';
import set from 'lodash/set';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    changeFieldValue,
    errorValue,
    formValue,
    handleSaveProperty,
    handleSetModal,
    initial,
    isSmallLoading,
    match,
    notification,
    setNotification,
  } = props;

  // STATE
  const [Questions] = useState(InputSheets('en'));
  const [selectedQuest, setSelectedQuest] = useState(null);
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
    });
    if (act === 'section') return sectionDone;
  };

  const calcPercentage = () => {
    let countTotal = 0;
    let countDone = 0;
    Questions.map((val) => {
      val.inputs.map((item) => {
        if (item.validation) {
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
      });
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

  return (
    <div className="pb-10">
      <div className="dis-f">
        <div>
          {
            Questions.map((quest, i) => (
              <div
                className={`accordWrap px-0 px-md-2`}
                key={i.toString()}
              >
                {
                  quest.group && (
                    <span className="accordGroup fweight-600 dis-b pt-3 pb-1 txtDark700 px-2 px-md-0">
                      {quest.group || ''}
                    </span>
                  )
                }
                <div className="accordControl dis-f a-c jc-b pl-1 pr-1 pl-md-0">
                  <div
                    className="accordTitle dis-f a-c cur-poi pt-2 pb-2"
                    onClick={() => setSelectedQuest(quest)}
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
        <div>
          {
            selectedQuest && (
              <FactsQuestion quest={selectedQuest} />
            )
          }
        </div>
      </div>
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
