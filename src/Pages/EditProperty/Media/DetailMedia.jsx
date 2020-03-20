/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { Field, change, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import {
  BrixelButtonIcon, BrixelInputText, BrixelButtonTertiary,
  BrixelTags, BrixelButtonPrimary, BrixelTextArea,
} from '@brixel/brixel-components';
import Loading from '../../../components/Loading';
import { rotateImg, deleteImg, setCoverPhoto } from '../../../actions/UploadActions';
import { saveActiveSingleProperty } from '../../../actions/PropertyActions';

const DetailMedia = (props) => {
  const {
    formValue,
    handleDeleteImg,
    handleRotateImg,
    handleSetCoverPhoto,
    handleSaveActiveSingleProperty,
    history,
    isSmallLoading,
    match,
  } = props;
  // STATE
  const [rotation, setRotation] = useState(0);
  const [idImg, setIdImg] = useState(null);
  const [changeSection, setChangeSection] = useState(false);
  // REFS
  const textAreaRef1 = useRef(null);
  const textAreaRef2 = useRef(null);
  const textAreaRef3 = useRef(null);
  // PARAMS URL
  const mediaID = get(match, 'params.imgId', null);
  const propID = get(match, 'params.propId', null);
  const mediaType = get(match, 'params.editType', null);

  useEffect(() => {
    if (mediaID && formValue && mediaType) {
      if (formValue[mediaType]) {
        const curId = formValue[mediaType].findIndex(img => img.id === mediaID);
        setIdImg(curId);
      }
    }
  }, [formValue, mediaType, match]);

  useEffect(() => {
    if (changeSection && !isSmallLoading) {
      const arrayImages = get(formValue, mediaType, []);
      const curImgID = arrayImages.findIndex(img => img.id === mediaID);
      if (curImgID >= 0 && arrayImages[curImgID + 1]) {
        history.push(`/${propID}/property/photos/${arrayImages[curImgID + 1].id}/edit/${mediaType}`)
      }
      console.log(arrayImages, curImgID);
    }
  }, [isSmallLoading]);

  const deleteImage = (e) => {
    e.preventDefault();
    const data = {
      id: propID,
      mediaID: mediaID,
      type: mediaType,
    };
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this item?')) {
      handleDeleteImg(data);
    }
  };

  const saveImage = () => {
    const data = {
      id: propID,
      photos: formValue.photos,
      floorPlans: formValue.floorPlans,
      smallLoader: true,
    };
    setChangeSection(true);
    // eslint-disable-next-line no-alert
    handleSaveActiveSingleProperty(data);
  };

  const rotateImage = (e) => {
    const mediaID = get(match, 'params.mediaID', null);
    if (e) e.preventDefault();
    let rotate = rotation + 90;
    // if (rotate > 360) rotate = 90;
    const data = {
      type: mediaType,
      id: mediaID,
      rotate: 90,
    };
    setRotation(rotate);
    handleRotateImg(data);
  };

  const handleCoverPhoto = (e, photo) => {
    e.preventDefault();
    const data = {
      id: propID,
      coverPhoto: photo,
    };
    handleSetCoverPhoto(data);
  };

  const openLink = (e, link) => {
    e.preventDefault();
    window.open(`${baseByData.apiPath}${link}`, '_blank');
  };

  // COPY DOCUMENT LINK
  const copyLinkToClipboard = (e, ref) => {
    e.preventDefault();
    if (ref === 'first') {
      textAreaRef1.current.select();
    } else if (ref === 'second') {
      textAreaRef2.current.select();
    } else if (ref === 'third') {
      textAreaRef3.current.select();
    }
    document.execCommand('copy');
  };

  if (!formValue || !formValue[mediaType]) {
    return (
      <Loading isLoading />
    );
  }

  return (
    <div className="thirdLevel">
      <div className="dis-fl-col h-perc-100">
        <div className="max-h-perc-100 ov-a">
          <div className="image-detail ov-a">
            <div className="dis-fl-row jc-b a-c">
              <h5>{mediaType === 'photos' ? 'Edit photo' : 'Edit floor plan'}</h5>
              <BrixelButtonIcon
                className="shadow-3dp"
                icon="close"
                background="White"
                color="dark"
                saturationTxt={700}
                noBorder
                onClick={() => history.push(`/${propID}/property/${mediaType}`) }
              />
            </div>
            {
              formValue && formValue[mediaType][idImg] && (
                // <div
                //   className="square max-w-fix-400 img-cov img-cen px-md-3"
                //   style={{ transform: `rotate(${rotation}deg)`, backgroundImage: `url(${getConfigEnv().shortPath}${formValue[mediaType][idImg].thumbnailPath})` }}
                // />
                <img
                  className="square max-h-fix-256 img-cov img-cen"
                  style={{ transform: `rotate(${rotation}deg)` }}
                  src={`${baseByData.shortPath}${formValue[mediaType][idImg].thumbnailPath}`}
                  alt="Edit Media"
                />
              )
            }
            <div className="actions dis-fl-row jc-b a-c mt-3 mb-4">
              {
                mediaType === 'photos' && (get(formValue[mediaType][idImg], 'id') !== formValue.coverPhoto.id)
                && (
                  <BrixelButtonTertiary
                    rounded
                    leftIcon="star-fill"
                    label="Set as cover"
                    onClick={(e) => handleCoverPhoto(e, formValue[mediaType][idImg])}
                  />
                )
              }
              <div className="secondary dis-fl-row a-c">
                <BrixelButtonIcon
                  className="mr-1"
                  bgTransparent
                  icon="rotate"
                  color="primary"
                  saturationTxt={400}
                  onClick={(e) => rotateImage(e)}
                />
                <BrixelButtonIcon
                  bgTransparent
                  background="red"
                  icon="bin"
                  color="red"
                  saturationTxt={400}
                  onClick={(e) => deleteImage(e)}
                />
              </div>
            </div>
            <Field
              name={`${mediaType}[${idImg}].name`}
              label="Name"
              component={BrixelInputText}
              placeholder="Name the photo"
              type="text"
              className="p-md-0 mb-2"
            />
            <Field
              name={`${mediaType}[${idImg}].description`}
              label="Description"
              component={BrixelTextArea}
              placeholder="Describe the photo"
              type="text"
              className="p-md-0 mb-2"
            />
            <Field
              name={`${mediaType}[${idImg}].tags`}
              label="New tag"
              component={BrixelTags}
              className="mb-4"
            />
            {
              formValue && formValue[mediaType][idImg] && (
                <div className="details dis-fl-col pt-4">
                  <span className="caption mb-3">Details</span>
                  <div className="dis-fl-row mb-2">
                    <span className="detail-title w-fix-80 mr-4">ID</span>
                    <span className="detail-info">{formValue[mediaType][idImg].id}</span>
                  </div>
                  <div className="dis-fl-row mb-2">
                    <span className="detail-title w-fix-80 mr-4">Type</span>
                    <span className="detail-info">{formValue[mediaType][idImg].mimeType}</span>
                  </div>
                  <div className="dis-fl-col">
                    <span className="detail-title mb-1">URLs</span>
                    <div className="dis-fl-row">
                      <BrixelButtonTertiary
                        className="detail-info link mr-1"
                        label={formValue[mediaType][idImg].path}
                        onClick={(e) => openLink(e, formValue[mediaType][idImg].path)}
                      />
                      <BrixelButtonIcon
                        icon="copy-link"
                        noBorder
                        bgTransparent
                        color="primary"
                        saturationTxt={400}
                        fontSize={16}
                        onClick={(e) => copyLinkToClipboard(e, 'first')}
                      />
                      <textarea
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0,
                        }}
                        readOnly
                        ref={textAreaRef1}
                        value={`${baseByData.apiPath}${formValue[mediaType][idImg].path}`}
                      />
                    </div>
                    <div className="dis-fl-row">
                      <BrixelButtonTertiary
                        className="detail-info link mr-1"
                        label={formValue[mediaType][idImg].bigPath}
                        onClick={(e) => openLink(e, formValue[mediaType][idImg].bigPath)}
                      />
                      <BrixelButtonIcon
                        icon="copy-link"
                        noBorder
                        bgTransparent
                        color="primary"
                        saturationTxt={400}
                        fontSize={16}
                        onClick={(e) => copyLinkToClipboard(e, 'second')}
                      />
                      <textarea
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0,
                        }}
                        readOnly
                        ref={textAreaRef2}
                        value={`${baseByData.apiPath}${formValue[mediaType][idImg].bigPath}`}
                      />
                    </div>
                    <div className="dis-fl-row">
                      <BrixelButtonTertiary
                        className="detail-info link mr-1"
                        label={formValue[mediaType][idImg].thumbnailPath}
                        onClick={(e) => openLink(e, formValue[mediaType][idImg].thumbnailPath)}
                      />
                      <BrixelButtonIcon
                        icon="copy-link"
                        noBorder
                        bgTransparent
                        color="primary"
                        saturationTxt={400}
                        fontSize={16}
                        onClick={(e) => copyLinkToClipboard(e, 'third')}
                      />
                      <textarea
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0,
                        }}
                        readOnly
                        ref={textAreaRef3}
                        value={`${baseByData.apiPath}${formValue[mediaType][idImg].thumbnailPath}`}
                      />
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="dis-f p-2">
          <BrixelButtonPrimary
            label='Cancel'
            background="white"
            saturation={0}
            color="dark"
            saturationTxt={400}
            rounded
            className="shadow-3dp w-perc-100 mr-1"
            onClick={() => history.push(`/${propID}/property/${mediaType}`)}
          />
          <BrixelButtonPrimary
            onClick={() => saveImage()}
            background="primary"
            saturation={400}
            rounded
            label="Save & Next"
            isLoading={isSmallLoading}
            className="w-perc-100 ml-1"
          />
        </div>
      </div>
    </div>
  );
};

DetailMedia.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleRotateImg: PropTypes.func.isRequired,
  handleDeleteImg: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleSetCoverPhoto: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.bool,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

DetailMedia.defaultProps = {
};

const DetailMediaForm = reduxForm({
  // a unique name for the form
  form: 'Property',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(DetailMedia);

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
  loggedInUser: get(state, 'user.loggedInUser', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleRotateImg: bindActionCreators(rotateImg, dispatch),
  handleDeleteImg: bindActionCreators(deleteImg, dispatch),
  handleSetCoverPhoto: bindActionCreators(setCoverPhoto, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DetailMediaForm);
