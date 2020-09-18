/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelButtonTertiary, BrixelTabs, destroy,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import logo from '@brixel/brixel-configuration-partner/src/images/logo_full.svg';
import { CSSTransition } from 'react-transition-group';
import useOutsideAlerter from './OutsideElement';
import {
  firstRoutes, secondRoutes, firstRoutesBuyer, secondRoutesBuyer,
} from '../resources/navigationRoutes';
import { setUserTypes } from '../actions/UserActions';
import { setActiveSingleProperty } from '../actions/PropertyActions';

import MenuNavigationSubmenu from './MenuNavigationSubmenu';
import CoverPropertyImage from './CoverPropertyImage';
import { sortObject } from '../utils/helpers';

const MenuSidebar = (props) => {
  const {
    activeSingleProperty,
    formValue,
    gameGroup,
    gameHistory,
    handleSetUserTypes,
    handleSetActiveSingleProperty,
    destroyForm,
    history,
    userType,
    windowDimensions,
  } = props;
  // STATE
  const [activeMenu, setActiveMenu] = useState(null);
  const [routeNav, setRouteNav] = useState([]);
  const [slideIn, setSlideIn] = useState(false);
  const [titleTooltip, setTitleTooltip] = useState(false);
  // REF
  const wrapperRef = useRef(null);
  const proTitleRef = useRef(null);

  const proTitleEl = proTitleRef.current;
  // URL PARAMS
  const propID = userType === 'seller' ? history.location.pathname.split('/')[1] : history.location.pathname.split('/')[3];
  const levelUrl = history.location.pathname.split('/');

  // FUNCTION TO LOAD THE GAME GROUP AND THE GAME HISTORY AND CALC THE NUMBER OF SECTION (number iside red circle)
  useEffect(() => {
    if (gameGroup && gameHistory) {
      // let numDone = 0;
      let numTodo = 0;
      const usrGroups = gameGroup.sort(sortObject('stub', 'asc'));
      usrGroups.forEach((groups) => {
        if (groups.stub.includes(userType)) {
          groups.achievements.forEach((group) => {
            if (gameHistory.data) {
              const selElTodo = gameHistory.data.find((game) => game.achievement.stub === group.stub && game.page === propID);
              if (typeof selElTodo === 'undefined') {
                numTodo += 1;
              } else {
                // numDone += 1;
              }
            }
          });
        }
      });
      if (
        get(formValue, 'location.countryCode', 'CH') !== 'CH' &&
        get(formValue, 'location.countryCode', 'CH') !== 'PT'
      ) numTodo -= 2;
      const nav = cloneDeep(firstRoutes);
      nav[0].title = `<span>Home</span><span class="numRecords">${numTodo}</span>`;
      setRouteNav([...nav]);
    }
  }, [gameGroup, gameHistory, activeSingleProperty]);

  // FUNCTION TO CALC IF TITLE IS LONG OR NOT AND ASSIGN THE DIFFERENT CLASS
  useEffect(() => {
    if (proTitleEl) {
      const titleHeight = proTitleEl.offsetHeight;
      if (titleHeight > 48) {
        proTitleEl.classList.add('longTitle');
        setTitleTooltip(true);
      }
    }
  });

  // FUNCTION TO MAANGE THE TAB CLICK
  const onTabClick = (val, act = 'url') => {
    if (act === 'state' || val === 'support' || val === '/support') {
      setActiveMenu(val.replace('/', ''));
      setSlideIn(true);
    } else {
      if (userType === 'seller') {
        history.push(`/${propID}/${val}`);
      } else {
        const url = val.replace(':propID', propID);
        history.push(url);
      }
      setActiveMenu(null);
    }
  };

  // FUNCTION TO SHOW/HIDE THE SUPPORT MENU (history.push({state: {showSupport: true}}))
  useEffect(() => {
    if (get(history, 'location.state.showSupport', null) === true) {
      onTabClick('support');
    }
  }, [get(history, 'location.state', null)]);

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

  // FUNCTION WHEN SUPPORT MENU IS CLOSED
  const onCloseSupport = () => {
    setActiveMenu(null);
    setSlideIn(false);
    history.push({ state: null });
  };

  // FUNCTION TO MANAGE CLICK OUTSIDE OF SUPPORT MENU
  useOutsideAlerter(wrapperRef, {
    action: 'function',
    func: () => {
      onCloseSupport();
    },
  });

  return (
    <>
      <header className="sideHeader dis-fl-col a-c jc-fs h-perc-100" id="menu-sidebar">
        <div className="w-perc-100 h-perc-100 pos-r">
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className={`pos-r sidebar w-perc-100 h-perc-100 bgWhite shadow-2dp ${levelUrl.length > 3 && windowDimensions.width <= 1024 ? 'zIndex1' : 'zIndex7'}`}>
            <div className="hide dis-b-md pl-3 pr-2">
              <div className="h-fix-64 dis-f a-c">
                <img className="pos-r w-fix-56" src={logo} alt="Brixel Logo" id="logo" />
              </div>

              <BrixelButtonTertiary
                label="Sell"
                rightIcon="arrow-right-small"
                onClick={() => {
                  handleSetUserTypes('seller');
                  handleSetActiveSingleProperty({});
                  history.push('/');
                }}
                color="dark"
                saturation={history.location.pathname.includes('buyer') ? 200 : 700}
              />
              <BrixelButtonTertiary
                label="Buy"
                rightIcon="arrow-right-small"
                onClick={() => {
                  destroyForm();
                  handleSetUserTypes('buyer');
                  handleSetActiveSingleProperty({});
                  history.push('/buyer/propertyLists');
                }}
                color="dark"
                saturation={history.location.pathname.includes('buyer') ? 700 : 200}
              />

              {
                get(formValue, 'id', undefined) && (
                  <div className="propertyPanel mb-1">
                    <div
                      className="image-ratio squared w-perc-100 shadow-3dp w-fix-48 h-fix-48 brdRadius ov-h cur-poi"
                      onClick={() => {
                        if (!history.location.pathname.includes('rewards')) history.push(`/${propID}/rewards`);
                      }}
                    >
                      <CoverPropertyImage
                        className="cover"
                        coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
                        propertyType={get(formValue, 'properties.propertyType', undefined)}
                      />
                    </div>
                    <div className="titleWrapper pos-r">
                      <h6
                        ref={proTitleRef}
                        className="mt-2 fsize-300 fweight-600 cur-poi"
                        onClick={() => {
                          if (!history.location.pathname.includes('rewards')) history.push(`/${propID}/rewards`);
                        }}
                      >
                        {get(formValue, 'title', '')}
                      </h6>
                      {
                        titleTooltip && (
                          <span className="titleTooltip dis-b">
                            {get(formValue, 'title', '')}
                          </span>
                        )
                      }
                    </div>
                  </div>
                )
              }
            </div>
            <hr className="my-2 mx-1 lighter" />
            <div className={`brixelNavMenu ${windowDimensions.width <= 1024 ? 'shadow-3dp' : ''}`}>
              {
                userType === 'seller' ? (
                  <BrixelTabs
                    classNameLi="dis-fl-col dis-fl-row-md py-1 py-md-0 pos-r"
                    classNameUl="zIndex4"
                    labels={routeNav.concat(secondRoutes).map((item) => item.title)}
                    labelsIcons={firstRoutes.concat(secondRoutes).map((item) => item.icon)}
                    clicksList={firstRoutes.concat(secondRoutes).map((item) => item.name)}
                    classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
                    activeTab={activeMenu || checkActiveTab()}
                    fullWidth={windowDimensions.width <= 1024}
                    onClick={(val) => onTabClick(val)}
                    showFull={false}
                    vertical={windowDimensions.width > 1024}
                    classNameIcon="fsize-md-400 txtLight600"
                    classNameLabel="fsize-300 txtLight600 dis-f a-c"
                  />
                ) : (
                  <BrixelTabs
                    classNameLi="dis-fl-col dis-fl-row-md py-1 py-md-0 pos-r"
                    classNameUl="zIndex4"
                    labels={activeSingleProperty.id ? firstRoutesBuyer.concat(secondRoutesBuyer).map((item) => item.title) : secondRoutesBuyer.map((item) => item.title)}
                    labelsIcons={activeSingleProperty.id ? firstRoutesBuyer.concat(secondRoutesBuyer).map((item) => item.icon) : secondRoutesBuyer.map((item) => item.icon)}
                    clicksList={activeSingleProperty.id ? firstRoutesBuyer.concat(secondRoutesBuyer).map((item) => item.path) : secondRoutesBuyer.map((item) => item.path)}
                    clicksListName={activeSingleProperty.id ? firstRoutesBuyer.concat(secondRoutesBuyer).map((item) => item.name) : secondRoutesBuyer.map((item) => item.name)}
                    classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
                    activeTab={activeMenu || checkActiveTab()}
                    fullWidth={windowDimensions.width <= 1024}
                    onClick={(val) => onTabClick(val)}
                    showFull={false}
                    vertical={windowDimensions.width > 1024}
                    classNameIcon="fsize-md-400 txtLight600"
                    classNameLabel="fsize-300 txtLight600 dis-f a-c"
                  />
                )
              }
            </div>
            <hr className="my-2 mx-1 lighter" />
            {
              userType === 'seller' && (
                <div className="hide dis-b-md pl-3 pr-2 mt-2">
                  <BrixelButtonTertiary
                    className="fsize-300 txtLight600 fweight-600 py-0 min-h-fix-30"
                    label="All properties"
                    rightIcon="arrow-right-small"
                    onClick={() => onTabClick('propertyList', 'state')}
                  />
                </div>
              )
            }
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
              onClose={() => onCloseSupport()}
            />
          </CSSTransition>
        </div>
      </header>
    </>
  );
};

MenuSidebar.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSetActiveSingleProperty: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  userType: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

MenuSidebar.defaultProps = {
  userType: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', { }),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', { })),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  userType: get(state, 'user.userTypes', ''),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
