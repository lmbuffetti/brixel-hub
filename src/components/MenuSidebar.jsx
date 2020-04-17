import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonTertiary, BrixelTabs, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo.svg';
import { CSSTransition } from 'react-transition-group';

import MenuNavigationSubmenu from './MenuNavigationSubmenu';
import CoverPropertyImage from './CoverPropertyImage';

const MenuSidebar = (props) => {
  const {
    windowDimensions, formValue, history
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  // REF
  const wrapperRef = useRef(null);
  // URL PARAMS
  const propID = history.location.pathname.split('/')[1];

  // CHECK TAB BY URL
  const checkActiveTab = () => {
    let curTab = '';
    if (history) {
      if (history.location.pathname.includes('rewards')) curTab = 'rewards';
      else if (history.location.pathname.includes('property')) curTab = 'property';
      else if (history.location.pathname.includes('listings')) curTab = 'listings';
    }
    return curTab;
  };

  const onTabClick = (val, act = 'url') => {
    if (act === 'state' || val === 'support') {
      setActiveMenu(val);
      setSlideIn(true);
    } else {
      setActiveMenu(null);
      history.push(`/${propID}/${val}`)
    }
  };

  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      setActiveMenu(null);
    },
  });

  return (
    <>
      <header className="sideHeader dis-fl-col a-c jc-fs h-perc-100 shadow-2dp" id="menu-sidebar">
        <div className="w-perc-100 h-perc-100 pt-3">
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className="pos-r sidebar hide dis-b-md w-perc-100 h-perc-100 bgWhite zIndex3">
            <img className="pos-r w-fix-32 ml-2" src={logo} alt="Brixel Logo" id="logo" />

            <div className="mt-3 mb-1 pl-2 pr-5">
              <div className="image-ratio squared w-perc-100 max-w-fix-48 brdRadius ov-h">
                <CoverPropertyImage
                  className="cover"
                  coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                  propertyType={get(formValue, 'properties.propertyType', undefined)}
                />
              </div>
              <h6 className="mt-1 body2 fweight-600">{get(formValue, 'title', '')}</h6>
            </div>
            <BrixelButtonTertiary
              className="pl-2"
              label="All properties"
              rightIcon="arrow-right-small"
              onClick={() => onTabClick('propertyList', 'state')}
            />
            <hr className="my-3" />

            <BrixelTabs
              classNameLi="dis-fl-col dis-fl-row-md my-2 py-0"
              classNameUl="zIndex4"
              labels={['Rewards', 'Property', 'Listings']}
              labelsRight={['Support']}
              labelsIcons={['first-time-occupancy', 'property-house', 'upload', 'conversation']}
              clicksList={['rewards', 'property', 'listings', 'support']}
              classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
              activeTab={activeMenu || checkActiveTab()}
              fullWidth={windowDimensions.width <= 768}
              onClick={(val) => onTabClick(val)}
              showFull={false}
              vertical
            />
          </div>
          <CSSTransition
            in={slideIn}
            timeout={350}
            classNames="slideIn"
            onEnter={() => setSlideIn(true)}
            onExited={() => setActiveMenu(null)}
            unmountOnExit
          >
            <MenuNavigationSubmenu
              windowDimensions={windowDimensions}
              activeMenu={activeMenu}
              onClose={() => { setSlideIn(false)}}
            />
          </CSSTransition>
        </div>
      </header>
    </>
  );
};

MenuSidebar.propTypes = {
  formValue: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MenuSidebar.defaultProps = {
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
  formValue: get(state, 'form.Property.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
