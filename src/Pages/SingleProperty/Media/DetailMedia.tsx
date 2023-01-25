import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelButtonIcon, BrixelButtonSecondary, BrixelButtonText, useOutsideAlerter,} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {BrixelTextArea, change, ReduxField, reset,} from '@brixel/brixel-components/dist/form';
import Loading from '../../../components/Loading';
import {deleteImg, rotateImg, setCoverPhoto} from '../../../actions/UploadActions';
import {saveActiveSingleProperty} from '../../../actions/PropertyActions';
import type {DetailMediaType} from '../../../@types/Pages/SingleProperty/Media/DeatailMedia';

const DetailMedia = (props: DetailMediaType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    formValue,
    handleRotateImg,
    changeFieldValue,
    handleDeleteImg,
    isSmallLoading,
    lang,
  } = props;
  // STATE
  const [rotation, setRotation] = useState(0);
  const [idImg, setIdImg] = useState(null);
  const [changeSection] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // PARAMS URL
  const mediaID = get(match, 'imgId', null);
  const propID = get(match, 'propID', null);
  const mediaType = get(match, 'editType', '');
  // REF
  const wrapImg = useRef(null);

  // SET ID OF CURRENT IMAGE
  useEffect(() => {
    if (mediaID && formValue && mediaType) {
      if (formValue[mediaType]) {
        const curId = formValue[mediaType].findIndex((img) => img.id === mediaID);
        setIdImg(curId);
      }
    }
  }, [formValue, mediaType, match]);

  // WHEN THE SMALL LOADING END AND changeSection IS SET TO TRUE MOVED TO NEXT IMAGES
  useEffect(() => {
    if (changeSection && !isSmallLoading.saveData) {
      const arrayImages: { id: string  }[] = get(formValue, mediaType, []);
      const curImgID = arrayImages.findIndex((img) => img.id === mediaID);
      if (curImgID >= 0 && arrayImages[curImgID + 1]) {
        history.push(`/${propID}/property/photos/${arrayImages[curImgID + 1].id}/edit/${mediaType}`);
      }
    }
  }, [isSmallLoading]);

  // FUNCTION TO DELETE THE IMAGES - FLOOR PLANS
  const deleteImage = () => {
    const data = {
      id: mediaID,
      pageID: propID,
      type: mediaType,
      smallLoader: 'saveData',
    };
    // eslint-disable-next-line no-alert
    handleDeleteImg(data);
    history.push(`/${propID}/property/${mediaType}`);
  };

  // FUNCTION TO ROTATE THE IMAGES - FLOOR PLANS
  const rotateImage = (e) => {
    if (e) e.preventDefault();
    const rotate = rotation + 90;
    // if (rotate > 360) rotate = 90;
    const data = {
      type: mediaType,
      id: mediaID,
      rotate: 90,
      smallLoader: 'saveData',
    };
    setRotation(rotate);
    handleRotateImg(data);
  };

  // FUNCTION TO SET COVER IMAGE
  const handleCoverPhoto = (e, photo) => {
    e.preventDefault();
    const allPhotos = cloneDeep(formValue.photos);
    if (allPhotos) {
      const getCoverID = allPhotos.findIndex((item) => item.id === photo.id);
      allPhotos.unshift(allPhotos.splice(getCoverID, 1)[0]);
      changeFieldValue('photos', allPhotos);
      changeFieldValue('coverPhoto', photo);
    }
  };

  // FUNCTION CLICK OUTSIDE OF IMAGE
  useOutsideAlerter(wrapImg, {
    action: 'function',
    func: () => { setConfirmDelete(false); },
  });

  const imgUrl = () => {
    const url = `${baseByData.shortPath}${formValue[mediaType][idImg].bigPath}??${Math.random().toString(36).slice(2)}`;
    return url;
  };

  // IF NOT FORM VALUE SHOW THE LOADING
  if (!formValue || !formValue[mediaType]) {
    return (
      <Loading isLoading />
    );
  }

  return (
    <div className="thirdLevel mediaDetails">
      <div className="boxCard dis-fl-col max-h-perc-100">
        <div className="max-h-perc-100">
          <div className="image-detail">
            <div className="dis-f jc-b w-perc-100 mb-3">
              <h5 className="">
                {translateTo(mediaType === 'photos' ? 'Edit photo' : 'Edit floor plan', lang)}
              </h5>
              <div className="">
                <BrixelButtonIcon
                  ghost
                  icon="close-small"
                  onClick={() => history.push(`/${propID}/property/${mediaType}`)}
                />
              </div>
            </div>
            <div className="pos-r image-ratio ov-h">
              {
                formValue && formValue[mediaType][idImg] && (
                  <img
                    loading="lazy"
                    className="max-w-perc-100 shadow-2dp brdRadius w-perc-100"
                    src={imgUrl()}
                    alt="Edit Media"
                  />
                )
              }
            </div>
            <div className="actions dis-fl-row jc-b a-c mt-2 mb-4 pos-r">
              <>
                {
                  (formValue.coverPhoto && mediaType === 'photos' && get(formValue, `[${mediaType}][${idImg}].id`, '') !== formValue.coverPhoto.id)
                && (
                  <BrixelButtonText
                    rounded
                    leftIcon="star-fill"
                    label={translateTo('Set as cover', lang)}
                    onClick={(e) => handleCoverPhoto(e, get(formValue, `[${mediaType}][${idImg}]`, ''))}
                  />
                )
                }
                <div className="dis-f ml-a">
                  <BrixelButtonIcon
                    className="mr-1"
                    ghost
                    icon="rotate"
                    isLoading={isSmallLoading.rotate}
                    onClick={(e) => rotateImage(e)}
                  />
                  {
                    confirmDelete ? (
                      <div ref={wrapImg}>
                        <BrixelButtonSecondary
                          rounded
                          theme="red"
                          rightIcon="bin"
                          label={translateTo('delete?', lang)}
                          isLoading={isSmallLoading.delete}
                          onClick={() => deleteImage()}
                        />
                      </div>
                    ) : (
                      <BrixelButtonIcon
                        ghost
                        icon="bin"
                        theme="red"
                        onClick={() => setConfirmDelete(true)}
                      />
                    )
                  }
                </div>
              </>
            </div>
            <ReduxField
              form="Property"
              input={{
                name: `${mediaType}[${idImg}].description`,
                placeholder: translateTo('Describe the photo', lang),
                type: 'text',
              }}
              labels={{
                label: translateTo('Description', lang),
              }}
              component={BrixelTextArea}
              design={{
                className: 'p-lg-0 mb-2 txtDark300 fweight-400',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  initialValues: get(state, 'brixelForm.Property.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', { }),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleReset(data) {
    dispatch(reset('Property', data));
  },
  handleRotateImg: bindActionCreators(rotateImg, dispatch),
  handleDeleteImg: bindActionCreators(deleteImg, dispatch),
  handleSetCoverPhoto: bindActionCreators(setCoverPhoto, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DetailMedia);
