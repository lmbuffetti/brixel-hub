/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset, Field } from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { BrixelButtonIcon, BrixelIcon } from '@brixel/brixel-components';
import LoadingSimple from '../../components/LoadingSimple';
import { saveActiveSingleProperty } from '../../actions/PropertyActions';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const FactsQuestion = (props) => {
  const {
    changeFieldValue,
    errorValue,
    formValue,
    handleSaveProperty,
    match,
    quest,
  } = props;
  // PARAMS URL
  const propID = get(match, 'params.propId', null);

  const handleSkipSection = async (val) => {
    const inputSheet = get(formValue, 'inputSheet', {});
    const skipSection = get(formValue, 'inputSheet.skipSection', {});
    set(skipSection, val, true);
    inputSheet.skipSection = skipSection;

    await handleSaveProperty({id: propID, inputSheet: inputSheet, smallLoader: true});
    changeFieldValue('inputSheet', inputSheet);
  };

  // FUNCTION TO LOAD DIFFERENT CHACKMAR IF GROUP IS COMPLETE, UNCOMPLETE, DISABLE
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

  const checkCondition = (input) => {
    let condition = true;
    if (input.condition) {
      const valA = get(formValue, input.condition.name, 'a');
      if (valA === input.condition.value) condition = true;
      else condition = false;
    }
    return condition;
  };

  return (
    <div
      className="questContent"
    >
      {
        quest.inputs.map((input, f) => (
          <>
            {
              checkCondition(input) && (
                <div className="singleInput mb-3" key={f.toString()}>
                  <div className="dis-f">
                    {
                      input.validation && (
                        <>{checkQuestionGroup(input)}</>
                      )
                    }
                  </div>
                  <div key={f.toString()}>
                    {
                      input.type === 'Map' ? (
                        <>
                          <div className="mb-20 pos-r zIndex1">
                            <Field
                              name={input.name}
                              label={input.label}
                              component={() => (
                                <Maps
                                  zoom={14}
                                  scrollZoom
                                  moveMarker
                                  draggable
                                  showSearchLocation
                                  showSelectCountry={true}
                                  showMap={true}
                                  isShowZip={false}
                                  className="w-perc-100"
                                />
                              )}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="dis-f a-c jc-b">
                          <div
                            className={`${input.classNameBox || ''} dis-fl-col w-perc-100`}
                            tabIndex="-1"
                          >
                            {input.deactivable ? input.deactivable.toString() : ''}
                            <Field
                              className={input.className || ''}
                              inputClassName={input.inputClassName || ''}
                              isHorizontal={input.isHorizontal}
                              name={input.name}
                              label={input.label}
                              icons={input.icons}
                              component={input.component}
                              fluid={false}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                              step={+input.step}
                              min={input.min}
                              deactivable={typeof input.deactivable !== 'undefined' ? input.deactivable : true}
                              placeholder={input.placeholder || ''}
                              meta={{
                                dirty: formValue[input.name] && errorValue[input.name] !== true,
                                invalid: true,
                              }}
                              //modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
                              message={{
                                help: null,
                                error: errorValue[input.name],
                              }}
                              minLenghtNum={input.minLenghtNum || null}
                              maxLengthNum={input.maxLenghtNum || null}
                              unit={input.unit}
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
          </>
        ))
      }
    </div>
  );
};

FactsQuestion.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  quest: PropTypes.arrayOf(PropTypes.object),
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
  handleSaveProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  reset(form) {
    (dispatch(reset(form)))
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(FactsQuestion);
