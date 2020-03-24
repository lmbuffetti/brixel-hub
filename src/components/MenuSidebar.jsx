import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonIcon, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';

import MenuNavigationSubmenu from './MenuNavigationSubmenu';

const MenuSidebar = (props) => {
  const {
    windowDimensions,
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  // REF
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      setActiveMenu(null);
    },
  });

  return (
    <>
      <header
        className="sideHeader dis-fl-col a-c jc-fs h-perc-100 shadow-2dp" id="menu-sidebar"
      >
        <div>
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className="pos-r zIndex3 sidebar hide dis-b-md">
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
          <MenuNavigationSubmenu windowDimensions={windowDimensions} activeMenu={activeMenu} onClose={() => setActiveMenu(null)} />
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
