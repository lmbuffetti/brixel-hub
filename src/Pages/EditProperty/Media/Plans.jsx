/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import Dropzone, { useDropzone } from 'react-dropzone';
import get from 'lodash/get';
import {
  BrixelIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { ReactSortable } from 'react-sortablejs';
import { uploadImg } from '../../../actions/UploadActions';
import last from 'lodash/last';

const Plans = (props) => {
  // PROPS
  const {
    changeFieldValue,
    formValue,
    history,
    loggedUser,
    match,
  } = props;
  const { floorPlans } = formValue;
  // STATE
  const [fixPhotos, setFixPhotos] = useState([]);
  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  useEffect(() => {
    setFixPhotos(floorPlans);
  }, [floorPlans]);

  // DROPZONE SETTINGS
  const dropzoneRef = useRef(null);
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
          user: loggedUser.user.id,
          imageType: 0,
          pageID: formValue.id,
          uploadAction: 'photos',
        };
        // handleUploadImg(binaryStr);
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
    changeFieldValue('floorPlans', imgArray);
  };

  return (
    <>
      <div className="dis-fl-col mt-2 px-2">
        <div className={`${fixPhotos && fixPhotos.length > 0 ? 'dis-fl-col' : 'dis-fl-col empty-state a-c'}`}>
          {
            (fixPhotos && fixPhotos.length > 0) ? (
              <>
                <ReactSortable
                  tag="ul"
                  className="dis-fl-col image-list"
                  list={fixPhotos}
                  setList={(order, evt) => {
                    changeOrder(order);
                  }}
                >
                  {
                    fixPhotos.map((item, i) => (
                      <li
                        className="dis-fl-row a-c"
                        key={i.toString()}
                        data-id={JSON.stringify(item)}
                      >
                        <BrixelIcon
                          className="mr-2 grab"
                          color="light"
                          icon="menu"
                        />
                        <div
                          className="media-image-container mb-2 dis-fl-row a-c jc-b h-fix-136 brdRadius w-perc-100 shadow-1dp"
                        >
                          <div className="dis-fl-row h-perc-100">
                            <img
                              src={`${item.tmpPath ? item.tmpPath : `${baseByData.shortPath}${item.galleryThumbnailPath}?${item.updatedAt}`}`}
                              className="pos-r w-fix-136 mr-3 image"
                              alt="Property"
                            />
                            <div className="photo-info dis-fl-col jc-c">
                              <span className="mb-2 photo-description">{item.name ? item.name : 'Photo'}</span>
                              <span className="mb-2">{item.tags ? item.tags : ''}</span>
                              <span className="photo-id">{item.id}</span>
                            </div>
                          </div>
                          <div className="dis-fl-row">
                            {
                              (item.id === get(formValue.coverPhoto, 'id')) ? (
                                <div className="dis-fl-row mr-3">
                                  <BrixelIcon
                                    icon="star-fill"
                                    className="mr-1"
                                    color="green"
                                  />
                                  <span className="cover-info">This is your cover photo</span>
                                </div>
                              ) : ''
                            }
                            <BrixelIcon
                              className="mr-2"
                              color="light"
                              icon="arrow-simple-right"
                              onClick={() => history.push(`/${propID}/property/edit/media/${item.id}/floorPlans`)}
                            />
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ReactSortable>
              </>
            ) : ( // Empty state
              <>
                <div
                  className="upload-container dis-fl-col a-c mb-5 max-w-fix-600 max-h-fix-400 p-8"
                  {...getRootProps()}
                >
                  <BrixelIcon
                    icon="document"
                  />
                  <input {...getInputProps()} />
                  <span>Drag & drop to upload</span>
                </div>
                <h4>Your page needs some photos of your property. Start uploading here.</h4>
              </>
            )
          }
        </div>
      </div>
    </>
  );
};

Plans.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Plans.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  loggedUser: get(state, 'user.loggedUser', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleUploadImg: bindActionCreators(uploadImg, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Plans);
