/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel/brixel-components';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

// SIMPLE COMPONENT TO MANAGE THE FULLSCREEN MODAL
// PROPS
// children: HTML
// title: STRING
// onClose: FUNCTION

const BrixelModalFullScreen = (props) => {
  // PROPS
  const {
    children,
    title,
    onClose,
  } = props;
  // STATE

  return (
    <div id="bodyModalWrapper" className="modalFlow">
      <div className="bodyModal">
        <header className="max-w-fix-760 w-perc-100 m-a">
          <div className="container p-1 p-md-2 dis-f jc-fe a-c">
            <div className="dis-f a-c">
              <BrixelButtonIcon
                icon="close-small"
                color="dark"
                saturationTxt={400}
                bgTransparent
                noBorder
                className="shadow-2dp as-c"
                onClick={() => onClose()}
              />
            </div>
          </div>
        </header>
        <form
          id="multiStepForm"
          // onSubmit={(e) => {e.preventDefault(); changeStep()}}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className="multiStepSlides">
            <div
              className="singleStep jc-c fade-enter-active"
            >
              <div className="subcontainer m-a">
                <div>
                  <h3 className="mb-5 ta-c">{title}</h3>
                  <div>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="footerAction max-w-fix-760 m-a p-1 p-md-2 shadow-1dp-top normStep staticFooter"
          >
            <div className="pos-r">
              <div className="w-perc-100 a-c dis-fl-row jc-b m-a jc-c">
                <BrixelButtonPrimary
                  className="noWrap w-perc-100 max-w-fix-160"
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
  );
};

BrixelModalFullScreen.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]).isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default compose(
  withRouter,
)(BrixelModalFullScreen);
