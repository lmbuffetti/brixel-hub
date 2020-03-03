/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Settings = (props) => {

  return (
    <>
      <div className="dis-fl-col mt-2 px-2">
        <h6>Settings</h6>
      </div>
    </>
  );
};

Settings.propTypes = {
};

Settings.defaultProps = {
};
/*
const mapStateToProps = (state) => {

};

const mapDispatchToProps = (dispatch) => ({

});
*/
export default compose(
  withRouter,
  connect(null, null),
)(Settings);
