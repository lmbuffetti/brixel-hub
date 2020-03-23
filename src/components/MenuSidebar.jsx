import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonIcon, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';

import Properties from '../Pages/Properties';
import baseByData from '@brixel/brixel-configuration-partner/src/SettingsWebpack';

const MenuSidebar = (props) => {
  // PROPS
  const {
    windowDimensions,
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(null);
  // REF
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      setActiveMenu(null);
    },
  });

  const onClickMobileMenu = (link) => {
    setShowMobileMenu(false);
    setActiveMenu(link);
    document.body.classList.remove('ov-h');
  };

  return (
    <>
      <header
        className="sideHeader dis-fl-col a-c jc-fs h-perc-100 shadow-2dp" id="menu-sidebar"
      >
        <div>
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className="sidebar zIndex3 hide dis-b-md pos-r">
            <div
              className="admin-info w-perc-100 dis-fl-col a-c mb-6 py-3"
            >
              <img className="pos-r w-fix-32" src={logo} alt="Brixel Logo" id="logo" />
            </div>

            <div className="links h-perc-100 w-perc-100 dis-fl-col jc-b pos-r zIndex2">
              <div className="routes dis-fl-col jc-fs">

                <div className={`pos-r h-fix-48 w-perc-100 dis-fl-col a-c ta-c`}>
                  <BrixelButtonIcon
                    icon="properties"
                    hoverTextColor="primary"
                    bgTransparent
                    noBorder
                    color={activeMenu === 'propertyList' ? 'primary' : 'dark'}
                    saturationTxt={activeMenu === 'propertyList' ? 400 : 100}
                    className="h-perc-100 w-perc-100"
                    onClick={() => {
                      // if (preventExit) {
                      //   setUnsavedModal({
                      //     state: true,
                      //     link: '/properties',
                      //   });
                      //   return;
                      // }
                      setActiveMenu('propertyList')
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
                    className="h-perc-100 w-perc-100"
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
                    className="h-perc-100"
                    saturationTxt={300}
                  />
                </div>

              </div>
            </div>
          </div>
          { /* SECTION SIDEBAR MENU MOBILE */ }
          <div className="hide-md">
            <BrixelButtonIcon
              bgTransparent
              color="primary"
              saturationTxt={400}
              noBorder
              className="shadow-2dp btnMainMenu"
              icon={showMobileMenu ? "close" : "menu"}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            />
            {
              showMobileMenu && (
                <div className="mobile-menu bgGreen700 w-perc-100 h-perc-100 pos-a dis-fl-col a-c p-1 zIndex5">
                  <BrixelButtonIcon
                    className="as-fe mb-5"
                    icon="close-small"
                    background="light"
                    saturation={100}
                    color="green"
                    saturationTxt={700}
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('ov-h');
                    }}
                  />
                  <div className="links dis-fl-col as-b pl-4">
                    <button
                      className="txtLight100 fweight-700 fSizePx28 mb-4"
                      onClick={() => onClickMobileMenu('propertyList')}
                    >
                      Properties
                    </button>
                    <button
                      className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                      onClick={() => ''}
                    >
                      Messages
                    </button>
                    <button
                      className="txtDark200 fweight-700 fSizePx28 mb-4 poi-none ta-l"
                      onClick={() => ''}
                    >
                      Calendar
                    </button>
                    <a
                      className="txtLight100 fweight-700 fSizePx28 mb-4"
                      href={baseByData(null,'io').profileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Profile
                    </a>
                  </div>
                </div>
              )
            }
          </div>
          {
            activeMenu && (
              <div className="sidebarSubmenu zIndex2 bgWhite" style={{ height: windowDimensions.height }}>
                <div className="sidebarSubmenuContent dis-fl-col h-perc-100" ref={wrapperRef}>
                  {
                    activeMenu === 'propertyList' && (
                      <Properties {...props} closeProperty={() => setActiveMenu(null)}/>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
      </header>
    </>
  );
};

MenuSidebar.propTypes = {
  history: PropTypes.object.isRequired,
  activeProperty: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  preventExit: PropTypes.bool.isRequired,
  // setUnsavedModal: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MenuSidebar.defaultProps = {
};

const mapStateToProps = (state) => ({
  isLoading: get(state, 'common.isLoading', 2),
  preventExit: get(state, 'common.preventExitFromScreen', false),
  activeProperty: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
