import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { getProperties } from '../../actions/PropertyActions';

const HomeDashboard = (props) => {
  // PROPS
  const {
    handleGetProperties,
    history,
  } = props;
  useEffect(() => {
  }, []);


  return (
    <div className="container">
      <h1>Support</h1>
    </div>
  )
};

HomeDashboard.propTypes = {
  handleGetProperties: PropTypes.func.isRequired,
};

HomeDashboard.defaultProps = {

};

const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = (dispatch) => ({
  handleGetProperties: bindActionCreators(getProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
