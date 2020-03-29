import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { useOutsideAlerter } from '@brixel/brixel-components';

import Properties from '../Pages/Properties';

const MenuNavigationSubmenu = (props) => {
  // PROPS
  const {
    activeMenu,
    onClose,
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
    </>
  );
};

MenuNavigationSubmenu.propTypes = {
  activeMenu: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object,
};

MenuNavigationSubmenu.defaultProps = {
  activeMenu: null,
  windowDimensions: {},
};

export default compose(
  withRouter,
)(MenuNavigationSubmenu);
