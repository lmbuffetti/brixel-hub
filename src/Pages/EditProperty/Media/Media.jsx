/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import LoadingSimple from '../../../components/LoadingSimple';
import { getImageType } from '../../../actions/UploadActions';

const Photos = Loadable({
  loader: () => import('./Photos' /* webpackChunkName: "Photos" */),
  loading: LoadingSimple,
});
const Plans = Loadable({
  loader: () => import('./Plans' /* webpackChunkName: "Plans" */),
  loading: LoadingSimple,
});
const Tour = Loadable({
  loader: () => import('./Tour' /* webpackChunkName: "Plans" */),
  loading: LoadingSimple,
});

const Media = (props) => {
  // PROPS
  const {
    handleGetImageType
  } = props;

  useEffect(() => {
    handleGetImageType();
  }, []);

  return (
    <>
      <div className="dis-fl-col mt-2 px-2 pb-10">
        <Photos />
        <Plans />
        <Tour />
      </div>
    </>
  );
};

Media.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Media.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  loggedInUser: get(state, 'user.loggedInUser', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleGetImageType: bindActionCreators(getImageType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Media);
