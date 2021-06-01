/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelIcon, Helpers,
  change, reset, BrixelButtonText,
} from '@brixel/brixel-components';
import has from 'lodash/has';
import { updatePortalsReview } from '../../actions/PropertyActions';
import portalStart from '../../images/Listings/portals_start.svg';
import portalReview from '../../images/Listings/portals_review.svg';
import portalPublished from '../../images/Listings/portals_published.svg';
import BrixelUpgradeMessage from '../../components/BrixelUpgradeMessage';
import { addGameHistory } from '../../actions/GamificationActions';

const Portals = (props) => {
  // PROPS
  const {
    company,
    customPortals,
    formValue,
    handleUpdatePortalsReview,
    history,
    isSmallLoading,
    match,
    portals,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

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

  // CHANGE PORTALS REVIEW
  const changeReviewStatus = (status) => {
    const data = {
      page: propID,
      smallLoader: 'portalsReview',
      status,
    };
    handleUpdatePortalsReview(data);
    // if (status === 'online') handleAddGameHistory({stub: 'portals'});
  };

  // MESSAGE TO UNLOCK
  const messageToUnlock = (key) => {
    let message = {
      title: 'Get 7 days of listings for free.',
      description: 'We offer you a free trial of 7 days for our Premium package, including listings on the biggest portals. During this time we will publish your listing on Homegate, Immoscout24 and Newhome. After this period you can upgrade to continue being present on the biggest portals.',
      btnLabel: 'Start free trial',
    };
    if (get(formValue, 'location.countryCode', null) === 'PT') {
      message = {
        title: 'Get 7 days of listings for free.',
        description: 'We offer you a free trial of 7 days for our Premium package, including listings on the biggest portals. During this time we will publish your listing on Idealista and Imovirtual. After this period you can upgrade to continue being present on the biggest portals.',
        btnLabel: 'Start free trial',
      };
    }
    return message[key];
  };

  const openTrialRequestFlow = () => {
    localStorage.setItem('backUrl', history.location.pathname);
    history.push(`/${propID}/trialRequest`);
  };

  return (
    <div className="dis-f">
      <div className="secondLevel dis-fl-col">
        <div>
          <div className="portalsWrapper dis-fl-col cardInfoBox">
            <div className="pos-r">
              <div className="dis-fl-col pageTitle">
                <div className="fixedIcon w-perc-100">
                  <BrixelButtonIcon
                    className="hide-md"
                    icon="arrow-left-small"
                    theme="dark"
                    ghost
                    onClick={() => history.push(`/${propID}/listings`)}
                  />
                </div>
                <h5 className="sectionTitle">Portals</h5>
              </div>
            </div>
            <div className="max-h-perc-100 pb-4 ov-a">
              {
                formValue.portalsReview ? (
                  <>
                    <div className="ta-c mt-2">
                      <img className="h-fix-120" src={portalReview} alt="Page Under review" />
                      {
                        formValue.portalsReview === 'offline' ? (
                          <>
                            <h5 className="txtPrimary600 mb-2 mt-3">Your property gets unpublished…</h5>

                            <p className="mb-1">Portals can take up to 8 hours until your property is offline.</p>
                          </>
                        ) : (
                          <>
                            <h5 className="txtPrimary600 mb-2 mt-3">Your property gets published…</h5>

                            <p className="mb-1">Portals can take up to 8 hours until your property is online.</p>
                            <p className="mb-1">We will let you know as soon as your listings are online.</p>
                          </>
                        )
                      }
                      <hr className="my-3" />

                      <p className="txtDark200">Any questions?</p>
                      {
                        has(company, 'contact.phone') && (
                          <p className="txtDark200">
                            <span>Call us</span>
                            <span>:&nbsp;</span>
                            <a
                              className="txtDark200"
                              href={`tel:${company.contact.phone}`}
                            >
                              {Helpers.telephoneFormat(company.contact.phone)}
                            </a>
                          </p>
                        )
                      }
                      {
                        has(company, 'contact.phone') && (
                          <p className="txtDark200">
                            <span>Write us</span>
                            <span>:&nbsp;</span>
                            <a
                              className="txtDark200"
                              href={`mailto:${company.contact.email}`}
                            >
                              {company.contact.email}
                            </a>
                          </p>
                        )
                      }

                    </div>
                  </>
                ) : (
                  <>
                    <div className="ta-c">
                      {
                        checkPortalsOnline() ? (
                          <div className="ta-c mt-2">
                            <img className="h-fix-120" src={portalPublished} alt="Portals" />
                            <h5 className="mb-2 mt-3">Your property is published</h5>

                            <div className="portalsList mt-3">
                              {
                                Object.keys(portals).map((key, i) => (
                                  <React.Fragment key={i.toString()}>
                                    {
                                      portals[key] && get(customPortals, `${key}`, true) && !key.toLocaleLowerCase().includes('url') && (
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
                              {
                                Object.keys(customPortals).map((key, i) => (
                                  <React.Fragment key={i.toString()}>
                                    {
                                      customPortals[key] && !key.toLocaleLowerCase().includes('url') && (
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href={customPortals[`${key}Url`]}
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
                              className="m-a mt-3"
                              label="Unpublish now"
                              theme="dark"
                              rounded
                              onClick={() => changeReviewStatus('offline')}
                              isLoading={isSmallLoading.portalsReview}
                            />
                          </div>
                        ) : (
                          <div className="ta-c mt-2">
                            <img className="h-fix-120" src={portalStart} alt="Portals" />
                            <h5 className="mb-2 mt-3">Your property on the biggest portals.</h5>

                            <div className="ta-l max-w-fix-344 m-a">
                              <div className="mb-1 pos-r dis-f">
                                <BrixelIcon className="pos-a" icon="check" color="green" />
                                <p className="ml-4 dis-b">Publish all your listings with one click</p>
                              </div>

                              <div className="mb-1 pos-r dis-f">
                                <BrixelIcon className="pos-a" icon="check" color="green" />
                                <p className="ml-4">Manage all your listings in one place</p>
                              </div>

                              <div className="mb-1 pos-r dis-f">
                                <BrixelIcon className="pos-a" icon="check" color="green" />
                                <p className="ml-4">Use the free trial to test out your listings.</p>
                              </div>
                              <BrixelButtonText
                                className="mt-4 dis-b m-a"
                                label={`Publish your listings for ${get(company, 'country.currency')} ${get(company, 'meta.portals.price')}`}
                                onClick={() => changeReviewStatus('online')}
                              />
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
        </div>

        {
          !checkPortalsOnline() && !formValue.portalsReview && (
            <BrixelUpgradeMessage
              className="mt-3"
              title={messageToUnlock('title')}
              description={messageToUnlock('description')}
              btnLabel={messageToUnlock('btnLabel')}
              onClick={() => openTrialRequestFlow()}
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
  company: PropTypes.object.isRequired,
  customPortals: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleUpdatePortalsReview: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  portals: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'brixelForm.Property.values', {});
  return ({
    company: get(state, 'companies.activeSingleCompany', {}),
    customPortals: get(formValue, 'customPortals', {}),
    formValue: get(state, 'brixelForm.Property.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    portals: get(formValue, 'portals', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form, data) {
    (dispatch(reset(form, data)));
  },
  handleUpdatePortalsReview: bindActionCreators(updatePortalsReview, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Portals);
