/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Media = (props) => {
  const {

  } = props;

  return (
    <>
      <div className="container dis-fl-col mt-2">
        <h6>Media</h6>
      </div>
    </>
  );
};

Media.propTypes = {
};

Media.defaultProps = {
};

const mapStateToProps = (state) => {

};

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(null, null),
)(Media);
