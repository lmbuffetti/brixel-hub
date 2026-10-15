import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelButtonIcon,
  BrixelImage,
  BrixelButtonSecondary,
  BrixelButtonText,
  useOutsideAlerter,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {BrixelTextArea, change, reset} from '@brixel-io/brixel-components/dist/form';
import Loading from '../../../components/Loading';
import {deleteImg, rotateImg, setCoverPhoto, updateDescriptionImage} from '../../../actions/UploadActions';
import {getActiveSingleProperty, saveActiveSingleProperty} from '../../../actions/PropertyActions';
import type {DetailMediaType} from '../../../@types/Pages/SingleProperty/Media/DeatailMedia';
import {spinnerSmall} from '../../../actions/CommonActions';
import {fromURLtoBase64} from '@brixel-io/brixel-components/dist/utils/helper';
import singleUploadCall from '@brixel-io/brixel-components/dist/helpers/uploads/SingleUpload';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';

const DetailMedia = (props: DetailMediaType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    formValue,
    handleGetActiveSingleProperty,
    handleUpdateImageDescription,
    changeFieldValue,
    handleSpinnerSmall,
    handleDeleteImg,
    isSmallLoading,
    lang,
  } = props;
  // STATE
  const [valueDescription, setValueDescription] = useState('');
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
        setValueDescription(formValue[mediaType][curId].description);
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
    const foto = cloneDeep(formValue[mediaType]);
    const fotoID = foto.findIndex((item) => item.id === idImg);
    if (fotoID > -1) foto.splice(fotoID, 1);
    const imgType = mediaType === 'photos' ? 'image' : 'floorPlan';
    const data = {
      photoID: mediaID,
      pageID: propID,
      type: imgType,
      imgToSave: foto,
      smallLoader: 'deleteMedia',
    };
    handleDeleteImg(data);
    history.push(`/${propID}/property/${mediaType}`);
  };

  // FUNCTION TO ROTATE THE IMAGES - FLOOR PLANS
  const rotateImage = async (e, photo) => {
    if (e) e.preventDefault();
    if (propID) {
      handleSpinnerSmall({rotateImg: true});
      await fromURLtoBase64(photo.url, (res: string) => {
        const file = {
          ...photo,
          type: photo.mimeType,
          file: res,
        }
        const imgType = mediaType === 'photos' ? 'pageImage' : 'floorPlanImage';
        singleUploadCall(file, imgType, {pageID: propID, companyID: '', imageID: photo.id})
          .then(() => {
            handleGetActiveSingleProperty({
              id: propID,
              smallLoader: 'rotateImg',
            })
            handleSpinnerSmall({[`rotateImg_${photo.id}`]: false});
          })
      })
    }
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

  // UPDATE DESCRIPTION
  const updateDescription = (e) => {
    if (e) e.preventDefault();
    const type = mediaType === 'photos' ? 'image' : 'floorPlan';
    handleUpdateImageDescription({
      pageID: propID,
      imageID: mediaID,
      type,
      body: {
        description: valueDescription,
      },
      smallLoader: 'updateDescription',
    })
  }

  // FUNCTION CLICK OUTSIDE OF IMAGE
  useOutsideAlerter(wrapImg, {
    action: 'function',
    func: () => { setConfirmDelete(false); },
  });

  // IF NOT FORM VALUE SHOW THE LOADING
  if (!formValue || !formValue[mediaType]) {
    return (
      <Loading isLoading={false} />
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
                  <BrixelImage
                    loading="lazy"
                    className="max-w-perc-100 shadow-2dp brdRadius w-perc-100"
                    url={formValue[mediaType][idImg].url}
                    alt="Edit Media"
                    size="L"
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
                    isLoading={isSmallLoading.rotateImg}
                    onClick={(e) => rotateImage(e, formValue[mediaType][idImg])}
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
            <BrixelTextArea
              placeholder={translateTo('Describe the photo', lang)}
              input={{
                name: `${mediaType}[${idImg}].description`,
                type: 'text',
                value: valueDescription,
                onChange: (val) => setValueDescription(val),
              }}
              label={translateTo('Description', lang)}
              className="p-lg-0 mb-2 txtText700 fweight-400"
            />
            {
              get(formValue, `[${mediaType}][${idImg}].description`, null) !== valueDescription && (
                <BrixelButtonPrimary
                  rounded
                  isLoading={isSmallLoading.updateDescription}
                  onClick={(e) => updateDescription(e)}
                  label="Save description"
                />
              )
            }
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
  handleDeleteImg: bindActionCreators(deleteImg, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleRotateImg: bindActionCreators(rotateImg, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSetCoverPhoto: bindActionCreators(setCoverPhoto, dispatch),
  handleSpinnerSmall: bindActionCreators(spinnerSmall, dispatch),
  handleUpdateImageDescription: bindActionCreators(updateDescriptionImage, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DetailMedia);
