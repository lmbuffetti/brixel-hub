import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { getAchievement, getGamegroup } from '../../actions/GamificationActions';

const HomeDashboard = (props) => {
  // PROPS
  const {
    handleGetGameAchievement,
    handleGetGameGroup,
  } = props;

  useEffect(() => {
    handleGetGameAchievement();
    handleGetGameGroup();
  }, []);


  return (
    <div className="container">
      <h1>Home of</h1>
    </div>
  )
};

HomeDashboard.propTypes = {
  handleGetGameAchievement: PropTypes.func.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
};

HomeDashboard.defaultProps = {

};

const mapStateToProps = (state, props) => ({
});

const mapDispatchToProps = (dispatch) => ({
  handleGetGameAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HomeDashboard);
