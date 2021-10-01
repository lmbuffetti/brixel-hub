import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  Helpers,
  BrixelButtonIcon,
  reset,
  MultiFileldsReduxForm,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import { QuestionsList } from '../resources/onBoardingBuyer';
import { createUserSearchProfile, updateUserSearchProfile } from '../actions/SearchProfileActions';

const SearchProfileBanner = (props) => {
  const {
    formValue,
    handleCreateSearchProfile,
    handleUpdateSearchProfile,
    isSmallLoading,
    lang,
    loggedInUser,
    preMarketStats,
    subtitle,
    title,
    userSearchProfiles,
    windowDimensions,
  } = props;
  // STATE
  const [showSearchProfileForm, setShowSearchProfileForm] = useState(false);
  const [fullForm, setFullForm] = useState([]);
  const [styleMobileProfile, setStyleMobileProfile] = useState(null);
  // REF
  const profileRef = useRef(null);

  useEffect(() => {
    if (showSearchProfileForm) document.body.classList.add('bgOverlay');
    else {
      setTimeout(() => setStyleMobileProfile(null), 500);
      setTimeout(() => document.body.classList.remove('bgOverlay'), 350);
    }
  }, [showSearchProfileForm]);

  useEffect(() => {
    const inputform = [];
    QuestionsList(lang, 'searchProfile').forEach((form) => {
      if (!form.hideSearchProfile) inputform.push(form);
    });
    setFullForm(inputform);
  }, [userSearchProfiles]);

  // FUNCTION TO SAVE DATA
  const saveData = async () => {
    const dataFormAnswer = cloneDeep(formValue);
    const dataSearchProfile = {
      characteristics: get(dataFormAnswer, 'characteristics', {}),
      location: get(dataFormAnswer, 'locations', []),
      profile: get(dataFormAnswer, 'profile', {}),
      finance: get(dataFormAnswer, 'finance', {}),
    };
    // PROPERTY DATA
    const data = {
      dataSearchProfile,
      smallLoader: 'saveData',
    };
    data.dataSearchProfile.user = loggedInUser.id;
    data.owner = loggedInUser.id;
    if (userSearchProfiles.id) {
      data.id = userSearchProfiles.id;
      handleUpdateSearchProfile(data);
    } else {
      await handleCreateSearchProfile(data);
    }
  };

  // FUNCTION TO SHOW SEARCH PROFILE FORM
  const openForm = (action) => {
    if (action === 'mobile') {
      if (profileRef.current.getBoundingClientRect().top > 50) setStyleMobileProfile(profileRef.current.getBoundingClientRect().top);
      setTimeout(() => {
        setShowSearchProfileForm(!showSearchProfileForm);
      }, 0);
    } else {
      setShowSearchProfileForm(!showSearchProfileForm);
    }
  };

  const cancel = () => {
    setShowSearchProfileForm(false);
  };

  return (
    <>
      <h5 className={`fweight-600 ${subtitle ? 'mb-2' : 'mb-1 mb-lg-3'} txtAltGrey700`}>{title}</h5>
      {subtitle && (<p className="mb-4">{subtitle}</p>)}
      <div className="pos-r headerFormMarketBuyer">
        {
          windowDimensions.width < 1025 && !subtitle && (
            <>
              {
                has(userSearchProfiles, 'id') && (
                  <div>
                    <div className="dis-f py-0 fsize-300 txtDark200 flex-wrap">
                      {
                        /* PROPERRTY TYPE */
                        get(userSearchProfiles, 'characteristics.propertyType', []).length > 0 && (
                          <div
                            className="mr-2"
                          >
                            {
                              get(userSearchProfiles, 'characteristics.propertyType', []).map((item, i) => (
                                <React.Fragment key={i.toString()}>
                                  {i > 0 && (<span>, </span>)}
                                  <span>{item}</span>
                                </React.Fragment>
                              ))
                            }
                          </div>
                        )
                      }
                      {
                        /* PROPERRTY LOCATION */
                        get(userSearchProfiles, 'location', []).length > 0 && (
                          <div
                            className="mr-2"
                          >
                            {
                              get(userSearchProfiles, 'location', []).map((item, i) => (
                                <React.Fragment key={i.toString()}>
                                  {i > 0 && (<span>, </span>)}
                                  <span>{item.name}</span>
                                </React.Fragment>
                              ))
                            }
                          </div>
                        )
                      }
                      { /* PROPERRTY TYPE */}
                      <div className="dis-f ws-nw mr-2">
                        <span>{get(userSearchProfiles, 'characteristics.livingArea.min', 0)} - {get(userSearchProfiles, 'characteristics.livingArea.max', 0)}</span>
                        <span>&nbsp;m2</span>
                      </div>

                      {
                        /* PRICE */
                        get(userSearchProfiles, 'finance.price.totalMax', 0) > 0 && (
                          <div className="dis-f ws-nw">
                            <span>
                              {get(userSearchProfiles, 'finance.currency', 0)}
                            </span>
                            <span className="ml-1">
                              {Helpers.formatNumberValue(get(userSearchProfiles, 'finance.price.totalMax', 0), get(userSearchProfiles, 'finance.currency', 'CHF'))}
                            </span>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )
              }
            </>
          )
        }
        <div className="pos-r">
          <div
            className={`bgWhite brdSmall-lg brdLight200 brdRadius-lg x-t-0 w-perc-100 zIndex3 slideOpen ${showSearchProfileForm ? 'open' : 'close'}`}
            ref={profileRef}
            style={styleMobileProfile ? { position: 'fixed', top: styleMobileProfile } : {}}
          >
            {
              windowDimensions.width < 1025 ? (
                <>
                  <div
                    className="closePanel dis-f jc-b px-2 a-c py-1"
                    style={styleMobileProfile ? {} : {}}
                  >
                    <h5 className="fweight-600 txtAltGrey700">{title}</h5>
                    <BrixelButtonIcon
                      ghost
                      theme="dark"
                      icon="close-small"
                      onClick={() => openForm('mobile')}
                    />
                  </div>
                  <div
                    className="topPanel dis-f jc-b px-0 py-2"
                    style={styleMobileProfile ? { paddingLeft: '16px', paddingRight: '16px' } : {}}
                  >
                    <BrixelButtonSecondary
                      theme="dark"
                      rounded
                      label="Edit"
                      className="noMinWidth"
                      leftIcon="edit-setting"
                      onClick={() => openForm('mobile')}
                    />

                    <div className="dis-f a-c">
                      <div className="bgAltMist200 brdFullRadius dis-f a-c brdSmallLeft brdLight200 h-perc-100 pr-1 ml-1">
                        <BrixelIcon
                          iconWidth="w-fix-24"
                          background="altMist"
                          saturation={200}
                          color="altMist"
                          rounded
                          icon="fire"
                        />
                        <div>
                          <p className="fsize-500 fweight-600 txtAltBlue400">
                            <span>{preMarketStats.total}</span>
                          </p>
                        </div>
                      </div>
                      <div className="bgAltRed200 brdFullRadius dis-f a-c brdSmallLeft brdLight200 h-perc-100 pr-1 ml-1">
                        <BrixelIcon
                          iconWidth="w-fix-24"
                          background="altRed"
                          saturation={200}
                          color="altRed"
                          rounded
                          icon="close-small"
                        />
                        <div>
                          <p className="fsize-500 fweight-600 txtAltRed700">
                            <span>{preMarketStats.dislikedTotal}</span>
                          </p>
                        </div>
                      </div>
                      <div className="bgAltGreen200 brdFullRadius dis-f a-c brdSmallLeft brdLight200 h-perc-100 pr-1 ml-1">
                        <BrixelIcon
                          iconWidth="w-fix-24"
                          background="altGreen"
                          saturation={200}
                          color="altGreen"
                          rounded
                          icon="favorite"
                        />
                        <div>
                          <p className="fsize-500 fweight-600 txtAltGreen400">
                            <span>{preMarketStats.likedTotal}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="dis-f jc-b px-3">
                  {
                    has(userSearchProfiles, 'id') ? (
                      <div
                        className="cur-poi"
                        onClick={() => openForm('desk')}
                      >
                        <div className="dis-f py-3">
                          {
                          /* PROPERRTY TYPE */
                            get(userSearchProfiles, 'characteristics.propertyType', []).length > 0 && (
                              <div
                                className="brdFullRadius brdSmall brdLight200 py-1 px-3 mr-2"
                              >
                                {
                                  get(userSearchProfiles, 'characteristics.propertyType', []).map((item, i) => (
                                    <React.Fragment key={i.toString()}>
                                      {i > 0 && (<span>, </span>)}
                                      <span>{item}</span>
                                    </React.Fragment>
                                  ))
                                }
                              </div>
                            )
                          }
                          {
                          /* PROPERRTY LOCATION */
                            get(userSearchProfiles, 'location', []).length > 0 && (
                              <div
                                className="brdFullRadius brdSmall brdLight200 py-1 px-3 mr-2"
                              >
                                {
                                  get(userSearchProfiles, 'location', []).map((item, i) => (
                                    <React.Fragment key={i.toString()}>
                                      {i > 0 && (<span>, </span>)}
                                      <span>{item.name}</span>
                                    </React.Fragment>
                                  ))
                                }
                              </div>
                            )
                          }
                          { /* PROPERRTY TYPE */ }
                          <div className="brdFullRadius brdSmall brdLight200 dis-f ws-nw py-1 px-3 mr-2">
                            <span>{get(userSearchProfiles, 'characteristics.livingArea.min', 0)} - {get(userSearchProfiles, 'characteristics.livingArea.max', 0)}</span>
                            <span>&nbsp;m2</span>
                          </div>

                          {
                          /* PRICE */
                            get(userSearchProfiles, 'finance.price.totalMax', 0) > 0 && (
                              <div className="brdFullRadius brdSmall brdLight200 dis-f ws-nw py-1 px-3">
                                <span>
                                  {get(userSearchProfiles, 'finance.currency', 0)}
                                </span>
                                <span className="ml-1">
                                  {Helpers.formatNumberValue(get(userSearchProfiles, 'finance.price.totalMax', 0), get(userSearchProfiles, 'finance.currency', 'CHF'))}
                                </span>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setShowSearchProfileForm(!showSearchProfileForm)}
                        className="py-3 dis-f a-c"
                      >
                        <div
                          className="brdFullRadius brdSmall brdLight200 py-1 px-3 mr-2"
                        >
                          <span>Type</span>
                        </div>
                        <div
                          className="brdFullRadius brdSmall brdLight200 py-1 px-3 mr-2"
                        >
                          <span>Location</span>
                        </div>
                        <div
                          className="brdFullRadius brdSmall brdLight200 py-1 px-3 mr-2"
                        >
                          <span>Size</span>
                        </div>
                        <div
                          className="brdFullRadius brdSmall brdLight200 py-1 px-3 mr-2"
                        >
                          <span>Price</span>
                        </div>
                      </div>
                    )
                  }
                  <div className="dis-f a-c">
                    <div className="dis-f a-c brdSmallLeft brdLight200 h-perc-100 pl-2 ml-2">
                      <BrixelIcon
                        iconWidth="w-fix-32"
                        background="altMist"
                        saturation={200}
                        color="altMist"
                        rounded
                        icon="fire"
                      />
                      <div className="ml-1">
                        <p className="fsize-600 fweight-600 txtAltBlue400">
                          <span>{preMarketStats.total}</span>
                          <span className="fsize-400 fweight-400 txtDark700 dis-b mt-1-neg">
                            Matching
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="dis-f a-c brdSmallLeft brdLight200 h-perc-100 pl-2 ml-2">
                      <BrixelIcon
                        iconWidth="w-fix-32"
                        background="altRed"
                        saturation={200}
                        color="altRed"
                        rounded
                        icon="close-small"
                      />
                      <div className="ml-1">
                        <p className="fsize-600 fweight-600 txtAltRed700">
                          <span>{preMarketStats.dislikedTotal}</span>
                          <span className="fsize-400 fweight-400 txtDark700 dis-b mt-1-neg">
                            Don&apos;t like
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="dis-f a-c brdSmallLeft brdLight200 h-perc-100 pl-2 ml-2">
                      <BrixelIcon
                        iconWidth="w-fix-32"
                        background="altGreen"
                        saturation={200}
                        color="altGreen"
                        rounded
                        icon="favorite"
                      />
                      <div className="ml-1">
                        <p className="fsize-600 fweight-600 txtAltGreen400">
                          <span>{preMarketStats.likedTotal}</span>
                          <span className="fsize-400 fweight-400 txtDark700 dis-b mt-1-neg">
                            likes
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            <div className="pt-4 brdSmallTop brdLight200">
              <div className="px-3 max-w-fix-1200 px-2 pb-5 mx-a">
                <div className="searchProfileGrid">
                  <MultiFileldsReduxForm
                    form="GetStarted"
                    disableNextBtn={false}
                    formValue={formValue}
                    nestedInputs={fullForm}
                    showSendButton
                  />
                </div>
                <div className="dis-f a-c">
                  <BrixelButtonSecondary
                    className="mr-a"
                    rounded
                    theme="light"
                    themeSat={600}
                    label="cancel"
                    onClick={() => cancel()}
                  />
                  <BrixelButtonPrimary
                    className="mr-a-lg"
                    rounded
                    theme="altGreen"
                    themeSat={300}
                    label="Save profile"
                    onClick={() => saveData()}
                    isLoading={isSmallLoading.saveData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SearchProfileBanner.propTypes = {
  formValue: PropTypes.object.isRequired,
  handleCreateSearchProfile: PropTypes.func.isRequired,
  handleUpdateSearchProfile: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  preMarketStats: PropTypes.object.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  userSearchProfiles: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

SearchProfileBanner.defaultProps = {
  subtitle: null,
  title: 'Search Profile',
};

const mapStateToProps = (state) => {
  const searchProfile = get(state, 'user.userSearchProfiles', []);
  return ({
    formValue: get(state, 'brixelForm.GetStarted.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'user.loggedInUser.user.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    userSearchProfiles: searchProfile ? searchProfile[searchProfile.length - 1] : searchProfile,
    windowDimensions: get(state, 'common.windowDimensions', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetForm(value) {
    dispatch(reset('GetStarted', value));
  },
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleUpdateSearchProfile: bindActionCreators(updateUserSearchProfile, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileBanner);
