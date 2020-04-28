import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import useOutsideAlerter from './OutsideElement';
import get from 'lodash/get';
import { connect } from 'react-redux';

import Properties from '../Pages/Properties';
import Support from './Support';
import Loading from '../components/Loading';

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

  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onClose();
    },
  });

  return (
    <>
      {
        activeMenu && (
          <div className="sidebarSubmenu zIndex2" style={{ height: windowDimensions.height }}>
            <div className="sidebarSubmenuContent shadow-1dp dis-fl-col h-perc-100 pos-r" ref={wrapperRef}>
              <Loading  isSmall isLoading={true} />
              {
                activeMenu === 'propertyList' && (
                  <Properties {...props} closeProperty={() => onClose(null)}/>
                )
              }
              {
                activeMenu === 'support' && (
                  <Support
                    isFixed={false}
                    onClose={() => onClose()}
                    expanded
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
  isSmallLoading: PropTypes.bool,
  windowDimensions: PropTypes.object,
};

MenuNavigationSubmenu.defaultProps = {
  activeMenu: null,
  rightMenu: null,
  windowDimensions: {},
  isSmallLoading: false,
};

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
})


export default compose(
  withRouter,
  connect(mapStateToProps),
)(MenuNavigationSubmenu);
