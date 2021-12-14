import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

function RequireAuth(props) {
  const { children, loggedInUser } = props;
  const location = useLocation();

  if (typeof cookie.get('brixelToken') === 'undefined' && loggedInUser.id) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }
  console.log(<Outlet />);
  return <Outlet />;
}

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser', null),
});

const mapDispatchToProps = () => ({
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(RequireAuth);
