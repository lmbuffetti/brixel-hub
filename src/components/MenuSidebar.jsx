import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { BrixelButtonTertiary, BrixelTabs, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_full.svg';
import { CSSTransition } from 'react-transition-group';
import { firstRoutes, secondRoutes } from '../resources/navigationRoutes';

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
  const levelUrl = history.location.pathname.split('/');

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
      <header className={`sideHeader dis-fl-col a-c jc-fs h-perc-100`} id="menu-sidebar">
        <div className={`w-perc-100 h-perc-100 pos-r`}>
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className={`pos-r sidebar w-perc-100 h-perc-100 bgWhite pt-3 shadow-2dp ${levelUrl.length > 3 && windowDimensions.width <= 768 ? 'zIndex1' : 'zIndex4'}`}>
          <div className="hide dis-b-md ml-3">
              <img className="pos-r w-fix-56" src={logo} alt="Brixel Logo" id="logo" />

              <div className="mt-3 mb-1">
                <div className="image-ratio squared w-perc-100 shadow-3dp max-w-fix-48 brdRadius ov-h">
                  <CoverPropertyImage
                    className="cover"
                    coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                    propertyType={get(formValue, 'properties.propertyType', undefined)}
                  />
                </div>
                <h6 className="mt-2 fsize-300 fweight-600">{get(formValue, 'title', '')}</h6>
              </div>
              <BrixelButtonTertiary
                className="fsize-200 txtLight700 fweight-600 py-0 min-h-fix-30"
                label="All properties"
                rightIcon="arrow-right-small"
                onClick={() => onTabClick('propertyList', 'state')}
              />
            </div>
            <hr className="my-2 mx-1 lighter" />
            <div className={`brixelNavMenu ${windowDimensions.width <= 768 ? 'shadow-3dp' : ''}`}>
              <BrixelTabs
                classNameLi="dis-fl-col dis-fl-row-md py-1 py-md-0"
                classNameUl="zIndex4"

                labels={firstRoutes.map((item)  => item["title"])}
                labelsRight={secondRoutes.map((item)  => item["title"])}
                labelsIcons={firstRoutes.concat(secondRoutes).map((item)  => item["icon"])}

                clicksList={firstRoutes.concat(secondRoutes).map((item)  => item["name"])}
                classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
                activeTab={activeMenu || checkActiveTab()}
                fullWidth={windowDimensions.width <= 768}
                onClick={(val) => onTabClick(val)}
                showFull={false}
                vertical={windowDimensions.width > 768}
                classNameIcon="fsize-600 fsize-md-400 txtLight300"
                classNameLabel="fsize-300 txtDark500"
              />
            </div>
          </div>
          <CSSTransition
            in={slideIn}
            timeout={200}
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
