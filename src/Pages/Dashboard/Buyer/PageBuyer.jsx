/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelIcon,
} from '@brixel/brixel-components';
import * as FormatValue from '@brixel/brixel-components/dist/utils/normalizeFormat';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { updatePublishedReview } from '../../../actions/PropertyActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';

const PageBuyer = (props) => {
  // PROPS
  const {
    formValue,
  } = props;
  // URL PARAMS

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
          <BrixelButtonPrimary
            leftIcon="eye"
            label={formValue.published ? 'Open' : 'Preview'}
            rounded
            onClick={() => onClickPreview()}
          />
        </div>

      </div>
      <div className="dis-f h-perc-lg-100">
        <div className="secondLevel dis-fl-col w-perc-100 h-perc-lg-100">
          <div className="pos-r">
            <div className="dis-f backPanel hide-lg">
              <div className="dis-f jc-b a-bl w-perc-100 pt-small-2">
                <h5 className="sectionTitle">Brixel Page</h5>
                <div className="">
                  <BrixelButtonPrimary
                    leftIcon="eye"
                    label="Preview"
                    rounded
                    onClick={() => onClickPreview()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="boxCard flex-1">
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
                        className="cover"
                        size="56"
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
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PageBuyer.propTypes = {
  formValue: PropTypes.object.isRequired,
};

PageBuyer.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(PageBuyer);
