/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelIcon,
  FormatValue,
  BrixelButtonSecondary,
  BrixelButtonText,
} from '@brixel/brixel-components';
import {
  BrixelSwitchButton,
  change,
  reset,
} from '@brixel/brixel-components/dist/form';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { useParams } from 'react-router-dom';
import { setModal } from '../../actions/CommonActions';
import { updatePublishedReview } from '../../actions/PropertyActions';
import CoverPropertyImage from '../../components/CoverPropertyImage';
import { MarketingModal } from '../../resources/marketingModal';

const Page = (props) => {
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleUpdatePublishedReview,
    handleSetModal,
    isSmallLoading,
    modal,
  } = props;
  // STATE
  const [status, setStatus] = useState({});
  // URL PARAMS
  const propID = get(match, 'propID', null);

  // ASSIGN COLOR AND TEXT BY STATUS
  useEffect(() => {
    if (activeSingleProperty.publishReview) {
      setStatus({
        text: 'Review',
        color: 'Yellow400',
        state: 'review',
      });
    } else if (activeSingleProperty.published) {
      setStatus({
        text: 'Published',
        color: 'Green400',
        state: 'published',
      });
    } else {
      setStatus({
        text: 'Unpublished',
        color: 'Red400',
        state: 'unpublished',
      });
    }
  }, [activeSingleProperty]);

  // GET PAGE STATUS
  const changeReviewStatus = () => {
    const data = {
      page: propID,
      smallLoader: 'saveData',
      status: status.state === 'published' ? 'offline' : 'online',
    };
    handleUpdatePublishedReview(data);
  };

  // FUNCTION TO GO TO PREVIEW OR LIVE PAGE
  const onClickPreview = () => {
    let url;
    if (formValue.published) {
      url = `${baseByData.pageUrl}${activeSingleProperty.stub}`;
      window.open(url, '_blank');
    } else {
      url = `${baseByData.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${get(window, 'location.href', '')}`;
      window.location.assign(url);
    }
  };

  const onClickRequest = (state, type = 'request') => {
    handleSetModal({
      state: true,
      layout:'xlarge',
      title: MarketingModal[state][type].title,
      body: MarketingModal[state][type].body,
      small: true,
      titleImg: MarketingModal[state][type].titleImg,
      bodyInnerClass: 'max-w-fix-384 m-a ta-c',
      bodyClassColor: 'bgWhite',
      classContainer: 'dis-b ta-c',
      classImg: 'mx-a w-fix-64 mb-3',
      bodyActionsClass: 'dis-f a-c jc-c mt-5 mb-3',
      classTitle: 'ta-c',
      showSupport: type === 'success',
      supportLayout: 'inline',
      multiBodyActions: type === 'success' ? [
        {
          btnType: 'Primary',
          name: 'Ok thanks',
          round: true,
          func: () => handleSetModal({}),
        }
      ] : [
        {
          btnType: 'Secondary',
          name: 'Cancel',
          round: true,
          className: 'mr-1',
          func: () => handleSetModal({}),
        },
        {
          btnType: 'Primary',
          name: 'Send request',
          round: true,
          className: 'ml-1',
          func: () => changeReviewStatus()
        }
      ]
    })
  };

  useEffect(() => {
    if (get(modal, 'multiBodyActions', []).length > 1) {
      modal.multiBodyActions[1].isLoading = isSmallLoading.saveData;
      handleSetModal(modal);
    }
    if (isSmallLoading.saveData === false) {
      const stateText = status.state === 'published' ? 'unpublishPage' : 'publishPage';
      onClickRequest(stateText, 'success');
    }
  }, [isSmallLoading]);

  if (!status.state) {
    return <div />
  }

  return (
    <>
      <div className="bgWhite p-4 brdRadius">
        <div className="dis-f jc-b a-c mb-2">
          <h5>Your Brixel Page</h5>
          <div className={`brdSmall px-2 py-1 brd${status.color} txt${status.color} brdRadius`}>
            {status.text}
          </div>
        </div>

        <div className="mb-4">
          {
            status.state === 'published' ? (
              <div className="dis-f a-c">
                <h6>Share your page</h6>
                <div className="dis-f jc-c a-c">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${baseByData.pageUrl}${formValue.stub}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dis-b ml-2"
                  >
                    <BrixelIcon
                      icon="facebook"
                      color="primary"
                      saturationTxt={700}
                    />
                  </a>
                  <a
                    href={`https://twitter.com/share?url=${baseByData.pageUrl}${formValue.stub}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dis-b ml-2"
                  >
                    <BrixelIcon
                      icon="twitter"
                      color="primary"
                      saturationTxt={700}
                    />
                  </a>
                </div>
              </div>
            ) : (
              <p>Present your property with an unique property website.</p>
            )
          }
        </div>
        <div
          className="websitePage brdRadius ov-h shadow-3dp pos-r cur-poi"
          onClick={() => onClickPreview()}
        >
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
        <div className="dis-f a-c jc-b mt-5">
          {
            status.state === 'published' ? (
              <>
                <BrixelButtonPrimary
                  rounded
                  label="View your page"
                  rightIcon="eye"
                  onClick={() => onClickPreview()}
                />
                <BrixelButtonText
                  label="Take Page offline"
                  theme="red"
                  rounded
                  onClick={() => onClickRequest('unpublishPage', 'request')}
                  isLoading={isSmallLoading.pageReview}
                />
              </>
            ) : (
              <>
                <BrixelButtonSecondary
                  rounded
                  label="Preview your page"
                  rightIcon="eye"
                  onClick={() => onClickPreview()}
                />
                {
                  status.state !== 'review' && (
                    <BrixelButtonPrimary
                      label="Request to publish"
                      rounded
                      onClick={() => onClickRequest('publishPage', 'request')}
                      isLoading={isSmallLoading.pageReview}
                    />
                  )
                }
              </>
            )
          }
        </div>

      </div>
  
      {
        status.state === 'published' && (
          <div className="pos-r w-perc-100 bgWhite p-3 my-5 brdRadius shadow-1dp">
            <h4 className="mb-3">Request visits</h4>
            <BrixelSwitchButton
              className="body2 row-reverse jc-b mt-2"
              label="Allow people to request visits on Brixel Page"
              input={{
                onChange: (val) => changeFieldValue('allowVisits', val),
                name: 'allowVisits',
                value: formValue.allowVisits,
              }}
            />
          </div>
        )
      }
    </>
  );
};

Page.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleUpdatePublishedReview: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  company: get(state, 'companies.activeSingleCompany', {}),
  modal: get(state, 'common.modal', {}),
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
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Page);
