/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { Field, change, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import {
  BrixelButtonIcon,
  BrixelButtonSecondary,
  BrixelButtonTertiary,
  BrixelTextArea,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import Loading from '../../../components/Loading';
import { rotateImg, deleteImg, setCoverPhoto } from '../../../actions/UploadActions';
import { saveActiveSingleProperty } from '../../../actions/PropertyActions';

const DetailMedia = (props) => {
  const {
    formValue,
    handleRotateImg,
    changeFieldValue,
    handleDeleteImg,
    history,
    isSmallLoading,
    match,
  } = props;
  // STATE
  const [rotation, setRotation] = useState(0);
  const [idImg, setIdImg] = useState(null);
  const [changeSection] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // PARAMS URL
  const mediaID = get(match, 'params.imgId', null);
  const propID = get(match, 'params.propId', null);
  const mediaType = get(match, 'params.editType', null);
  // REF
  const wrapImg = useRef(null);
  const thirdlevelEl = document.getElementsByClassName('thirdLevel')[0];

  useEffect(() => {
    if (mediaID && formValue && mediaType) {
      if (formValue[mediaType]) {
        const curId = formValue[mediaType].findIndex(img => img.id === mediaID);
        setIdImg(curId);
      }
    }
  }, [formValue, mediaType, match]);

  useEffect(() => {

    if (formValue[mediaType][idImg]) {

      if (formValue[mediaType][idImg] != '') {

        if (thirdlevelEl) {

          thirdlevelEl.classList.add('move');

          setTimeout(function(){
            thirdlevelEl.classList.remove('move');
          }, 500);

        }
      }
    }
  })

  useEffect(() => {
    if (changeSection && !isSmallLoading) {
      const arrayImages = get(formValue, mediaType, []);
      const curImgID = arrayImages.findIndex(img => img.id === mediaID);
      if (curImgID >= 0 && arrayImages[curImgID + 1]) {
        history.push(`/${propID}/property/photos/${arrayImages[curImgID + 1].id}/edit/${mediaType}`)
      }
    }
  }, [isSmallLoading]);

  const deleteImage = () => {
    const propID = get(match, 'params.propId', null);
    const data = {
      id: mediaID,
      pageID: propID,
      type: mediaType,
      smallLoader: 'delete',
    };
    // eslint-disable-next-line no-alert
    handleDeleteImg(data);
    history.push(`/${propID}/property/${mediaType}`)
  };

  const rotateImage = () => {
    let rotate = rotation + 90;
    // if (rotate > 360) rotate = 90;
    const data = {
      type: mediaType,
      id: mediaID,
      rotate: 90,
      smallLoader: 'rotate',
    };
    setRotation(rotate);
    handleRotateImg(data);
  };

  const handleCoverPhoto = (e, photo) => {
    e.preventDefault();
    const allPhotos = cloneDeep(formValue.photos);
    const getCoverID = allPhotos.findIndex(item => item.id === photo.id);
    allPhotos.unshift(allPhotos.splice(getCoverID, 1)[0]);
    changeFieldValue('photos', allPhotos);
    changeFieldValue('coverPhoto', photo);
  };

  useOutsideAlerter(wrapImg, {
    action: 'function',
    func: () => { setConfirmDelete(false) },
  });

  if (!formValue || !formValue[mediaType]) {
    return (
      <Loading isLoading />
    );
  }

  return (
    <div className="thirdLevel mediaDetails">
      <div className="dis-fl-col max-h-perc-100">
          <div className="max-h-perc-100">
            <div className="image-detail">
              <div className="dis-f jc-b a-c mb-3">
                <h5 className="">{mediaType === 'photos' ? 'Edit photo' : 'Edit floor plan'}</h5>
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
              <div className="pos-r image-ratio ov-h">
                {
                  formValue && formValue[mediaType][idImg] && (
                    // <div
                    //   className="square max-w-fix-400 img-cov img-cen px-md-3"
                    //   style={{ transform: `rotate(${rotation}deg)`, backgroundImage: `url(${getConfigEnv().shortPath}${formValue[mediaType][idImg].thumbnailPath})` }}
                    // />
                    <img
                      className="max-w-perc-100 shadow-2dp brdRadius w-perc-100"
                      //style={{ transform: `rotate(${rotation}deg)` }}
                      src={`${baseByData.shortPath}${formValue[mediaType][idImg].path}?${formValue[mediaType][idImg].updatedAt}`}
                      alt="Edit Media"
                    />
                  )
                }
              </div>
              <div className="actions dis-fl-row jc-b a-c mt-2 mb-4 pos-r">
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
                <div className="dis-f ml-a">
                  <BrixelButtonIcon
                    className="mr-1 shadow-2dp"
                    background="white"
                    saturation={0}
                    icon="rotate"
                    color="primary"
                    saturationTxt={400}
                    isLoading={isSmallLoading === 'rotate'}
                    onClick={(e) => rotateImage(e)}
                  />
                  {
                    confirmDelete ? (
                      <div ref={wrapImg}>
                        <BrixelButtonSecondary
                          rounded
                          color="red"
                          saturation={400}
                          saturationTxt={400}
                          rightIcon="bin"
                          label="delete?"
                          className="shadow-2dp"
                          isLoading={isSmallLoading === 'delete'}
                          onClick={() => deleteImage()}
                        />
                      </div>
                    ) : (
                      <BrixelButtonIcon
                        className="shadow-2dp"
                        background="white"
                        saturation={0}
                        icon="bin"
                        color="red"
                        saturationTxt={400}
                        onClick={(e) => setConfirmDelete(true)}
                      />
                    )
                  }
                </div>
              </div>
              <Field
                name={`${mediaType}[${idImg}].description`}
                label="Description"
                component={BrixelTextArea}
                placeholder="Describe the photo"
                type="text"
                className="p-md-0 mb-2 txtDark300 fweight-400"
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
  isSmallLoading: PropTypes.string,
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
  isSmallLoading: get(state, 'common.isSmallLoading', null),
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
