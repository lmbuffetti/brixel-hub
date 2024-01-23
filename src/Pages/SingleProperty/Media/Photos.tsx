import React, {useEffect, useRef, useState} from 'react';
import {Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {useDropzone} from 'react-dropzone';
import {diff} from 'deep-object-diff';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import {BrixelButtonIcon, BrixelButtonSecondary, BrixelIcon} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {change} from '@brixel-io/brixel-components/dist/form';
import {ReactSortable} from 'react-sortablejs';
import SectionMobileTitle from '../../../components/SectionMobileTitle';
import {deleteDocument, deleteImg, reorderImages} from '../../../actions/UploadActions';
import DetailMedia from './DetailMedia';
import {Truncate} from '../../../utils/helpers';
import uploadPhotosEmpty from '../../../images/Upload/upload_photos_empty.svg';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';
import {PhotosType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {PhotosPageType} from '../../../@types/Pages/SingleProperty/Media/Photos';
import getUrlImg from '@brixel-io/brixel-components/dist/utils/ImageUrl';
import multiUpload from '@brixel-io/brixel-components/dist/helpers/uploads/MultiUpload';
import {spinnerSmall} from '../../../actions/CommonActions';

const Photos = (props: PhotosPageType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    changeFieldValue,
    handleChangeOrder,
    formValue,
    handleDeleteImg,
    handleGetActiveSingleProperty,
    handleSpinnerSmall,
    isSmallLoading,
    lang,
    windowDimensions,
  } = props;
  const { photos } = formValue;
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
  const arrayImg = [...Array(photos ? photos.length : 0)].map(() => React.createRef());
  const wrappImg = useRef(arrayImg) as any;

  useEffect(() => () => document.body.classList.remove('scrollSmooth'));

  // COMPARE IMAGES AND fixPhotos TO ADD THE PREVIEW IMAGES ON UPLOADING
  useEffect(() => {
    // setNewImages([]);
    if (photos && Object.keys(diff(photos, fixPhotos)).length > 0 && !isSmallLoading.uploadMedia) {
      setNewImages([]);
      setConfirmDelete(null);
      setBtnActive(undefined);
      const defPhotos = (photos ? cloneDeep(photos) : []);
      setFixPhotos(defPhotos);
    }
  }, [photos, isSmallLoading]);

  // FUNCTION TO DELETE IMAGE
  const deleteImage = (e, id) => {
    if (e) e.preventDefault();
    const data = {
      photoID: id,
      pageID: get(activeSingleProperty, 'id'),
      type: 'image',
    };
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this item?')) {
      handleDeleteImg(data);
    }
  };

  // DROPZONE SETTINGS
  const onDrop = async (acceptedFiles) => {
    if (activeSingleProperty.id) {
      handleSpinnerSmall({uploadMedia: true});
      multiUpload(acceptedFiles, 'pageImage', {pageID: activeSingleProperty.id, companyID: activeSingleCompany.id})
        .then(() => {
          handleGetActiveSingleProperty({
            id: activeSingleProperty.id,
            smallLoader: 'uploadMedia',
          });
        })
    }
  };

  // DROPZONE SETTINGS - SUPPORTED EXTENSIONS AND MAX SIZE AND OTHER SETTINGS
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
    },
    minSize: 0,
    maxSize: 1e+7,
  });

  // ORDER IMAGE SETTINGS
  const changeOrder = (order) => {
    const imgArray: PhotosType[] = [];
    // eslint-disable-next-line array-callback-return
    order.map((item) => {
      if (item.createdAt) {
        delete item.chosen;
        delete item.selected;
        imgArray.push(item);
      }
      return null;
    });

    // It means the drag and drop changed the cover photo
    if (imgArray[0].id || '' !== (photos && photos[0].id)) {
      changeFieldValue('coverPhoto', imgArray[0]);
    }
    if (formValue.photos) {
      const idPhotos = imgArray.map((item) => item.id);
      const idOriginalPhotos = formValue.photos.map((item) => item.id);
      const difference = idOriginalPhotos.toString() !== idPhotos.toString();
      if (difference) {
        changeFieldValue('photos', imgArray);
        const data = {
          pageID: activeSingleProperty.id,
          type: 'image',
          data: {
            imageIds: idPhotos,
          },
          smallLoader: 'reorderImg',
        }
        handleChangeOrder(data);
      }
    }
  };

  // FUCNTION FOR REAL DELETE
  const onConfirmDelete = (id) => {
    setBtnActive('delete');
    setConfirmDelete(id);
  };

  const scrollToTopEdit = () => {
    const scrollEl = document.getElementsByClassName('hubDasContent')[0];
    if (scrollEl) {
      document.body.classList.add('scrollSmooth');
      setTimeout(() => {
        scrollEl.scrollTop = 10;
      }, 100);
    }
  };

  setTimeout(() => {setIsReady(true)}, 200);

  return (
    <>
      {
        isReady ? (
          <>
            <h3 className="mb-3 hide dis-b-lg">{translateTo('Photos', lang)}</h3>
            <div className="photosWrapper dis-f">
              <div className="secondLevel dis-fl-col">
                <SectionMobileTitle
                  title="Photos"
                />
                {(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) && (
                  <span className='mb-3 mb-md-5 txtRed400'>{translateTo('You have uploaded 0 photos.', lang)} </span>
                )}
                <div className={`boxCard mb-5 ${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'emptyMedia' : ''}`}>
                  <div className={`${fixPhotos && fixPhotos.length > 0 ? 'uploadPanel dis-fl-col' : 'empty-state dis-fl-col a-c'}`}>
                    {
                      (!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? ('') : (
                        <>
                          <p className='fweight-600'>{translateTo('Drag the files to move and rearrange', lang)} </p>
                          <p className='fsize-300 txtText400 mb-2'>{translateTo('Choose the order you like', lang)} </p>
                        </>
                      )
                    }

                    <div
                      className={`${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'emptyState' : 'hasImages bgGreen50 mb-3 py-2'} upload-container dis-fl-col a-c ta-c`}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />

                      <div className={`dis-fl-col ${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'max-w-fix-304' : ''}`}>

                        {
                          isSmallLoading.uploadMedia ? (
                            <>
                              <div className={`${!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0) ? 'h-fix-128' : 'h-fix-64'} dis-f a-c`}>
                                <div className='loaderX ml-a mr-a'>
                                  <div className='loader-wheel'></div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <img loading="lazy" className={!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0) ? 'h-fix-128' : 'h-fix-64'} src={uploadPhotosEmpty} alt="Empty State" />
                            </>
                          )
                        }


                        <p className="mt-2 txtGreen400">
                          <span className='td-u fweight-500'>{translateTo('Click to upload', lang)}</span>
                          <span> {translateTo('or drag and drop files here', lang)}</span>
                          {/* {(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) && (<span>{translateTo('your first photos ', lang)}</span>)} */}
                        </p>
                        {(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) && (<span className='brdSmallTop brdText100 w-fix-104 my-2 ml-a mr-a'></span>)}

                        <span className="fsize-300 txtText400 max-width-304">{translateTo('Formats .jpeg or .png with a maximum of 10 MB', lang)}</span>
                      </div>

                    </div>

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
                              fixPhotos.filter((img) => img.url).map((item, i) => (
                                <li
                                  className="cur-poi pos-r"
                                  key={`pht_${i.toString()}`}
                                >
                                  <div
                                    className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h"
                                    onClick={() => (windowDimensions.width < 1025 ? history.push(`/${propID}/property/photos/${item.id}/edit/photos`) : '')}
                                  >
                                    <div
                                      className="w-perc-100 square dis-fl-row imgConver"
                                      style={{ backgroundImage: `url(${getUrlImg(item.url, {size: 'M'})})`}}
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
                                          onClick={(e) => deleteImage(e, item.id)}
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
                                      <p className="ta-l mt-1 fsize-200 txtText900 w-prec-100">
                                        {translateTo(Truncate(item.description, 60), lang)}
                                      </p>
                                    )
                                  }
                                </li>
                              ))
                            }
                            {
                              newImages.filter((img) => img.url).map((upImg, i) => (
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
                                        <div className="perc-r w-perc-100 square dis-fl-row imgConver" style={{ backgroundImage: `url(${upImg.url})` }} />
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

                <BrixelUpgradeMessage
                  lang={lang}
                  unlockFunction={false}
                  title={translateTo('Do you want to capture your property in its best possible light?', lang)}
                  description={translateTo('High-quality photos help you to stand out in the market. Request a free on-site appointment by one of our experts to get a free photo shooting.', lang)}
                  btnLabel={translateTo('Request photo shoot', lang)}
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
  activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
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
  handleChangeOrder: bindActionCreators(reorderImages, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleSpinnerSmall: bindActionCreators(spinnerSmall, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Photos);
