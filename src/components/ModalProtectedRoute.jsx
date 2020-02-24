import React, { useEffect } from 'react';
import {
  Route, withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { BrixelModal } from '@brixel/brixel-components';

const ModalProtectedRoute = (props) => {
  const {
    component,
    history,
    loggedUser,
    path,
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
            title="Modal Route"
            layout="xlarge"
            onClose={() => ''}
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
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  history: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  loggedUser: get(state, 'user.loggedUser', null),
});

const mapDispatchToProps = () => ({
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModalProtectedRoute);
