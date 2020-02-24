import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { getProperties } from '../../actions/PropertyActions';
import { BrixelIcon } from '@brixel/brixel-components';

const HomeDashboard = (props) => {
  // PROPS
  const {
    handleGetProperties,
    history,
  } = props;
  useEffect(() => {
  }, []);


  return (
    <div className="container supportCard">
      <div>
        <BrixelIcon
          classaName="dis-b"
          icon="question"
          background="primary"
          saturation={300}
          color="white"
          saturationTxt={0}
        />
        <h4 className="my-1">Support</h4>
        <p>How can I hel you?</p>
      </div>
      <div className="mt-4">
        <BrixelIcon
          classaName="dis-b"
          icon="first-time-occupancy"
          background="primary"
          saturation={300}
          color="white"
          saturationTxt={0}
        />
        <h4 className="my-1">Upgrade</h4>
        <p>Learn about Brixel Premium</p>
      </div>
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
