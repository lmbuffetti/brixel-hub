/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import LoadingSimple from '../../../components/LoadingSimple';

const Photos = Loadable({
  loader: () => import('./Photos' /* webpackChunkName: "Photos" */),
  loading: LoadingSimple,
});
const Plans = Loadable({
  loader: () => import('./Plans' /* webpackChunkName: "Plans" */),
  loading: LoadingSimple,
});

const DetailMedia = (props) => {
  const {
    match
  } = props;
  // PARAMS URL
  const imgID = get(match, 'params.imgId', null);

  return (
    <>
      <div className="dis-fl-col mt-2 px-2 pb-10">
        <h5>Test</h5>
      </div>
    </>
  );
};

DetailMedia.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

DetailMedia.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  loggedUser: get(state, 'user.loggedUser', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DetailMedia);
