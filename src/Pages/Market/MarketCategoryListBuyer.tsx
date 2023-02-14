import {BrixelButtonIcon, BrixelButtonPrimary, BrixelDropdown, BrixelIcon} from '@brixel/brixel-components';
import get from 'lodash/get';
import React, {Suspense, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setHistory, setModal, setSplashType} from '../../actions/CommonActions';
import {getActiveSingleCompany} from '../../actions/CompanyActions';
import {getBuyerProperties} from '../../actions/MarketActions';
import {setActiveMarketOverlayProperty, setEstimation} from '../../actions/PropertyActions';
import MarketCard from '../../components/Cards/MarketCard';
import Pagination from '../../components/Pagination';
import SearchProfileField from '../../components/SearchProfileField';
import SplashScreen from '../../components/SplashScreen';
import searchProfileDeskImg from '../../images/Market/searchProfileDesk.svg';
import searchProfileMobileImg from '../../images/Market/searchProfileMobile.svg';
import {QuestionsList} from '../../resources/Flows/onBoardingBuyer';
import {getCookie, setCookie} from '../../utils/helpers';
import {titleSearchProfile} from '../../utils/titleCreationSearchProfile';
import translateTo from '../../utils/translation';
import LearnMoreListingsProperty from './Buyer/LearnMoreListingsProperty';
import type {MarketCategoryListBuyerType} from '../../@types/Pages/Market/MarketCategoryListBuyer';

