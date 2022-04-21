/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback, useEffect, useState, useRef,
} from 'react';
import {
  Routes, Route, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { diff } from 'deep-object-diff';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import {
  change,
  BrixelButtonIcon,
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { ReactSortable } from 'react-sortablejs';
import { deleteImg, uploadImg, multiUploadImg } from '../../../actions/UploadActions';
import DetailMedia from './DetailMedia';
import { Truncate, tobase64Handler } from '../../../utils/helpers';
import uploadPhotosEmpty from '../../../images/Upload/upload_photos_empty.svg';
import OutsideElement from '../../../components/OutsideElement';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Photos = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleMultiUploadImg,
    handleDeleteImg,
    imageType,
    isSmallLoading,
    loggedInUser,
    windowDimensions,
  } = props;
  const { photos } = formValue;
  // STATE
  const [fixPhotos, setFixPhotos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [btnActive, setBtnActive] = useState(null);
  const [newImages, setNewImages] = useState([]);
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  // REF
  // eslint-disable-next-line no-unused-vars
  const arrayImg = [...Array(photos ? photos.length : 0)].map((_, index) => React.createRef());
  const wrappImg = useRef(arrayImg);

  useEffect(() => () => document.body.classList.remove('scrollSmooth'));

  // COMPARE IMAGES AND fixPhotos TO ADD THE PREVIEW IMAGES ON UPLOADING
  useEffect(() => {
    // setNewImages([]);
    if (Object.keys(diff(photos, fixPhotos)).length > 0 && !isSmallLoading.uploadMedia) {
      setNewImages([]);
      setConfirmDelete(null);
      setBtnActive(null);
      setFixPhotos(cloneDeep(photos));
    }
  }, [photos, isSmallLoading]);

  // FUNCTION TO DELETE IMAGE
  const deleteImage = (id) => {
    const mediaID = id;
    const data = {
      id: mediaID,
      pageID: propID,
      type: 'photos',
      smallLoader: 'deleteMedia',
    };
    handleDeleteImg(data);
    history.push(`/${propID}/property/photos`);
  };

  // MULTIUPLOADING FUNCTION
  const onDrop = useCallback(async (acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    // eslint-disable-next-line no-console
    reader.onabort = () => console.log('file reading was aborted');
    // eslint-disable-next-line no-console
    reader.onerror = () => console.log('file reading has failed');
    setBtnActive('uploading');
    const imgType = imageType.find((val) => val.name === 'Gallery');
    const imgList = tobase64Handler(
      acceptedFiles,
      loggedInUser.user.id,
      'photos',
      formValue.id,
      imgType.id,
    );
    imgList.then((res) => {
      handleMultiUploadImg({
        allImgs: res,
        actions: 'photos',
        pageID: activeSingleProperty.id || propID,
        smallLoader: 'uploadMedia',
      });
    });
  }, []);

  // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: 'image/png,image/jpg,image/jpeg',
    minSize: 0,
    maxSize: 1e+7,
  });

  // ORDER IMAGE SETTINGS
  const changeOrder = (order) => {
    const imgArray = [];
    order.map((item) => {
      if (item.createdAt) {
        delete item.chosen;
        delete item.selected;
        imgArray.push(item);
      }
      return null;
    });
    const changeObj = diff(fixPhotos, imgArray);
    if (Object.keys(changeObj).length > 0) {
      changeFieldValue('photos', imgArray);
      changeFieldValue('coverPhoto', imgArray[0]);
    }
  };

  // FUCNTION FOR REAL DELETE
  const onConfirmDelete = (id) => {
    setBtnActive('delete');
    setConfirmDelete(id);
  };

  // CLICK OUTSIDE OF IMAGES
  OutsideElement(wrappImg, {
    id: confirmDelete || 0,
    action: 'function',
    func: () => { setConfirmDelete(null); },
  });

  const scrollToTopEdit = () => {
    const scrollEl = document.getElementsByClassName('hubDasContent')[0];
    if (scrollEl) {
      document.body.classList.add('scrollSmooth');
      setTimeout(() => {
        scrollEl.scrollTop = 10;
      }, 100);
    }
  };

  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">Photos</h3>
      <div className="photosWrapper dis-f">
        <div className="secondLevel dis-fl-col">
          <div className="dis-f backPanel hide-lg">
            <h5 className="sectionTitle">
              Photos
            </h5>
          </div>
          <div className={`boxCard mb-5 ${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'emptyMedia' : ''}`}>
            <div className={`${fixPhotos && fixPhotos.length > 0 ? 'uploadPanel dis-fl-col' : 'empty-state dis-fl-col a-c'}`}>
              {
                (fixPhotos && fixPhotos.length > 0) && (
                  <>
                    <ReactSortable
                      scroll
                      bubbleScroll
                      tag="ul"
                      className="image-list row-cols-2-gut-1 row-cols-lg-3-gut-1"
                      list={cloneDeep(fixPhotos).concat(newImages)}
                      setList={(order) => {
                        changeOrder(order);
                      }}
                    >
                      {
                        fixPhotos.map((item, i) => (
                          <li
                            className="cur-poi pos-r"
                            key={`pht_${i.toString()}`}
                            data-id={JSON.stringify(item)}
                          >
                            <div
                              className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h"
                              onClick={() => (windowDimensions.width < 1025 ? history.push(`/${propID}/property/photos/${item.id}/edit/photos`) : '')}
                            >
                              <div className="w-perc-100 square dis-fl-row imgConver" style={{ backgroundImage: `url(${item.tmpPath ? item.tmpPath : `${baseByData.shortPath}${item.galleryThumbnailPath}?${item.updatedAt}`})` }}>
                                <div
                                  className={`photo-action a-c hide dis-f-md ${confirmDelete === i ? 'show' : 'hoverShow'}`}
                                  ref={wrappImg.current[i]}
                                >
                                  <BrixelButtonSecondary
                                    rounded
                                    theme="red"
                                    rightIcon="bin"
                                    label="delete?"
                                    className={`${confirmDelete === i ? '' : 'hide'}`}
                                    onClick={() => deleteImage(item.id)}
                                    isLoading={isSmallLoading.deleteMedia && btnActive === 'delete'}
                                  />
                                  <BrixelButtonIcon
                                    ghost
                                    theme="red"
                                    icon="bin"
                                    className={`${confirmDelete === i ? 'hide' : ''}`}
                                    onClick={() => onConfirmDelete(i)}
                                  />
                                  <BrixelButtonIcon
                                    ghost
                                    icon="edit"
                                    className={`ml-1 ${confirmDelete === i ? 'hide' : ''}`}
                                    onClick={
                                      () => {
                                        history.push(`/${propID}/property/photos/${item.id}/edit/photos`);
                                        scrollToTopEdit();
                                      }
                                    }
                                  />
                                </div>
                                {
                                  i === 0 && (
                                    <div className="fixedActionsBtmRight">
                                      <BrixelIcon
                                        icon="star-fill"
                                        color="primary"
                                        saturationTxt={400}
                                        className="fSizePx24"
                                      />
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                            {
                              item.description && (
                                <p className="ta-l mt-1 fsize-200 txtDark700 w-prec-100">
                                  {Truncate(item.description, 60)}
                                </p>
                              )
                            }
                          </li>
                        ))
                      }
                      {
                        newImages.map((upImg, i) => (
                          <li
                            className="cur-poi pos-r"
                            key={(fixPhotos.length + i).toString()}
                            data-id={JSON.stringify(fixPhotos[0])}
                          >
                            {
                              isSmallLoading.uploadMedia && (
                                <div
                                  className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h"
                                >
                                  <div className="perc-r w-perc-100 square dis-fl-row imgConver" style={{ backgroundImage: `url(${upImg.galleryThumbnailPath})` }} />
                                </div>
                              )
                            }
                          </li>
                        ))
                      }
                    </ReactSortable>
                  </>
                )
              }
              <>
                <div
                  className={`${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-lg-3'} upload-container dis-fl-col a-c mt-2 ta-c`}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {
                    (!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) && (
                      <div className="dis-fl-col">
                        <img className="h-fix-120" src={uploadPhotosEmpty} alt="Empty State" />
                        <h5 className="mt-3 mb-2">Upload your first photo</h5>
                      </div>
                    )
                  }
                  <span className="body2 txtDark200 max-width-220">Choose .jpeg .png with max. 10 MB size</span>
                  <BrixelButtonPrimary
                    label="upload"
                    rightIcon="upload"
                    rounded
                    className="mt-3"
                    isLoading={isSmallLoading.uploadMedia}
                  />
                </div>
              </>
            </div>
          </div>

          <BrixelUpgradeMessage
            unlockFunction={false}
            title="Do you want to capture your property in its best possible light?"
            description="High-quality photos help you to stand out in the market. Request a free on-site appointment by one of our experts to get a free photo shooting."
            btnLabel="Request photo shoot"
            redirectUrl={`/${activeSingleProperty.id}/trialRequest`}
            trialRequest
          />

        </div>
        <Routes>
          <Route
            path="/:imgId/edit/:editType"
            element={<DetailMedia />}
          />
          <Route path="*" element={null} />
        </Routes>
      </div>
    </>
  );
};

Photos.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleDeleteImg: PropTypes.func.isRequired,
  handleMultiUploadImg: PropTypes.func.isRequired,
  imageType: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  imageType: get(state, 'images.imageType', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser', { }),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleDeleteImg: bindActionCreators(deleteImg, dispatch),
  handleUploadImg: bindActionCreators(uploadImg, dispatch),
  handleMultiUploadImg: bindActionCreators(multiUploadImg, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Photos);
