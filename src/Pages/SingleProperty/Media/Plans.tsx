import React, {useEffect, useRef, useState} from 'react';
import {Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {useDropzone} from 'react-dropzone';
import get from 'lodash/get';
import {BrixelButtonIcon, BrixelButtonSecondary, useOutsideAlerter} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {change} from '@brixel/brixel-components/dist/form';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {ReactSortable} from 'react-sortablejs';
import cloneDeep from 'lodash/cloneDeep';
import {diff} from 'deep-object-diff';
import {deleteImg, multiUploadImg, uploadImg} from '../../../actions/UploadActions';
import DetailMedia from './DetailMedia';
import uploadFloorPlansEmpty from '../../../images/Upload/upload_floorPlans_empty.svg';
import {checkBrowser, tobase64Handler, Truncate} from '../../../utils/helpers';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';
import type {FloorPlansPageType} from '../../../@types/Pages/SingleProperty/Media/Plans';
import {PhotosType} from '@brixel/brixel-components/dist/@types/Model';

const Plans = (props: FloorPlansPageType) => {
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
  const [fixPhotos, setFixPhotos] = useState<PhotosType[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [btnActive, setBtnActive] = useState<string>();
  const [newImages, setNewImages] = useState<PhotosType[]>([]);
  const [isReady, setIsReady] = useState(false);
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  // REF
  // eslint-disable-next-line no-unused-vars
  const arrayImg = [...Array(floorPlans ? floorPlans.length : 0)].map(() => React.createRef());
  const wrappImg = useRef(arrayImg) as any;

  // COMPARE FLOOR PLANS AND fixPhotos TO ADD THE PREVIEW FLOOR PLANS ON UPLOADING
  useEffect(() => {
    if (floorPlans && Object.keys(diff(floorPlans, fixPhotos)).length > 0 && !isSmallLoading.uploadMedia) {
      setNewImages([]);
      setConfirmDelete(null);
      setBtnActive(undefined);
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
  const onDrop = acceptedFiles => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    // eslint-disable-next-line no-console
    reader.onabort = () => console.log('file reading was aborted');
    // eslint-disable-next-line no-console
    reader.onerror = () => console.log('file reading has failed');
    setBtnActive('uploading');
    const imgType = imageType.find((val) => val.name === 'Gallery');
    if (imgType) {
      const imgList = tobase64Handler(acceptedFiles, get(loggedInUser, 'user.id', ''), 'floorPlans', formValue.id, imgType.id);
      imgList.then((res) => {
        handleMultiUploadImg({
          allImgs: res,
          actions: 'floorPlans',
          pageID: formValue.id || propID,
          smallLoader: 'uploadMedia',
        });
      });
    }
  };

  // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    minSize: 0,
    maxSize: 1e+7,
  });

  // ORDER FLOOR PLANS SETTINGS
  const changeOrder = (order) => {
    const imgArray: object[] = [];
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
                {(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (
                  <span className='mb-3 mb-md-5 txtRed400'>{translateTo('You have uploaded 0 plans.', lang)}</span>
                )}
                <div className={`boxCard mb-5 ${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyMedia' : ''}`}>

                  <div className={`${fixPhotos && fixPhotos.length > 0 ? 'uploadPanel dis-fl-col' : 'empty-state dis-fl-col a-c'}`}>
                    <>
                      {
                        (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? ('') : (
                          <>
                            <p className='fweight-600'>{translateTo('Drag to move and reorder photos', lang)} </p>
                            <p className='fsize-300 txtText400 mb-2'>{translateTo('Drag to move and reorder photos', lang)} </p>
                          </>
                        )
                      }
                      <div
                        className={`${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyState' : 'hasImages bgGreen50 mb-3 py-2'} upload-container dis-fl-col a-c ta-c`}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <div className={`dis-fl-col ${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'max-w-fix-304' : ''}`}>
                          {
                            isSmallLoading.uploadMedia ? (
                              <>
                                <div className={`${!fixPhotos || (fixPhotos && fixPhotos.length === 0) ? 'h-fix-128' : 'h-fix-64'} dis-f a-c`}>
                                  <div className='loaderX ml-a mr-a'>
                                    <div className='loader-wheel'></div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <img loading="lazy" className={!fixPhotos || (fixPhotos && fixPhotos.length === 0) ? 'h-fix-128' : 'h-fix-64'} src={uploadFloorPlansEmpty} alt="Empty State" />
                              </>
                            )
                          }


                          <p className="mt-2 txtGreen400">
                            <span className='td-u fweight-500'>{translateTo('Click to upload', lang)} </span>
                            {(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (<span>{translateTo('your first plans ', lang)}</span>)}
                            <span>{translateTo('or drag and drop.', lang)}</span>
                          </p>
                          {(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (<span className='brdSmallTop brdText200 w-fix-104 my-2 ml-a mr-a'></span>)}

                          <span className="fsize-300 txtText400 max-width-304">{translateTo('Choose .jpeg .png with max. 10 MB size', lang)}</span>
                        </div>
                      </div>
                    </>
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
                                      <p className="ta-l mt-1 fsize-200 txtText900 w-prec-100">
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
)(Plans);
