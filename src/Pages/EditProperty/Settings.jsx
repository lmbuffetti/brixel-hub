/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

const Settings = (props) => {
  const {

  } = props;

  return (
    <>
      <div className="container dis-fl-col mt-2">
        <h6>Settings</h6>
      </div>
    </>
  );
};

Settings.propTypes = {
};

Settings.defaultProps = {
};

const mapStateToProps = (state) => {

};

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Settings);
