import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  connect,
} from 'react-redux';
import { DateTime } from 'luxon';
import {
  BrixelButtonSecondary, BrixelIcon, Helpers, BrixelTabs,
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
    activeSingleProperty,
    className,
    dealID,
    isBuyer,
    propID,
    setSplashScreen,
    userLang,
    windowDimensions,
  } = props;
  // STATE
  const [showTabSection, setShowTabSection] = useState(null);

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
  };

  useEffect(() => {
    if (windowDimensions.width < 1024 && !showTabSection) {
      setShowTabSection('buyer');
    } else if (windowDimensions.width >= 1024) {
      setShowTabSection(null);
    }
  }, [windowDimensions]);

  // TODO: add active/inactive lock logic
  const onClickOffer = useCallback((action) => {
    if (action === 'add') {
      history.push(`/packageFlow/${activeSingleProperty.id}/makeOffer`);
    } else {
      setSplashScreen({
        component: ReviewOffer,
      });
    }
  }, []);

  if (!activeSingleDeal.id) {
    return (
      <div className={`closing-tree brdRadius shadow-1dp dis-fl-col w-perc-100 max-w-fix-1056 ${className}`}>
        <div className="body dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 px-sm-5 px-1 txtDark700">
            {
              sectionNumber.map((item, i) => (
                <div
                  key={i.toString()}
                  className={`offer-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageOffer.active', null) ? 'active' : 'locked'}`}
                >
                  <ClosingTree />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  const closingStage = [
    {
      name: 'offer',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageOffer',
      subtitle: get(activeSingleOffer, 'offer.amount', 0) > 0 ?
        `<span class="ff-mono fsize-300">${get(activeSingleOffer, 'offer.currency', 0)}</span><span class="ff-mono fsize-300 ml-1">${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 0))}</span>` :
        'Add your first offer to start.',
      title: 'Offer',
    },
    {
      name: 'identification',
      button: (action) => onClickOffer(action),
      stageName: 'stageIdentification',
      subtitle: 'Submit ID and personal information.',
      title: 'Identification',
    },
    {
      name: 'lock',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageLock',
      subtitle: 'Reserve the property for closing.',
      title: 'Lock',
    },
    {
      name: 'contract',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageContract',
      subtitle: 'Approve the terms of the contract.',
      title: 'Contract',
    },
    {
      name: 'notary',
      onClick: (action) => onClickOffer(action),
      stageName: 'stageNotary',
      subtitle: 'Sign the contract at the notary.',
      title: 'Notary',
    },
  ];

  const personsInfo = (usrType, classNamePersons = '') => (
    <>
      {
        get(activeSingleClosing, `stageIdentification.${usrType}.persons`, []).length > 0 && (
          <div className={`dis-f a-c bgBlue100x25 txtGreen400 brdRadius w-perc-100 jc-b py-1 px-2 ${classNamePersons} personsListIdentification`}>
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
            {
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
                    get(activeSingleOffer, 'offer.amount', 0) > 0 && (
                      <>
                        <div className="dis-f a-c jc-fe jc-fs-lg">
                          <BrixelIcon
                            icon="check-small-fill"
                            color="green"
                            className="mr-1"
                            iconWidth="w-fix-16"
                          />
                          <span className="fsize-300 fsize-lg-400 txtGreen400">Sent</span>
                        </div>
                        {
                          get(activeSingleOffer, 'offer.createdAt', null) && (
                            <p className="fsize-300 txtDark200 mt-2">
                              {DateTime.fromMillis(activeSingleOffer.offer.createdAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                            </p>
                          )
                        }
                      </>
                    )
                  }
                  {
                    (!get(activeSingleOffer, 'offer.status', null) || (get(activeSingleOffer, 'offer.status', '') !== 'pending' && get(activeSingleOffer, 'offer.status', '') !== 'accepted')) && isBuyer && (
                      <BrixelButtonSecondary
                        rounded
                        className="mt-2"
                        label="Add offer"
                        onClick={() => onClickOffer('add')}
                      />
                    )
                  }
                </>
              )
            }
          </>
        );
      case 'stageIdentification':
        return (
          <>
            {
              get(activeSingleClosing, 'stageIdentification.active', null) === false ? (
                <>
                  <BrixelIcon
                    icon="locked"
                    color="dark"
                    className="mb-1"
                  />
                </>
              ) : (
                <div>
                  <div className="dis-f a-c jc-fe jc-fs-lg">
                    {
                      get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length > 0 && (
                        <BrixelIcon
                          icon={get(activeSingleClosing, 'stageIdentification.buyer.completedBy', null) ? status.accepted.icon : status.pending.icon}
                          color={get(activeSingleClosing, 'stageIdentification.buyer.completedBy', null) ? 'green' : 'dark'}
                          iconWidth="w-fix-16"
                        />
                      )
                    }
                    {
                      get(activeSingleClosing, 'stageIdentification.buyer.completedBy', null) && (
                        <span className="ml-1 txtGreen400 fsize-300 fsize-lg-400">Verified</span>
                      )
                    }
                    {
                      get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length > 0 && !get(activeSingleClosing, 'stageIdentification.buyer.completedBy', null) && (
                        <span className="ml-1 txtYellow400 fsize-300 fsize-lg-400">Pending</span>
                      )
                    }
                  </div>
                  {
                    get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length === 0 && isBuyer && (
                      <div className="dis-f a-c jc-fe jc-fs-lg">
                        <BrixelButtonSecondary
                          className="mt-2"
                          rounded
                          label="Add buyer"
                          onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/buyer/identification/`)}
                        />
                      </div>
                    )
                  }
                  {
                    !showTabSection && (
                      <>
                        {personsInfo('buyer', 'mt-2 mx-2 mx-lg-0')}
                      </>
                    )
                  }
                </div>
              )
            }
          </>
        );
      default:
        return (
          <>
            {
              get(activeSingleClosing, `${stage}.active`, null) ? (
                <>
                  <BrixelIcon
                    icon="check-small-fill"
                    color="green"
                    className="mb-1"
                    iconWidth="w-fix-16"
                  />
                  <span className="fsize-200 txtGreen400">Locked</span>
                  {
                    get(activeSingleClosing, `${stage}.completedBySeller.completedAt`, null) ? (
                      <span className="fsize-100 txtDark200">
                        {DateTime.fromMillis(activeSingleClosing[stage].completedBySeller.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                      </span>
                    ) : (
                      <span className="fsize-100 txtDark200">-</span>
                    )
                  }
                </>
              ) : (
                <div
                  className="pos-r"
                >
                  <BrixelIcon
                    icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                    color="dark"
                  />
                </div>
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
            {
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
                            <p className="fsize-300 txtDark200 mt-2">
                              {DateTime.fromMillis(activeSingleOffer.offer.reviewedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                            </p>
                          )
                        }
                        {
                          get(activeSingleOffer, 'offer.status', '') === 'pending' && !isBuyer && (
                            <BrixelButtonSecondary
                              rounded
                              className="ml-a ml-lg-0 mt-2"
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
            }
          </>
        );
      case 'stageIdentification':
        return (
          <>
            {
              get(activeSingleClosing, 'stageIdentification.active', null) === false ? (
                <>
                  <BrixelIcon
                    icon="locked"
                    color="dark"
                    className="mb-1"
                  />
                </>
              ) : (
                <div>
                  <div className="dis-f a-c jc-fe jc-fs-lg">
                    {
                      get(activeSingleClosing, 'stageIdentification.seller.persons', []).length > 0 && (
                        <BrixelIcon
                          icon={get(activeSingleClosing, 'stageIdentification.seller.completedBy', null) ? status.accepted.icon : status.pending.icon}
                          color={get(activeSingleClosing, 'stageIdentification.seller.completedBy', null) ? 'green' : 'dark'}
                        />
                      )
                    }

                    {
                      get(activeSingleClosing, 'stageIdentification.seller.completedBy', null) && (
                        <span className="ml-1 txtGreen400">Verified</span>
                      )
                    }
                    {
                      get(activeSingleClosing, 'stageIdentification.seller.persons', []).length > 0 && !get(activeSingleClosing, 'stageIdentification.seller.completedBy', null) && (
                        <span className="ml-1 txtYellow400">Pending</span>
                      )
                    }
                  </div>
                  {
                    get(activeSingleClosing, 'stageIdentification.seller.persons', []).length === 0 && !isBuyer && (
                      <div className="dis-f a-c jc-fe jc-fs-lg">
                        <BrixelButtonSecondary
                          className="mt-2"
                          rounded
                          label="Add seller"
                          onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/seller/identification/`)}
                        />
                      </div>
                    )
                  }
                  {
                    !showTabSection && (
                      <>
                        {personsInfo('seller', 'mt-2 mx-2 mx-lg-0')}
                      </>
                    )
                  }
                </div>
              )
            }
          </>
        );
      default:
        return (
          <>
            {
              get(activeSingleClosing, `${stage}.active`, null) ? (
                <>
                  <BrixelIcon
                    icon="check-small-fill"
                    color="green"
                    className="mb-1"
                    iconWidth="w-fix-16"
                  />
                  <span className="fsize-200 txtGreen400">Locked</span>
                  {
                    get(activeSingleClosing, `${stage}.completedBySeller.completedAt`, null) ? (
                      <span className="fsize-100 txtDark200">
                        {DateTime.fromMillis(activeSingleClosing[stage].completedBySeller.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                      </span>
                    ) : (
                      <span className="fsize-100 txtDark200">-</span>
                    )
                  }
                </>
              ) : (
                <div
                  className="pos-r"
                >
                  <BrixelIcon
                    icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                    color="dark"
                    iconWidth={get(activeSingleClosing, `${stage}.active`, null) ? 'w-fix-16' : ''}
                  />
                </div>
              )
            }
          </>
        );
    }
  };

  return (
    <>
      <div className={`brdRadius shadow-1dp w-perc-100 max-w-fix-1200 ${className} px-0 pt-0 px-lg-3 pt-lg-3 bgWhite closingTree`}>
        <div className="dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 txtDark700">

            <div className="hide header bgGreen100 brdRadius dis-f-lg jc-b a-c w-perc-100 px-3 py-2">
              <span className="w-perc-40">PROCESS</span>
              <span className="w-perc-30">BUYER</span>
              <span className="w-perc-30">SELLER</span>
            </div>

            <BrixelTabs
              className="hide-lg ov-h"
              classNameUl="ov-y-h"
              labels={['Buyer', 'Seller']}
              clicksList={['buyer', 'seller']}
              onClick={(val) => setShowTabSection(val)}
              activeTab={showTabSection}
              fullWidth
            />

            {
              closingStage.map((stage, i) => (
                <div
                  className={`offer-container dis-fl-row jc-b ${get(activeSingleClosing, `${stage.stageName}.active`, null) ? 'active' : 'locked'} ${closingStage.length > i + 1 ? 'brdSmallBottom brdAltGrey100' : ''} flex-wrap`}
                  key={i.toString()}
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
            }
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
  activeSingleProperty: PropTypes.object.isRequired,
  className: PropTypes.string,
  dealID: PropTypes.string.isRequired,
  isBuyer: PropTypes.bool,
  propID: PropTypes.string.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  userLang: PropTypes.string.isRequired,
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
  userLang: get(state, 'user.loggedInUser.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BrixelClosingTree);
