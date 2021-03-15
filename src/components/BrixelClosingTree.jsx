import React, {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  connect,
} from 'react-redux';
import {
  BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon,
} from '@brixel/brixel-components';
import ReviewOffer from '../Pages/Offers/ReviewOffer';
import AddNewOffer from '../Pages/Offers/AddNewOffer';
import { setSplashType } from '../actions/CommonActions';

const BrixelClosingTree = (props) => {
  const {
    activeSingleOffer,
    className,
    adminMode,
    isBuyer,
    offer,
    setSplashScreen,
  } = props;

  // TODO: add active/inactive lock logic
  const onClickOffer = (action) => {
    if (action === 'add') {
      setSplashScreen({
        component: AddNewOffer,
      });
    } else {
      setSplashScreen({
        component: ReviewOffer,
      });
    }
  };

  return (
    <>
      <div className={`closing-tree brdRadius shadow-1dp dis-fl-col w-perc-100 max-w-fix-1056 ${className}`}>
        <div className="body dis-fl-row">
          <div className="phases dis-fl-col h-perc-100 w-perc-100 p-3">
            <div className="offer-container pb-3 dis-fl-row a-c jc-b">
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon="check-small-fill"
                  color="green"
                  onClick={() => ''}
                />
                <span className="txtGreen400">Sent</span>
                <span className="fsize-100">date</span>
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5 className="mb-1">Offer</h5>
                <span className="fsize-200 mb-3">CHF 1000001</span>
                {
                  isBuyer ? (
                    <>
                      {
                        activeSingleOffer.status ? (
                          <BrixelButtonPrimary
                            theme="primary"
                            rounded
                            label="Add offer"
                            onClick={() => onClickOffer('add')}
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
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
                <span>{activeSingleOffer.status}</span>
              </div>
            </div>
            <div className="identification-container py-3 dis-fl-row a-c jc-b">
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5>Identification</h5>
                <span className="fsize-200">Submit ID and personal information.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
            </div>
            <div className="lock-container py-3 dis-fl-row a-c jc-b">
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5>Lock</h5>
                <span className="fsize-200">Reserve the property for closing.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
            </div>
            <div className="contract-container py-3 dis-fl-row a-c jc-b">
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5>Contract</h5>
                <span className="fsize-200">Approve the terms of the contract.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
            </div>
            <div className="notary-container py-3 dis-fl-row a-c jc-b">
              <div className="as-b w-fix-120 dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
                />
              </div>
              <div className="action w-fix-256 dis-fl-col a-c jc-c">
                <h5>Notary</h5>
                <span className="fsize-200">Sign the contract at the notary.</span>
              </div>
              <div className="as-b w-fix-120 a-b dis-fl-col">
                <BrixelIcon
                  icon="check-small"
                  color="dark"
                  onClick={() => ''}
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
  activeSingleOffer: PropTypes.object.isRequired,
  adminMode: PropTypes.bool,
  className: PropTypes.string,
  isBuyer: PropTypes.bool,
  offer: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
};

BrixelClosingTree.defaultProps = {
  adminMode: false,
  className: '',
  isBuyer: false,
};

const mapStateToProps = (state) => ({
  activeSingleOffer: get(state, 'deal.activeSingleOffer', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(BrixelClosingTree);
