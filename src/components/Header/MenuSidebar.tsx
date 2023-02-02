/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {BrixelIcon} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {destroy} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setActiveSingleProperty} from '../../actions/PropertyActions';
import {setUserTypes} from '../../actions/UserActions';
import {sidebarNavigationBuyer, sidebarNavigationSeller} from '../../resources/Utilities/navigationRoutes';
import type {MenuSidebarType, NavigationType} from '../../@types/components/Header/MenuSidebar';

const MenuSidebar = (props: MenuSidebarType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleDeal,
    lang,
    onClickLink = () => '',
    userType = 'user',
    windowDimensions,
  } = props;
  // STATE
  const [navigationMenu, setNavigationMenu] = useState<NavigationType[]>();
  // URL PARAMS
  const propID = userType === 'seller' ? history.location.pathname.split('/')[1] : history.location.pathname.split('/')[2];
  const levelUrl = history.location.pathname.split('/');

  // FUNCTION TO MAANGE THE TAB CLICK
  const linkMenu = (val) => {
    let url = val.replace(':propID', propID);
    url = url.replace(':dealID', activeSingleDeal.id);
    return url;
  };

  useEffect(() => {
    if (history.location.pathname.includes('buyer')) {
      setNavigationMenu(sidebarNavigationBuyer);
    } else {
      setNavigationMenu(sidebarNavigationSeller);
    }
  }, [get(history, 'location.pathname', null)]);

  return (
    <>
      <header className="sideHeader dis-fl-col a-c jc-fs " id="menu-sidebar">
        <div className="w-perc-100 pos-r ">
          { /* SECTION SIDEBAR MENU DESKTOP */ }
          <div className={`pos-r sidebar w-perc-100  ${levelUrl.length > 3 && windowDimensions.width <= 1024 ? 'zIndex1' : 'zIndex7'}`}>
            <div>
              <ul className="sidebarNav dis-fl-col">
                {
                  navigationMenu && navigationMenu.map((nav, i) => (
                    <React.Fragment key={`mnu_${i.toString()}`}>
                      {
                        !linkMenu(nav.path).includes('undefined') && (
                          <li
                            key={`nav_${i.toString()}`}
                            className={`${history.location.pathname.includes(nav.name) ? 'active' : ''} mainNav fsize-400 fweight-600`}
                            onClick={() => onClickLink()}
                          >
                            <Link
                              to={linkMenu(nav.path)}
                            >

                              <BrixelIcon
                                color="blue"
                                saturationTxt={700}
                                icon={nav.icon}
                              />

                              <span className="pl-1">{translateTo(nav.title, lang)}</span>

                            </Link>
                            {
                              nav.submenu && (
                                <ul className="submenu">
                                  {
                                    nav.submenu.map((submenu, f) => (
                                      <li
                                        key={`nav_${f.toString()}`}
                                        className={`${history.location.pathname.includes(submenu.name) ? 'submenuActive' : ''} subNav`}
                                      >
                                        <Link
                                          to={linkMenu(submenu.path)}
                                          className={`fsize-400 fweight-400  ${history.location.pathname.includes(submenu.name) ? 'txtBlue700' : 'txtText900'}`}
                                        >
                                          <span className="dot" />
                                          <span className="pl-4">{translateTo(submenu.title, lang)}</span>
                                        </Link>
                                      </li>
                                    ))
                                  }
                                </ul>
                              )
                            }
                          </li>
                        )
                      }
                    </React.Fragment>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  lang: get(state, 'common.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
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
  connect(mapStateToProps, mapDispatchToProps),
)(MenuSidebar);
