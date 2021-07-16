/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  destroy,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { CSSTransition } from 'react-transition-group';
import useOutsideAlerter from './OutsideElement';
import { setUserTypes } from '../actions/UserActions';
import { setActiveSingleProperty } from '../actions/PropertyActions';
import { sidebarNavigationSeller, sidebarNavigationBuyer } from '../resources/navigationRoutes';

import MenuNavigationSubmenu from './MenuNavigationSubmenu';

const MenuSidebar = (props) => {
  const {
    activeSingleDeal,
    history,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  const [navigationMenu, setNavigationMenu] = useState([]);
  // REF
  const wrapperRef = useRef(null);
  // URL PARAMS
  const propID = userType === 'seller' ? history.location.pathname.split('/')[1] : history.location.pathname.split('/')[2];
  const levelUrl = history.location.pathname.split('/');

  // FUNCTION TO MAANGE THE TAB CLICK
  const onTabClick = useCallback((val, act = 'url') => {
    if (act === 'state' || val === 'support' || val === '/support') {
      setActiveMenu(val.replace('/', ''));
      setSlideIn(true);
    }
  }, []);

  // FUNCTION TO MAANGE THE TAB CLICK
  const linkMenu = useCallback((val) => {
    let url = val.replace(':propID', propID);
    url = url.replace(':dealID', activeSingleDeal.id);
    return url;
  }, [userType, activeSingleDeal, propID]);

  // FUNCTION TO SHOW/HIDE THE SUPPORT MENU (history.push({state: {showSupport: true}}))
  useEffect(() => {
    if (get(history, 'location.state.showSupport', null) === true) {
      onTabClick('support');
    }
  }, [get(history, 'location.state', null)]);

  // FUNCTION WHEN SUPPORT MENU IS CLOSED
  const onCloseSupport = useCallback(() => {
    setActiveMenu(null);
    setSlideIn(false);
    history.push({ state: null });
  }, []);

  useEffect(() => {
    if (history.location.pathname.includes('buyer')) {
      setNavigationMenu(sidebarNavigationBuyer);
    } else {
      setNavigationMenu(sidebarNavigationSeller);
    }
  }, [get(history, 'location.pathname', null)]);

  // FUNCTION TO MANAGE CLICK OUTSIDE OF SUPPORT MENU
  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onCloseSupport();
    },
  });

  return (
    <>
      {
        windowDimensions.width > 1024 && (
          <header className="sideHeader dis-fl-col a-c jc-fs h-perc-100" id="menu-sidebar">
            <div className="w-perc-100 h-perc-100 pos-r">
              { /* SECTION SIDEBAR MENU DESKTOP */ }
              <div className={`pos-r sidebar w-perc-100 h-perc-100 bgLight100 ${levelUrl.length > 3 && windowDimensions.width <= 1024 ? 'zIndex1' : 'zIndex7'}`}>
                <div className="hide dis-b-md">
                  <ul className="sidebarNav pr-3 py-4">
                    {
                      navigationMenu.map((nav, i) => (
                        <li
                          key={i.toString()}
                          className={`${history.location.pathname.includes(nav.name) ? 'active' : ''} mainNav fsize-300`}
                        >
                          <Link to={linkMenu(nav.path)}>{nav.title}</Link>
                          {
                            nav.submenu && (
                              <ul className="submenu">
                                {
                                  nav.submenu.map((submenu, f) => (
                                    <li
                                      key={f.toString()}
                                      className={`${history.location.pathname.includes(submenu.name) ? 'submenuActive' : ''} subNav`}
                                    >
                                      <Link to={linkMenu(submenu.path)}>{submenu.title}</Link>
                                    </li>
                                  ))
                                }
                              </ul>
                            )
                          }
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
              <CSSTransition
                in={slideIn}
                timeout={200}
                classNames="slideIn"
                onEnter={() => setSlideIn(true)}
                onExited={() => setActiveMenu(null)}
                unmountOnExit
              >
                <MenuNavigationSubmenu
                  windowDimensions={windowDimensions}
                  activeMenu={activeMenu}
                  onClose={() => onCloseSupport()}
                />
              </CSSTransition>
            </div>
          </header>
        )
      }
    </>
  );
};

MenuSidebar.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userType: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

MenuSidebar.defaultProps = {
  userType: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  userType: get(state, 'user.userTypes', ''),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
