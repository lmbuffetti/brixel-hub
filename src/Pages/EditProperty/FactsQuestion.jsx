/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonIcon, MultiFileldsReduxForm  } from '@brixel/brixel-components';
import { saveActiveSingleProperty } from '../../actions/PropertyActions';

const FactsQuestion = (props) => {
  const {
    formValue,
    history,
    match,
    quest,
  } = props;
  // PARAMS URL
  const propID = get(match, 'params.propId', null);

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
          className="shadow-2dp"
          icon="close-small"
          color="primary"
          saturationTxt={400}
          bgTransparent
          noBorder
          onClick={() => history.push(`/${propID}/property/facts`)}
        />
      </div>
        <MultiFileldsReduxForm
          className="singleInput mb-5"
          form="Property"
          disableNextBtn={false}
          formValue={formValue}
          inputs={quest.inputs}
          onClick={() => ''}
        />
    </div>
  );
};

FactsQuestion.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  quest: PropTypes.object,
};

FactsQuestion.defaultProps = {
  quest: [],
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  errorValue: get(state, 'form.Property.syncErrors', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  reset(form) {
    (dispatch(reset(form)))
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(FactsQuestion);
