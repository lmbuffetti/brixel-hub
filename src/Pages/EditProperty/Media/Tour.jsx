/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { uploadImg } from '../../../actions/UploadActions';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

const Tour = (props) => {
  // PROPS
  const {
    formValue,
  } = props;

  return (
    <div className="secondLevel">
      <div className="dis-fl-col p-2 p-md-4">

        <div className="dis-fl-row jc-b a-c mb-4">
          <h5>
            3D Tour
          </h5>
        </div>
        <div>
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
                <h5 className="mt-3 mb-1">Get your own 3D Tour</h5>
                <p className="txtDark200">3D-Tour and much more is part of Brixel Premium.</p>
                <div className="dis-f jc-c mt-3">
                  <BrixelButtonPrimary
                    label="Upgrade now"
                    background="red"
                    saturation={400}
                    rounded
                  />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

Tour.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Tour.defaultProps = {
};

const mapStateToProps = (state) => ({
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
