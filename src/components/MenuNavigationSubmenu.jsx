import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { useOutsideAlerter } from '@brixel/brixel-components';

import Properties from '../Pages/Properties';
import DrawerLayout from './DrawerLayout';
import Support from './Support';

const MenuNavigationSubmenu = (props) => {
  // PROPS
  const {
    activeMenu,
    onClose,
    rightMenu,
    windowDimensions,
  } = props;

  // REF
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onClose(null);
    },
  });

  return (
    <>
      {
        activeMenu && (
          <div className="sidebarSubmenu zIndex2" style={{ height: windowDimensions.height }}>
            <div className="sidebarSubmenuContent dis-fl-col h-perc-100" ref={wrapperRef}>
              {
                activeMenu === 'propertyList' && (
                  <Properties {...props} closeProperty={() => onClose(null)}/>
                )
              }
            </div>
          </div>
        )
      }
      {
        rightMenu && (
          <DrawerLayout onClose={() => onClose()}>
            <Support
              isFixed={false}
              expanded
            />
          </DrawerLayout>
        )
      }
    </>
  );
};

MenuNavigationSubmenu.propTypes = {
  activeMenu: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  rightMenu: PropTypes.string,
  windowDimensions: PropTypes.object,
};

MenuNavigationSubmenu.defaultProps = {
  activeMenu: null,
  rightMenu: null,
  windowDimensions: {},
};

export default compose(
  withRouter,
)(MenuNavigationSubmenu);
