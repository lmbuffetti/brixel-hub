/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { uploadImg } from '../../../actions/UploadActions';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import defaultCover from '../../../images/3d-tour-placeholder.jpg';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const Tour = (props) => {
  // PROPS
  const {
    formValue,
    history,
    match,
  } = props;
  // STATE
  const [showTour, setShowTour] = useState(false);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  return (
    <div className="tourWrapper h-perc-md-100">
      <div className="secondLevel dis-fl-col">
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
            <h5 className="m-a m-md-0 sectionTitle">
              3d Tour
            </h5>
          </div>
          {
            !showTour ? (
              <div className="pos-r brdRadius ov-h">
                {
                  get(formValue, 'virtual.matterport', null) ? (
                    <img
                      className="dis-b"
                      src={`${baseByData.shortPath}${get(formValue, 'coverPhoto.path', '')}`}
                      alt="Cover"
                    />
                  ) : (
                    <img
                      className="dis-b"
                      src={defaultCover}
                      alt="Cover"
                    />
                  )
                }
                <div className="pos-a w-perc-100 h-perc-100 bgBlack opacity5" />
                <div className="pos-a xy-c">
                  <BrixelButtonIcon
                    noBorder
                    padding={16}
                    icon="play-fill"
                    background="white"
                    saturation={0}
                    color="primary"
                    fontSize={16}
                    className="m-a opacity8"
                    saturationTxt={400}
                    onClick={() => setShowTour(true)}
                  />
                  <p className="ta-c txtWhite mt-2">Start 3D Tour</p>
                </div>
              </div>
            ) : (
              <>
                {
                  get(formValue,'virtual.matterport', null) ? (
                    <iframe
                      className="min-h-fix-320"
                      width="100%"
                      height="100%"
                      src={`https://my.matterport.com/show/?m=${get(formValue,'virtual.matterport', null)}&help=0&hl=2&nt=1&play=1&brand=0&mls=2&mt=0&wh=0`}
                      allow="vr"
                      frameBorder="0"
                      allowFullScreen
                      title={get(formValue,'virtual.matterport', null)}
                    />
                  ) : (
                    <div className="ta-c">
                      <iframe
                        className="min-h-fix-320"
                        width="100%"
                        height="100%"
                        src={`https://my.matterport.com/show/?m=ctWod3ggrZi&help=0&hl=2&nt=1&play=1&brand=0&mls=2&mt=0&wh=0`}
                        allow="vr"
                        frameBorder="0"
                        allowFullScreen
                        title={get(formValue,'virtual.matterport', null)}
                      />
                    </div>
                  )
                }
              </>
            )
          }
        </div>
        {
          !get(formValue, 'virtual.matterport', null) && (
            <BrixelUpgradeMessage
              className="mt-3"
              title="Get your own 3D-Tour"
              description="3D-Tour and much more is part of Brixel Premium."
            />
          )
        }
      </div>

    </div>
  );
};

Tour.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Tour.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'form.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', null),
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
)(Tour);
