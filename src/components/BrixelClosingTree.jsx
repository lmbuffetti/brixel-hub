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

  return (
    <>
      <div className="header dis-fl-row jc-b a-c mb-2 w-perc-100 max-w-fix-1056 px-1">
        {
          isBuyer ? (
            <>
              <span className="tt-up fsize-200">You</span>
              <span className="tt-up fsize-200">Seller</span>
            </>
          ) : (
            <>
              <span className="tt-up fsize-200">Buyer</span>
              <span className="tt-up fsize-200">You</span>
            </>
          )
        }
      </div>
      <div className={`closing-tree brdRadius shadow-1dp dis-fl-col w-perc-100 max-w-fix-1056 ${className}`}>
        <div className="body dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 px-sm-5 px-1 txtDark700">
            <div className={`offer-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageOffer.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                {
                  get(activeSingleOffer, 'offer.amount', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1 as-b"
                      />
                      <span className="fsize-200 txtGreen400">Sent</span>
                      {
                        get(activeSingleOffer, 'createdAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleOffer.createdAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageOffer.active', null) ? '' : setShowTooltip({ type: 'offer', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageOffer.active', null) ? '' : setShowTooltip({ type: 'offer', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageOffer.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        setShowTooltip.type === 'offer' && setShowTooltip.active === true && (
                          <span
                            className="tooltip-label fsize-200"
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
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                {
                  !isBuyer ? (
                    <h5
                      onClick={() => onClickOffer('review')}
                      className="mb-1 cur-poi"
                    >
                      Offer
                    </h5>
                  ) : (
                    <h5 className="mb-1">Offer</h5>
                  )
                }
                {
                  !get(activeSingleOffer, 'offer.amount', null) && isBuyer ? (
                    <span className="fsize-200 mb-3">Add your first offer to start.</span>
                  ) : (
                    <span className="ff-mono mb-3">{get(activeSingleOffer, 'offer.currency', 0)} {Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', 0))}</span>
                  )
                }
                {
                  isBuyer ? (
                    <>
                      {
                        (((!get(activeSingleOffer, 'offer.amount', null) || get(activeSingleOffer, 'offer.status', null) === 'rejected')) && activeSingleDeal.id && get(activeSingleOffer, 'offer.status', null) !== 'pending') && (
                          <BrixelButtonPrimary
                            theme="primary"
                            rounded
                            label="Add offer"
                            onClick={() => onClickOffer('add')}
                          />
                        )
                      }
                    </>
                  ) : (
                    <>
                      {
                        activeSingleOffer.status === 'pending' ? (
                          <BrixelButtonPrimary
                            theme="primary"
                            rounded
                            label="Review"
                            onClick={() => onClickOffer('review')}
                          />
                        ) : (
                          <BrixelButtonSecondary
                            theme="primary"
                            rounded
                            label="Open"
                            onClick={() => onClickOffer('review')}
                          />
                        )
                      }
                    </>
                  )
                }
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                {
                  !get(activeSingleOffer, 'offer.status', null) && (
                    <BrixelIcon
                      icon="check-small"
                      color="dark"
                    />
                  )
                }
                {
                  get(activeSingleOffer, 'offer.status', null) === 'pending' && (
                    <>
                      <BrixelIcon
                        icon="check-small"
                        color="dark"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtYellow400">Pending</span>
                    </>
                  )
                }
                {
                  get(activeSingleOffer, 'offer.status', null) === 'accepted' && (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Accepted</span>
                      {
                        get(activeSingleOffer, 'updatedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleOffer.updatedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  )
                }
                {
                  get(activeSingleOffer, 'offer.status', null) === 'rejected' && (
                    <>
                      <BrixelIcon
                        icon="close-circle"
                        color="red"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtRed400">Rejected</span>
                      {
                        get(activeSingleOffer, 'updatedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleOffer.updatedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  )
                }
              </div>
            </div>
            <div className={`identification-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageIdentification.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                {
                  get(activeSingleClosing, 'stageIdentification.completedByBuyer.status', null) && get(activeSingleClosing, 'stageIdentification.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Verified</span>
                      {
                        get(activeSingleClosing, 'stageIdentification.completedByBuyer.completedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageIdentification.completedByBuyer.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageIdentification.active', null) ? '' : setShowTooltip({ type: 'identification', side: 'left', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageIdentification.active', null) ? '' : setShowTooltip({ type: 'identification', side: 'left', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'identification' && showTooltip.side === 'left' && showTooltip.active === true && (
                          <span
                            className="tooltip-label fsize-200"
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
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Identification</h5>
                <span className="fsize-200 ta-c">Submit ID and personal information.</span>
                {
                  get(activeSingleClosing, 'stageIdentification.active', null) && (
                    <BrixelButtonSecondary
                      className="mt-2"
                      rounded
                      onClick={() => history.push(`/packageFlow/${propID}/${dealID}/closing/identification`)}
                      label="Edit"
                    />
                  )
                }
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                {
                  get(activeSingleClosing, 'stageIdentification.completedBySeller.status', null) && get(activeSingleClosing, 'stageIdentification.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Verified</span>
                      {
                        get(activeSingleClosing, 'stageIdentification.completedBySeller.completedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageIdentification.completedBySeller.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageIdentification.active', null) ? '' : setShowTooltip({ type: 'identification', side: 'right', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageIdentification.active', null) ? '' : setShowTooltip({ type: 'identification', side: 'right', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'identification' && showTooltip.side === 'right' && showTooltip.active === true && (
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
              </div>
            </div>
            <div className={`lock-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageLock.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                {
                  get(activeSingleClosing, 'stageLock.completedByBuyer.status', null) && get(activeSingleClosing, 'stageLock.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Locked</span>
                      {
                        get(activeSingleClosing, 'stageLock.completedByBuyer.completedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageLock.completedByBuyer.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageLock.active', null) ? '' : setShowTooltip({ type: 'lock', side: 'left', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageLock.active', null) ? '' : setShowTooltip({ type: 'lock', side: 'left', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageLock.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'lock' && showTooltip.side === 'left' && showTooltip.active === true && (
                          <span
                            className="tooltip-label fsize-200"
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
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Lock</h5>
                <span className="fsize-200 ta-c">Reserve the property for closing.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                {
                  get(activeSingleClosing, 'stageLock.completedBySeller.status', null) && get(activeSingleClosing, 'stageLock.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Locked</span>
                      {
                        get(activeSingleClosing, 'stageLock.completedBySeller.completedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageLock.completedBySeller.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageLock.active', null) ? '' : setShowTooltip({ type: 'lock', side: 'right', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageLock.active', null) ? '' : setShowTooltip({ type: 'lock', side: 'right', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageLock.active', null) ? 'check-small' : 'locked'}
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
              </div>
            </div>
            <div className={`contract-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageContract.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                {
                  get(activeSingleClosing, 'stageContract.completedByBuyer.status', null) && get(activeSingleClosing, 'stageContract.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Approved</span>
                      {
                        get(activeSingleClosing, 'stageContract.completedByBuyer.completedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageContract.completedByBuyer.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageContract.active', null) ? '' : setShowTooltip({ type: 'contract', side: 'left', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageContract.active', null) ? '' : setShowTooltip({ type: 'contract', side: 'left', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageContract.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'contract' && showTooltip.side === 'left' && showTooltip.active === true && (
                          <span
                            className="tooltip-label fsize-200"
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
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Contract</h5>
                <span className="fsize-200 ta-c">Approve the terms of the contract.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                {
                  get(activeSingleClosing, 'stageContract.completedBySeller.status', null) && get(activeSingleClosing, 'stageLock.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Approved</span>
                      {
                        get(activeSingleClosing, 'stageContract.completedBySeller.completedAt', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageContract.completedBySeller.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageContract.active', null) ? '' : setShowTooltip({ type: 'contract', side: 'right', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageContract.active', null) ? '' : setShowTooltip({ type: 'contract', side: 'right', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageContract.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'contract' && showTooltip.side === 'right' && showTooltip.active === true && (
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
              </div>
            </div>
            <div className={`notary-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageNotary.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                {
                  get(activeSingleClosing, 'stageNotary.completedByBuyer.status', null) && get(activeSingleClosing, 'stageLock.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Signed</span>
                      {
                        get(activeSingleClosing, 'stageNotary.completedByBuyer', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageNotary.completedByBuyer.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageNotary.active', null) ? '' : setShowTooltip({ type: 'notary', side: 'left', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageNotary.active', null) ? '' : setShowTooltip({ type: 'notary', side: 'left', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageNotary.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'notary' && showTooltip.side === 'left' && showTooltip.active === true && (
                          <span
                            className="tooltip-label fsize-200"
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
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Notary</h5>
                <span className="fsize-200 ta-c">Sign the contract at the notary.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                {
                  get(activeSingleClosing, 'stageNotary.completedBySeller.status', null) && get(activeSingleClosing, 'stageLock.active', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                      />
                      <span className="fsize-200 txtGreen400">Signed</span>
                      {
                        get(activeSingleClosing, 'stageNotary.completedBySeller', null) ? (
                          <span className="fsize-100 txtDark200">
                            {DateTime.fromMillis(activeSingleClosing.stageNotary.completedBySeller.completedAt, { locale: userLang }).toFormat('d LLL yy, H:mm')}
                          </span>
                        ) : (
                          <span className="fsize-100 txtDark200">-</span>
                        )
                      }
                    </>
                  ) : (
                    <div
                      className="pos-r"
                      onMouseEnter={() => (get(activeSingleClosing, 'stageNotary.active', null) ? '' : setShowTooltip({ type: 'notary', side: 'right', active: true }))}
                      onMouseLeave={() => (get(activeSingleClosing, 'stageNotary.active', null) ? '' : setShowTooltip({ type: 'notary', side: 'right', active: false }))}
                    >
                      <BrixelIcon
                        icon={get(activeSingleClosing, 'stageNotary.active', null) ? 'check-small' : 'locked'}
                        color="dark"
                      />
                      {
                        showTooltip.type === 'notary' && showTooltip.side === 'right' && showTooltip.active === true && (
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
              </div>
            </div>
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
