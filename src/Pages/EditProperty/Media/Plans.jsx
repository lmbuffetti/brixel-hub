/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import get from 'lodash/get';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { ReactSortable } from 'react-sortablejs';
import { deleteImg, uploadImg } from '../../../actions/UploadActions';
import DetailMedia from './DetailMedia';
import upload_floorPlans_empty from '../../../images/Upload/upload_floorPlans_empty.svg';
import cloneDeep from 'lodash/cloneDeep';
import OutsideElement from '../../../components/OutsideElement';
import { Truncate } from '../../../utils/helpers';
import { diff } from 'deep-object-diff';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Photos = (props) => {
  // PROPS
  const {
    changeFieldValue,
    formValue,
    handleUploadImg,
    handleDeleteImg,
    history,
    isSmallLoading,
    loggedInUser,
    match,
  } = props;
  const { floorPlans } = formValue;
  // STATE
  const [fixPhotos, setFixPhotos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [btnActive, setBtnActive] = useState(null);
  const [newImages, setNewImages] = useState([]);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  // REF
  const arrayImg = [...Array(floorPlans ? floorPlans.length : 0)].map((_, index) => React.createRef());
  const wrappImg = useRef(arrayImg);

  useEffect(() => {
    if (Object.keys(diff(floorPlans, fixPhotos)).length > 0 && !isSmallLoading) {
      setNewImages([]);
      setConfirmDelete(null);
      setBtnActive(null);
      setFixPhotos(floorPlans ? cloneDeep(floorPlans) : []);
    }
  });

  const deleteImage = (id) => {
    const propID = get(match, 'params.propId', null);
    const mediaID = id;
    const data = {
      id: mediaID,
      pageID: propID,
      type: 'floorPlans',
      smallLoader: true,
    };
    // eslint-disable-next-line no-alert
    handleDeleteImg(data);
    history.push(`/${propID}/property/floorPlans`)
  };

  // DROPZONE SETTINGS
  // const dropzoneRef = useRef(null);
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    const arrayDates = [];
    setBtnActive('uploading');
    acceptedFiles.forEach((file) => {
      const read = new FileReader();
      read.readAsDataURL(file);
      read.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = {
          name: Date.now() / 1000,
          file: read.result,
          user: loggedInUser.user.id,
          imageType: 0,
          pageID: formValue.id,
          uploadAction: 'floorPlans',
          smallLoader: true,
        };
        arrayDates.push({galleryThumbnailPath: read.result, createdAt: Date().now});
        setNewImages([...arrayDates]);
        handleUploadImg(binaryStr);
      };
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
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
    changeFieldValue('floorPlans', imgArray);
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
    <div className="plansWrapper dis-f">
      <div className="secondLevel dis-fl-col ">
        <div>
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
            <h5 className="m-a m-md-0">
              Floor Plans
            </h5>
          </div>

          <div className={`${fixPhotos && fixPhotos.length > 0 ? 'uploadPanel' : 'empty-state dis-fl-col a-c'}`}>
            {
              (fixPhotos && fixPhotos.length > 0) && (
                <>
                  <ReactSortable
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
                        >
                          <div
                            className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp brdRadius ov-h"
                          >
                            <div
                              className="w-perc-100 square dis-fl-row imgConver" style={{ backgroundImage: `url(${item.tmpPath ? item.tmpPath : `${baseByData.shortPath}${item.galleryThumbnailPath}?${item.updatedAt}`})` }}
                            >
                              <div
                                className={`photo-action dis-f a-c ${confirmDelete === i ? 'show' : 'hoverShow'}`}
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
                                  onClick={() => history.push(`/${propID}/property/floorPlans/${item.id}/edit/floorPlans`)}
                                />
                              </div>
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
                className={`${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyState mb-5' : 'hasImages py-2 py-md-3'} upload-container dis-fl-col a-c mt-3 ta-c`}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {
                  (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (
                    <div>
                      <img src={upload_floorPlans_empty} alt="Empty State" />
                      <h5 className="mt-2 mb-1">Upload your floor Plans</h5>
                    </div>
                  )
                }
                <span className="body2 txtDark200 max-width-220">Choose .pdf .jpeg .png with max. 10 MB size</span>
                <BrixelButtonPrimary
                  rounded
                  label="upload"
                  rightIcon="upload"
                  className="mt-3"
                  isLoading={isSmallLoading && btnActive === 'uploading'}
                />
              </div>
            </>
          </div>
        </div>

        <BrixelUpgradeMessage
          className="mt-3"
          title="You don’t have a plan?"
          description="Accurate floor plans and much more is part of Brixel Premium."
        />

      </div>
      <Route path="/:propId?/property/floorPlans/:imgId/edit/:editType" exact component={DetailMedia} />
    </div>
  );
};

Photos.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleDeleteImg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Photos.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
  loggedInUser: get(state, 'user.loggedInUser', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleDeleteImg: bindActionCreators(deleteImg, dispatch),
  handleUploadImg: bindActionCreators(uploadImg, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Photos);
