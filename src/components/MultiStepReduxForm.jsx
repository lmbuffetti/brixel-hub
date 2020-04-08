import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { getBrowserPlatform } from '@brixel/brixel-components/dist/utils/helper';

const MultiStepForm = (props) => {
  // PROPS
  const {
    disableNextBtn,
    errorValue,
    formValue,
    input,
    onClick,
  } = props;

  const hideOnDesk = getBrowserPlatform().indexOf('desk') !== -1 ? 'hide-desktop' : 'dis-b-mobile';

  return (
    <div>
      {input.title && ( <h6 className="mt-5 mb-3">{input.title}</h6> ) }
      <div className="dis-f a-c jc-b">
        <div
          className={`${input.classNameBox || ''} dis-f-col a-c jc-b w-perc-100`}
          tabIndex="-1"
        >
          <Field
            className="w-perc-100"
            inputClassName={input.className || ''}
            name={input.name}
            label={input.label}
            icons={input.icons}
            component={input.component}
            limit={input.limit}
            fluid={true}
            options={input.options}
            validate={input.validation}
            type={input.type}
            step={+input.step}
            min={input.min}
            pdClass={input.pdClass}
            iconClass={input.iconClass}
            deactivable={typeof input.deactivable !== 'undefined' ? input.deactivable : true}
            placeholder={input.placeholder || ''}
            meta={{
              dirty: get(formValue, input.name, false) && get(errorValue, input.name, true) !== true,
              invalid: true,
            }}
            message={{
              help: null,
              error: get(errorValue, input.name, true) !== true,
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
        {
          (input.type === 'number' || input.type === 'text') && (
            <BrixelButtonPrimary
              rounded
              label="Ok"
              className={`ml-2 ${hideOnDesk}`}
              background="green"
              onClick={() => onClick()}
              disabled={disableNextBtn}
              type="submit"
            />
          )
        }
      </div>
      <p className="body2">{input.help}</p>
    </div>
  )
};

MultiStepForm.propTypes = {
  disableNextBtn: PropTypes.bool,
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object,
  input: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

MultiStepForm.defaultProps = {
  disableNextBtn: false,
  errorValue: {},
};

export default withRouter(MultiStepForm);
