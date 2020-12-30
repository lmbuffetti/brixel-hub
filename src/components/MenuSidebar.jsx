/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelButtonText, destroy, BrixelButtonPrimary, BrixelButtonSecondary,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_full_v2.svg';
import { CSSTransition } from 'react-transition-group';
import BrixelIcon from '@brixel/brixel-components/dist/components/BrixelIcon';
import useOutsideAlerter from './OutsideElement';
import { setUserTypes } from '../actions/UserActions';
import { setActiveSingleProperty } from '../actions/PropertyActions';

import MenuNavigationSubmenu from './MenuNavigationSubmenu';

const MenuSidebar = (props) => {
  const {
    handleSetUserTypes,
    handleSetActiveSingleProperty,
    destroyForm,
    history,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  // REF
  const wrapperRef = useRef(null);
  // URL PARAMS
  const propID = userType === 'seller' ? history.location.pathname.split('/')[1] : history.location.pathname.split('/')[3];
  const levelUrl = history.location.pathname.split('/');

  // FUNCTION TO MAANGE THE TAB CLICK
  const onTabClick = (val, act = 'url') => {
    if (act === 'state' || val === 'support' || val === '/support') {
      setActiveMenu(val.replace('/', ''));
      setSlideIn(true);
    } else {
      if (userType === 'seller') {
        const url = val.replace(':propID', propID);
        history.push(url);
      } else {
        const url = val.replace(':propID', propID);
        history.push(url);
      }
      setActiveMenu(null);
    }
  };

  // FUNCTION TO SHOW/HIDE THE SUPPORT MENU (history.push({state: {showSupport: true}}))
  useEffect(() => {
    if (get(history, 'location.state.showSupport', null) === true) {
      onTabClick('support');
    }
  }, [get(history, 'location.state', null)]);

  // FUNCTION WHEN SUPPORT MENU IS CLOSED
  const onCloseSupport = () => {
    setActiveMenu(null);
    setSlideIn(false);
    history.push({ state: null });
  };

  useEffect(() => {
    if (history.location.pathname.includes('buyer')) {
      setIsBuyer(true);
    } else {
      setIsBuyer(false);
    }
  });

  // FUNCTION TO MANAGE CLICK OUTSIDE OF SUPPORT MENU
  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onCloseSupport();
    },
  });

  return (
    <>
      <header className="sideHeader dis-fl-col a-c jc-fs h-perc-100" id="menu-sidebar">
        <div className="w-perc-100 h-perc-100 pos-r">
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className={`pos-r sidebar w-perc-100 h-perc-100 bgWhite shadow-2dp ${levelUrl.length > 3 && windowDimensions.width <= 1024 ? 'zIndex1' : 'zIndex7'}`}>
            <div className="hide dis-b-md">
              <div className="h-fix-64 dis-f a-c logoWrapper px-2">
                <img className="pos-r w-fix-64" src={logo} alt="Brixel Logo" id="logo" />
              </div>
              <div className="sidebarNav mt-5 px-2">
                <ul className="navigation">
                  <li
                    onClick={() => {
                      handleSetUserTypes('seller');
                      handleSetActiveSingleProperty({});
                      history.push('/seller/pageLists');
                    }}
                    className={`${isBuyer ? '' : 'active'} fweight-500 fsize-300 dis-f a-c brdRadius px-2 h-fix-40 txtLight400 cur-poi`}
                  >
                    <BrixelIcon
                      icon="property-house"
                      className="mr-small-12"
                    />
                    Sell
                  </li>
                  <li
                    onClick={() => {
                      destroyForm();
                      handleSetUserTypes('buyer');
                      handleSetActiveSingleProperty({});
                      history.push('/buyer/propertyLists');
                    }}
                    className={`${isBuyer ? 'active' : ''} fweight-500 fsize-300 dis-f a-c brdRadius px-2 h-fix-40 txtLight400 cur-poi`}
                  >
                    <BrixelIcon
                      icon="favorite"
                      className="mr-small-12"
                    />
                    Buy
                  </li>
                </ul>
              </div>
            </div>
            <div className="pos-a-fix x-b-2 w-perc-100">
              <hr className="lighter mb-2" />
              <div className="px-2 dis-f jc-c">
                <span
                  onClick={() => onTabClick('support')}
                  className="cur-poi txtDark700 fsize-300 fweight-500"
                >
                  <BrixelIcon
                    icon="conversation"
                    className="mr-1"
                  />
                  Support
                </span>
              </div>
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
    </>
  );
};

MenuSidebar.propTypes = {
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  userType: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

MenuSidebar.defaultProps = {
  userType: 'user',
};

const mapStateToProps = (state) => ({
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
