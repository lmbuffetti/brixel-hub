import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {BrixelButtonPrimary, BrixelButtonText, BrixelStatus} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {BrixelSwitchButton, BrixelTextArea, change, ReduxField, reset} from '@brixel/brixel-components/dist/form';
import {updatePortalsReview} from '../../actions/PropertyActions';
import {setModal} from '../../actions/CommonActions';
import {MarketingModalData} from '../../resources/SingleProperty/marketingModal';
import type {StatusType} from '../../@types/Pages/Marketing/Portals';

const Portals = (props) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    changeFieldValue,
    companyPortals,
    customPortals,
    formValue,
    handleSetModal,
    handleUpdatePortalsReview,
    isSmallLoading,
    lang,
    modal,
    portals,
  } = props;
  // STATE
  const [status, setStatus] = useState<StatusType>();
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const MarketingModal = MarketingModalData(lang);

  // GET PORTALS STATUS
  const checkPortalsOnline = () => {
    let isOnline = false;
    Object.keys(portals).map((key) => {
      if (portals[key] && get(customPortals, `${key}`, true) && !isOnline && !key.includes('Url')) isOnline = true;
      return null;
    });
    Object.keys(customPortals).map((key) => {
      if (customPortals[key] && !isOnline && !key.includes('Url')) isOnline = true;
      return null;
    });
    return isOnline;
  };

  // ASSIGN COLOR AND TEXT BY STATUS
  useEffect(() => {
    if (activeSingleProperty.portalsReview) {
      setStatus({
        text: translateTo('Review', lang),
        color: 'Yellow400',
        state: 'review',
      });
    } else if (checkPortalsOnline()) {
      setStatus({
        text: translateTo('Published', lang),
        color: 'Green400',
        state: 'published',
      });
    } else {
      setStatus({
        text: translateTo('Unpublished', lang),
        color: 'Red400',
        state: 'unpublished',
      });
    }
  }, [activeSingleProperty]);

  // CHANGE PORTALS REVIEW
  const changeReviewStatus = () => {
    const data = {
      page: propID,
      smallLoader: 'saveMarketingPortal',
      status: checkPortalsOnline() ? 'offline' : 'online',
    };
    handleUpdatePortalsReview(data);
  };

  const onClickRequest = (state, type = 'request') => {
    const bodyText = MarketingModal[state][type].body.replace(':companyPrice', `${get(activeSingleCompany, 'country.currency')} ${get(activeSingleCompany, 'meta.portals.price')}`);
    handleSetModal({
      state: true,
      layout:'xlarge',
      bodyClassColor: 'bgWhite',
      title: MarketingModal[state][type].title,
      body: bodyText,
      small: true,
      titleImg: MarketingModal[state][type].titleImg,
      classContainer: 'dis-b ta-c',
      classImg: 'mx-a w-fix-64 mb-3',
      bodyActionsClass: 'dis-f a-c jc-c mt-5 mb-3',
      bodyInnerClass: 'max-w-fix-384 m-a ta-c',
      classTitle: 'ta-c',
      showSupport: type === 'success',
      supportLayout: 'inline',
      multiBodyActions: type === 'success' ? [
        {
          btnType: 'Primary',
          name: translateTo('Ok thanks', lang),
          round: true,
          func: () => handleSetModal({}),
        },
      ] : [
        {
          btnType: 'Secondary',
          name: translateTo('Cancel', lang),
          round: true,
          className: 'mr-1',
          func: () => handleSetModal({}),
        },
        {
          btnType: 'Primary',
          name: translateTo('Confirm', lang),
          round: true,
          className: 'ml-1',
          func: () => changeReviewStatus(),
        },
      ],
    })
  };

  useEffect(() => {
    if (get(modal, 'multiBodyActions', []).length > 1 && isSmallLoading.saveMarketingPortal === true) {
      modal.multiBodyActions[1].isLoading = isSmallLoading.saveMarketingPortal;
      handleSetModal(modal);
    }
    if (isSmallLoading.saveMarketingPortal === false) {
      const stateText = status?.state === 'published' ? 'unpublishPage' : 'publishPage';
      onClickRequest(stateText, 'success');
    }
  }, [isSmallLoading]);

  return (
    <>
      <div className="bgWhite p-4 brdRadius">
        <div className="dis-f jc-b a-c mb-2">
          <h5>{translateTo('Publish on portals', lang)}</h5>
          <div className={`brdSmall px-2 py-1 brd${status?.color} txt${status?.color} brdRadius`}>
            {translateTo(status?.text || '', lang)}
          </div>
        </div>

        <div className="mb-4">
          {
            checkPortalsOnline() ? (
              <p>{translateTo('Your property is published on following portals:', lang)}</p>
            ) : (
              <div>
                <p>
                  {translateTo('Reach a wide audience and publish your property on the biggest portals', lang)}
                </p>
                <ul className="checkList fsize-300 green mt-2 txtAltGrey700">
                  <li>{translateTo('Manage all your listings in one place', lang)}</li>
                  <li>{translateTo('Publish all your listings with one click', lang)}</li>
                  <li>
                    <span>{translateTo('Valid for', lang)}</span>
                    <span className="mx-small-4">{get(activeSingleCompany, 'meta.portals.duration', 6)}</span>
                    <span>{translateTo('months', lang)}</span>
                  </li>
                  {
                    get(activeSingleProperty, 'location.countryCode', '') === 'PT' ? (
                      <li>{translateTo('Idealista, Imovirtual, Casa Sapo, SuperCasa and many more.', lang)}</li>
                    ) : (
                      <li>{translateTo('Homegate, ImmoScout24, Comparis, Newhome and many more.', lang)}</li>
                    )
                  }
                </ul>
              </div>
            )
          }
        </div>

        <div className="portalsList mt-3">
          {
            checkPortalsOnline() && Object.keys(companyPortals).map((key, i) => (
              <React.Fragment
                key={`prt_${i.toString()}`}
              >
                {
                  companyPortals[key] && (
                    <>
                      {
                        portals[key] ? (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={portals[`${key}Url`]}
                            className="dis-f a-c"
                          >
                            <span className="fsize-300">{translateTo(key, lang)}</span>
                            <BrixelStatus
                              color="green"
                            />
                          </a>
                        ) : (
                          <div
                            className="dis-f a-c singlePortal"
                          >
                            <span className="fsize-300">{translateTo(key, lang)}</span>
                            <BrixelStatus
                              color="red"
                            />
                          </div>
                        )
                      }
                    </>
                  )
                }
              </React.Fragment>
            ))
          }
          {
            Object.keys(customPortals).map((key, i) => (
              <React.Fragment key={`cstPrt_${i.toString()}`}>
                {
                  customPortals[key] && !key.toLocaleLowerCase().includes('url') && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={customPortals[`${key}Url`]}
                      className="dis-f a-c"
                    >
                      <span className="fsize-300">{translateTo(key, lang)}</span>
                      <BrixelStatus
                        color="green"
                      />
                    </a>
                  )
                }
              </React.Fragment>
            ))
          }
        </div>

        {
          checkPortalsOnline() && !formValue.portalsReview && (
            <>
              <div>
                <p className="fweight-500 txtDark700 mb-1 mt-5">{translateTo('Portals description', lang)}</p>
                <span className="txtDark200">{translateTo('Add a description text which is shown on portals only.', lang)}</span>
              </div>
              <ReduxField
                form="Property"
                input={{
                  name: 'description.portalHighlight',
                  placeholder: translateTo('Add text', lang),
                }}
                design={{
                  className: 'mt-2',
                }}
                component={BrixelTextArea}
              />
            </>
          )
        }

        <div className="dis-f a-c jc-fe mt-5">
          {
            checkPortalsOnline() ? (
              <>
                <BrixelButtonText
                  label={translateTo('Take Page offline', lang)}
                  theme="red"
                  rounded
                  onClick={() => onClickRequest('unpublishPortals', 'request')}
                  isLoading={isSmallLoading.pageReview}
                />
              </>
            ) : (
              <>
                {
                  status?.state !== 'review' && (
                    <BrixelButtonPrimary
                      label={translateTo('Request to publish', lang)}
                      rounded
                      onClick={() => onClickRequest('publishPortals', 'request')}
                      isLoading={isSmallLoading.pageReview}
                    />
                  )
                }
              </>
            )
          }
        </div>

      </div>


      {
        get(activeSingleProperty, 'published', null) === false && (
          <div className="bgWhite brdRadius p-4 mt-2">
            <BrixelSwitchButton
              isReversed
              label={translateTo('Pre-market', lang)}
              className="mb-3 boldLabel"
              input={{
                onChange: (val) => changeFieldValue('preMarketVisible', val),
                name: 'stageOffer',
                value: activeSingleProperty.preMarketVisible,
              }}
            />
            {
              get(activeSingleProperty, 'preMarketVisible', false) === true ? (
                <p className="txtDark700">
                  {translateTo('Your property is visible on our pre-market. Registered buyers can observe your property and will be informed if you want to go to market. We never share any exact address or personal data without your consent.', lang)}
                </p>
              ) : (
                <p className="txtDark700" dangerouslySetInnerHTML={{ __html: translateTo('Your property is <strong class="lh-in fweight-600">not</strong> visible on our pre-market. If you make it visible, registered buyers can observe your property and will be informed if you want to go to market. We never share any exact address or personal data without your consent.', lang) }} />
              )
            }
          </div>
        )
      }

    </>
  );
};

Portals.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  companyPortals: PropTypes.object.isRequired,
  customPortals: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleUpdatePortalsReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  modal: PropTypes.object.isRequired,
  portals: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'brixelForm.Property.values', {});
  const activeSingleProperty = get(state, 'property.activeSingleProperty', {});
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty,
    companyPortals: get(state, 'companies.activeSingleCompany.availablePortals', {}),
    customPortals: get(activeSingleProperty, 'customPortals', {}),
    formValue,
    lang: get(state, 'common.language', 'en'),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    modal: get(state, 'common.modal', {}),
    portals: get(activeSingleProperty, 'portals', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form, data) {
    (dispatch(reset(form, data)));
  },
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleUpdatePortalsReview: bindActionCreators(updatePortalsReview, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Portals);
