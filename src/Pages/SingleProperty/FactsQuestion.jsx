/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import unset from 'lodash/unset';
import { diff } from 'deep-object-diff';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import {
  MultiFileldsReduxForm,
  change,
  reset,
} from '@brixel/brixel-components/dist/form';
import { saveActiveSingleProperty } from '../../actions/PropertyActions';
import { keyify } from '../../utils/helpers';
import { InputSheets } from '../../resources/inputSheets';

const FactsQuestion = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    formValue,
    initValues,
    quest,
  } = props;
  // PARAMS URL
  const propID = get(match, 'propID', null);
  const dashWrapperEl = document.getElementsByClassName('hubDashboard')[0];

  useEffect(() => {
    if (dashWrapperEl) dashWrapperEl.classList.add('secondLevelActive');
    return () => {
      if (dashWrapperEl) dashWrapperEl.classList.add('secondLevelActive');
    };
  }, [dashWrapperEl]);

  useEffect(() => {
    const fieldsChanged = diff(initValues, formValue);
    const keyChanged = keyify(fieldsChanged);
    keyChanged.forEach((item) => {
      InputSheets().forEach((singleQuest) => {
        singleQuest.inputs.forEach((input) => {
          if (input.condition) {
            if (input.condition.name) {
              if (input.condition.name === item) {
                if (input.condition.value !== get(formValue, item, null)) {
                  unset(formValue, input.name);
                }
              }
            } else {
              input.condition.forEach((condition) => {
                if (condition.name === item) {
                  if (condition.value !== get(formValue, item, null)) {
                    unset(formValue, input.name);
                  }
                }
              });
            }
          }
        });
      });
    });
  }, [formValue]);

  // FUNCTIONS TO SKIP SECTION
  /*
  const handleSkipSection = async (val) => {
    const inputSheet = get(formValue, 'inputSheet', {});
    const skipSection = get(formValue, 'inputSheet.skipSection', {});
    set(skipSection, val, true);
    inputSheet.skipSection = skipSection;

    await handleSaveActiveSingleProperty({id: propID, inputSheet: inputSheet, smallLoader: true});
    changeFieldValue('inputSheet', inputSheet);
  };
  */

  // FUNCTION TO LOAD DIFFERENT CHACKMAR IF GROUP IS COMPLETE, UNCOMPLETE, DISABLE
  /*
  const checkQuestionGroup = (questInput, skipped = {}) => {
    const sectionSkip = get(formValue, `inputSheet.skipSection[${questInput.name}]`, false);
    if (get(errorValue, questInput.name, null) === true) {
      return (
        <div>
          <BrixelIcon
            className="brdSmall dis-b border-green"
            icon="check"
            rounded
            background="green"
            saturation={400}
            color="white"
            saturationTxt={0}
            iconSize="small"
            padding="p-small-7"
          />
        </div>
      )
    } else {
      return (
        <div>
          <BrixelButtonIcon
            icon="check"
            rounded
            bgTransparent={!sectionSkip}
            background={sectionSkip ? 'primary' : ''}
            saturation={sectionSkip ? 300 : 0}
            color={sectionSkip ? "white" : "dark"}
            saturationTxt={sectionSkip ? 0 : 400}
            className={`brdSmall dis-b p-small-4 ${sectionSkip ? 'border-primary' : ''}`}
            iconSize="small"
            onClick={() => handleSkipSection(questInput.name)}
            // isLoading={isSmallLoading && quest.history === selObj}
          />
        </div>
      )
    }
  };
  */

  return (
    <div
      className="questContent"
    >
      <div className="dis-f a-c jc-b pos-r mb-3">
        <h5>{quest.title}</h5>
        <BrixelButtonIcon
          icon="close-small"
          ghost
          onClick={() => history.push(`/${propID}/property/facts`)}
        />
      </div>

      <MultiFileldsReduxForm
        autofocus={false}
        classNameBox={quest.classNameBox}
        className="singleInput"
        form="Property"
        hintMessage
        disableNextBtn={false}
        formValue={formValue}
        inputs={quest.inputs}
        onClick={() => ''}
      />
    </div>
  );
};

FactsQuestion.propTypes = {
  formValue: PropTypes.object.isRequired,
  initValues: PropTypes.object.isRequired,
  quest: PropTypes.object,
};

FactsQuestion.defaultProps = {
  quest: [],
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  initValues: get(state, 'brixelForm.Property.initialValues', {}),
  errorValue: get(state, 'brixelForm.syncErrors', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  reset(form) {
    (dispatch(reset(form)));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(FactsQuestion);
