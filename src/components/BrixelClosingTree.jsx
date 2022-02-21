import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  connect,
} from 'react-redux';
import { DateTime } from 'luxon';
import {
  BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, Helpers,
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
  } = props;
  // STATE
  const [showTooltip, setShowTooltip] = useState({ type: '', side: '', active: false });

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
        `<span>${get(activeSingleOffer, 'offer.currency', 0)}</span><span>${Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 0))}</span>` :
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
                    get(activeSingleOffer, 'offer.amount', 0) > 0 ? (
                      <>
                        <div className="dis-f a-c">
                          <BrixelIcon
                            icon="check-small-fill"
                            color="green"
                            className="mr-1"
                          />
                          <span className="txtGreen400">Sent</span>
                        </div>
                        {
                          get(activeSingleOffer, 'createdAt', null) ? (
                            <p className="fsize-300 txtDark200">
                              {DateTime.fromMillis(activeSingleOffer.createdAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                            </p>
                          ) : (
                            <span className="fsize-100 txtDark200">-</span>
                          )
                        }
                      </>
                    ) : (
                      <>
                        <BrixelIcon
                          icon="check-small"
                          color="dark"
                        />
                        {
                          isBuyer && (
                            <BrixelButtonPrimary
                              label="Add new"
                              onClick={() => onClickOffer('add')}
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
                <div
                  className="pos-r"
                >
                  <BrixelIcon
                    icon="check-small"
                    color={get(activeSingleClosing, 'stageIdentification.buyer.completedBy', null) ? 'green' : 'dark'}
                  />
                  {
                    get(activeSingleClosing, 'stageIdentification.buyer.completedBy', null) && (
                      <span className="fsize-200 txtGreen400">Verified</span>
                    )
                  }
                  {
                    get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length > 0 ? (
                      <div className="dis-f a-c bgBlue100 txtGreen400 brdRadius w-perc-100 jc-b py-1 px-2">
                        <div className="dis-f a-c">
                          <BrixelIcon
                            className="mr-1"
                            rounded
                            background="white"
                            saturation={0}
                            color="green"
                            icon="account"
                          />
                          <span>
                            {get(activeSingleClosing, 'stageIdentification.buyer.persons[0].fullName', '')}
                          </span>
                        </div>
                        {
                          get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length > 1 && (
                            <span>
                              +{get(activeSingleClosing, 'stageIdentification.buyer.persons', []).length - 1}
                            </span>
                          )
                        }
                        <BrixelIcon
                          color="green"
                          icon="pencil"
                          onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/buyer/identification/`)}
                        />
                      </div>
                    ) : (
                      <BrixelButtonSecondary
                        label="Edit"
                        onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/seller/identification/`)}
                      />
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
                  onMouseEnter={() => (get(activeSingleClosing, `${stage}.active`, null) ? '' : setShowTooltip({ type: 'lock', side: 'right', active: true }))}
                  onMouseLeave={() => (get(activeSingleClosing, `${stage}.active`, null) ? '' : setShowTooltip({ type: 'lock', side: 'right', active: false }))}
                >
                  <BrixelIcon
                    icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                    color="dark"
                  />
                  {
                    showTooltip.type === 'lock' && showTooltip.side === 'right' && showTooltip.active === true && (
                      <span
                        className="tooltip-label right fsize-200"
                        style={{
                          minWidth: '200px',
                        }}
                      >
                        This stage is locked. The prior stage must be fulfilled to unlock it.
                      </span>
                    )
                  }
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
              get(activeSingleClosing, 'stageIdentification.active', null) === false ? (
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
                      <BrixelIcon
                        icon="check-small"
                        color="dark"
                      />
                    ) : (
                      <>
                        <div className="dis-f a-c">
                          <BrixelIcon
                            icon={status[get(activeSingleOffer, 'offer.status', '')].icon}
                            color={status[get(activeSingleOffer, 'offer.status', '')].color}
                            className="mr-1"
                          />
                          <span className={status[get(activeSingleOffer, 'offer.status', '')].colorText}>
                            {status[get(activeSingleOffer, 'offer.status', '')].label}
                          </span>
                        </div>
                        {
                          get(activeSingleOffer, 'updatedAt', null) ? (
                            <p className="fsize-300 txtDark200">
                              {DateTime.fromMillis(activeSingleOffer.updatedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                            </p>
                          ) : (
                            <span className="fsize-100 txtDark200">-</span>
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
                <div
                  className="pos-r"
                >
                  <BrixelIcon
                    icon="check-small"
                    color={get(activeSingleClosing, 'stageIdentification.seller.completedBy', null) ? 'green' : 'dark'}
                  />
                  {
                    get(activeSingleClosing, 'stageIdentification.seller.completedBy', null) && (
                      <span className="fsize-200 txtGreen400">Verified</span>
                    )
                  }
                  {
                    get(activeSingleClosing, 'stageIdentification.seller.persons', []).length > 0 ? (
                      <div className="dis-f a-c bgBlue100 txtGreen400 brdRadius w-perc-100 jc-b py-1 px-2">
                        <div className="dis-f a-c">
                          <BrixelIcon
                            className="mr-1"
                            rounded
                            background="white"
                            saturation={0}
                            color="green"
                            icon="account"
                          />
                          <span>
                            {get(activeSingleClosing, 'stageIdentification.seller.persons[0].fullName', '')}
                          </span>
                        </div>
                        {
                          get(activeSingleClosing, 'stageIdentification.seller.persons', []).length > 1 && (
                            <span>
                              +{get(activeSingleClosing, 'stageIdentification.seller.persons', []).length - 1}
                            </span>
                          )
                        }
                        <BrixelIcon
                          color="green"
                          icon="pencil"
                          onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/seller/identification/`)}
                        />
                      </div>
                    ) : (
                      <BrixelButtonSecondary
                        label="Edit"
                        onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/seller/identification/`)}
                      />
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
                  onMouseEnter={() => (get(activeSingleClosing, `${stage}.active`, null) ? '' : setShowTooltip({ type: 'lock', side: 'right', active: true }))}
                  onMouseLeave={() => (get(activeSingleClosing, `${stage}.active`, null) ? '' : setShowTooltip({ type: 'lock', side: 'right', active: false }))}
                >
                  <BrixelIcon
                    icon={get(activeSingleClosing, `${stage}.active`, null) ? 'check-small' : 'locked'}
                    color="dark"
                  />
                  {
                    showTooltip.type === 'lock' && showTooltip.side === 'right' && showTooltip.active === true && (
                      <span
                        className="tooltip-label right fsize-200"
                        style={{
                          minWidth: '200px',
                        }}
                      >
                        This stage is locked. The prior stage must be fulfilled to unlock it.
                      </span>
                    )
                  }
                </div>
              )
            }
          </>
        );
    }
  };

  return (
    <>
      <div className={`brdRadius shadow-1dp w-perc-100 max-w-fix-1056 ${className} px-3 pt-3`}>
        <div className="dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 txtDark700">

            <div className="header bgGreen100 brdRadius dis-f jc-b a-c w-perc-100 px-3 py-2 mb-1">
              <span className="w-perc-40">PROCESS</span>
              <span className="w-perc-30">BUYER</span>
              <span className="w-perc-30">SELLER</span>
            </div>

            {
              closingStage.map((stage, i) => (
                <div
                  className={`offer-container dis-fl-row jc-b ${get(activeSingleClosing, `${stage.stageName}.active`, null) ? 'active' : 'locked'} ${closingStage.length > i + 1 ? 'brdSmallBottom brdAltGrey100' : ''}`}
                  key={i.toString()}
                >
                  <div className="w-perc-40 py-4 px-2">
                    <h5 className="mb-1">{stage.title}</h5>
                    <div dangerouslySetInnerHTML={{ __html: stage.subtitle }} />
                  </div>

                  <div className="w-perc-30 bgAltGrey100 py-4 px-2">
                    {buyerSection(stage.stageName)}
                  </div>

                  <div className="w-perc-30 py-4 px-2">
                    {sellerSection(stage.stageName)}
                  </div>

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
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BrixelClosingTree);
