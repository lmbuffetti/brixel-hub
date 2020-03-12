import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import Loadable from 'react-loadable';
import Loading from './Loading';

const Properties = Loadable({
  loader: () => import('../Pages/Properties' /* webpackChunkName: "Properties" */),
  loading: Loading,
});

const MenuSidebar = (props) => {
  // PROPS
  const {
    history, activeProperty,
    // preventExit, setUnsavedModal,
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <>
      <header
        className="sideHeader dis-fl-col a-c jc-fs h-perc-100"
      >
        <div
          className="admin-info w-perc-100 dis-fl-col a-c mb-6 py-3"
        >
          <img className="pos-r w-fix-32" src={logo} alt="Brixel Logo" id="logo" />
        </div>

        <div className="links h-perc-100 w-perc-100 dis-fl-col jc-b pos-r zIndex2">
          <div className="routes dis-fl-col jc-fs">

            <div className={`pos-r h-fix-48 w-perc-100 dis-fl-col a-c ta-c ${(history.location.pathname.includes('home') || history.location.pathname.includes('property')) ? 'active properties-list' : 'properties-list'}`}>
              <BrixelButtonIcon
                icon="properties"
                hoverTextColor="primary"
                bgTransparent
                noBorder
                color="dark"
                saturationTxt={100}
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
            <div className="sidebarSubmenu zIndex1">
              <div className="sidebarSubmenuContent">
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
};

MenuSidebar.defaultProps = {
};

const mapStateToProps = (state) => ({
  isLoading: get(state, 'common.isLoading', 2),
  preventExit: get(state, 'common.preventExitFromScreen', false),
  activeProperty: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
