import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  connect,
} from 'react-redux';
import moment from 'moment';
import {
  BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, Helpers,
} from '@brixel/brixel-components';
import ReviewOffer from '../Pages/Offers/ReviewOffer';
import AddNewOffer from '../Pages/Offers/AddNewOffer';
import { setSplashType } from '../actions/CommonActions';
import ClosingTree from './Skeleton/ClosingTree';

const BrixelClosingTree = (props) => {
  const sectionNumber = new Array(5).fill('');

  const {
    activeSingleClosing,
    activeSingleDeal,
    activeSingleOffer,
    className,
    isBuyer,
    setSplashScreen,
  } = props;

  // TODO: add active/inactive lock logic
  const onClickOffer = useCallback((action) => {
    if (action === 'add') {
      setSplashScreen({
        component: AddNewOffer,
      });
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
        <span className="tt-up fsize-200">Buyer</span>
        <span className="tt-up fsize-200">Seller</span>
      </div>
      <div className={`closing-tree brdRadius shadow-1dp dis-fl-col w-perc-100 max-w-fix-1056 ${className}`}>
        <div className="body dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 px-sm-5 px-1 txtDark700">
            <div className={`offer-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageOffer.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                {
                  get(activeSingleOffer, 'createdAt', null) ? (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                        className="mb-1"
                        onClick={() => ''}
                      />
                      <span className="fsize-200 txtGreen400">Sent</span>
                      <span className="fsize-100 txtDark200">{moment(get(activeSingleOffer, 'createdAt', null)).format('D MMM YY, H:mm')}</span>
                    </>
                  ) : (
                    <BrixelIcon
                      icon={get(activeSingleClosing, 'stageOffer.active', null) ? 'check-small' : 'locked'}
                      color="dark"
                      onClick={() => ''}
                    />
                  )
                }
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Offer</h5>
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
                        (!get(activeSingleOffer, 'offer.amount', null) || get(activeSingleOffer, 'offer.status', null) === 'rejected') && activeSingleDeal.id && (
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
                      onClick={() => ''}
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
                      <span className="fSizePx14 txtYellow400">Pending</span>
                    </>
                  )
                }
                {
                  get(activeSingleOffer, 'offer.status', null) === 'accepted' && (
                    <>
                      <BrixelIcon
                        icon="check-small-fill"
                        color="green"
                      />
                      <span className="fSizePx14 txtGreen400">Accepted</span>
                      <span className="fsize-100">{moment(get(activeSingleOffer, 'updatedAt', null)).format('D MMM YY, H:mm')}</span>
                    </>
                  )
                }
                {
                  get(activeSingleOffer, 'offer.status', null) === 'rejected' && (
                    <>
                      <BrixelIcon
                        icon="close-circle"
                        color="red"
                      />
                      <span className="fSizePx14 txtRed400">Rejected</span>
                      <span className="fsize-100">{moment(get(activeSingleOffer, 'updatedAt', null)).format('D MMM YY, H:mm')}</span>
                    </>
                  )
                }
              </div>
            </div>
            <div className={`identification-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageIdentification.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Identification</h5>
                <span className="fsize-200 ta-c">Submit ID and personal information.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
            </div>
            <div className={`lock-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageLock.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageLock.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Lock</h5>
                <span className="fsize-200 ta-c">Reserve the property for closing.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
            </div>
            <div className={`contract-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageContract.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageContract.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Contract</h5>
                <span className="fsize-200 ta-c">Approve the terms of the contract.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
            </div>
            <div className={`notary-container py-3 dis-fl-row a-c jc-b ${get(activeSingleClosing, 'stageNotary.active', null) ? 'active' : 'locked'}`}>
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageNotary.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Notary</h5>
                <span className="fsize-200 ta-c">Sign the contract at the notary.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon={get(activeSingleClosing, 'stageIdentification.active', null) ? 'check-small' : 'locked'}
                  color="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

BrixelClosingTree.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleOffer: PropTypes.object.isRequired,
  activeSingleClosing: PropTypes.object.isRequired,
  className: PropTypes.string,
  isBuyer: PropTypes.bool,
  setSplashScreen: PropTypes.func.isRequired,
};

BrixelClosingTree.defaultProps = {
  className: '',
  isBuyer: false,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
  activeSingleClosing: get(state, 'deal.activeSingleDeal.closing', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(BrixelClosingTree);
