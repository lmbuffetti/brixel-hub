import React  from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { getProperties } from '../../actions/PropertyActions';
import { BrixelIcon } from '@brixel/brixel-components';

const HomeDashboard = (props) => {

  return (
    <div className="supportCard pt-2 pl-2 pr-1">
      <div>
        <BrixelIcon
          className="dis-ib"
          icon="question"
          background="primary"
          saturation={300}
          padding="p-small-9"
          color="white"
          iconSize="large"
          saturationTxt={0}
        />
        <span className="my-1 dis-b fweight-500 txtDark700">Support</span>
        <p className="body2 txtDark500">How can I help you?</p>
      </div>
      <div>
        <BrixelIcon
          className="dis-ib mt-3"
          icon="first-time-occupancy"
          background="primary"
          padding="p-small-9"
          saturation={300}
          iconSize="large"
          color="white"
          saturationTxt={0}
        />
        <span className="my-1 dis-b fweight-500 txtDark700">Upgrade</span>
        <p className="body2 txtDark500">Learn about Brixel Premium</p>
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
