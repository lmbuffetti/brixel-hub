import React, {useEffect, useState} from 'react';
import {
  BrixelButtonIcon,
  BrixelIcon,
  Helpers,
  BrixelImage,
} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {BrixelTextArea} from '@brixel/brixel-components/dist/form';
import {sendSupportMessage} from '../actions/CommonActions';
import type {SupportType} from '../@types/components/Support';

const Support = (props: SupportType) => {
  const {
    activeSingleCompany,
    activeSingleProperty,
    expanded = false,
    handleSendSupportMessage,
    hideClose = true,
    isFixed = true,
    isSmallLoading,
    lang,
    layout = 'support',
    onClose = () => '',
    requestDone,
  } = props;

  // STATIC CONTACT DATA FROM COMPANY
  const phone = get(activeSingleCompany, 'contact.phone', null);
  const email = get(activeSingleCompany, 'contact.email', null);
  const whatsapp = get(activeSingleCompany, 'contact.whatsapp', null);
  const teamAvatars = get(activeSingleCompany, 'teamAvatars', []);
  const companyLegalName = get(activeSingleCompany, 'name', get(activeSingleCompany, 'name', null));
  // COLOR
  const colorLinkTextInfo = layout === 'onboarding' ? 'txtText900' : 'txtText900';

  const [openDetail, setOpenDetail] = useState(expanded);
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => () => document.body.classList.remove('scrollSmooth'));

  // FUCNTION TO OPEN/CLOSE THE SUPPORT DETAIL AND SCROLL DOWN
  const onClickOne = () => {
    setOpenDetail(!openDetail);
    if (!openDetail) {
      document.body.classList.add('scrollSmooth');
      setTimeout(() => {
        const scrollPage = document.getElementsByClassName('singleStep')[0] as HTMLElement;
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
      company: activeSingleCompany.id,
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
                    <p className="txtText600 mb-2">{translateTo('Need support?', lang)}</p>
                    <h5 className="txtText900">{companyLegalName}</h5>
                  </div>
                ) : (
                  <div className="dis-f a-c">
                    {
                      layout === 'floatable' && (
                        <div className="dis-f jc-fs a-t">
                          {
                            teamAvatars.map((imgTeam, i) => (
                              <BrixelImage
                                loading="lazy"
                                key={`avt_${i.toString()}`}
                                url={imgTeam.url}
                                size={'XS'}
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
                        <span className="ml-2 txtText200">{translateTo('Support', lang)}</span>
                      )
                    }
                  </div>
                )
              }
              {
                // HIDE CLOSE BUTTON IF PROPS isFixed OR hideClose
                !isFixed && !hideClose && (
                  <BrixelButtonIcon
                    icon="close-small"
                    bgTransparent
                    onClick={() => onClose()}
                  />
                )
              }
              {
                layout === 'floatable' && (
                  <BrixelButtonIcon
                    icon="close-small"
                    theme="green"
                    bgTransparent
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
                        <BrixelImage
                          loading="lazy"
                          key={`avt_${i.toString()}`}
                          url={imgTeam.url}
                          size={'XS'}
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
                  <span className="mb-2 fweight-600 px-3 pt-1">
                    {translateTo('How can we help?', lang)}
                  </span>
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
                    <p className="txtWhite fweight-400 fsize-300 lh-22 pr-2">
                      <span>{translateTo('Thanks for your message.', lang)}</span>
                      <span className="dis-b">
                        {translateTo('We\'ll get back to you shortly.', lang)}
                      </span>
                    </p>
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
                      placeholder={translateTo('Write us a message', lang)}
                      input={{
                        name: 'supportMessage',
                        value: supportMessage,
                        onChange: (val) => setSupportMessage(val),
                      }}
                    />
                    <BrixelButtonIcon
                      icon="send"
                      theme="white"
                      bgTransparent
                      disabled={supportMessage.length === 0}
                      isLoading={isSmallLoading.supportMessage}
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

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany.id', null) ? get(state, 'companies.activeSingleCompany', null) : get(state, 'user.loggedInUser.user.company', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', ''),
  lang: get(state, 'common.language', 'en'),
  requestDone: get(state, 'common.requestDone', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleSendSupportMessage: bindActionCreators(sendSupportMessage, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Support);
