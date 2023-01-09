/* eslint-disable max-len */
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { change } from '@brixel/brixel-components/dist/form';
import { diff } from 'deep-object-diff';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import PropTypes from 'prop-types';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { bindActionCreators, compose } from 'redux';
import { deleteImg, multiUploadImg, uploadImg } from '../../../actions/UploadActions';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';
import uploadFloorPlansEmpty from '../../../images/Upload/upload_floorPlans_empty.svg';
import { checkBrowser, tobase64Handler, Truncate } from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
import DetailMedia from './DetailMedia';

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
    handleDeleteImg,
    handleMultiUploadImg,
    imageType,
    isSmallLoading,
    lang,
    loggedInUser,
    windowDimensions,
  } = props;
  const { floorPlans } = formValue;
  // STATE
  const [fixPhotos, setFixPhotos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [btnActive, setBtnActive] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [isReady, setIsReady] = useState(false);
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  // REF
  // eslint-disable-next-line no-unused-vars
  const arrayImg = [...Array(floorPlans ? floorPlans.length : 0)].map((_, index) => React.createRef());
  const wrappImg = useRef(arrayImg);

  // COMPARE FLOOR PLANS AND fixPhotos TO ADD THE PREVIEW FLOOR PLANS ON UPLOADING
  useEffect(() => {
    if (Object.keys(diff(floorPlans, fixPhotos)).length > 0 && !isSmallLoading.uploadMedia) {
      setNewImages([]);
      setConfirmDelete(null);
      setBtnActive(null);
      setFixPhotos(floorPlans ? cloneDeep(floorPlans) : []);
    }
  }, [floorPlans, isSmallLoading]);

  // FUNCTION TO DELETE FLOOR PLAN
  const deleteImage = (id) => {
    const mediaID = id;
    const data = {
      id: mediaID,
      pageID: propID,
      type: 'floorPlans',
      smallLoader: 'deleteMedia',
    };
    // eslint-disable-next-line no-alert
    handleDeleteImg(data);
    history.push(`/${propID}/property/floorPlans`);
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
    const imgList = tobase64Handler(acceptedFiles, loggedInUser.user.id, 'floorPlans', formValue.id, imgType.id);
    imgList.then((res) => {
      handleMultiUploadImg({
        allImgs: res,
        actions: 'floorPlans',
        pageID: formValue.id || propID,
        smallLoader: 'uploadMedia',
      });
    });
  }, []);

  // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/png,image/jpg,image/jpeg,application/pdf',
    minSize: 0,
    maxSize: 1e+7,
  });

  // ORDER FLOOR PLANS SETTINGS
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
    changeFieldValue('floorPlans', imgArray);
  };

  // FUCNTION FOR REAL DELETE
  const onConfirmDelete = (id) => {
    setBtnActive('delete');
    setConfirmDelete(id);
  };

  // CLICK OUTSIDE OF IMAGES
  useOutsideAlerter(wrappImg, {
    id: confirmDelete || 0,
    action: 'function',
    func: () => { setConfirmDelete(null); },
  });

  const scrollToTopEdit = () => {
    const scrollEl = document.getElementsByClassName('hubDasContent')[0];
    if (checkBrowser() > 0 && scrollEl) {
      scrollEl.scrollTop = 0;
    } else if (scrollEl) {
      scrollEl.scrollTo({ top: 10, behavior: 'smooth' });
    }
  };

  setTimeout(() => {setIsReady(true)}, 200);

  return (
    <>
      {
        isReady ? (
          <>
            <h3 className="mb-3 hide dis-b-lg">{translateTo('Floor Plans', lang)}</h3>
            <div className="plansWrapper dis-f">
              <div className="secondLevel dis-fl-col">
                <div className="dis-f backPanel hide-lg">
                  <h5 className="sectionTitle">
                    {translateTo('Floor Plans', lang)}
                  </h5>
                </div>
                <div className={`boxCard mb-5 ${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyMedia' : ''}`}>

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
                                  key={`fixPht_${i.toString()}`}
                                  data-id={JSON.stringify(item)}
                                >
                                  <div
                                    className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h"
                                    onClick={() => (windowDimensions.width < 1025 ? history.push(`/${propID}/property/floorPlans/${item.id}/edit/floorPlans`) : '')}
                                  >
                                    <div
                                      className="w-perc-100 square dis-fl-row imgConver"
                                      style={{ backgroundImage: `url(${item.tmpPath ? item.tmpPath : `${baseByData.shortPath}${item.galleryThumbnailPath}?${item.updatedAt}`})` }}
                                    >
                                      <div
                                        className={`photo-action a-c hide dis-f-md ${confirmDelete === i ? 'show' : 'hoverShow'}`}
                                        ref={wrappImg.current[i]}
                                      >
                                        <BrixelButtonSecondary
                                          rounded
                                          theme="red"
                                          rightIcon="bin"
                                          label={translateTo('delete?', lang)}
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
                                              history.push(`/${propID}/property/floorPlans/${item.id}/edit/floorPlans`);
                                              scrollToTopEdit();
                                            }
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    item.description && (
                                      <p className="ta-l mt-1 fsize-200 txtDark700 w-prec-100">
                                        {translateTo(Truncate(item.description, 60), lang)}
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
                        className={`${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-lg-3'} upload-container dis-fl-col a-c mt-2 ta-c`}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {
                          (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (
                            <div>
                              <img loading="lazy" className="w-perc-100 h-fix-120" src={uploadFloorPlansEmpty} alt="Empty State" />
                              <h5 className="mt-3 mb-2">{translateTo('Upload your floor Plans', lang)}</h5>
                            </div>
                          )
                        }
                        <span className="body2 txtDark200 max-width-220">{translateTo('Choose .jpeg .png .pdf with max. 10 MB size', lang)}</span>
                        <BrixelButtonPrimary
                          rounded
                          label={translateTo('upload', lang)}
                          rightIcon="upload"
                          className="mt-3"
                          isLoading={isSmallLoading.uploadMedia}
                        />
                      </div>
                    </>
                  </div>
                </div>

                {
                  get(activeSingleProperty, 'servicePackages', []).length === 0 && (
                    <BrixelUpgradeMessage
                      lang={lang}
                      unlockFunction={false}
                      title={translateTo('You don\'t have a plan?', lang)}
                      description={translateTo('Accurate floor plans are important for your potential buyers. Request a free photo shooting by one of our experts to get your own plan.', lang)}
                      btnLabel={translateTo('Request photo shoot', lang)}
                      redirectUrl={`/${activeSingleProperty.id}/trialRequest`}
                      trialRequest
                    />
                  )
                }
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
        ) : (
          <div className="secondLevel dis-fl-col">
            <div className="max-w-fix-1024 mt-10 pt-1 pt-lg-0 mt-lg-0 h-perc-100">
              <p className="h-fix-24 h-fix-lg-40 mb-3 skeletonBg w-perc-15"> </p>
              <div className='w-perc-100 brdRadius skeletonBg h-fix-400'/>
              <div className='w-perc-100 mt-5 brdRadius skeletonBg h-fix-296'/>
            </div>
          </div>
        )
      }
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
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  imageType: get(state, 'images.imageType', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
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