const MarketCategoryListBuyer = (props: MarketCategoryListBuyerType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    buyerProperties,
    activeSearchProfile,
    filterPropType = [],
    handleGetActiveBuyerProperties,
    handleGetActiveSingleCompany,
    handleSetModal,
    lang,
    loggedInUser,
    setSplashScreen,
    skeleton,
    splashScreenType,
    userSearchProfiles,
    windowDimensions,
  } = props;
  // STATE
  const [fieldsSearchProfile, setFieldsSearchProfile] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(filterPropType[0]);
  // URL PARAMS
  const cat = get(match, 'cat', null);
  const page = get(match, 'page', 0);

  useEffect(() => {
    const fields: string[] = [...fieldsSearchProfile];
    QuestionsList(lang, 'searchProfile', () => '', 'SearchProfile').forEach((inputs) => {
      if (inputs.inputs) {
        inputs.inputs.forEach((field) => {
          if (field.name && field.name !== 'location.countryCode') {
            if (field.name.includes('location')) fields.push('location');
            else if (!field.name.includes('register')) fields.push(field.name);
          }
        });
      }
    });
    setFieldsSearchProfile(fields);
  }, []);

  useEffect(() => {
    if (page && cat && activeSearchProfile) {
      const data = {
        limit: 9,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        searchProfileId: activeSearchProfile.id,
        type: cat,
      }
      handleGetActiveBuyerProperties(data);
    }
  }, [page, cat, activeSearchProfile]);

  useEffect(() => {
    if (get(loggedInUser, 'id', null)) {
      let cmpID;
      if (get(loggedInUser, 'company.id', null)) cmpID = get(loggedInUser, 'company.id', '');
      else if (loggedInUser.companies) cmpID = loggedInUser.companies[0];
      handleGetActiveSingleCompany({id: cmpID});
    }
  }, [loggedInUser.id]);

  // Update market card when bestimate changes
  useEffect(() => {
    if (getCookie('brixelSplashHome') === 'buyerWelcome') {
      setSplashScreen('buyerWelcome');
    }
  }, [getCookie('brixelSplashHome')]);

  const onCloseWelcome = () => {
    setCookie('brixelMarketWelcome', true);
    setCookie('brixelSplashHome', null);
    setSplashScreen('');
  };

  useEffect(() => {
    const catList = document.getElementsByClassName('market-container')[0];
    if (catList) catList.classList.add('market-listings');
    return () => {
      if (catList) catList.classList.remove('market-listings');
    };
  }, []);

  useEffect(() => {
    const fltProp = filterPropType.find((flt) => flt.value === cat);
    if (fltProp) setActiveTab(fltProp);
  }, [cat]);

  const onLearnMore = () => {
    handleSetModal({
      bodyClassColor: 'white ov-v',
      title: '',
      layout: 'large',
      small: true,
      component: React.createElement(LearnMoreListingsProperty, {lang}),
      state: true,
    })
  }

  const onChangeFilter = (val) => {
    setActiveTab(val);
    history.push(`/buy/searchProfile/${val.value}/1`);
  }

  return (
    <>
      <Suspense fallback="">
        <div className="buyerMarket">
          {/* SECTION: buyer welcome message  */}
          {
            splashScreenType === 'buyerWelcome' && (
              <SplashScreen
                className="result-popup centered"
                closeOutside={false}
              >
                <div className="dis-f jc-fe mb-2">
                  <BrixelButtonIcon
                    ghost
                    theme="text"
                    icon="close-small"
                    onClick={() => onCloseWelcome()}
                  />
                </div>
                <div className="dis-fl-col jc-c a-c pb-2">
                  <h3>{translateTo('Welcome 🖐', lang)}</h3>
                  <span className="txtText600 pt-2 pb-5">
                    {translateTo('This is our Brixel market. A place where you can do great things.', lang)}
                  </span>
                  <div className="mb-5">
                    <div className="dis-f mb-2">
                      <div className="dis-f a-c min-w-fix-64 jc-fe">
                        <BrixelIcon
                          icon="favorite-fill"
                          color="red"
                        />
                      </div>
                      <span className="max-w-fix-424 txtText900 pl-2">
                        {translateTo('Manage your favorites and buy your new home directly on Brixel.', lang)}
                      </span>
                    </div>
                    <div className="dis-f mb-2">
                      <div className="dis-f a-c min-w-fix-64 jc-fe">
                        <span className="category-tag bgPrimary300">
                          {translateTo('Pre', lang)}
                        </span>
                      </div>
                      <span className="max-w-fix-424 txtText900 pl-2">
                        {translateTo('Discover exclusive properties which are not on the market yet, but waiting for your first move.', lang)}
                      </span>
                    </div>
                    <div className="dis-f">
                      <div className="dis-f a-c min-w-fix-64 jc-fe">
                        <span className="category-tag bgRed400">
                          {translateTo('Premium', lang)}
                        </span>
                      </div>
                      <span className="max-w-fix-424 txtText900 pl-2">
                        {translateTo('Explore our Premium properties with 3D tour, detailed documentation and verified informations.', lang)}
                      </span>
                    </div>
                  </div>
                  <BrixelButtonPrimary
                    label={translateTo('ok, got it!', lang)}
                    rounded
                    onClick={() => onCloseWelcome()}
                  />
                </div>
              </SplashScreen>
            )
          }

          { /* SEARCH PROFILE */}
          <div className="bgGreen50 mt-3 min-h-fix-320">
            {
              !userSearchProfiles ? (
                <div className="container px-0 py-10">
                  <div className="w-perc-80 ov-h brdRadius h-fix-md-152 mb-4 dis-f">
                    <div className="ml-md-4 ml-2 h-perc-100 dis-fl-col w-perc-100 py-2">
                      <p className="h-fix-40 skeletonBgInner w-perc-70"> </p>
                      <p className="h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100"> </p>
                      <p className="h-fix-16 mt-1 skeletonBgInner w-perc-100"> </p>
                      <p className="h-fix-40 mt-2 skeletonBgInner w-perc-80"> </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={windowDimensions.width <= 768 && !activeSearchProfile?.id ? '' : 'container'}>
                  {
                    activeSearchProfile?.id ? (
                      <div className="dis-f jc-b-lg a-c py-10">
                        <div className="w-perc-100 max-w-fix-880 ml-a mr-a ta-c">
                          <Link
                            className="fweight-600 fsize-300 td-u"
                            to='/buy/searchProfile/list'
                          >
                            {translateTo('Manage Search Profiles', lang)}
                          </Link>
                          <h3 className="txtBlue700 fweight-600 mt-4">
                            {get(activeSearchProfile, 'name', null) || titleSearchProfile(activeSearchProfile, lang)}
                          </h3>
                          <p className="mt-1 fsize-300 txtText700">
                            {translateTo('Search profiles allow you to keep track of the properties that match your needs.', lang)}
                          </p>
                          <div className="dis-f flex-wrap a-t jc-c mt-4">
                            {
                              fieldsSearchProfile.map((field, index) => (
                                <React.Fragment key={`search${index.toString()}`}>
                                  {
                                    field !== 'isDefault' && field !== 'name' && (
                                      <>
                                        <SearchProfileField
                                          onClick={() => history.push(`/buy/searchProfile/list/edit/${activeSearchProfile.id}`, {state: { url: `/buy/searchProfile/${cat}/${page}` }})}
                                          searchProfile={activeSearchProfile}
                                          field={field}
                                          lang={lang}
                                        />
                                      </>
                                    )
                                  }
                                </React.Fragment>
                              ))
                            }
                            <BrixelButtonIcon
                              icon="edit-setting"
                              secondary
                              className="bgWhite"
                              onClick={() => history.push(`/buy/searchProfile/list/edit/${activeSearchProfile.id}`, {state: { url: `/buy/searchProfile/${cat}/${page}` }})}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="dis-f jc-b-lg a-c flex-wrap">
                        {
                          windowDimensions.width <= 768 && (
                            <div className="w-100-vw">
                              <img width="100%" src={searchProfileMobileImg} alt="Search Profile" />
                            </div>
                          )
                        }
                        <div className="max-w-fix-344 w-perc-100 pb-8 pb-md-0 ta-c ta-l-md m-a m-md-0">
                          <h3 className="txtGreen700 fweight-600 mt-4 mt-md-0 mb-1">
                            {translateTo('Create your personalized Search', lang)}
                          </h3>
                          <p className="fsize-300 txtText700">
                            {translateTo('You can create multiple Search Profiles to apply different filters and find the properties that best match your needs.', lang)}
                          </p>
                          <BrixelButtonPrimary
                            onClick={() => history.push('/buy/searchProfile/list/create')}
                            className="mt-3 mx-a mx-md-0"
                            rounded
                            leftIcon="plus"
                            label={translateTo('Create search Profile', lang)}
                          />
                        </div>
                        {
                          windowDimensions.width > 768 && (
                            <div className="w-perc-50">
                              <img className="min-h-fix-320" src={searchProfileDeskImg} alt="Search Profile" />
                            </div>
                          )
                        }
                      </div>
                    )
                  }
                </div>
              )
            }

          </div>

          <div className="container">
            <div className="dis-fl-col dis-fl-row-sm a-c jc-c jc-b-sm my-5">
              <div className="ta-l max-w-fix-304 mb-2 mb-sm-0">
                <h4 className="fweight-600 dis-f a-c">
                  <span className="mr-1">{translateTo('Results', lang)}</span>
                  <span>({get(buyerProperties, 'total', 0)})</span>
                  {
                    buyerProperties.total > 0 && (
                      <div
                        className="dis-f cur-poi"
                        onClick={() => onLearnMore()}
                      >
                        <BrixelIcon
                          color="green"
                          className="ml-1"
                          icon="info"
                        />
                        <span className="txtGreen400 fsize-300 fweight-500 td-u pl-1">{translateTo('Learn more', lang)}</span>
                      </div>
                    )
                  }
                </h4>
                {
                  get(buyerProperties, 'total', null) !== null && (
                    <>
                      {
                        buyerProperties.total === 0 && (
                          <div>
                            <p className="txtText700 fSizePx14">
                              <span>
                                {translateTo('Properties could already be for sale or still in the Pre-Market.', lang)}
                              </span>
                              <span>
                                <button
                                  className="ml-1 txtGreen400 td-u fweight-600"
                                  onClick={() => onLearnMore()}
                                >
                                  {translateTo('Learn more.', lang)}
                                </button>
                              </span>
                            </p>
                          </div>
                        )
                      }
                    </>
                  )
                }
              </div>
              <div>
                <BrixelDropdown
                  selected={translateTo(activeTab.label || '', lang)}
                  onSelect={(e, val) => onChangeFilter(val)}
                  options={filterPropType}
                />
              </div>
            </div>
            <div className="row-cols-1-gut-3 row-cols-sm-2-gut-3 row-cols-md-3-gut-3">
              {
                skeleton.buyerProperties === 'CardImageTextVertical' ? (
                  <>
                    {
                      [...Array(3)].map((x, i) => (
                        <div
                          key={`skeleton${i.toString()}`}
                          className="w-perc-100 ov-h brdRadius pb-2"
                        >
                          <div className="h-perc-100 dis-fl-col w-perc-100">
                            <div className="h-fix-208 skeletonBgInner w-perc-100" />
                            <div className="h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" />
                            <div className="h-fix-16 mt-1 skeletonBgInner w-perc-100" />
                            <div className="h-fix-40 mt-2 skeletonBgInner w-perc-100" />
                          </div>
                        </div>
                      ))
                    }
                  </>
                ) : (
                  <>
                    {
                      get(buyerProperties, 'data', []).map((property, index) => (
                        <MarketCard
                          layout="singleOwnCard"
                          type="premium"
                          key={`nmCrd_${index.toString()}`}
                          item={property}
                          lang={lang}
                        />
                      ))
                    }
                  </>
                )
              }
            </div>
            <div className="pb-8">
              <Pagination
                className="mt-5 pb-10"
                totalItems={buyerProperties.total || 0}
                itemsPerPage={9}
                activePage={(+page - 1) * 9}
                paginate={(resultsPerPage, skip, pageNumber) => history.push(`/buy/searchProfile/${cat}/${pageNumber}`)}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

const mapStateToProps = (state) => ({
  buyerProperties: get(state, 'market.buyerProperties', {}),
  activeSearchProfile: get(state, 'user.activeSearchProfile', null),
  estimation: get(state, 'property.estimation', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  preMarketStats: get(state, 'market.preMarketStats', {}),
  premiumEuropeProperties: get(state, 'market.premiumEuropeProperties', {}),
  premiumProperties: get(state, 'market.premiumProperties', {}),
  skeleton: get(state, 'common.skeleton', {}),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveBuyerProperties: bindActionCreators(getBuyerProperties, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCategoryListBuyer);
