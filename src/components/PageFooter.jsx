import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// IMAGES
import logo from '@brixel/brixel-configuration-partner/src/images/logo_white.svg';

const PageFooter = (props) => {

  return (
    <footer className="px-2 px-md-6" id="page-footer">
      <img src={logo} alt="Brixel Logo Footer" className="w-fix-40" />
    </footer>
  );
};

PageFooter.propTypes = {
};

const mapStateToProps = (state) => ({
});

export default withRouter(connect(mapStateToProps, null)(PageFooter));
