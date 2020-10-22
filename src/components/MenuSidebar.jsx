/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelButtonTertiary, destroy,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_full.svg';
import { CSSTransition } from 'react-transition-group';
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

  // FUNCTION TO MANAGE CLICK OUTSIDE OF SUPPORT MENU
  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onCloseSupport();
    },
  });

  console.log(userType, 'usertype');

  return (
    <>
      <header className="sideHeader dis-fl-col a-c jc-fs h-perc-100" id="menu-sidebar">
        <div className="w-perc-100 h-perc-100 pos-r">
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className={`pos-r sidebar w-perc-100 h-perc-100 bgWhite shadow-2dp ${levelUrl.length > 3 && windowDimensions.width <= 1024 ? 'zIndex1' : 'zIndex7'}`}>
            <div className="hide dis-b-md pl-3 pr-2">
              <div className="h-fix-64 dis-f a-c">
                <img className="pos-r w-fix-56" src={logo} alt="Brixel Logo" id="logo" />
              </div>
              <BrixelButtonTertiary
                label="Sell"
                rightIcon="arrow-right-small"
                labelClass="fsize-300"
                className="pb-small-4 td-n"
                onClick={() => {
                  handleSetUserTypes('seller');
                  handleSetActiveSingleProperty({});
                  history.push('/seller/pageLists');
                }}
                color="dark"
                saturation={history.location.pathname.includes('buyer') ? 100 : 700}
              />
              <BrixelButtonTertiary
                label="Buy"
                rightIcon="arrow-right-small"
                labelClass="fsize-300"
                className="pt-small-4 td-n"
                onClick={() => {
                  destroyForm();
                  handleSetUserTypes('buyer');
                  handleSetActiveSingleProperty({});
                  history.push('/buyer/propertyLists');
                }}
                color="dark"
                saturation={history.location.pathname.includes('buyer') ? 700 : 100}
              />
            </div>

            <BrixelButtonTertiary
              className="fsize-300 txtLight600 fweight-600 py-0 min-h-fix-30 td-n pos-a-fix x-b-2 x-l-2"
              label="Support"
              leftIcon="conversation"
              onClick={() => onTabClick('support')}
            />
          </div>
          {
            (userType === 'buyer' || userType === 'seller') && windowDimensions.width <= 1024 && (
              <>
                <div className="buyerNav a-c jc-c">
                  <div
                    className="fsize-400 fweight-500"
                    onClick={() => {
                      destroyForm();
                      handleSetUserTypes('buyer');
                      handleSetActiveSingleProperty({});
                      history.push('/buyer/propertyLists');
                    }}
                  >
                    Buyer Hub
                  </div>
                  <div
                    className="fsize-400 fweight-500"
                    onClick={() => {
                      handleSetUserTypes('seller');
                      handleSetActiveSingleProperty({});
                      history.push('/seller/pageLists');
                    }}
                  >
                    Seller Hub
                  </div>
                </div>
              </>
            )
          }
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
