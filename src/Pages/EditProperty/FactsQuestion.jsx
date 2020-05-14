/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset, Field, Form } from 'redux-form';
import get from 'lodash/get';
// import set from 'lodash/set';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
// import { BrixelButtonIcon, BrixelIcon } from '@brixel/brixel-components';
import LoadingSimple from '../../components/LoadingSimple';
import { saveActiveSingleProperty } from '../../actions/PropertyActions';
import { BrixelButtonIcon, ReduxField, BrixelInputText } from '@brixel/brixel-components';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const FactsQuestion = (props) => {
  const {
    changeFieldValue,
    errorValue,
    formValue,
    // handleSaveActiveSingleProperty,
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

  const checkCondition = (input) => {
    let condition = true;
    if (input.condition) {
      if (input.name) {
        const valA = get(formValue, input.condition.name, 'a');
        if (valA === input.condition.value) condition = true;
        else if (input.condition.value === 'isPositive' && valA > 0) condition = true;
        else condition = false;
      } else if (input.condition.length > 0) {
        input.condition.map((item) => {
          const valA = get(formValue, input.condition.name, 'a');
          if (valA === input.condition.value) condition = true;
          else if (input.condition.value === 'isPositive' && valA > 0) condition = true;
          else condition = false;
          return null;
        });
      }
    }
    if (input.conditions) {
      condition = false;
      input.conditions.map((item) => {
        if (!condition) {
          const valA = get(formValue, item.name, 'a');
          if (valA === item.value) condition = true;
          else if (item.value === 'isPositive' && valA > 0) condition = true;
          else condition = false;
        }
        return null;
      });
    }
    return condition;
  };

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
      {
        quest.inputs.map((input, f) => (
          <React.Fragment key={f.toString()}>
            {
              checkCondition(input) && (
                <div className="singleInput mb-5" key={f.toString()}>
                  <div key={f.toString()}>
                    {
                      input.type === 'Map' ? (
                        <>
                          <div className="pos-r zIndex1">
                            <Field
                              name={input.name}
                              label={input.label}
                              component={() => (
                                <Maps
                                  zoom={14}
                                  scrollZoom={false}
                                  moveMarker
                                  inputLabel={input.label}
                                  draggable
                                  showSearchLocation
                                  showSelectCountry={true}
                                  showMap={false}
                                  isShowZip={false}
                                  className="w-perc-100"
                                  changeCountry={(val) => changeFieldValue('location.countryCode', val)}
                                  selCountry={get(formValue, 'location.countryCode', '')}
                                />
                              )}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                            />
                            <Maps
                              minHeight={200}
                              zoom={14}
                              scrollZoom={false}
                              moveMarker
                              draggable
                              showSearchLocation={false}
                              showSelectCountry={false}
                              showMap={true}
                              isShowZip={false}
                              className="w-perc-100"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="dis-f a-c jc-b">
                          <div
                            className={`${input.classNameBox || ''} dis-fl-col w-perc-100`}
                            tabIndex="-1"
                          >
                            <ReduxField
                              component={input.component}
                              design={{
                                className: input.className || '',
                                compact: input.compact,
                                fluid: false,
                                formatText: input.formatText,
                                inputClassName: input.inputClassName || '',
                                isHorizontal: input.isHorizontal,
                              }}
                              form="Property"
                              input={{
                                deactivable: typeof input.deactivable !== 'undefined' ? input.deactivable : true,
                                name: input.name,
                                placeholder: input.placeholder || '',
                                options: input.options,
                                type: input.type || '',
                                validate: input.validation,
                                unit: input.unit,
                              }}
                              inputFormat={{
                                formatType: input.formatType,
                                maxLengthNum: input.maxLenghtNum || null,
                                min: input.min,
                                minLenghtNum:input.minLenghtNum || null,
                                step: +input.step,
                              }}
                              labels={{
                                icons: input.icons,
                                label: input.label,
                                labelLeft: input.labelLeft,
                              }}
                              meta={{
                                dirty: get(formValue, input.name, null) !== null,
                                invalid: get(errorValue, input.name, true) !== true && get(errorValue, input.name, true) !== 'Mark Required',
                                message: {
                                  help: null,
                                  error: get(errorValue, input.name, 'Invalid Input'),
                                }
                              }}
                            />
                          </div>
                        </div>
                      )
                    }
                    <p className="body2">{input.help}</p>
                  </div>
                </div>
              )
            }
          </React.Fragment>
        ))
      }
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
