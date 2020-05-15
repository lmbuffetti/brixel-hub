import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, BrixelButtonIcon, Helpers } from '@brixel/brixel-components';
import SupportImg from '../images/Support/supportImg.png';
import CallUsImg from '../images/Support/call_us.svg';
import WriteUsImg from '../images/Support/wite_us.svg';
import WhatAppImg from '../images/Support/whatsapp.svg';
import get from 'lodash/get';
import { connect } from 'react-redux';

const Support = (props) => {
  const {
    activeSingleCompany,
    expanded,
    hideClose,
    isFixed,
    layout,
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
      <div className={`${isFixed ? 'shadow-1dp' : ''} ${layout === 'rewards' ? 'p-1' : 'p-4'}`}>
        {
          layout !== 'rewards' && (
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
          )
        }
        {
          layout === 'rewards' && (
            <div className="ta-c max-w-fix-376 m-a">
              <h5 className="ta-c mt-3 mb-2">Let us give you some free advice.</h5>
              <p className="ta-c fsize-300 txtDark200">What is the right selling price? When is the right time to start? How long does it take?</p>
            </div>
          )
        }
        <div
          className={`dis-f a-c ${layout === 'rewards' ? 'jc-c my-5' : 'mt-3 jc-b '} ${expanded ? '' : 'cur-poi'}`}
          onClick={() => expanded ? ''  : onclickOne() }
        >
          <img src={SupportImg} alt="Support Team" className={layout === 'rewards' ? "w-fix-280" : "w-fix-160"} />
          {
            !expanded && (
              <BrixelIcon
                icon={openDetail ? "arrow-simple-up" : "arrow-simple-down"}
              />
            )
          }
        </div>
        {
          layout !== 'rewards' && (
            <hr className="my-3 lighter"/>
          )
        }
        <div className={`moreInfoSupport ${openDetail ? 'open' : 'close'} ${layout === 'rewards' ? 'w-fit m-a' : ''}`}>
          <a href={`tel:${activeSingleCompany.contact.phone}`} className="dis-f a-c mb-3">
            <img className="w-fix-40" src={CallUsImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200 body2">Call Us</span>
              <span className="txtDark700 ff-mono">{Helpers.telephoneFormat(activeSingleCompany.contact.phone.toString())}</span>
            </p>
          </a>
          <a href={`mailto: ${activeSingleCompany.contact.email}`} className="dis-f a-c mb-3">
            <img className="w-fix-40" src={WriteUsImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200 body2">Write us</span>
              <span className="txtDark700">{activeSingleCompany.contact.email}</span>
            </p>
          </a>
          <a
            href={`https://wa.me/${(activeSingleCompany.contact.whatsapp).replace('+', '')}`}
            className="dis-f a-c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="w-fix-40" src={WhatAppImg} alt="Call Us" />
            <p className="ml-2">
              <span className="dis-b txtDark200 body2">Text Us</span>
              <span className="txtDark700 ff-mono">{Helpers.telephoneFormat(activeSingleCompany.contact.whatsapp)}</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  )
};

Support.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
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

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
});

export default connect(mapStateToProps, null)(Support);
