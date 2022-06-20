import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, BrixelButtonIcon, Helpers } from '@brixel/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import {
  compose, bindActionCreators,
} from 'redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { BrixelTextArea } from '@brixel/brixel-components/dist/form';
import { sendSupportMessage } from '../actions/CommonActions';

const Support = (props) => {
  const {
    activeSingleCompany,
    activeSingleProperty,
    expanded,
    handleSendSupportMessage,
    hideClose,
    isFixed,
    isSmallLoading,
    layout,
    onClose,
    requestDone,
  } = props;

  // STATIC CONTACT DATA FROM COMPANY
  const phone = get(activeSingleCompany, 'contact.phone', null);
  const email = get(activeSingleCompany, 'contact.email', null);
  const whatsapp = get(activeSingleCompany, 'contact.whatsapp', null);
  const teamAvatars = get(activeSingleCompany, 'teamAvatars', []);
  const companyLegalName = get(activeSingleCompany, 'legalName', get(activeSingleCompany, 'name', null));
  // COLOR
  const colorLinkTextInfo = layout === 'onboarding' ? 'txtDark700' : 'txtDark700';

  const [openDetail, setOpenDetail] = useState(expanded);
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => () => document.body.classList.remove('scrollSmooth'));

  // FUCNTION TO OPEN/CLOSE THE SUPPORT DETAIL AND SCROLL DOWN
  const onClickOne = () => {
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
    if (layout === 'floatable') return 'pt-3'
    return 'p-3';
  };

  const sendMessage = () => {
    const data = {
      page: get(activeSingleProperty, 'id', ''),
      message: supportMessage,
      smallLoader: 'supportMessage',
    };
    handleSendSupportMessage(data);
  };

  return (
    <div className={`max-w-perc-100 ${isFixed ? 'p-2' : ''} ${layout !== 'onboarding' ? 'bgWhite' : ''} ${isFixed ? 'fixed' : 'noFixed'} ${layout === 'floatable' ? 'shadow-3dp brdRadius min-w-fix-312 max-w-fix-312' : 'mb-4'}`} id="supportBox">
      <div className={`${isFixed && layout !== 'floatable' ? 'shadow-1dp' : ''} ${padding()}`}>
        {
          layout !== 'onboarding' && (
            <div className={`dis-f jc-b a-t ${layout === 'floatable' ? 'px-3' : ''}`}>
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
                                className="w-fix-40 mr-1-neg square brdLarge brdWhite brdCircle"
                              />
                            ))
                          }
                        </div>
                      )
                    }
                    {
                      layout !== 'floatable' && (
                        <span className="ml-2 txtLight400">Support</span>
                      )
                    }
                  </div>
                )
              }
              {
                // HIDE CLOSE BUTTON IF PROPS isFixed OR hideClose
                !isFixed && !hideClose && (
                  <BrixelIcon
                    icon="close-small"
                    ghost
                    onClick={() => onClose()}
                  />
                )
              }
              {
                layout === 'floatable' && (
                  <BrixelIcon
                    icon="close-small"
                    color="green"
                    ghost
                    onClick={() => onClose()}
                  />
                )
              }
            </div>
          )
        }
        {
          (layout === 'onboarding' || layout === 'floatable' || expanded) && (
            <div
              className={`dis-f a-c jc-b ${expanded ? '' : 'cur-poi'} ${layout !== 'floatable' ? 'mt-3' : ''}`}
              onClick={() => (expanded ? '' : onClickOne())}
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
                          className="w-fix-40 mr-1-neg square brdLarge brdWhite brdCircle"
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
              {
                layout === 'floatable' && (
                  <span className="mb-2 fweight-600 px-3 pt-1">How can we help?</span>
                )
              }
            </div>
          )
        }
        <div className={`moreInfoSupport ${openDetail ? 'open' : 'close'} ${layout === 'floatable' ? 'px-3' : ''}`}>
          {
            phone && (
              <a href={`tel:${Helpers.telephoneFormat(phone)}`} className={`dis-f a-c ${layout === 'floatable' ? 'mb-1' : 'mb-2'}`}>
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
            layout !== 'floatable' && email && (
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
        {
          layout === 'floatable' && (
            <div className="send-message mt-2 p-2 bgGreen400 dis-fl-row w-perc-100 jc-b">
              {
                requestDone ? (
                  <>
                    <span className="txtWhite fweight-400 fsize-300 lh-22 pr-2">Thanks for your message.
                      <span className="dis-b"> We&apos;ll get back to you shortly.</span></span>
                    <BrixelIcon
                      icon="tick"
                      color="white"
                      className="mr-1"
                    />
                  </>
                ) : (
                  <>
                    <BrixelTextArea
                      className="w-perc-100 pr-2"
                      placeholder="Write us a message"
                      input={{
                        name: 'supportMessage',
                        value: supportMessage,
                        onChange: (val) => setSupportMessage(val),
                      }}
                    />
                    <BrixelButtonIcon
                      icon="send"
                      theme="white"
                      ghost
                      disabled={supportMessage.length === 0}
                      isLoading={isSmallLoading.supportMessage}
                      bgTransparent
                      onClick={() => sendMessage()}
                    />
                  </>
                )
              }

            </div>
          )
        }
      </div>
    </div>
  );
};

Support.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  layout: PropTypes.string,
  handleSendSupportMessage: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  hideClose: PropTypes.bool,
  isFixed: PropTypes.bool,
  expanded: PropTypes.bool,
  requestDone: PropTypes.bool.isRequired,
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
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', ''),
  requestDone: get(state, 'common.requestDone', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleSendSupportMessage: bindActionCreators(sendSupportMessage, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Support);
