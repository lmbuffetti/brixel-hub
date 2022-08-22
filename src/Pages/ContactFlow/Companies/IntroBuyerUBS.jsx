/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useRef, useState,
} from 'react';
// import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  useLocation,
  useNavigate, useParams,
} from 'react-router-dom';

const IntroBuyerUBS = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
  } = props;

  return (
    <main className="introScanFlow pt-2 pt-sm-4 pb-2 pb-sm-4 h-perc-100 txtDark700">

      <h2>Test</h2>

    </main>
  );
};

IntroBuyerUBS.propTypes = {
};

IntroBuyerUBS.defaultProps = {
  scrollHash: null,
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(IntroBuyerUBS);
