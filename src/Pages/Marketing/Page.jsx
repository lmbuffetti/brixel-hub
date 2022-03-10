/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelIcon,
  BrixelSwitchButton,
} from '@brixel/brixel-components';
import { reset, change } from '@brixel/brixel-components/dist/utils/ReduxForm.Functions';
import * as FormatValue from '@brixel/brixel-components/dist/utils/normalizeFormat';
import * as Helpers from '@brixel/brixel-components/dist/utils/helper';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { useParams } from 'react-router-dom';
import { updatePublishedReview } from '../../actions/PropertyActions';
import CoverPropertyImage from '../../components/CoverPropertyImage';
import BrixelUpgradeMessage from '../../components/BrixelUpgradeMessage';

const Page = (props) => {
  const match = useParams();
  // PROPS
  const {
    changeFieldValue,
    company,
    formValue,
    handleUpdatePublishedReview,
    isSmallLoading,
  } = props;
  // URL PARAMS
  const propID = get(match, 'propID', null);

  // GET PAGE STATUS
  const changeReviewStatus = (status) => {
    const data = {
      page: propID,
      smallLoader: 'saveData',
      status,
    };
    handleUpdatePublishedReview(data);
  };

  // FUNCTION TO GO TO PREVIEW OR LIVE PAGE
  const onClickPreview = () => {
    let url;
    if (formValue.published) {
      url = `${baseByData.pageUrl}${formValue.stub}`;
      window.open(url, '_blank');
    } else {
      url = `${baseByData.pageUrl}preview/${formValue.stub}?hubUrl=${get(window, 'location.href', '')}`;
      window.location.assign(url);
    }
  };

  return (
    <>
      <div className="hide dis-f-lg jc-b max-w-fix-768">

        <h3 className="mb-3 hide dis-b-lg">Brixel Page</h3>
        <div className="">
          {
            formValue.published ? (
              <BrixelButtonPrimary
                leftIcon="eye"
                label="Live view"
                rounded
                onClick={() => onClickPreview()}
              />
            ) : (
              <BrixelButtonPrimary
                leftIcon="eye"
                label="Preview"
                rounded
                onClick={() => onClickPreview()}
              />
            )
          }
        </div>

      </div>
      <div className="dis-f">
        <div className="secondLevel dis-fl-col">
          <div className="pos-r">
            <div className="dis-f backPanel hide-lg">
              <div className="dis-f jc-b a-bl w-perc-100 pt-small-2">

                <h5 className="sectionTitle">Brixel Page</h5>
                <div className="">
                  {
                    formValue.published ? (
                      <BrixelButtonPrimary
                        leftIcon="eye"
                        label="Live view"
                        rounded
                        onClick={() => onClickPreview()}
                      />
                    ) : (
                      <BrixelButtonPrimary
                        leftIcon="eye"
                        label="Preview"
                        rounded
                        onClick={() => onClickPreview()}
                      />
                    )
                  }
                </div>
              </div>

            </div>
          </div>
          <div className="mb-5">
            <div className="brixelPageWrapper dis-fl-col cardInfoBox">
              <div className="pb-4">
                <>
                  <div
                    className="websitePage brdRadius ov-h shadow-3dp pos-r cur-poi"
                    onClick={() => onClickPreview()}
                  >
                    <div className="dis-f bgLight100 p-1">
                      <div className="square brdCircle w-fix-8 bgRed400 mr-1" />
                      <div className="square brdCircle w-fix-8 bgYellow400 mr-1" />
                      <div className="square brdCircle w-fix-8 bgGreen400" />
                    </div>
                    <div className="image-ratio">
                      <CoverPropertyImage
                        size="56"
                        className="cover"
                        coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                        propertyType={get(formValue, 'properties.propertyType', undefined)}
                      />
                    </div>
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
                        <h6 className="w-fix-24 ff-mono">{FormatValue.formatRooms(get(formValue, 'properties.typology.bedrooms', 0), get(formValue, 'location.countryCode', 'CH'))}</h6>
                        {
                          get(formValue, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                            <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.grossArea.value', 0)}</h6>
                          ) : (
                            <h6 className="w-fix-24 ff-mono">{get(formValue, 'properties.typology.livingArea.value', 0)}</h6>
                          )
                        }
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
                    formValue.publishReview && (
                      <>
                        <div className="ta-c mt-3">
                          <h5 className="txtPrimary600 mb-1 mt-3">Review in the making…</h5>

                          <p className="mb-1">To assure great quality your page is being reviewed for free.</p>

                          <p>Our customer team gets back to you within one business day.</p>

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
                    )
                  }
                  {
                    formValue.published && (
                      <>
                        <div className="ta-c mt-4">
                          <h5 className="mb-1">Share for free.</h5>
                          <p className="fsize-300 txtDark200">Use the power of social media.</p>

                          <div className="dis-f jc-c a-c max-w-fix-344 m-a mt-3">
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${baseByData.pageUrl}${formValue.stub}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dis-b mr-4"
                            >
                              <BrixelIcon
                                icon="facebook"
                                color="primary"
                                saturationTxt={700}
                              />
                              <span className="dis-b ta-c txtDark700 fsize-300">Facebook</span>
                            </a>
                            <a
                              href={`https://twitter.com/share?url=${baseByData.pageUrl}${formValue.stub}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dis-b mr-4"
                            >
                              <BrixelIcon
                                icon="twitter"
                                color="primary"
                                saturationTxt={700}
                              />
                              <span className="dis-b ta-c txtDark700 fsize-300">Twitter</span>
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
                              <span className="dis-b ta-c txtDark700 fsize-300">Linkedin</span>
                            </a>
                          </div>

                          <hr className="my-3" />

                          <p className="fsize-300 txtDark200 w-fix-200 m-a">Your property should not be visible anymore?</p>

                          <BrixelButtonPrimary
                            className="m-a mt-3"
                            label="Take Page offline"
                            theme="dark"
                            rounded
                            onClick={() => changeReviewStatus('offline')}
                            isLoading={isSmallLoading.pageReview}
                          />
                        </div>
                        <div className="pos-r w-perc-100 zIndex1 p-3 my-5 brdRadius shadow-1dp">
                          <h4 className="mb-3">Request visits</h4>
                          <BrixelSwitchButton
                            className="body2 row-reverse jc-b mt-2"
                            label="Allow people to request visits on Brixel Page"
                            input={{
                              onChange: () => changeFieldValue('allowVisits', !formValue.allowVisits),
                              name: 'allowVisits',
                              value: formValue.allowVisits,
                            }}
                          />
                        </div>
                      </>
                    )
                  }
                </>
              </div>
            </div>
          </div>

          {
            !formValue.published && !formValue.publishReview && (
              <BrixelUpgradeMessage
                title="Make your Brixel Page public."
                description="You can publish your Brixel Page for free to share it wherever you want. We will review your content before publishing to make sure you get the best result."
                btnLabel="Request Brixel Page"
                titleConfirm="Please confirm your order."
                descriptionConfirm="You can publish your Brixel Page for free to share it wherever you want. We will review your content before publishing to make sure you get the best result."
                onClick={() => changeReviewStatus('online')}
                isSmallLoading={isSmallLoading}
                unlockFunction
              />
            )
          }

        </div>
      </div>
    </>
  );
};

Page.propTypes = {
  company: PropTypes.object.isRequired,
  handleUpdatePublishedReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  company: get(state, 'companies.activeSingleCompany', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form, data) {
    (dispatch(reset(form, data)));
  },
  handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Page);
