import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import get from 'lodash/get';
import { MarketCheckQuestions } from '../resources/MarketCheck';

const MultiStepForm = (props) => {
  // PROPS
  const {
    errorValue,
    form,
    formValue,
    questions,
    step,
  } = props;

  const checkCondition = (val) => {
    let isToShow = true;
    if (val && val.condition) {
      const formCurVal = get(formValue, val.condition.name, null);
      if (val.condition.value === 'isPositive') isToShow = formCurVal > 0;
      else if (val.condition.value !== formCurVal) isToShow = false;
    }
    return isToShow;
  };

  return (
    <form name={form}>
      <h1>Form</h1>
      {
        questions.map((quest, i) => (
          <div key={i.toString()}>
            <h3>{quest.title}</h3>
            <div key={i.toString()} className="dis-f">
              {
                quest.inputs.map((input, f) => (
                  <div key={f.toString()}>
                    {
                      checkCondition(input) && (
                        <div key={f.toString()}>
                          <div className="dis-f a-c jc-b">
                            <div
                              className={`${input.classNameBox || ''} dis-f a-c jc-b w-perc-100`}
                              tabIndex="-1"
                            >
                              {input.deactivable ? input.deactivable.toString() : ''}
                              <Field
                                className="w-perc-100"
                                inputClassName={input.className || ''}
                                name={input.name}
                                label={input.label}
                                icons={input.icons}
                                component={input.component}
                                fluid={true}
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
                                message={{
                                  help: null,
                                  error: errorValue[input.name],
                                }}
                                minLenghtNum={input.minLenghtNum || null}
                                maxLengthNum={input.maxLenghtNum || null}
                              />
                              {
                                input.unit && (
                                  <span className="pl-2">{input.unit}</span>
                                )
                              }
                            </div>
                          </div>
                          <p className="body2">{input.help}</p>
                        </div>
                      )
                    }
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </form>
  )
};

MultiStepForm.propTypes = {
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  onChangeStep: PropTypes.func,
  questions: PropTypes.arrayOf(PropTypes.object),
  step: PropTypes.number,
};

MultiStepForm.defaultProps = {
  onChangeStep: () => '',
  step: 0,
}

const mapStateToProps = (state, props) => {
  console.log('DASDADASDASADAS', get(props, 'initialValue', {}));
  return ({
    formValue: get(state, `formValues[${props.formName}].values`, {}),
    errorValue: get(state, `formValues[${props.formName}].syncErrors`, {}),
    form: props.form,
    initialValue: {
      ...get(props, 'initialValue', {})
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
});

const MultiStepFormRedux = reduxForm({
  destroyOnUnmount: false, // a unique identifier for this form
  enableReinitialize: true,
})(MultiStepForm);

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(MultiStepFormRedux);
