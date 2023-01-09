/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import type {BrixelModalFullScreenType} from '../@types/components/BrixelModalFullScreen';

const BrixelModalFullScreen = (props: BrixelModalFullScreenType) => {
  // PROPS
  const {
    children,
    lang,
    onClose,
    title,
  } = props;
  // STATE

  return (
    <div id="bodyModalWrapper" className="modalFlow">
      <div className="bodyModal">
        <header className="max-w-fix-760 w-perc-100 m-a">
          <div className="container p-1 p-lg-2 dis-f jc-fe a-c">
            <div className="dis-f a-c">
              <BrixelButtonIcon
                icon="close-small"
                theme="dark"
                ghost
                className="as-c"
                onClick={() => onClose()}
              />
            </div>
          </div>
        </header>
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className="multiStepSlides">
            <div
              className="singleStep jc-c fade-enter-active"
            >
              <div className="subcontainer m-a">
                <div>
                  <h3 className="mb-5 ta-c">{translateTo(title, lang)}</h3>
                  <div>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="footerAction max-w-fix-760 m-a p-1 p-lg-2 shadow-1dp-top normStep staticFooter"
          >
            <div className="pos-r">
              <div className="w-perc-100 a-c dis-fl-row jc-b m-a jc-c">
                <BrixelButtonPrimary
                  className="noWrap"
                  rounded
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
export default BrixelModalFullScreen;
