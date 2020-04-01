/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import get from 'lodash/get';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { ReactSortable } from 'react-sortablejs';
import { deleteImg, uploadImg } from '../../../actions/UploadActions';
import DetailMedia from './DetailMedia';
import upload_photos_empty from '../../../images/Upload/upload_photos_empty.svg'

const Photos = (props) => {
  // PROPS
  const {
    changeFieldValue,
    formValue,
    handleUploadImg,
    handleDeleteImg,
    history,
    loggedInUser,
    match,
  } = props;
  const { photos } = formValue;
  // STATE
  const [fixPhotos, setFixPhotos] = useState([]);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  useEffect(() => {
    setFixPhotos(photos);
  }, [photos]);

  const deleteImage = (id) => {
    const propID = get(match, 'params.propId', null);
    const mediaID = id;
    const data = {
      id: mediaID,
      pageID: propID,
      type: 'photos',
    };
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this item?')) {
      handleDeleteImg(data);
    }
  };

  // DROPZONE SETTINGS
  // const dropzoneRef = useRef(null);
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    // const imgType = imageType.find((val) => val.name === 'Gallery');
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
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
          uploadAction: 'photos',
        };
        handleUploadImg(binaryStr);
      };
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
    changeFieldValue('photos', imgArray);
  };

  return (
    <div className="dis-f h-perc-100">
      <div className="secondLevel dis-fl-col">
        <div className="photosWrapper max-h-perc-100 ov-a">
          <div className="dis-fl-row jc-b a-c">
            <h5>
              Photos
            </h5>

          </div>

          <div className={`${fixPhotos && fixPhotos.length > 0 ? 'dis-fl-col' : 'dis-fl-col empty-state a-c'}`}>
            {
              (fixPhotos && fixPhotos.length > 0) && (
                <>
                  <ReactSortable
                    tag="ul"
                    className="image-list row-cols-3-gut-1"
                    list={fixPhotos}
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
                            className="square media-image-container dis-fl-row a-c jc-b w-perc-100 shadow-2dp"
                          >
                            <div className="w-perc-100 square dis-fl-row imgConver" style={{ backgroundImage: `url(${item.tmpPath ? item.tmpPath : `${baseByData.shortPath}${item.galleryThumbnailPath}?${item.updatedAt}`})` }}>
                              <div className="photo-action dis-f a-c">
                                <BrixelButtonIcon
                                  background="white"
                                  saturation={0}
                                  color="red"
                                  saturationTxt={400}
                                  noBorder
                                  icon="bin"
                                  className="shadow-2dp"
                                  onClick={() => deleteImage(item.id)}
                                />
                                <BrixelButtonIcon
                                  background="white"
                                  saturation={0}
                                  color="primary"
                                  saturationTxt={400}
                                  noBorder
                                  icon="edit"
                                  className="shadow-2dp ml-1"
                                  onClick={() => history.push(`/${propID}/property/photos/${item.id}/edit/photos`)}
                                />
                              </div>
                              {
                                item.id === get(formValue, 'coverPhoto.id', null) && (
                                  <div className="fixedActionsBtmRight">
                                    <div className="brdRadius bgWhite txtPrimary400 px-1 body2 brdSmall brdPrimary400">Cover</div>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                          <p className="ta-l mt-1 body2 w-prec-100">{item.description}</p>
                        </li>
                      ))
                    }
                  </ReactSortable>
                </>
              )
            }
            <>
              <div
                className={`${(!fixPhotos || (fixPhotos && fixPhotos.length === 0)) ? 'emptyState' : 'hasImages'} upload-container dis-fl-col a-c mb-5 max-w-fix-600 max-h-fix-400 p-8 mt-3`}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {
                  (!fixPhotos || (fixPhotos && fixPhotos.length === 0)) && (
                    <div>
                      <img src={upload_photos_empty} alt="Empty State" />
                      <h5 className="mt-2 mb-1">Uplaod your fist photo</h5>
                    </div>
                  )
                }
                <span>Choose .pdf .jpeg .png with max. 10 MB size</span>
                <BrixelButtonPrimary
                  label="upload"
                  rightIcon="upload"
                  rounded
                  className="mt-3"
                />
              </div>
            </>
          </div>
        </div>
      </div>
      <Route path="/:propId?/property/photos/:imgId/edit/:editType" exact component={DetailMedia} />
    </div>
  );
};

Photos.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleDeleteImg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Photos.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
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
