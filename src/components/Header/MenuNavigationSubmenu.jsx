import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import get from 'lodash/get';
import { connect } from 'react-redux';
import useOutsideAlerter from '../OutsideElement';

import Properties from '../../Pages/Properties';
import Support from '../Support';
import Loading from '../Loading';

const MenuNavigationSubmenu = (props) => {
  // PROPS
  const {
    activeMenu,
    onClose,
    windowDimensions,
    isSmallLoading,
  } = props;

  // REF
  const wrapperRef = useRef(null);

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onClose();
    },
  });

  return (
    <>
      {
        // WHEN THE MENU IS ACTIVE
        activeMenu && (
          <div className="sidebarSubmenu" style={{ height: windowDimensions.height }}>
            <div className="sidebarSubmenuContent shadow-2dp dis-fl-col h-perc-100 pos-r" ref={wrapperRef}>
              <Loading isSmall isLoading={isSmallLoading.getData} />
              {
                activeMenu === 'propertyList' && (
                  <Properties {...props} closeProperty={() => onClose(null)} />
                )
              }
              {
                activeMenu === 'support' && (
                  <Support
                    isFixed={false}
                    onClose={() => onClose()}
                    expanded
                    hideClose={false}
                  />
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
  rightMenu: PropTypes.string,
  isSmallLoading: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object,
};

MenuNavigationSubmenu.defaultProps = {
  activeMenu: null,
  rightMenu: null,
  windowDimensions: {},
};

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

export default compose(
  connect(mapStateToProps),
)(MenuNavigationSubmenu);
