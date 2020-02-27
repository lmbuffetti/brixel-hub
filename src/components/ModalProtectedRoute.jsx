/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Route, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { BrixelModal } from '@brixel/brixel-components';
import { setModal } from '../actions/CommonActions';

const ModalProtectedRoute = (props) => {
  const {
    closePath,
    component,
    history,
    loggedUser,
    modal,
    path,
    title,
  } = props;

  useEffect(() => {
    if (loggedUser && typeof loggedUser.statusCode !== 'undefined') {
      if (window.location.hostname.includes('localhost')) {
        history.push('/tokeninput');
      } else {
        window.location.href = `${baseByData.loginUrl}?url=${window.location.href}`;
      }
    }
  }, [loggedUser]);

  return (
    <>
      {
        loggedUser.token && (
          <BrixelModal
            title={title}
            layout="xlarge"
            onClose={() => history.push(closePath)}
            multiActions={modal.multiActions}
            clickOutsideToClose={false}
          >
            <div>
              <Route path={path} component={component} />
            </div>
          </BrixelModal>
        )
      }
    </>
  );
};

ModalProtectedRoute.propTypes = {
  closePath: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  handleSetModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string,
};

ModalProtectedRoute.defaultProps = {
  title: null,
};


const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', null),
  modal: get(state, 'common.modal', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModalProtectedRoute);
