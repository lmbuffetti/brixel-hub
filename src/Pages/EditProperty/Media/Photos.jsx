/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { diff } from 'deep-object-diff';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import {
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
import upload_photos_empty from '../../../images/Upload/upload_photos_empty.svg';
import OutsideElement from '../../../components/OutsideElement';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Photos = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleMultiUploadImg,
    handleDeleteImg,
    history,
    imageType,
    isSmallLoading,
    loggedInUser,
    match,
    windowDimensions,
  } = props;
  const { photos } = formValue;
  // STATE
  const [fixPhotos, setFixPhotos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [btnActive, setBtnActive] = useState(null);
  const [newImages, setNewImages] = useState([]);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  // REF
  const arrayImg = [...Array(photos ? photos.length : 0)].map((_, index) => React.createRef());
  const wrappImg = useRef(arrayImg);

  useEffect(() => {
    //setNewImages([]);
    if (Object.keys(diff(photos, fixPhotos)).length > 0 && !isSmallLoading) {
      setNewImages([]);
      setConfirmDelete(null);
      setBtnActive(null);
      setFixPhotos(cloneDeep(photos));
    }
  });

  const deleteImage = (id) => {
    const propID = get(match, 'params.propId', null);
    const mediaID = id;
    const data = {
      id: mediaID,
      pageID: propID,
      type: 'photos',
    };
    // eslint-disable-next-line no-alert
    handleDeleteImg(data);
    history.push(`/${propID}/property/photos`)
  };

  // DROPZONE SETTINGS
  // const dropzoneRef = useRef(null);
  const onDrop = useCallback(async (acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    setBtnActive('uploading');
    const imgType = imageType.find((val) => val.name === 'Gallery');
    const imgList = tobase64Handler(
      acceptedFiles,
      loggedInUser.user.id,
      'photos',
      formValue.id,
      imgType.id
    );
    imgList.then((res, i) => {
      handleMultiUploadImg({
        allImgs: res,
        actions: 'photos',
        pageID: formValue.id,
        smallLoader: 'upload'
      });
      // arrayDates.push({galleryThumbnailPath: res, createdAt: Date().now});
      // setNewImages([...arrayDates]);
      // handleUploadImg(binaryStr);
    });
  }, []);

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

  const onConfirmDelete = (id) => {
    setBtnActive('delete');
    setConfirmDelete(id);
  };

  OutsideElement(wrappImg, {
    id: confirmDelete || 0,
    action: 'function',
    func: () => { setConfirmDelete(null) },
  });

  return (
    <div className="photosWrapper dis-f">
      <div className="secondLevel dis-fl-col">
        <div className={`${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'emptyMedia' : ''}`}>
          <div className="dis-f jc-b a-c mb-3">
            <BrixelButtonIcon
              className="shadow-3dp hide-md"
              icon="arrow-simple-left"
              background="White"
              color="primary"
              saturationTxt={400}
              noBorder
              onClick={() => history.push(`/${propID}/property`)}
            />
            <h5 className="m-a m-md-0 sectionTitle">
              Photos
            </h5>
          </div>
          <div className={`${fixPhotos && fixPhotos.length > 0 ? 'uploadPanel dis-fl-col' : 'empty-state dis-fl-col a-c'}`}>
            {
              (fixPhotos && fixPhotos.length > 0) && (
                <>
                  <ReactSortable
                    scroll={true}
                    bubbleScroll={true}
                    tag="ul"
                    className="image-list row-cols-2-gut-1 row-cols-md-3-gut-1"
                    list={cloneDeep(fixPhotos).concat(newImages)}
                    setList={(order, evt) => {
                      changeOrder(order);
                    }}
                  >
                    {
                      fixPhotos.map((item, i) => (
                        <li
                          className="cur-poi pos-r"
                          key={i.toString()}
                          data-id={JSON.stringify(item)}
                          onClick={() => windowDimensions.width < 1025 ? history.push(`/${propID}/property/photos/${item.id}/edit/photos`) : ''}
                        >
                          <div
                            className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h"
                          >
                            <div className="w-perc-100 square dis-fl-row imgConver" style={{ backgroundImage: `url(${item.tmpPath ? item.tmpPath : `${baseByData.shortPath}${item.galleryThumbnailPath}?${item.updatedAt}`})` }}>
                              <div
                                className={`photo-action a-c hide dis-f-md ${confirmDelete === i ? 'show' : 'hoverShow'}`}
                                ref={wrappImg.current[i]}
                              >
                                <BrixelButtonSecondary
                                  rounded
                                  color="red"
                                  saturation={400}
                                  saturationTxt={400}
                                  rightIcon="bin"
                                  label="delete?"
                                  className={`shadow-2dp ${confirmDelete === i ? '' : 'hide'}`}
                                  onClick={() => deleteImage(item.id)}
                                  isLoading={isSmallLoading && btnActive === 'delete'}
                                />
                                <BrixelButtonIcon
                                  background="white"
                                  saturation={0}
                                  color="red"
                                  saturationTxt={400}
                                  noBorder4
                                  icon="bin"
                                  className={`shadow-2dp ${confirmDelete === i ? 'hide' : ''}`}
                                  onClick={() => onConfirmDelete(i)}
                                />
                                <BrixelButtonIcon
                                  background="white"
                                  saturation={0}
                                  color="primary"
                                  saturationTxt={400}
                                  noBorder
                                  icon="edit"
                                  className={`shadow-2dp ml-1 ${confirmDelete === i ? 'hide' : ''}`}
                                  onClick={() => history.push(`/${propID}/property/photos/${item.id}/edit/photos`)}
                                />
                              </div>
                              {
                                i === 0 && (
                                  <div className="fixedActionsBtmRight">
                                    <BrixelIcon
                                      icon={'star-fill'}
                                      color={'primary'}
                                      saturationTxt={400}
                                      className={'fSizePx24'}
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
                            isSmallLoading && (
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
                className={`${(!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-md-3'} upload-container dis-fl-col a-c mt-2 ta-c`}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {
                  (!fixPhotos || (isArray(fixPhotos) && fixPhotos.length === 0)) && (
                    <div className="dis-fl-col">
                      <img className="h-fix-120" src={upload_photos_empty} alt="Empty State" />
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
                  isLoading={isSmallLoading === 'upload'}
                />
              </div>
            </>
          </div>
        </div>
        {
          get(activeSingleProperty, 'servicePackages', []).length === 0 && (
            <BrixelUpgradeMessage
              className="mt-3"
              title="Do you want professional photos?"
              description="Hight quality photos and much more is part of Brixel Premium."
            />
          )
        }

      </div>
      <Route path="/:propId?/property/photos/:imgId/edit/:editType" exact component={DetailMedia} />
    </div>
  );
};

Photos.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleDeleteImg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  imageType: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSmallLoading: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Photos.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  imageType:  get(state, 'image.imageType', []),
  percentage: get(state, 'common.percentage', 0),
  loggedInUser: get(state, 'user.loggedInUser', null),
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Photos);
