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
  BrixelIcon, Helpers,
} from '@brixel/brixel-components';
import { updatePortalsReview } from '../../actions/PropertyActions';
import portalStart from '../../images/Listings/portals_start.svg';
import portalReview from '../../images/Listings/portals_review.svg';
import portalPublished from '../../images/Listings/portals_published.svg';
import BrixelUpgradeMessage from '../../components/BrixelUpgradeMessage';
import { addGameHistory } from '../../actions/GamificationActions';
import has from 'lodash/has';

const Portals = (props) => {
  // PROPS
  const {
    company,
    formValue,
    handleUpdatePortalsReview,
    history,
    isSmallLoading,
    match,
    portals,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const currency = get(company, 'country.currency', '');
  const meta = get(company, 'meta', {});

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
    //if (status === 'online') handleAddGameHistory({stub: 'portals'});
  };

  const publishDuration = () => {
    const duration = get(meta, 'publish.duration', null);
    if (!duration || duration === 0) return 'unlimited';
    if (duration === 1) return `for <span class="notranslate">${duration}</span> month`;
    if (duration > 1) return `for <span class="notranslate">${duration}</span> months`;
  }

  return (
    <div className="dis-f">
      <div className="secondLevel dis-fl-col ml-md-1">
        <div>
          <div className="portalsWrapper dis-fl-col cardInfoBox">
            <div className="pos-r">
              <div className="dis-f jc-b a-c mb-3">
                <BrixelButtonIcon
                  className="shadow-3dp hide-md"
                  icon="arrow-simple-left"
                  background="White"
                  color="primary"
                  saturationTxt={400}
                  noBorder
                  onClick={ () => history.push(`/${propID}/listings`) }
                />
                <h5 className="sectionTitle">Portals</h5>
                <span />
              </div>
            </div>
            <div className="max-h-perc-100 pb-4 ov-a">
              {
                formValue.portalsReview ? (
                  <>
                    <div className="ta-c mt-2">
                      <img className="h-fix-120" src={portalReview} alt="Page Under review" />
                      <h5 className="txtPrimary600 mb-2 mt-3">Your property gets published…</h5>

                      <p className="mb-1">Portals can take up to 8 hours until your property is online.</p>
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
                          <div className="ta-c mt-2">
                            <img className="h-fix-120" src={portalStart} alt="Portals" />
                            <h5 className="mb-2 mt-3">Your property on the biggest portals.</h5>

                            <div className="ta-l max-w-fix-344 m-a">
                              <div className="mb-1 pos-r">
                                <BrixelIcon className="pos-a" icon="check" color="green" />
                                <p className="ml-4 dis-b">Publish all your listings with one click</p>
                              </div>

                              <div className="mb-1 pos-r">
                                <BrixelIcon className="pos-a" icon="check" color="green" />
                                <p className="ml-4">Weekly republishing for best visibility</p>
                              </div>

                              <div className="mb-1 pos-r">
                                <BrixelIcon className="pos-a" icon="check" color="green" />
                                <p className="ml-4">Homegate, Immoscout24, Comparis and many more...</p>
                              </div>
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
              title="Save 15% compared to listings price."
              description={`Only <span class="notranslate">${currency} ${get(meta, 'portals.price', '')}</span> ${publishDuration()}. Don't worry. You will not be charged for now. Get the result first. Pay later.`}
              titleConfirm="Please confirm your order."
              descriptionConfirm={`<b>Publish on portals.</b><span>Only <span class="notranslate">${currency} ${get(meta, 'portals.price', '')}</span> ${publishDuration()}. You will not be charged for now.</span>`}
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
  company: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleUpdatePortalsReview: PropTypes.func.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.string,
  formValue: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  portals: PropTypes.object.isRequired,
};

Portals.defaultProps = {
};

const mapStateToProps = (state) => {
  const formValue = get(state, 'form.Property.values', {});
  return ({
    company: get(state, 'companies.activeSingleCompany', {}),
    formValue: get(state, 'form.Property.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', null),
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
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Portals);
