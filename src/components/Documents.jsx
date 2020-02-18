/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';

// COMPONENTS
import { BrixelButtonIcon } from '@brixel/brixel-components';
import SidebarLayout from '../components/SidebarLayout';

const Documents = (props) => {
  const {
    history,
  } = props;

  return (
    <>
      <SidebarLayout>
        <div className="p-2">
          <div className="dis-f a-c jc-b mb-5">
            <h3>Brixel Coming In Town</h3>
            <BrixelButtonIcon
              className="shadow-3dp"
              noBorder
              background="white"
              color="dark"
              saturationTxt={700}
              icon="arrow-simple-right"
              onClick={() => history.push('./')}
            />
          </div>
          <div>
            DOCUMENTS
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

Documents.propTypes = {
  history: PropTypes.object.isRequired,
};

Documents.defaultProps = {

};

const mapStateToProps = (state) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(Documents);
