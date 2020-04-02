/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { Field, change, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import {
  BrixelButtonIcon,
  BrixelButtonTertiary,
  BrixelTextArea,
} from '@brixel/brixel-components';
import Loading from '../../../components/Loading';
import { rotateImg, deleteImg, setCoverPhoto } from '../../../actions/UploadActions';
import { saveActiveSingleProperty } from '../../../actions/PropertyActions';

const DetailMedia = (props) => {
  const {
    formValue,
    handleRotateImg,
    handleSetCoverPhoto,
    history,
    isSmallLoading,
    match,
  } = props;
  // STATE
  const [rotation, setRotation] = useState(0);
  const [idImg, setIdImg] = useState(null);
  const [changeSection] = useState(false);
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
    }
  }, [isSmallLoading]);

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

  if (!formValue || !formValue[mediaType]) {
    return (
      <Loading isLoading />
    );
  }

  return (
    <div className="thirdLevel">
      <div className="dis-fl-col max-h-perc-100">
        <div className="max-h-perc-100 ov-a">
          <div className="image-detail ov-a">
            <div className="dis-fl-row jc-b a-c">
              <h5>{mediaType === 'photos' ? 'Edit photo' : 'Edit floor plan'}</h5>
              <BrixelButtonIcon
                className="shadow-3dp"
                icon="close-small"
                background="White"
                color="dark"
                saturationTxt={700}
                noBorder
                onClick={() => history.push(`/${propID}/property/${mediaType}`) }
              />
            </div>
            <div className="pos-r">
              {
                formValue && formValue[mediaType][idImg] && (
                  // <div
                  //   className="square max-w-fix-400 img-cov img-cen px-md-3"
                  //   style={{ transform: `rotate(${rotation}deg)`, backgroundImage: `url(${getConfigEnv().shortPath}${formValue[mediaType][idImg].thumbnailPath})` }}
                  // />
                  <img
                    className="square max-h-fix-256 img-cov img-cen"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    src={`${baseByData.shortPath}${formValue[mediaType][idImg].path}`}
                    alt="Edit Media"
                  />
                )
              }
              <div className="fixedActionsBtmRight">
                <BrixelButtonIcon
                  className="mr-1"
                  background="white"
                  saturation={0}
                  icon="rotate"
                  color="primary"
                  saturationTxt={400}
                  isLoading={isSmallLoading}
                  onClick={(e) => rotateImage(e)}
                />
              </div>
            </div>
            <div className="actions dis-fl-row jc-b a-c mt-2 mb-4">
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
            </div>
            <Field
              name={`${mediaType}[${idImg}].description`}
              label="Description"
              component={BrixelTextArea}
              placeholder="Describe the photo"
              type="text"
              className="p-md-0 mb-2"
            />
          </div>
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
