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
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { updatePublishedReview } from '../../actions/PropertyActions';
import defaultCover from '../../images/no_cover.jpg';
import page_review from '../../images/Listings/page_review.svg';

const Page = (props) => {
  // PROPS
  const {
    formValue,
    handleUpdatePublishedReview,
    history,
    isSmallLoading,
    match,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  const changeReviewStatus = (status) => {
    const data = {
      page: propID,
      smallLoader: true,
      status: status,
    };
    handleUpdatePublishedReview(data);
  };

  return (
    <div className="dis-f">
      <div className="secondLevel dis-fl-col ml-md-1">
        <div className="brixelPageWrapper max-h-perc-100 dis-fl-col">
          <div className="pos-r">
            <div className="dis-f jc-b a-c">
              <BrixelButtonIcon
                className="shadow-3dp hide-md"
                icon="arrow-simple-left"
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => history.push(`${propID}/listings`)}
              />
              <h5>Brixel Page</h5>
              {
                formValue.published ? (
                  <BrixelButtonPrimary
                    className="shadow-3dp"
                    leftIcon="eye"
                    label="Live view"
                    rounded
                    onClick={() => window.open(`${baseByData.pageUrl}${formValue.stub}`, '_blank') }
                  />
                ) : (
                  <BrixelButtonPrimary
                    className="shadow-3dp"
                    leftIcon="eye"
                    label="Preview"
                    rounded
                    onClick={() => window.open(`${baseByData.pageUrl}preview/${formValue.stub}`, '_blank') }
                  />
                )
              }
            </div>
          </div>
          <div className="max-h-perc-100 pb-4 ov-a">
            {
              formValue.publishReview ? (
                <>
                  <div className="ta-c mt-3">
                    <img src={page_review} alt="Page Under review" />
                    <h5 className="txtPrimary600 mb-1 mt-3">Review in the making…</h5>

                    <p className="mb-1">To assure great quality your page is being reviewed for free.</p>

                    <p>Our customer team gets back to you within one business day.</p>

                    <hr className="my-3" />

                    <p className="txtDark200">Any questions?</p>
                    <p className="txtDark200">Call us: <a className="txtDark200" href="tel:+41 43 333 57 00">+41 43 333 57 00</a></p>
                    <p className="txtDark200">Write us: <a className="txtDark200" href="mailto:support@brixel.ch">support@brixel.ch</a></p>

                  </div>
                </>
              ) : (
                <>
                  <div
                    className="websitePage brdRadius ov-h shadow-3dp pos-r cur-poi"
                    onClick={() => window.open(formValue.published ? `${baseByData.pageUrl}${formValue.stub}` : `${baseByData.pageUrl}preview/${formValue.stub}` , '_blank')}
                  >
                    <div className="dis-f bgLight100 p-1">
                      <div className="square brdCircle w-fix-8 bgRed400 mr-1" />
                      <div className="square brdCircle w-fix-8 bgYellow400 mr-1" />
                      <div className="square brdCircle w-fix-8 bgGreen400" />
                    </div>
                    {
                      formValue.coverPhoto ? (
                        <img
                          className="dis-b"
                          src={`${baseByData.shortPath}${formValue.coverPhoto.path}`}
                          alt="Cover"
                        />
                      ) : (
                        <img
                          className="dis-b"
                          src={defaultCover}
                          alt="Cover"
                        />
                      )
                    }
                    <div className="cardPageInfo">
                      <div className="w-fix-80 bgPrimary400 opacity5 h-fix-8 mb-1" />
                      <h6>{formValue.title}</h6>
                      <div className="dis-f jc-b a-c mt-2">
                        <div className="w-fix-40 bgLight400 opacity5 h-fix-8" />
                        <div className="w-fix-40 bgLight400 opacity5 h-fix-8" />
                      </div>
                      <div className="dis-f jc-b a-c mt-3">
                        <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                        <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                        <div className="w-fix-24 bgLight400 opacity5 h-fix-8" />
                      </div>
                      <div className="dis-f jc-b a-c pb-3">
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.bedrooms', 0)}</h6>
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.livingArea.value', 0)}</h6>
                        <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.building.built', 0)}</h6>
                      </div>
                      <div className="contactPageCard">
                        <div className="contactUser">
                          <BrixelIcon icon="account" />
                        </div>
                        <div className="button" />
                      </div>
                    </div>
                  </div>

                  {
                    formValue.published ? (
                      <div className="ta-c mt-3">
                        <h5 className="mb-1">Share for free.</h5>
                        <p>Use the power of social media.</p>

                        <div className="dis-f jc-b a-c max-w-fix-344 m-a mt-3">
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${baseByData.pageUrl}${formValue.stub}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dis-b"
                          >
                            <BrixelIcon
                              icon="facebook"
                              color="primary"
                              saturationTxt={700}
                            />
                            <span className="dis-b ta-c txtDark700">Facebook</span>
                          </a>
                          <a
                            href={`https://twitter.com/share?url=${baseByData.pageUrl}${formValue.stub}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dis-b"
                          >
                            <BrixelIcon
                              icon="twitter"
                              color="primary"
                              saturationTxt={700}
                            />
                            <span className="dis-b ta-c txtDark700">Twitter</span>
                          </a>
                          <a
                            href={`https://www.linkedin.com/shareArticle?url=${baseByData.pageUrl}${formValue.stub}&title=${formValue.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dis-b"
                          >
                            <BrixelIcon
                              icon="linkedin"
                              color="primary"
                              saturationTxt={700}
                            />
                            <span className="dis-b ta-c txtDark700">Linkedin</span>
                          </a>
                        </div>

                        <hr className="my-3" />

                        <BrixelButtonPrimary
                          className="m-a mt-3 w-fix-176"
                          label="Take Page offline"
                          background="dark"
                          rounded
                          onClick={() => changeReviewStatus('offline')}
                          isLoading={isSmallLoading}
                        />
                      </div>
                    ) : (
                      <div className="ta-c mt-3">
                        <h5 className="mb-1">Do you like what you see?</h5>
                        <p>
                          Put your Brixel Page online.
                          <br />
                          Only CHF 350. Unlimited time.
                        </p>

                        <BrixelButtonPrimary
                          className="m-a mt-3 w-fix-176"
                          label="Unlock now"
                          background="red"
                          rounded
                          onClick={() => changeReviewStatus('online')}
                          isLoading={isSmallLoading}
                        />
                      </div>
                    )
                  }
                </>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

Page.propTypes = {
  history: PropTypes.object.isRequired,
  handleUpdatePublishedReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.bool.isRequired,
  formValue: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Page.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Page);
