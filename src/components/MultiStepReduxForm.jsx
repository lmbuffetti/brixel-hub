import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, Field, isValid } from 'redux-form';
import get from 'lodash/get';
import { BrixelButtonPrimary, ReduxField } from '@brixel/brixel-components';
import { getBrowserPlatform } from '@brixel/brixel-components/dist/utils/helper';
import { compose } from 'redux';
import { connect } from 'react-redux';

const MultiStepForm = (props) => {
  // PROPS
  const {
    changeFieldValue,
    country,
    disableNextBtn,
    errorValue,
    formValue,
    formName,
    input,
    onClick,
  } = props;

  const countryObj = (curVal) => {
    const getCurrent = country.find((val) => val.value === curVal.toLowerCase() || val.value === curVal.toLowerCase());
    changeFieldValue('location.countryCode', curVal);
    changeFieldValue('location.countryName', get(getCurrent, 'label', ''));
    // setCurCountry(getCurrent);
  };

  const hideOnDesk = getBrowserPlatform().indexOf('desk') !== -1 ? 'hide-desktop' : 'dis-b-mobile';
  console.log(formValue, formName, get(formValue, 'location.countryCode', ''))
  return (
    <div>
      {input.title && ( <h6 className="mt-5 mb-3">{input.title}</h6> ) }
      <div className="dis-f a-c jc-b">
        <div
          className={`${input.classNameBox || ''} dis-f-col a-c jc-b w-perc-100`}
          tabIndex="-1"
        >
          <ReduxField
            component={input.component}
            formValue={formValue}
            mapOptions={{...input.mapOptions}}
            mapFunctions={{
              defCountry: get(formValue, 'location.countryName', ''),
              selCountry: get(formValue, 'location.countryCode', ''),
            }}
            changeCountry={(val) => countryObj(val)}
            design={{
              className: input.className || '',
              compact: input.compact,
              fluid: false,
              formatText: input.formatText,
              inputClassName: input.inputClassName || '',
              isHorizontal: input.isHorizontal,
            }}
            form={formName}
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
  country: PropTypes.arrayOf(PropTypes.object).isRequired,
  disableNextBtn: PropTypes.bool,
  formValue: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  errorValue: PropTypes.object,
  input: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

MultiStepForm.defaultProps = {
  disableNextBtn: false,
  errorValue: {},
};

const mapStateToProps = (state) => ({
  country: get(state, 'common.country', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MultiStepForm);
