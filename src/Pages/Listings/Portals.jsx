/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelIcon,
} from '@brixel/brixel-components';
import { updatePortalsReview } from '../../actions/PropertyActions';
import page_review from '../../images/Listings/page_review.svg';
import portalsImg from '../../images/Listings/portals.svg';
import BrixelUpgradeMessage from '../../components/BrixelUpgradeMessage';

const Portals = (props) => {
  // PROPS
  const {
    formValue,
    handleUpdatePortalsReview,
    history,
    isSmallLoading,
    match,
    portals,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  const checkPortalsOnline = () => {
    let isOnline = false;
    Object.keys(portals).map((key) => {
      if (portals[key]) isOnline = true;
      return null;
    });
    return isOnline;
  };

  const changeReviewStatus = (status) => {
    const data = {
      page: propID,
      smallLoader: true,
      status: status,
    };
    handleUpdatePortalsReview(data);
  };

  return (
    <div className="dis-f">
      <div className="secondLevel dis-fl-col ml-md-1">
        <div className="portalsWrapper max-h-perc-100 dis-fl-col cardInfoBox">
          <div className="pos-r">
            <div className="dis-f jc-b a-c mb-3">
              <BrixelButtonIcon
                className="shadow-3dp hide-md"
                icon="arrow-simple-left"
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => history.push(`/${propID}/listings`)}
              />
              <h5>Portals</h5>
              <span />
            </div>
          </div>
          <div className="max-h-perc-100 pb-4 ov-a">
            {
              formValue.portalsReview ? (
                <>
                  <div className="ta-c mt-3">
                    <img src={page_review} alt="Page Under review" />
                    <h5 className="txtPrimary600 mb-1 mt-3">Your property gets published…</h5>

                    <p className="mb-1">Portals can take up to 8 hours until your property is online.</p>
                    <hr className="my-3" />

                    <p className="txtDark200">Any questions?</p>
                    <p className="txtDark200"><span>Call us</span>:&nbsp;<a className="txtDark200" href="tel:+41 43 333 57 00">+41 43 333 57 00</a></p>
                    <p className="txtDark200"><span>Write us</span>:&nbsp;<a className="txtDark200" href="mailto:support@brixel.ch">support@brixel.ch</a></p>

                  </div>
                </>
              ) : (
                <>
                  <div className="ta-c mt-3">
                    <img src={portalsImg} alt="Portals" />
                    {
                      checkPortalsOnline() ? (
                        <div className="ta-c mt-3">
                          <h5 className="mb-1">Your property is published</h5>

                          <div className="portalsList mt-3">
                            {
                              Object.keys(portals).map((key, i) => (
                                <React.Fragment key={i.toString()}>
                                  {
                                    portals[key] && !key.toLocaleLowerCase().includes('url') && (
                                      <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={portals[`${key}Url`]}
                                      >
                                        <BrixelIcon
                                          className="mr-1"
                                          icon="copy-link"
                                          color="primary"
                                        />
                                        <span>{key}</span>
                                      </a>
                                    )
                                  }
                                </React.Fragment>
                              ))
                            }
                          </div>

                          <hr className="my-3" />

                          <p className="txtDark200">You want to remove your property form all portals?</p>

                          <BrixelButtonPrimary
                            className="m-a mt-3 w-fix-176"
                            label="Unpublish now"
                            background="dark"
                            rounded
                            onClick={() => changeReviewStatus('offline')}
                            isLoading={isSmallLoading}
                          />
                        </div>
                      ) : (
                        <div className="ta-c mt-3">
                          <h5 className="mb-3">Your property on the biggest portals.</h5>

                          <div className="ta-l max-w-fix-344 m-a">
                            <p className="mb-1">
                              <BrixelIcon icon="check" color="green" />
                              <span className="ml-1">Publish all your listings with one click</span>
                            </p>

                            <p className="mb-1">
                              <BrixelIcon icon="check" color="green" />
                              <span className="ml-1">Weekly republishing for best visibility</span>
                            </p>

                            <p className="dis-f a-t">
                              <BrixelIcon icon="check" color="green" />
                              <span className="ml-1">Homegate, Immoscout24, Comparis and many more...</span>
                            </p>
                          </div>

                        </div>
                      )
                    }
                  </div>
                </>
              )
            }
          </div>
        </div>

        {
          !checkPortalsOnline() && !formValue.portalsReview && (
            <BrixelUpgradeMessage
              className="mt-3"
              title="Save 15% compared to listings price."
              description="Only CHF 750 for 3 months. Don't worry. You will not be charged for now. Get the result first. Pay later."
              titleConfirm="Please confirm your order."
              descriptionConfirm="<b>Publish on portals.</b><span>Only CHF 750 for 3 months. You will not be charged for now.</span>"
              onClick={() => changeReviewStatus('online')}
              isSmallLoading={isSmallLoading}
              unlockFunction
            />
          )
        }

      </div>
    </div>
  );
};

Portals.propTypes = {
  history: PropTypes.object.isRequired,
  handleUpdatePortalsReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.bool.isRequired,
  formValue: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  portals: PropTypes.object.isRequired,
};

Portals.defaultProps = {
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'form.Property.values', {});
  return ({
    formValue: get(state, 'form.Property.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
    portals: get(formValue, 'portals', {}),
  });
}

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleUpdatePortalsReview: bindActionCreators(updatePortalsReview, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Portals);
