import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, BrixelButtonIcon } from '@brixel/brixel-components';
import SupportImg from '../images/Support/supportImg.png';
import CallUsImg from '../images/Support/call_us.svg';
import WriteUsImg from '../images/Support/wite_us.svg';
import WhatAppImg from '../images/Support/whatsapp.svg';

const Support = (props) => {
  const {
    expanded,
    hideClose,
    isFixed,
    onClose,
  } = props;

  const [openDetail, setOpenDetail] = useState(expanded);

  return (
    <div className={`max-w-perc-100 ${isFixed ? 'w-fix-md-344 p-2' : ''} mb-4 bgWhite ${isFixed ? 'fixed' : 'noFixed'}`} id="supportBox">
      <div className={`${isFixed ? 'shadow-1dp' : ''} p-3`}>
        <div className="dis-f jc-b a-t">
          <div>
            <h5 className="mb-1">Do you need  support?</h5>
            <p className="txtDark200 mb-2">Get in touch with us.</p>
          </div>
          {
            !isFixed && !hideClose && (
              <BrixelButtonIcon
                className="shadow-3dp hide dis-b-md"
                icon="close-small"
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => onClose()}
              />
            )
          }
        </div>
        <div
          className="dis-f jc-b a-c cur-poi"
          onClick={() => setOpenDetail(!openDetail)}
        >
          <img src={SupportImg} alt="Support Team" className="w-fix-160" />
          {
            !expanded && (
              <BrixelIcon
                icon={openDetail ? "arrow-simple-up" : "arrow-simple-down"}
              />
            )
          }
        </div>
        <div className={`moreInfoSupport ${openDetail ? 'open' : 'close'}`}>
          <hr className="my-3" />
          <a href="tel:+410433335700" className="dis-f a-c mb-3">
            <img src={CallUsImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200">Call Us</span>
              <span className="txtDark700">+41 43 333 57 00</span>
            </p>
          </a>
          <a href="mailto: support@brixel.ch" className="dis-f a-c mb-3">
            <img src={WriteUsImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200">Write us</span>
              <span className="txtDark700">support@brixel.ch</span>
            </p>
          </a>
          <a
            href="https://wa.me/41799332918"
            className="dis-f a-c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={WhatAppImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200">Text Us</span>
              <span className="txtDark700">+41 79 933 29 18</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  )
};

Support.propTypes = {
  hideClose: PropTypes.bool,
  isFixed: PropTypes.bool,
  expanded: PropTypes.bool,
  onClose: PropTypes.func,
};

Support.defaultTypes = {
  hideClose: true,
  isFixed: true,
  expanded: false,
  onClose: () => '',
};

export default Support;
