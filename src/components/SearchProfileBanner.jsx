import React, {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {
  bindActionCreators,
  compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, Helpers, MultiFileldsReduxForm,
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
  } = props;
  // STATE
  const [showSearchProfileForm, setShowSearchProfileForm] = useState(false);
  const [fullForm, setFullForm] = useState([]);

  useEffect(() => {
    if (showSearchProfileForm) document.body.classList.add('bgOverlay');
    else document.body.classList.remove('bgOverlay');
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

  return (
    <>
      <h5 className={`fweight-600 ${subtitle ? 'mb-2' : 'mb-3'} txtAltGrey400`}>{title}</h5>
      {subtitle && (<p className="mb-4">{subtitle}</p>)}
      <div className="pos-r headerFormMarketBuyer">
        <div className={`bgWhite brdSmall brdLight200 brdRadius px-3 pos-a-fix x-t-0  w-perc-100 zIndex3 slideOpen ${showSearchProfileForm ? 'open' : 'close'}`}>
          <div className="dis-f jc-b">
            {
              has(userSearchProfiles, 'id') ? (
                <div
                  className="cur-poi"
                  onClick={() => setShowSearchProfileForm(!showSearchProfileForm)}
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
                  <p className="fsize-600 fweight-600 txtAltRed400">
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
          <div className="mt-4">
            <div className=" max-w-fix-1030 px-2 pb-5 mx-a">
              <div className="row-cols-1-gut-1 row-cols-md-2-gut-4">
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
                />
                <BrixelButtonPrimary
                  className="mr-a"
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
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleCreateSearchProfile: bindActionCreators(createUserSearchProfile, dispatch),
  handleUpdateSearchProfile: bindActionCreators(updateUserSearchProfile, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SearchProfileBanner);
