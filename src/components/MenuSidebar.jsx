import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonIcon, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import { CSSTransition } from 'react-transition-group';

import MenuNavigationSubmenu from './MenuNavigationSubmenu';

const MenuSidebar = (props) => {
  const {
    windowDimensions, history
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  // REF
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      setActiveMenu(null);
    },
  });

  const propertyUrls = (history.location.pathname.includes('rewards')) || (history.location.pathname.includes('property')) || (history.location.pathname.includes('listings')) ? true : false;

  return (
    <>
      <header className="sideHeader dis-fl-col a-c jc-fs h-perc-100 shadow-2dp" id="menu-sidebar">
        <div className="w-perc-100 h-perc-100">
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className="pos-r sidebar hide dis-b-md w-perc-100 h-perc-100 bgWhite zIndex3">
            <div className="admin-info w-perc-100 dis-fl-col a-c mb-10 py-3">
              <img className="pos-r w-fix-32" src={logo} alt="Brixel Logo" id="logo" />
            </div>
            <div className="links h-perc-100 w-perc-100 dis-fl-col jc-b pos-r zIndex2">
              <div className="routes dis-fl-col jc-fs">
                <div className={`pos-r h-fix-48 w-perc-100 dis-fl-col a-c ta-c ${activeMenu === 'propertyList'? 'clicked' : ''}`}>
                  <BrixelButtonIcon
                    icon="properties"
                    hoverTextColor="primary"
                    bgTransparent
                    noBorder
                    color="dark"
                    saturationTxt={300}
                    className={`noRadius h-perc-100 w-perc-100 ${propertyUrls ? 'active' : '' }`}
                    onClick={() => {
                      // if (preventExit) {
                      //   setUnsavedModal({
                      //     state: true,
                      //     link: '/properties',
                      //   });
                      //   return;
                      // }
                      setActiveMenu('propertyList');
                      setSlideIn(true)
                    }}
                  />
                </div>

                <div className="pos-r h-fix-48 w-perc-100 dis-fl-col a-c ta-c">
                  <BrixelButtonIcon
                    disabled
                    icon="conversation"
                    bgTransparent
                    noBorder
                    color="light"
                    className="noRadius h-perc-100 w-perc-100"
                    saturationTxt={300}
                  />
                </div>

                <div className="pos-r h-fix-48 w-perc-100 dis-fl-col a-c ta-c">
                  <BrixelButtonIcon
                    disabled
                    icon="calendar"
                    bgTransparent
                    noBorder
                    color="light"
                    className="noRadius h-perc-100 w-perc-100"
                    saturationTxt={300}
                  />
                </div>

              </div>
            </div>
          </div>
          <CSSTransition
            in={slideIn}
            timeout={300}
            classNames="alert"
            onEnter={() => setSlideIn(true)}
            onExited={() => setActiveMenu(null)}
            unmountOnExit
          >
            <MenuNavigationSubmenu windowDimensions={windowDimensions} activeMenu={activeMenu} onClose={() => { setSlideIn(false)}} />
          </CSSTransition>
        </div>
      </header>
    </>
  );
};

MenuSidebar.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
};

MenuSidebar.defaultProps = {
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
