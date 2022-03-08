import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, BrixelButtonIcon, Helpers } from '@brixel/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

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
  const colorLinkTextInfo = layout === 'onboarding' ? 'txtDark700' : 'txtDark700';

  const [openDetail, setOpenDetail] = useState(expanded);

  useEffect(() => () => document.body.classList.remove('scrollSmooth'));

  // FUCNTION TO OPEN/CLOSE THE SUPPORT DETAIL AND SCROLL DOWN
  const onclickOne = () => {
    setOpenDetail(!openDetail);
    if (!openDetail) {
      document.body.classList.add('scrollSmooth');
      setTimeout(() => {
        const scrollPage = document.getElementsByClassName('singleStep')[0];
        if (scrollPage) scrollPage.scrollTop = scrollPage.offsetHeight;
      }, 100);
    }
  };

  const padding = () => {
    if (layout === 'onboarding' && expanded) return '';
    if (layout === 'rewards') return 'p-1';
    return 'p-3';
  };

  return (
    <div className={`max-w-perc-100 ${isFixed ? 'p-2' : ''} mb-4 ${layout !== 'onboarding' ? 'bgWhite' : ''} ${isFixed ? 'fixed' : 'noFixed'} ${layout === 'floatable' ? 'shadow-3dp brdRadius min-w-fix-312' : ''}`} id="supportBox">
      <div className={`${isFixed && layout !== 'floatable' ? 'shadow-1dp' : ''} ${padding()}`}>
        {
          layout !== 'rewards' && layout !== 'onboarding' && (
            <div className="dis-f jc-b a-t">
              {
                layout !== 'floatable' ? (
                  <div>
                    <p className="txtDark200 mb-2">Need support?</p>
                    <h5 className="txtDark700">{companyLegalName}</h5>
                  </div>
                ) : (
                  <div className="dis-f a-c">
                    {
                      layout !== 'onboarding' && layout === 'floatable' && (
                        <div className="dis-f jc-fs a-t">
                          {
                            teamAvatars.map((imgTeam, i) => (
                              <img
                                key={`rmAvt_${i.toString()}`}
                                src={`${baseByData.shortPath}${imgTeam.path}`}
                                alt="Support Team"
                                className="w-fix-32 mr-1-neg square brdLarge brdWhite brdCircle"
                              />
                            ))
                          }
                        </div>
                      )
                    }
                    <span className="ml-2 txtLight400">Support</span>
                  </div>
                )
              }
              {
                // HIDE CLOSE BUTTON IF PROPS isFixed OR hideClose
                !isFixed && !hideClose && (
                  <BrixelButtonIcon
                    icon="close-small"
                    ghost
                    onClick={() => onClose()}
                  />
                )
              }
              {
                layout === 'floatable' && (
                  <BrixelButtonIcon
                    icon="close-small"
                    theme="green"
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
        {
          (layout === 'onboarding' || layout === 'floatable' || expanded) && (
            <div
              className={`dis-f a-c ${layout === 'rewards' ? 'jc-c mt-2 mb-5' : 'mt-3 jc-b '} ${expanded ? '' : 'cur-poi'}`}
              onClick={() => (expanded ? '' : onclickOne())}
            >
              {
                layout !== 'onboarding' && layout !== 'floatable' && (
                  <div className="dis-f jc-fs a-t">
                    {
                      teamAvatars.map((imgTeam, i) => (
                        <img
                          key={`tmAvt_${i.toString()}`}
                          src={`${baseByData.shortPath}${imgTeam.path}`}
                          alt="Support Team"
                          className={`${layout === 'rewards' ? 'w-fix-56 w-fix-sm-104 mr-2-neg' : 'w-fix-40 mr-1-neg'}  square brdLarge brdWhite brdCircle`}
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
          )
        }
        {
          layout !== 'rewards' && layout !== 'onboarding' && layout !== 'floatable' && (
            <hr className="my-3 lighter" />
          )
        }
        <div className={`moreInfoSupport ${openDetail ? 'open' : 'close'} ${layout === 'rewards' ? 'w-fit m-a' : ''}`}>
          {
            phone && (
              <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="dis-f a-c mb-2">
                <BrixelIcon
                  color="blue"
                  saturationTxt={700}
                  icon="phone"
                />
                <p className="ml-2">
                  <span className={` ${colorLinkTextInfo}`}>{Helpers.telephoneFormat(phone)}</span>
                </p>
              </a>
            )
          }
          {
            email && (
              <a href={`mailto: ${email}`} className="dis-f a-c mb-2">
                <BrixelIcon
                  color="red"
                  saturationTxt={400}
                  icon="mail"
                />
                <p className="ml-2">
                  <span className={colorLinkTextInfo}>{email}</span>
                </p>
              </a>
            )
          }
          {
            whatsapp && (
              <a
                href={`https://wa.me/${Helpers.telephoneFormat(whatsapp, false, false, false, true)}`}
                className="dis-f a-c"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrixelIcon
                  color="primary"
                  saturationTxt={400}
                  icon="whatsapp"
                />
                <p className="ml-2">
                  <span className={` ${colorLinkTextInfo}`}>{Helpers.telephoneFormat(whatsapp)}</span>
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
