import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { get, cloneDeep } from 'lodash';
import {
  connect,
} from 'react-redux';
import { DateTime } from 'luxon';
import {
  BrixelButtonSecondary, BrixelIcon, Helpers, translateTo,
} from '@brixel/brixel-components';
import ReviewOffer from '../Pages/Offers/ReviewOffer';
import { setSplashType } from '../actions/CommonActions';
import ClosingTree from './Skeleton/ClosingTree';

const BrixelClosingTree = (props) => {
  const sectionNumber = new Array(5).fill('');
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleClosing,
    activeSingleDeal,
    activeSingleOffer,
    className,
    dealID,
    isBuyer,
    lang,
    propID,
    setSplashScreen,
    windowDimensions,
  } = props;
  // STATE
  const userType = isBuyer ? 'buyer' : 'seller';
  const [showTabSection, setShowTabSection] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  //const [collapsedNum, setCollapsedNum] = useState(null);

  // TODO: add active/inactive lock logic
  const onClickOffer = useCallback((action) => {
    if (action === 'add') {
      history.push(`/packageFlow/${propID}/makeOffer`);
    } else {
      setSplashScreen({
        component: ReviewOffer,
      });
    }
  }, []);

  const [closingStage, setClosingStage] = useState([
    {
      name: 'offer',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageOffer',
      subtitle: get(activeSingleOffer, 'offer.amount', 0) > 0 ?
        `<span class="fsize-400">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="fsize-400 ml-1">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 0))}</span>` :
        translateTo('Add your first offer to start.', lang),
      title: translateTo('Offer', lang),
    },
    {
      name: 'identification',
      button: (action) => onClickOffer(action),
      stageName: 'stageIdentification',
      subtitle: translateTo('Submit ID and personal information.', lang),
      title: translateTo('Identification', lang),
    },
    {
      name: 'lock',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageLock',
      subtitle: translateTo('Reserve the property for closing.', lang),
      title: translateTo('Lock', lang),
    },
    {
      name: 'finance',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageFinance',
      subtitle: translateTo('Plan early for your financial situation.', lang),
      title: translateTo('Finance', lang),
    },
    {
      name: 'contract',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageContract',
      subtitle: translateTo('Approve the terms of the contract.', lang),
      title: translateTo('Contract', lang),
    },
    {
      name: 'notary',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageNotary',
      subtitle: translateTo('Sign the contract at the notary.', lang),
      title: translateTo('Notary', lang),
    },
  ]);

  const status = {
    accepted: {
      icon: 'check-small-fill',
      label: 'Accepted',
      color: 'green',
      colorText: 'txtGreen400',
    },
    rejected: {
      icon: 'close-circle',
      label: 'Rejected',
      color: 'red',
      colorText: 'txtRed400',
    },
    pending: {
      icon: 'check-small',
      label: 'Pending',
      color: 'yellow',
      colorText: 'txtYellow400',
    },
    default: {
      icon: 'check-small',
      label: '',
      color: 'dark',
      colorText: 'txtDark400',
    },
  };

  const statusIdentification = (usrType) => {
    if (get(activeSingleClosing, `stageIdentification.${usrType}.completedBy`, null)) return 'accepted';
    if (get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 0 && !get(activeSingleClosing, `stageIdentification.${usrType}.completedBy`, null)) return 'pending';
    return 'default';
  };

  useEffect(() => {
    if (windowDimensions.width < 1024 && !showTabSection) {
      setShowTabSection('buyer');
    } else if (windowDimensions.width >= 1024) {
      setShowTabSection(null);
    }
  }, [windowDimensions]);

  useEffect(() => {
    const stageText = cloneDeep(closingStage);
    if (get(activeSingleDeal, 'id', null)) {
      if (get(activeSingleOffer, 'offer.status', '') === 'rejected') {
        stageText[0].subtitle = `<span class="fsize-400 txtRed400">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="fsize-400 ml-1 txtRed400">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 0))}</span><span class="ml-1 txtRed400">${translateTo('(Rejected)', lang)}</span>`;
      } else if (get(activeSingleOffer, 'offer.amount', 0) > 0) {
        stageText[0].subtitle = `<span class="fsize-400">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="fsize-400 ml-1">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 0))}</span>`;
      }
      if (statusIdentification(userType) === 'pending' && (!showTabSection || (showTabSection === userType))) {
        stageText[1].subtitle = translateTo('Identification currently being verified', lang);
      } else {
        stageText[1].subtitle = translateTo('Submit ID and personal information.', lang);
      }
    }
    setClosingStage(stageText);
  }, [activeSingleOffer, showTabSection]);

  if (!activeSingleDeal.id) {
    return (
      <div className={`closing-tree max-w-fix-1200 dis-fl-col w-perc-100 ${className}`}>
        <div className="body dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100">
            {
              sectionNumber.map((item, i) => (
                <div
                  key={`sctNm_${i.toString()}`}
                  className={`offer-container ${get(activeSingleClosing, 'stageOffer.active', null) ? 'active' : 'locked'}`}
                >
                  <div className="hide dis-b-md">
                    <ClosingTree className="bgWhite my-3 shadow-3dp brdRadius" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  const onCollapse = (stageName) => {
    setCollapsed({...collapsed, [stageName]: !get(collapsed, stageName, false)})
  }

  const personsInfo = (usrType, classNamePersons = '') => (
    <>
      {
        get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 0 && (
          <div className={`dis-f a-c txtGreen400 brdRadius w-perc-100 jc-b py-1 px-2 ${classNamePersons} ${(isBuyer && usrType === 'buyer') || (!isBuyer && usrType === 'seller') ? '' : 'filterGray'} ${statusIdentification('seller') === 'accepted' || statusIdentification('buyer') === 'accepted' ? 'disabled' : ''} bgBlue100x25 personsListIdentification`}>
            <div className="dis-f a-c wrapName">
              <BrixelIcon
                className="mr-1"
                rounded
                background="white"
                saturation={0}
                color="green"
                icon="account"
              />
              <span className="personsName">
                {get(activeSingleClosing, `stageIdentification.${usrType}.persons[0].fullName`, '')}
              </span>
            </div>
            <div className="dis-f a-c">
              {
                get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 1 && (
                  <span className="mr-1">
                    +{get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length - 1}
                  </span>
                )
              }
              {
                ((isBuyer && usrType === 'buyer') || (!isBuyer && usrType === 'seller')) && (
                  <BrixelIcon
                    color="green"
                    icon="pencil"
                    className="editIcon"
                    onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/${usrType}/identification/`)}
                  />
                )
              }
            </div>
          </div>
        )
      }
    </>
  );

  const buyerSection = (stage) => {
    switch (stage) {
      case 'stageOffer':
        return (
          <>

            <div className="secHead p-2 h-fix-56">
              <div className="secStatus">
                {
                  get(activeSingleClosing, 'stageOffer.active', null) === false ? (
                    <BrixelIcon
                      icon="locked"
                      color="dark"
                      className="mb-1"
                    />
                  ) : (
                    <>
                      { get(activeSingleOffer, 'offer.amount', 0) > 0 &&
                        get(activeSingleOffer, 'offer.status', '') !== 'rejected' ? (
                          <div className="dis-f a-c jc-b w-perc-100">
                            <div className="dis-f a-c">
                              <BrixelIcon
                                icon="check-small-fill"
                                color="green"
                                className="mr-1"
                                iconWidth="w-fix-24"
                              />
                              <span>{translateTo('Buyer', lang)}</span>
                            </div>
                            <span className="fsize-300 fsize-lg-400 txtGreen400">{translateTo('Sent', lang)}</span>
                          </div>
                        ) : (
                          <>
                            <BrixelIcon
                              icon="check-small"
                              className="mr-1"
                              color="altGrey"
                              iconWidth="w-fix-24"
                            />
                            <span>{translateTo('Buyer', lang)}</span>
                          </>
                        )
                      }
                    </>
                  )
                }
              </div>
            </div>

            <div className="secDetails brdAltGrey100 closed">
              <div className="p-2">
                {
                  get(activeSingleOffer, 'offer.amount', 0) > 0 &&
                    get(activeSingleOffer, 'offer.status', '') !== 'rejected' && (
                    <>
                      {
                        get(activeSingleOffer, 'offer.createdAt', null) && (
                          <p className="fsize-300 txtDark200">
                            {DateTime.fromMillis(activeSingleOffer.offer.createdAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                          </p>
                        )
                      }
                    </>
                  )}
                {
                  (!get(activeSingleOffer, 'offer.status', null) || (get(activeSingleOffer, 'offer.status', '') !== 'pending' &&
                    get(activeSingleOffer, 'offer.status', '') !== 'accepted')) &&
                  isBuyer && (
                    <BrixelButtonSecondary
                      rounded
                      className=""
                      label={translateTo('Add offer', lang)}
                      onClick={() => onClickOffer('add')}
                    />
                  )
                }
              </div>
            </div>

          </>
        );
      case 'stageIdentification':
        return (
          <>
            <div className="secHead p-2 h-fix-56">
              <div className="secStatus">
                {
                  get(activeSingleClosing, 'stageIdentification.active', null) === false ? (
                    <div className="dis-f jc-b">
                      <span>{translateTo('Buyer', lang)}</span>
                      <BrixelIcon
                        icon="locked"
                        color="dark"
                        iconWidth="w-fix-24"
                      />
                    </div>
                  ) : (
                    <div className="dis-f jc-b w-perc-100">
                      <div className="dis-f jc-b w-perc-100">
                        <div className="">
                          {
                            get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length > 0 ? (
                              <BrixelIcon
                                icon={status[statusIdentification('buyer')].icon}
                                color={status[statusIdentification('buyer')].color}
                                iconWidth="w-fix-24"
                                className="mr-1"
                              />
                            ) : (
                              <BrixelIcon
                                icon="check-small"
                                color="altGrey"
                                className="mr-1"
                                iconWidth="w-fix-24"
                              />
                            )
                          }
                          <span>{translateTo('Buyer', lang)}</span>
                        </div>
                        <div className="div">
                          {
                            statusIdentification('buyer') === 'accepted' && (
                              <span className="ml-1 txtGreen400 fsize-300 fsize-lg-400">{translateTo('Verified', lang)}</span>
                            )
                          }
                          {
                            statusIdentification('buyer') === 'pending' && (
                              <span className="ml-1 txtYellow400 fsize-300 fsize-lg-400">{translateTo('Pending', lang)}</span>
                            )
                          }
                        </div>
                      </div>
                      {
                        get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length === 0 && (
                          <div className="">
                            {
                              isBuyer && (
                                <span className={`${status[statusIdentification('buyer')].colorText}`}>
                                  {translateTo('Pending', lang)}
                                </span>
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className="secDetails">
              <div className="p-2">
                {
                  get(activeSingleClosing, 'stageIdentification.active', null) !== false && (
                    <div>
                      {
                        get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length === 0 ? (
                          <div>
                            {
                              isBuyer && (
                                <BrixelButtonSecondary
                                  rounded
                                  label={translateTo('Add buyer', lang)}
                                  onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/buyer/identification/`)}
                                />
                              )
                            }
                          </div>
                        ) : (
                          <>{personsInfo('buyer', '')} </>
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </>
        );
      case 'stageFinance':
        return (
          <>

            <div className="secHead dis-f jc-b p-2 h-fix-56">
              {
                get(activeSingleClosing, 'stageFinance.active', null) ? (
                  <>
                    <div>
                      <BrixelIcon
                        icon="check-small"
                        color="altGrey"
                        className="mr-1"
                        iconWidth="w-fix-24"
                      />
                      <span>{translateTo('Buyer', lang)}</span>
                    </div>
                    <span className="fsize-200">{translateTo('Manual Step', lang)}</span>
                  </>
                ) : (
                  <>
                    <span>{translateTo('Buyer', lang)}</span>
                    <BrixelIcon
                      icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                      color="dark"
                      iconWidth="w-fix-24"
                    />
                  </>
                )
              }
            </div>
            <div className="secDetails">
            </div>
          </>
        );
      default:
        return (
          <>
            {
              get(activeSingleClosing, `${stage}.active`, null) ? (
                <>
                  <div className="secHead dis-f jc-b p-2 h-fix-56">
                    <div>
                      <BrixelIcon
                        icon="check-small"
                        color="altGrey"
                        className="mr-1"
                        iconWidth="w-fix-24"
                      />
                      <span>{translateTo('Buyer', lang)}</span>
                    </div>
                    <span className="fsize-200">{translateTo('Manual Step', lang)}</span>
                  </div>
                  <div className="secDetails">
                    {
                      get(activeSingleClosing, `${stage}.completedBySeller.completedAt`, null) ? (
                        <span className="fsize-100 txtDark200">
                          {DateTime.fromMillis(activeSingleClosing[stage].completedBySeller.completedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                        </span>
                      ) : (
                        <></>
                      )
                    }
                  </div>
                </>
              ) : (
                <>
                  <div className="secHead dis-f jc-b p-2 h-fix-56">
                    <span>{translateTo('Buyer', lang)}</span>
                    <BrixelIcon
                      icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                      color="dark"
                      iconWidth="w-fix-24"
                    />
                  </div>
                  <div className="secDetails">
                  </div>
                </>
              )
            }
          </>
        );
    }
  };

  const sellerSection = (stage) => {
    switch (stage) {
      case 'stageOffer':
        return (
          <>
            <div className="secHead dis-f jc-b h-fix-56">
              <div className="secStatus p-2 w-perc-100">
                {
                  get(activeSingleClosing, 'stageOffer.active', null) === false ? (
                    <BrixelIcon
                      icon="locked"
                      color="dark"
                      iconWidth="w-fix-16"
                    />
                  ) : (
                    <>
                      { !get(activeSingleOffer, 'offer.status', null) || !status[get(activeSingleOffer, 'offer.status', '')] ? (
                        <>
                          <BrixelIcon
                            icon="check-small"
                            className="mr-1"
                            color="altGrey"
                            iconWidth="w-fix-24"
                          />
                          <span>{translateTo('Seller', lang)}</span>
                        </>
                      ) : (
                        <>
                          <div className="dis-f a-c jc-b w-perc-100">
                            <div className="dis-f a-c">
                              <BrixelIcon
                                icon={status[get(activeSingleOffer, 'offer.status', '')].icon}
                                color={status[get(activeSingleOffer, 'offer.status', '')].color}
                                className="mr-1"
                                iconWidth="w-fix-24"
                              />
                              <span>{translateTo('Seller', lang)}</span>
                            </div>
                            <span className={`${status[get(activeSingleOffer, 'offer.status', '')].colorText} fsize-300 fsize-lg-400`}>
                              {translateTo(status[get(activeSingleOffer, 'offer.status', '')].label, lang)}
                            </span>
                          </div>
                        </>
                      )
                      }
                    </>
                  )
                }
              </div>

              {
                get(activeSingleClosing, 'stageOffer.active', null) !== false && (
                  <div className="collExBtn p-2 dis-f a-c brdSmallLeft brdAltGrey100">
                    <BrixelIcon
                      icon="dropdown"
                      color="altGrey"
                      className={collapsed['stageOffer'] ? "" : "rotateIcon"}
                      onClick={()=> onCollapse('stageOffer')}
                    />
                  </div>
                )
              }
            </div>

            <div className="secDetails closed">
              <div className="p-2">
                {
                  get(activeSingleClosing, 'stageOffer.active', null) !== false && (
                    <>
                      { !get(activeSingleOffer, 'offer.status', null) || !status[get(activeSingleOffer, 'offer.status', '')] ? (
                        <>
                        </>
                      ) : (
                        <>
                          {
                            get(activeSingleOffer, 'offer.reviewedAt', null) && (
                              <p className="fsize-300 txtDark200">
                                {DateTime.fromMillis(activeSingleOffer.offer.reviewedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                              </p>
                            )
                          }
                          {
                            get(activeSingleOffer, 'offer.status', '') === 'pending' && !isBuyer && (
                              <BrixelButtonSecondary
                                rounded
                                className=""
                                label={translateTo('Review offer', lang)}
                                onClick={() => onClickOffer('review')}
                              />
                            )
                          }
                        </>
                      )
                      }
                    </>
                  )
                }
              </div>
            </div>


            {/* {
              get(activeSingleClosing, 'stageOffer.active', null) === false ? (
                <>
                  <BrixelIcon
                    icon="locked"
                    color="dark"
                    className="mb-1"
                  />
                </>
              ) : (
                <>
                  {
                    !get(activeSingleOffer, 'offer.status', null) || !status[get(activeSingleOffer, 'offer.status', '')] ? (
                      <></>
                    ) : (
                      <>
                        <div className="dis-f a-c jc-fe jc-fs-lg">
                          <BrixelIcon
                            icon={status[get(activeSingleOffer, 'offer.status', '')].icon}
                            color={status[get(activeSingleOffer, 'offer.status', '')].color}
                            className="mr-1"
                            iconWidth="w-fix-16"
                          />
                          <span className={`${status[get(activeSingleOffer, 'offer.status', '')].colorText} fsize-300 fsize-lg-400`}>
                            {status[get(activeSingleOffer, 'offer.status', '')].label}
                          </span>
                        </div>
                        {
                          get(activeSingleOffer, 'offer.reviewedAt', null) && (
                            <p className="fsize-300 txtDark200">
                              {DateTime.fromMillis(activeSingleOffer.offer.reviewedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                            </p>
                          )
                        }
                        {
                          get(activeSingleOffer, 'offer.status', '') === 'pending' && !isBuyer && (
                            <BrixelButtonSecondary
                              rounded
                              className=" mt-2"
                              label="Review offer"
                              onClick={() => onClickOffer('review')}
                            />
                          )
                        }
                      </>
                    )
                  }
                </>
              )
            } */}
          </>
        );
      case 'stageIdentification':
        return (
          <>
            <div className="secHead dis-f jc-b h-fix-56">
              <div className="secStatus p-2 w-perc-100">
                {
                  get(activeSingleClosing, 'stageIdentification.active', null) === false ? (
                    <div className="dis-f jc-b">
                      <span>{translateTo('Seller', lang)}</span>
                      <BrixelIcon
                        icon="locked"
                        color="dark"
                        iconWidth="w-fix-24"
                      />
                    </div>
                  ) : (
                    <div className="dis-f jc-b">
                      <div className="dis-f jc-b w-perc-100">
                        <div className="">
                          {
                            get(activeSingleClosing, 'stageIdentification.seller.persons', []).length > 0 ? (
                              <BrixelIcon
                                icon={status[statusIdentification('seller')].icon}
                                color={status[statusIdentification('seller')].color}
                                iconWidth="w-fix-24"
                                className="mr-1"
                              />
                            ) : (
                              <>
                                <BrixelIcon
                                  icon={status[statusIdentification('buyer')].icon}
                                  color={status[statusIdentification('buyer')].color}
                                  iconWidth="w-fix-24"
                                  className="mr-1"
                                />
                              </>
                            )
                          }
                          <span>{translateTo('Seller', lang)}</span>
                        </div>
                        <div className="">
                          {
                            statusIdentification('seller') === 'accepted' && (
                              <span className="ml-1 txtGreen400">Verified</span>
                            )
                          }
                          {
                            statusIdentification('seller') === 'pending' && (
                              <span className="ml-1 txtYellow400">Pending</span>
                            )
                          }
                        </div>
                      </div>
                      {
                        get(activeSingleClosing, 'stageIdentification.seller.persons', []).length === 0 && (
                          <div>
                            {
                              !isBuyer && (
                                <>
                                  <span className={`${status[statusIdentification('buyer')].colorText} ml-1 fsize-300 fsize-lg-400`}>
                                    Pending
                                  </span>
                                </>
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  )
                }
              </div>
              {
                get(activeSingleClosing, 'stageIdentification.active', null) !== false && (
                  <div className="collExBtn p-2 dis-f a-c brdSmallLeft brdAltGrey100">
                    <BrixelIcon
                      icon="dropdown"
                      color="altGrey"
                      className={collapsed['stageIdentification'] ? "" : "rotateIcon"}
                      onClick={()=> onCollapse('stageIdentification')}
                    />
                  </div>
                )
              }
            </div>
            <div className="secDetails">
              <div className="p-2">
                {
                  get(activeSingleClosing, 'stageIdentification.active', null) !== false && (
                    <div>
                      {
                        get(activeSingleClosing, 'stageIdentification.seller.persons', []).length === 0 && (
                          <div className="dis-f a-c jc-fe jc-fs-lg">
                            {
                              !isBuyer && (
                                <BrixelButtonSecondary
                                  rounded
                                  label={translateTo('Add seller', lang)}
                                  onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/seller/identification/`)}
                                />
                              )
                            }
                          </div>
                        )
                      }
                      {personsInfo('seller', '')}
                    </div>
                  )
                }
              </div>
            </div>
          </>
        );
      case 'stageFinance':
        return (
          <>
            <div className="secHead dis-f jc-b p-2 h-fix-56">
              {
                get(activeSingleClosing, 'stageFinance.active', null) ? (
                  <>
                    <div>
                      <BrixelIcon
                        icon="check-small"
                        color="altGrey"
                        className="mr-1"
                        iconWidth="w-fix-24"
                      />
                      <span>{translateTo('Seller', lang)}</span>
                    </div>
                    <span className="fsize-200">Manual Step</span>
                  </>
                ) : (
                  <>
                    <span>{translateTo('Seller', lang)}</span>
                    <BrixelIcon
                      icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                      color="dark"
                      iconWidth="w-fix-24"
                    />
                  </>
                )
              }
            </div>
            <div className="secDetails">
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="secHead dis-f jc-b p-2 h-fix-56">
              {
                get(activeSingleClosing, `${stage}.active`, null) ? (
                  <>
                    <div>
                      <BrixelIcon
                        icon="check-small"
                        color="altGrey"
                        className="mr-1"
                        iconWidth="w-fix-24"
                      />
                      <span>{translateTo('Seller', lang)}</span>
                    </div>
                    <span className="fsize-200">{translateTo('Manual Step', lang)}</span>
                  </>
                ) : (
                  <>
                    <span>{translateTo('Seller', lang)}</span>
                    <BrixelIcon
                      icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                      color="dark"
                      iconWidth="w-fix-24"
                    />
                  </>
                )
              }
            </div>
            <div className="secDetails">
              {
                get(activeSingleClosing, `${stage}.active`, null) && get(activeSingleClosing, `${stage}.completedBySeller.completedAt`, null) ? (
                  <span className="fsize-100 txtDark200">
                    {DateTime.fromMillis(activeSingleClosing[stage].completedBySeller.completedAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}
                  </span>
                ) : (
                  <> </>
                )
              }
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className={`w-perc-100 max-w-fix-1200 ${className} closingTree`}>
        <div className="dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 txtDark700">

            {/* <div className="hide header bgGreen100 brdRadius dis-f-lg jc-b a-c w-perc-100 px-2 py-2">
              <span className="w-perc-40 tt-up">Process</span>
              <span className="w-perc-30 px-2 tt-up">Buyer</span>
              <span className="w-perc-30 pl-2 tt-up">{translateTo('Seller', lang)}</span>
            </div>

             <BrixelTabs
                className="hide-lg ov-h"
                classNameUl="ov-y-h"
                labels={['Buyer', '{translateTo('Seller', lang)}']}
                clicksList={['buyer', 'seller']}
                onClick={(val) => setShowTabSection(val)}
                activeTab={showTabSection}
                fullWidth
              /> */}

            {
              closingStage.map((stage, i) => (
                <div
                  className={`tableWrapper brdRadius mb-3 shadow-3dp ${get(activeSingleClosing, `${stage.stageName}.active`, null) ? 'active' : 'locked'} ${collapsed[stage.stageName]  ? 'collapsed' : ''}`}
                  key={`clsStg_${i.toString()}`}
                >

                  <div className="tableItem">
                    <div className="secHead p-2 h-fix-56 dis-f jc-b">
                      <div className="">
                        <span
                          className={`brdCircle bgGreen400 dis-ib h-fix-24 w-fix-24 txtWhite ta-c ff-mono fsize300`}>
                          {i + 1}
                        </span>
                        <span className="fsize-400 fweight-600 pl-1">
                          {stage.title}
                        </span>
                      </div>
                      {
                        get(activeSingleClosing, `${stage.stageName}.active`, null) ? (
                          <>
                          </>
                        ) : (
                          <>
                            {
                              windowDimensions.width < 1026 && (
                                <BrixelIcon
                                  icon="locked"
                                  color="dark"
                                  iconWidth="w-fix-24"
                                />
                              )
                            }
                          </>
                        )
                      }

                    </div>
                    <div className="secDetails closed">
                      <span className="p-2 dis-b fsize-400" dangerouslySetInnerHTML={{ __html: stage.subtitle }} />
                    </div>
                  </div>
                  <div className="tableItem">
                    {buyerSection(stage.stageName)}
                  </div>
                  <div className="tableItem">
                    {sellerSection(stage.stageName)}
                  </div>

                </div>
              ))
            }

            {/*   {
              closingStage.map((stage, i) => (
                <div
                  className={`offer-container dis-fl-row jc-b ${get(activeSingleClosing, `${stage.stageName}.active`, null) ? 'active' : 'locked'} ${closingStage.length > i + 1 ? 'brdSmallBottom brdAltGrey100' : ''} flex-wrap`}
                  key={`clsStg_${i.toString()}`}
                >
                  <div className="w-perc-50 w-perc-lg-40 py-2 py-lg-4 px-2">
                    <h5 className="mb-2 fweight-600 fsize-300 fsize-lg-400">{stage.title}</h5>
                    <div className="fsize-300" dangerouslySetInnerHTML={{ __html: stage.subtitle }} />
                  </div>
                  {
                    (!showTabSection || showTabSection === 'buyer') && (
                      <div className="w-perc-50 w-perc-lg-30 bg-lgLight100 py-2 py-lg-4 px-2 ta-r ta-l-lg">
                        {buyerSection(stage.stageName)}
                      </div>
                    )
                  }

                  {
                    (!showTabSection || showTabSection === 'seller') && (
                      <div className="w-perc-50 w-perc-lg-30 py-2 py-lg-4 px-2 ta-r ta-l-lg">
                        {sellerSection(stage.stageName)}
                      </div>
                    )
                  }

                  {
                    stage.stageName === 'stageIdentification' && showTabSection && (
                      <>
                        {personsInfo(showTabSection, 'mb-2 mx-2 mx-lg-0')}
                      </>
                    )
                  }

                </div>
              ))
            } */}
          </div>
        </div>
      </div>
    </>
  );
};

BrixelClosingTree.propTypes = {
  activeSingleClosing: PropTypes.object.isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleOffer: PropTypes.object.isRequired,
  className: PropTypes.string,
  dealID: PropTypes.string.isRequired,
  isBuyer: PropTypes.bool,
  lang: PropTypes.string.isRequired,
  propID: PropTypes.string.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

BrixelClosingTree.defaultProps = {
  className: '',
  isBuyer: false,
};

const mapStateToProps = (state) => ({
  activeSingleClosing: get(state, 'deal.activeSingleDeal.closing', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BrixelClosingTree);
