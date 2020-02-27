import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';

const MenuSidebar = (props) => {
  // PROPS
  const {
    history,
    // preventExit, setUnsavedModal,
  } = props;

  return (
    <>
      <header
        className="dis-fl-col a-c jc-fs h-perc-100 w-perc-100 shadow-2dp"
      >
        <div
          className="admin-info w-perc-100 dis-fl-col a-c mb-6 p-3"
        >
          <img className="pos-r w-fix-32" src={logo} alt="Brixel Logo" id="logo" />
        </div>

        <div className="links h-perc-100 w-perc-100 dis-fl-col jc-b">
          <div className="routes dis-fl-col jc-fs">

            <div className={`pos-r h-fix-48 w-perc-100 dis-fl-col a-c ta-c ${(history.location.pathname.includes('home') || history.location.pathname.includes('property')) ? 'active properties-list' : 'properties-list'}`}>
              <BrixelButtonIcon
                icon="properties"
                hoverTextColor="primary"
                bgTransparent
                noBorder
                color="dark"
                saturationTxt={100}
                className="h-perc-100"
                onClick={() => {
                  // if (preventExit) {
                  //   setUnsavedModal({
                  //     state: true,
                  //     link: '/properties',
                  //   });
                  //   return;
                  // }
                  history.push('/properties');
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
                className="h-perc-100"
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
      </header>
    </>
  );
};

MenuSidebar.propTypes = {
  history: PropTypes.object.isRequired,
  preventExit: PropTypes.bool.isRequired,
  // setUnsavedModal: PropTypes.func.isRequired,
};

MenuSidebar.defaultProps = {
};

const mapStateToProps = (state) => ({
  isLoading: get(state, 'common.isLoading', 2),
  preventExit: get(state, 'common.preventExitFromScreen', false),
});

const mapDispatchToProps = (dispatch) => ({
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
