import React from 'react';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {BrixelButtonPrimary, BrixelIcon, FormatValue} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {change, reset} from '@brixel/brixel-components/dist/form';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {updatePublishedReview} from '../../../actions/PropertyActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
import type {PageBuyerType} from '../../../@types/Pages/Dashboard/Buyer/PageBuyer';

const PageBuyer = (props: PageBuyerType) => {
  // PROPS
  const {
    activeSingleProperty,
    lang,
  } = props;
  // URL PARAMS

  // FUNCTION TO GO TO PREVIEW OR LIVE PAGE
  const onClickPreview = () => {
    let url;
    if (activeSingleProperty.published) {
      url = `${baseByData.pageUrl}${activeSingleProperty.stub}`;
      window.open(url, '_blank');
    } else {
      url = `${baseByData.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${get(window, 'location.href', '')}`;
      window.location.assign(url);
    }
  };

  return (
    <>
      <div className="hide dis-f-lg jc-b max-w-fix-1024">

        <h3 className="mb-3 hide dis-b-lg">{translateTo('Brixel Page', lang)}</h3>
        <div className="">
          <BrixelButtonPrimary
            leftIcon="eye"
            label={translateTo(activeSingleProperty.published ? 'Open' : 'Preview', lang)}
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
                <h5 className="sectionTitle">{translateTo('Brixel Page', lang)}</h5>
                <div className="">
                  <BrixelButtonPrimary
                    leftIcon="eye"
                    label={translateTo('Preview', lang)}
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
                        coverPhoto={get(activeSingleProperty, 'coverPhoto.path', undefined)}
                        propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
                      />
                    </div>
                    <div className="cardPageInfo">
                      <div className="w-fix-80 bgPrimary400 opacity5 h-fix-8 mb-1" />
                      <h6>{activeSingleProperty.title}</h6>
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
                        <h6 className="w-fix-24 ff-mono">{FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))}</h6>
                        {
                          get(activeSingleProperty, 'location.countryCode', '') === 'PT' && get(activeSingleProperty, 'properties.typology.grossArea.value', 0) > 0 ? (
                            <h6 className="w-fix-24 ff-mono">{get(activeSingleProperty, 'properties.typology.grossArea.value', 0)}</h6>
                          ) : (
                            <h6 className="w-fix-24 ff-mono">{get(activeSingleProperty, 'properties.typology.livingArea.value', 0)}</h6>
                          )
                        }
                        <h6 className="w-fix-24 ff-mono">{get(activeSingleProperty, 'properties.typology.building.built', 0)}</h6>
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

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
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
)(PageBuyer);
