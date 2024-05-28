import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {BrixelButtonPrimary, BrixelButtonText, BrixelStatus} from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import {change, reset} from '@brixel-io/brixel-components/dist/form';
import {updatePortalsReview} from '../../actions/PropertyActions';
import {setModal} from '../../actions/CommonActions';
import {MarketingModalData} from '../../resources/SingleProperty/marketingModal';
import api from '../../controllers/api/config';
import type {PortalsType, StatusType} from '../../@types/Pages/Marketing/Portals';

const Portals = (props) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    // changeFieldValue,
    customPortals,
    handleSetModal,
    handleUpdatePortalsReview,
    isSmallLoading,
    lang,
    modal,
  } = props;
  // STATE
  const [status, setStatus] = useState<StatusType>();
  const [portalsList, setPortalsList] = useState<PortalsType[] | null>(null)

  // URL PARAMS
  const propID = get(match, 'propID', null);
  const MarketingModal = MarketingModalData(lang);

  // GET PORTALS STATUS
  const checkPortalsOnline = () => {
    let isOnline = false;
    if (portalsList && portalsList.length > 0) {
      let counter = portalsList.length;
      portalsList.forEach((el) => {
        if (el.exportEnabled === true) counter++;
        if (el.exportEnabled === null || el.exportEnabled === false) counter--;
      });
      if (counter === 0) {
        isOnline = false;
      }
      if (counter > 0) {
        isOnline = true;
      }
    }
    return isOnline;
  };

  // ASSIGN COLOR AND TEXT BY STATUS
  useEffect(() => {
    if (portalsList && portalsList.length > 0) {
      if (activeSingleProperty.portalsReview) {
        setStatus({
          text: translateTo('Review', lang),
          color: 'Yellow400',
          state: 'review',
        });
      } else if (checkPortalsOnline() === true) {
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
    }
  }, [portalsList]);

  const getPortals = () => {
    let portals: PortalsType[] = [];
    const callArray: Promise<void>[] = []
    const call = api.portals.getPortals(activeSingleProperty.id)
      .then((res) => {
        if (res.meta.status === 200) {
          portals = res.data;
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    callArray.push(call);
    Promise.allSettled(callArray).then(() => {
      setPortalsList(portals)
    })
  }

  useEffect(() => {
    if (activeSingleProperty.id) {
      getPortals()
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
      /* showSupport: type === 'success', */
      /* supportLayout: 'inline', */
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
                <ul className="checkList fsize-300 green mt-2 txtText700">
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
            checkPortalsOnline() && portalsList && portalsList.length > 0 && portalsList.map((portal, i) => (
              <React.Fragment
                key={`prt_${i.toString()}`}
              >
                {
                  portal.children.length === 0 ? (
                    portal.exportEnabled ? (
                      <>
                        {
                          portal.url ? (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={portal.url}
                              className="dis-f a-c"
                            >
                              <BrixelStatus
                                color={`${portal.exportEnabled ? 'green' : 'red'}`}
                              />
                              <span className={`fsize-300 ${portal.exportEnabled ? 'txtGreen400' : 'txtText900'} td-u ml-1`}>{translateTo(portal.portal.displayName, lang)}</span>
                            </a>
                          ) : (
                            <div className="dis-f a-c">
                              <BrixelStatus
                                color={`${portal.exportEnabled ? 'green' : 'red'}`}
                              />
                              <span className="fsize-300 txtText900 ml-1">{translateTo(portal.portal.displayName, lang)}</span>
                            </div>
                          )
                        }
                      </>
                    ) : (
                      <div className="dis-f a-c singlePortal">
                        <BrixelStatus
                          color="red"
                        />
                        <span className="fsize-300 txtText900 ml-1 no-transform">{translateTo(portal.portal.displayName, lang)}</span>
                      </div>
                    )
                  
                  ) : (
                    portal.children.length > 0 && portal.children.map((portalChild, j) => (
                      <React.Fragment
                        key={`prtChld_${j.toString()}`}
                      >
                        {
                          portal.exportEnabled ? (
                            <>
                              {
                                portalChild.url ? (
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={portalChild.url}
                                    className="dis-f a-c"
                                  >
                                    <BrixelStatus
                                      color={`${portal.exportEnabled ? 'green' : 'red'}`}
                                    />
                                    <span className={`fsize-300 ${portal.exportEnabled ? 'txtGreen400' : 'txtText900'} no-transform td-u ml-1`}>{translateTo(portalChild.portal.displayName, lang)}</span>
                                  </a>
                                ) : (
                                  <div className="dis-f a-c">
                                    <BrixelStatus
                                      color={`${portal.exportEnabled ? 'green' : 'red'}`}
                                    />
                                    <span className="fsize-300 txtText900 ml-1">{translateTo(portalChild.portal.displayName, lang)}</span>
                                  </div>
                                )
                              }
                            </>
                          ) : (
                            <div className="dis-f a-c singlePortal">
                              <BrixelStatus
                                color="red"
                              />
                              <span className="fsize-300 txtText900 ml-1 no-transform">{translateTo(portalChild.portal.displayName, lang)}</span>
                            </div>
                          )
                        }
                      </React.Fragment>
                    ))
                  )}
              </React.Fragment>
            ))
          }

          {/* CUSTOM PORTALS */}
          {
            Object.keys(customPortals).map((key, i) => (
              <React.Fragment key={`cstPrt_${i.toString()}`}>
                {
                  customPortals[key] && !key.toLocaleLowerCase().includes('url') && (
                    <>
                      {
                        customPortals[`${key}Url`] ? (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={customPortals[`${key}Url`]}
                            className="dis-f a-c"
                          >
                            <BrixelStatus
                              color="green"
                            />
                            <span className="fsize-300 txtGreen400 td-u ml-1">
                              {translateTo(key, lang)}
                            </span>
                          </a>
                        ) : (
                          <div
                            className="dis-f a-c"
                          >
                            <BrixelStatus
                              color="green"
                            />
                            <span className="fsize-300 txtText900 ml-1">{translateTo(key, lang)}</span>
                          </div>
                        )
                      }
                    </>

                  )
                }
              </React.Fragment>
            ))
          }
        </div>

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


      {/*
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
                <p className="txtText900">
                  {translateTo('Your property is visible on our pre-market. Registered buyers can observe your property and will be informed if you want to go to market. We never share any exact address or personal data without your consent.', lang)}
                </p>
              ) : (
                <p className="txtText900" dangerouslySetInnerHTML={{ __html: translateTo('Your property is <strong class="lh-in fweight-600">not</strong> visible on our pre-market. If you make it visible, registered buyers can observe your property and will be informed if you want to go to market. We never share any exact address or personal data without your consent.', lang) }} />
              )
            }
          </div>
        )
      */}

    </>
  );
};

Portals.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  customPortals: PropTypes.object.isRequired,
  // formValue: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleUpdatePortalsReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  modal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  // const formValue = get(state, 'brixelForm.Property.values', {});
  const activeSingleProperty = get(state, 'property.activeSingleProperty', {});
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty,
    customPortals: get(activeSingleProperty, 'customPortals', {}),
    // formValue,
    lang: get(state, 'common.language', 'en'),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    modal: get(state, 'common.modal', {}),
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
