/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

const BrixelModalFullScreen = (props) => {
  // PROPS
  const {
    children,
    title,
    onClose,
  } = props;
  // STATE

  return (
    <div id="bodyModalWrapper">
      <div className="bodyModal">
        <div className="dis-f jc-fe p-1 p-md-2 h-fix-72">
          <BrixelButtonIcon
            icon="close-small"
            color="primary"
            saturationTxt={400}
            bgTransparent
            noBorder
            className="shadow-1dp as-c"
            onClick={() => onClose()}
          />
        </div>
        <form
          id="multiStepForm"
          // onSubmit={(e) => {e.preventDefault(); changeStep()}}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className={`slideMultiStepForm`}>
            <div
              className={`singleStep jc-c 'fade-enter`}
            >
              <div className="subcontainer m-a">
                <div>
                  <h3 className={'mb-5 ta-c'}>{title}</h3>
                  <div>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-md-2 shadow-1dp-top normStep`}
          >
            <div className="container pos-r">
              <div className={`w-perc-100 a-c dis-fl-row jc-b m-a jc-c`}>
                <BrixelButtonPrimary
                  className={`noWrap w-perc-100 max-w-fix-160`}
                  rounded
                  background="primary"
                  saturation={400}
                  label="Ok, got it"
                  rightIcon="arrow-right-small"
                  onClick={() => onClose()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

BrixelModalFullScreen.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
)(BrixelModalFullScreen);
