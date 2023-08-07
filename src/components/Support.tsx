import React, {useEffect, useState} from 'react';
import {
  BrixelButtonIcon,
  BrixelIcon,
  Helpers,
  BrixelImage,
  BrixelButtonPrimary,
  BrixelButtonText,
} from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {BrixelTextArea} from '@brixel-io/brixel-components/dist/form';
import {sendSupportMessage, setModal} from '../actions/CommonActions';
import type {SupportType} from '../@types/components/Support';
import PhoneImg from '../images/TestDrive/phoneTrial.png';
import textImg from '../images/TestDrive/textMessage.png';

const Support = (props: SupportType) => {
  const {
    activeSingleCompany,
    activeSingleProperty,
    handleSendSupportMessage,
    isSmallLoading,
    lang,
    onClose = () => '',
    isMobile,
    requestDone,
    handleSetModal,
  } = props;

  // STATIC CONTACT DATA FROM COMPANY
  const phone = get(activeSingleCompany, 'contact.phone', null);
  const whatsapp = get(activeSingleCompany, 'contact.whatsapp', null);
  const teamAvatars = get(activeSingleCompany, 'teamAvatars', []);
  // COLOR
  const colorLinkTextInfo = 'txtText900';
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => () => document.body.classList.remove('scrollSmooth'));

  const closeModal = () => {
    handleSetModal({})
  }

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
    <>
      {
        isMobile ? (
          <div className='dis-fl-col flex-1 bgWhite jc-b'>
            <div className="flex-1 dis-fl-col jc-b">
              {
                requestDone ? (
                  <>
                    <p className="fweight-400 flex-1 bgText25 brdRadius dis-fl-col jc-c a-c ta-c pt-3">
                      <div className='w-perc-90 ml-a mr-a'>
                        <span>{translateTo('Thanks for your message.', lang)}</span>
                        <span className="dis-b">
                          {translateTo('We\'ll get back to you shortly.', lang)}
                        </span>
                      </div>
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
                      className="w-perc-100 flex-1 pb-4 full-height"
                      placeholder={translateTo('Write us a message', lang)}
                      large
                      input={{
                        name: 'supportMessage',
                        value: supportMessage,
                        onChange: (val) => setSupportMessage(val),
                      }}
                    />
                  </>
                )
              }
              <div className="bgGreen50 p-2 dis-f brdRadius mb-2">
                <div>
                  <img className='w-fix-32' src={PhoneImg} alt='phone icon' />
                </div>
                <div className="dis-fl-col jc-c pl-2">
                  <span className='fsize-300'> {translateTo('Call us', lang)}</span>
                  <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="td-u fSizePx18 txtGreen400">{Helpers.telephoneFormat(phone)}</a>
                </div>
              </div>
              <div className="bgGreen50 p-2 dis-f brdRadius mb-2">
                <div>
                  <img className='w-fix-40' src={textImg} alt='text icon' />
                </div>
                <div className="dis-fl-col jc-c pl-2">
                  <span className='fsize-300'> {translateTo('Text us via WhatsApp', lang)}</span>
                  <a href={`https://wa.me/${Helpers.telephoneFormat(whatsapp, false, false, false, true)}`} className="td-u txtGreen400">
                    {Helpers.telephoneFormat(whatsapp)}
                  </a>
                </div>
              </div>
            </div>
            <div className={`dis-f  pt-3 pb-1 mt-2 brdSmallTop brdText50 ${requestDone ? 'jc-c'  : 'jc-b'}`}>
              {
                requestDone ? (
                  <>
                    <BrixelButtonPrimary
                      rounded
                      label={translateTo('Close', lang)}
                      onClick={() => closeModal()}
                    />
                  </>
                ) : (
                  <>
                    <BrixelButtonText
                      theme="text"
                      rounded
                      themeSat={800}
                      label={translateTo('Cancel', lang)}
                      onClick={() => closeModal()}
                    />
                    <BrixelButtonPrimary
                      rightIcon="send"
                      rounded
                      bgTransparent
                      label={translateTo('Send', lang)}
                      disabled={supportMessage.length === 0}
                      isLoading={isSmallLoading.supportMessage}
                      onClick={() => sendMessage()}
                    />
                  </>
                )
              }

            </div>
          </div>
        ) : (
          <div className={'max-w-perc-100 p-2 bgWhite fixed  shadow-3dp brdRadius min-w-fix-312 max-w-fix-312'} id="supportBox">
            <div className="pt-2">
              <div className={'dis-f jc-b a-t pl-3 pr-1'}>
                <div className="dis-f a-c">
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
                </div>
                <BrixelButtonIcon
                  icon="close-small"
                  theme="green"
                  bgTransparent
                  onClick={() => onClose()}
                />
              </div>
              <div className={'dis-f a-c jc-b'}>
                <span className="mb-2 fweight-600 px-3 pt-1">
                  {translateTo('How can we help?', lang)}
                </span>
              </div>
              <div className={'px-3'}>
                {
                  phone && (
                    <a href={`tel:${Helpers.telephoneFormat(phone)}`} className={'dis-f a-c mb-1'}>
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
                        <span className={`${colorLinkTextInfo}`}>
                          {Helpers.telephoneFormat(whatsapp)}
                        </span>
                      </p>
                    </a>
                  )
                }
              </div>
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
                      <div>
                        <BrixelButtonIcon
                          icon="send"
                          theme="white"
                          bgTransparent
                          disabled={supportMessage.length === 0}
                          isLoading={isSmallLoading.supportMessage}
                          onClick={() => sendMessage()}
                        />
                      </div>
                    </>
                  )
                }

              </div>
            </div>
          </div>
        )
      }
    </>
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
  handleSetModal: bindActionCreators(setModal, dispatch),
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Support);
