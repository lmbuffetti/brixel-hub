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

  const onclickOne = () => {
    setOpenDetail(!openDetail);
    if (!openDetail) {
      setTimeout(() => {
        const scrollPage = document.getElementsByClassName('singleStep')[0];
        scrollPage.scrollTo({ top: scrollPage.offsetHeight, behavior: 'smooth' })
      }, 100);
    }
  };

  return (
    <div className={`max-w-perc-100 ${isFixed ? 'p-2' : ''} mb-4 bgWhite ${isFixed ? 'fixed' : 'noFixed'}`} id="supportBox">
      <div className={`${isFixed ? 'shadow-1dp' : ''} p-3`}>
        <div className="dis-f jc-b a-t">
          <div>
            <p className="txtDark200 mb-2">Need support?</p>
            <h5 className="txtDark700">Get in touch with us.</h5>
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
          className={`dis-f jc-b a-c mt-3 ${expanded ? '' : 'cur-poi'}`}
          onClick={() => expanded ? ''  : onclickOne() }
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
          <hr className="my-3 lighter"/>
          <a href="tel:+410433335700" className="dis-f a-c mb-3">
            <img className="w-fix-40" src={CallUsImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200 body2">Call Us</span>
              <span className="txtDark700 ff-mono">+41 43 333 57 00</span>
            </p>
          </a>
          <a href="mailto: support@brixel.ch" className="dis-f a-c mb-3">
            <img className="w-fix-40" src={WriteUsImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200 body2">Write us</span>
              <span className="txtDark700">support@brixel.ch</span>
            </p>
          </a>
          <a
            href="https://wa.me/41799332918"
            className="dis-f a-c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="w-fix-40" src={WhatAppImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200 body2">Text Us</span>
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
