import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, BrixelButtonIcon, Helpers } from '@brixel/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import CallUsImg from '../images/Support/call_us.svg';
import WriteUsImg from '../images/Support/wite_us.svg';
import WhatAppImg from '../images/Support/whatsapp.svg';

const Support = (props) => {
  const {
    activeSingleCompany,
    expanded,
    hideClose,
    isFixed,
    layout,
    onClose,
  } = props;

  // STATIC CONTCT DATA FROM COMPANY
  const phone = get(activeSingleCompany, 'contact.phone', null);
  const email = get(activeSingleCompany, 'contact.email', null);
  const whatsapp = get(activeSingleCompany, 'contact.whatsapp', null);
  const teamAvatars = get(activeSingleCompany, 'teamAvatars', []);
  const companyLegalName = get(activeSingleCompany, 'legalName', get(activeSingleCompany, 'name', null));
  // COLOR
  const colorLinkTextTitle = layout === 'onboarding' ? 'txtPrimary200' : 'txtDark200';
  const colorLinkTextInfo = layout === 'onboarding' ? 'txtWhite' : 'txtDark700';

  const [openDetail, setOpenDetail] = useState(expanded);
  console.log(activeSingleCompany);
  // FUCNTION TO OPEN/CLOSE THE SUPPORT DETAIL AND SCROLL DOWN
  const onclickOne = () => {
    setOpenDetail(!openDetail);
    if (!openDetail) {
      setTimeout(() => {
        const scrollPage = document.getElementsByClassName('singleStep')[0];
        scrollPage.scrollTo({ top: scrollPage.offsetHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className={`max-w-perc-100 ${isFixed ? 'p-2' : ''} mb-4 ${layout !== 'onboarding' ? 'bgWhite' : ''} ${isFixed ? 'fixed' : 'noFixed'}`} id="supportBox">
      <div className={`${isFixed ? 'shadow-1dp' : ''} ${layout === 'rewards' ? 'p-1' : 'pt-2 px-3 pb-3'}`}>
        {
          layout !== 'rewards' && layout !== 'onboarding' && (
            <div className="dis-f jc-b a-t">
              <div>
                <p className="txtDark200 mb-2">Need support?</p>
                <h5 className="txtDark700">{companyLegalName}</h5>
              </div>
              {
                // HIDE CLOSE BUTTON IF PROPS isFixed OR hideClose
                !isFixed && !hideClose && (
                  <BrixelButtonIcon
                    className="shadow-2dp hide dis-b-md"
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
              <h5 className="txtDark700 mt-3">{companyLegalName}</h5>
            </div>
          )
        }
        <div
          className={`dis-f a-c ${layout === 'rewards' ? 'jc-c mt-2 mb-5' : 'mt-3 jc-b '} ${expanded ? '' : 'cur-poi'}`}
          onClick={() => (expanded ? '' : onclickOne())}
        >
          {
            layout !== 'onboarding' && (
              <div className="dis-f jc-fs a-t">
                {
                  teamAvatars.map((imgTeam, i) => (
                    <img
                      key={i.toString()}
                      src={`${baseByData.shortPath}${imgTeam.path}`}
                      alt="Support Team"
                      className={`${layout === 'rewards' ? 'w-fix-104 mr-2-neg' : 'w-fix-40 mr-1-neg'}  square brdLarge brdWhite brdCircle`}
                    />
                  ))
                }
              </div>
            )
          }
          {
            !expanded && (
              <BrixelIcon
                icon={openDetail ? 'arrow-simple-up' : 'arrow-simple-down'}
              />
            )
          }
        </div>
        {
          layout !== 'rewards' && layout !== 'onboarding' && (
            <hr className="my-3 lighter" />
          )
        }
        <div className={`moreInfoSupport ${openDetail ? 'open' : 'close'} ${layout === 'rewards' ? 'w-fit m-a' : ''}`}>
          {
            phone && (
              <a href={`tel:${phone}`} className="dis-f a-c mb-3">
                <img className="w-fix-40" src={CallUsImg} alt="Call Us" />
                <p className="ml-2">
                  <span className={`dis-b body2 ${colorLinkTextTitle}`}>Call Us</span>
                  <span className={`ff-mono ${colorLinkTextInfo}`}>{Helpers.telephoneFormat(phone.toString())}</span>
                </p>
              </a>
            )
          }
          {
            email && (
              <a href={`mailto: ${email}`} className="dis-f a-c mb-3">
                <img className="w-fix-40" src={WriteUsImg} alt="Call Us" />
                <p className="ml-2">
                  <span className={`dis-b body2 ${colorLinkTextTitle}`}>Write us</span>
                  <span className={colorLinkTextInfo}>{email}</span>
                </p>
              </a>
            )
          }
          {
            whatsapp && (
              <a
                href={`https://wa.me/${(whatsapp).replace('+', '')}`}
                className="dis-f a-c"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="w-fix-40" src={WhatAppImg} alt="Call Us" />
                <p className="ml-2">
                  <span className={`dis-b body2 ${colorLinkTextTitle}`}>Text Us</span>
                  <span className={`ff-mono ${colorLinkTextInfo}`}>{Helpers.telephoneFormat(whatsapp)}</span>
                </p>
              </a>
            )
          }
        </div>
      </div>
    </div>
  );
};

Support.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  layout: PropTypes.string,
  hideClose: PropTypes.bool,
  isFixed: PropTypes.bool,
  expanded: PropTypes.bool,
  onClose: PropTypes.func,
};

Support.defaultProps = {
  hideClose: true,
  layout: 'support',
  isFixed: true,
  expanded: false,
  onClose: () => '',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany.id', null) ? get(state, 'companies.activeSingleCompany', null) : get(state, 'user.loggedInUser.user.company', {}),
});

export default connect(mapStateToProps, null)(Support);
