import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonIcon, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';

import Properties from '../Pages/Properties';

const MenuSidebar = (props) => {
  // PROPS
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
        className="sideHeader dis-fl-col a-c jc-fs h-perc-100 shadow-2dp"
      >
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
        {
          activeMenu && (
            <div className="sidebarSubmenu zIndex1" style={{ height: windowDimensions.height }}>
              <div className="sidebarSubmenuContent dis-fl-col" ref={wrapperRef}>
                {
                  activeMenu === 'propertyList' && (
                    <Properties {...props} closeProperty={() => setActiveMenu(null)}/>
                  )
                }
              </div>
            </div>
          )
        }
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
