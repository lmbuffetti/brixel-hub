/* eslint-disable react-hooks/exhaustive-deps */
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import pullAt from 'lodash/pullAt';
import compact from 'lodash/compact';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  FormatValue,
  Helpers,
  ProgressRing,
} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
import {
  calcPercentageProEstimation, setCookie, completedBestimate,
} from '../../utils/helpers';
import { setSplashType } from '../../actions/CommonActions';
import { generateEstimation } from '../../actions/EstimationActions';
import {
  setActiveSingleProperty,
  setEstimation,
  setActiveMarketOverlayProperty,
  setActiveMarketOverlayPropertyLists,
  getEstimation, getPackageProperty,
} from '../../actions/PropertyActions';

const MarketCard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    companyListings,
    favoritesProperties,
    handleGenerateBestimate,
    handleGetEstimation,
    handleGetPackageProperty,
    isSmallLoading,
    item,
    lang,
    layout,
    onSetActiveProperty,
    preventClick,
    setMarketOverlayProperty,
    setPropertyEstimation,
    setSplashScreen,
    skeleton,
    type,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  
  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && coverImgLoaded) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);
  
  const isPreMarket = () => get(item, 'tags', []).includes('pre-market');
  
  // Process tags
  useEffect(() => {
    const result = [];
    if (get(item, 'tags', []).length > 1) {
      item.tags.forEach((tag) => {
        if (tag === 'updated') result.splice(0, 0, tag);
        if (tag === 'new') result.splice(1, 0, tag);
        if (tag === 'premium') result.splice(2, 0, tag);
        if (tag === 'pre-market') result.splice(3, 0, tag);
      });
      set(item, 'tags', pullAt(compact(result), [0, 1]));
    }
  }, [get(item, 'tags', [])]);
  
  useEffect(() => {
    if (layout === 'singleOwnCard') {
      handleGetPackageProperty({ id: get(item, 'id', null), smallLoader: `loadPackage${get(item, 'id', '')}`, addToOwnerProp: true });
    }
  }, [layout, item]);
  
  const openCard = (e) => {
    if (e) e.preventDefault();
    if (!preventClick) {
      if (type === 'own') {
        history.push({
          pathname: `/${item.id}/home`,
          state: { section: 'Market' },
        });
      } else if (type === 'preMarket' || get(item, 'tags', []).includes('pre-market') ||
        ((
          type === 'premium' || get(item, 'tags', []).includes('premium') ||
          type === 'new' || get(item, 'tags', []).includes('new')
        ) && type !== 'favorite' && type !== 'wishlist' && !history.location.pathname.includes('sell'))
      ) {
        window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
      } else if (type === 'favorite' || type === 'wishlist') {
        history.push({
          pathname: `/buyer/${item.id}/home`,
          state: { section: 'Market' },
        });
      } else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
      // TODO: Estimation opens overlay
    }
  };
  
  const openBestimateOverlay = (e, location, estim, page, action) => {
    if (e) e.preventDefault();
    onSetActiveProperty(page.id);
    setMarketOverlayProperty(page);
    if (location.countryCode !== 'PT' && location.countryCode !== 'CH') {
      setCookie('brixelMarketBestimate', false);
      setSplashScreen('bestimateTeaser');
    }
    if (location.countryCode === 'CH' || location.countryCode === 'PT') {
      if (action === 'new') {
        setCookie('brixelMarketBestimate', false);
        setSplashScreen('bestimateTeaser');
      } else {
        if (!has(estim, 'result')) {
          const payload = {
            reloadOnwProperties: true,
            type: 'market',
            id: item.id,
          };
          handleGetEstimation(payload);
        } else if (has(estim, 'result') && !has(estim, 'result.value')) {
          handleGenerateBestimate(estim.id);
        }
        setCookie('brixelMarketBestimate', false);
        setSplashScreen('bestimateResult');
        setPropertyEstimation(estim);
      }
    }
  };
  
  const selectActiveServicePackage = () => {
    let basicPackage = null;
    if (companyListings.length > 0) {
      const activeCompany = companyListings.find((cmp) => cmp.id === get(item, 'company', ''));
      if (activeCompany) {
        const activeCompanyPackages = get(activeCompany, 'servicePackages', []);
        basicPackage = activeCompanyPackages.find((pkg) => pkg.type === 'basic');
      }
      if (get(item, 'servicePackage', null)) {
        const activeSinglePropertyPackage = cloneDeep(get(item, 'servicePackage', []));
        if (activeSinglePropertyPackage.length > 0) {
          const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
          const getActivePackage = sortedPackage.find((pkg) => pkg.started);
          if (get(getActivePackage, 'servicePackage', null)) {
            return getActivePackage.servicePackage;
          }
          if (get(sortedPackage[0], 'servicePackage', null)) {
            return sortedPackage[0].servicePackage;
          }
        }
      }
    }
    return basicPackage;
  };
  
  const checkFavorite = () => {
    const findIndex = favoritesProperties.findIndex((prop) => prop.id === get(item, 'id', null));
    return findIndex > -1;
  };
  
  // eslint-disable-next-line consistent-return
  const getTypeText = (text) => {
    switch (text) {
      case 'new': {
        return 'New';
      }
      case 'updated': {
        return 'Updated';
      }
      case 'premium': {
        return 'Premium';
      }
      case 'pre-market': {
        return 'Pre-market';
      }
      default:
    }
  };
  
  // eslint-disable-next-line consistent-return
  const getColor = (text) => {
    switch (text) {
      case 'new': {
        return 'Green';
      }
      case 'updated': {
        return 'Yellow';
      }
      case 'premium': {
        return 'Red';
      }
      case 'pre-market': {
        return 'Primary';
      }
      default:
    }
  };
  
  return (
    <>
      {
        (!removeSkeleton || !item) && (
          <CardImageText type={type} />
        )
      }
      <div
        className={`market-card ov-h cur-poi h-perc-100 pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} `}
        onClick={(e) => (type !== 'own' ? openCard(e) : '')}
      >
        <div className={`${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} ${layout === 'singleOwnCard' ? 'px-0' : 'px-1'}`}>
          {
            type === 'own' ? (
              <>
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 ${layout === 'singleOwnCard' ? 'w-fix-sm-184 h-fix-184 mb-1 mb-sm-0' : 'w-fix-sm-208 h-fix-208 mb-1'}`}
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                  onClick={(e) => openCard(e)}
                />
                {
                  get(item, 'tags', []).length > 0 && layout !== 'singleOwnCard' && (
                    <div className="tag-container pos-a dis-fl-row a-c jc-b">
                      {
                        get(item, 'tags', []).filter((tag) => tag !== 'new').map((tag, i) => (
                          <p
                            key={`itm_${i.toString()}`}
                            className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                            onClick={() => tag === 'pre-market' && history.push(`/${item.id}/marketing/portals`)}
                          >
                            <span className="type">
                              {translateTo(getTypeText(tag), lang)}
                            </span>
                          </p>
                        ))
                      }
                    </div>
                  )
                }
                
                <div className="info dis-fl-col pl-sm-4 pl-0 w-perc-100 jc-b">
                  <div>
                    <div
                      className="top dis-fl-col"
                      onClick={(e) => openCard(e)}
                    >
                      <h6
                        className="fweight-600 fsize-500 fsize-sm-600 mb-small-4 txtDark700 ellipsis two w-perc-100 ta-l mb-2 notranslate"
                      >
                        {translateTo(get(item, 'title', ''), lang)}
                      </h6>
                      <div>
                        <span className="fsize-300 txtAltGrey700 mb-1 ta-l brdSmallRight brdLight400 mr-2 pr-2 dis-ib notranslate">
                          {get(item, 'location.zip', '')} {get(item, 'location.city', '')}
                          {
                            get(item, 'location.countryCode', 'CH') === 'CH' && (
                              <>
                                {` (${get(item, 'location.stateCode', '')})`}
                              </>
                            )
                          }
                        </span>
                        <span className="fsize-300 txtAltGrey700 mb-1 ta-l brdSmallRight mr-2 pr-2 brdLight400 dis-ib">
                          {translateTo(get(item, 'properties.propertyType', ''), lang)}
                        </span>
                        <span className="fsize-300 txtAltGrey700 mb-1 ta-l brdSmallRight mr-2 pr-2  brdLight400 dis-ib notranslate">
                          {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                        </span>
                        {
                          get(item, 'properties.typology.livingArea.value', 0) > 0 && (
                            <span className="dis-ib notranslate">
                              <span className="fsize-300 txtAltGrey700">
                                {get(item, 'properties.typology.livingArea.value', 0)}
                              </span>
                              <span className="fsize-300 txtAltGrey700"> m2</span>
                            </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="">
                    {
                      item && get(item, 'price.total', 0) > 0 ? (
                        <div className="dis-fl-col mt-2">
                          <div className="dis-f a-c">
                            <BrixelIcon
                              background="blue"
                              saturation={100}
                              color="blue"
                              saturationTxt={700}
                              padding="p-small-12"
                              icon="price"
                              rounded
                              className="mr-0"
                              iconSize="large"
                            />
                            <div className="ml-2 dis-fl-col">
                              <span className="txtLight600 fsize-300">
                                {translateTo('Your Price', lang)}</span>
                              <Link to={`/${item.id}/property/price`} className="txtBlue700 fweight-600">
                                <span>{get(item, 'price.currency', 0)}</span>
                                <span className="ml-1">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', 0))}</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="dis-f pt-sm-2 a-t pt-3 pt-sm-0">
                          <BrixelIcon
                            className="dis-b-sm hide mr-2"
                            background="blue"
                            saturation={100}
                            color="blue"
                            saturationTxt={700}
                            padding="p-small-12"
                            icon="chart"
                            rounded
                            iconSize="large"
                          />
                          <div className="dis-fl-col">
                            <span className="txtLight600 fsize-300">{translateTo('Your Bestimate', lang)}</span>
                            {
                              ((get(item, 'estimation.status', '') === 'pending' && completedBestimate(item)) || (get(item, 'properties.propertyType', null) === 'Commercial' || get(item, 'properties.propertyType', null) === 'Building land')) ? (
                                <span className="txtBlue700 fweight-600">
                                  {translateTo('Pending', lang)}
                                </span>
                              ) : (
                                <>
                                  {
                                    get(item, 'estimation.status', '') !== 'processed' && (
                                      <Link
                                        to={`/${item.id}/singleFlow/achievement/bestimate/step1?url=/sell`}
                                        className="txtBlue700 fweight-600"
                                      >
                                        {translateTo('Get Estimation', lang)}
                                      </Link>
                                    )
                                  }
                                </>
                              )
                            }
                            {
                              get(item, 'estimation.status', '') === 'processed' && (get(item, 'properties.propertyType', null) === 'House' || get(item, 'properties.propertyType', null) === 'Apartment') && (
                                <div
                                  onClick={(e) => openBestimateOverlay(e, item.location, item.estimation, item, 'exists')}
                                  className="txtBlue700 no-state fweight-600"
                                >
                                  {get(item, 'estimation.result.currency', '')} {Helpers.formatNumberValue(get(item, 'estimation.result.higherValue', ''), get(item, 'estimation.currency', ''))}
                                </div>
                              )
                            }
                          </div>
                          {
                            (get(item, 'properties.propertyType', '') === 'House' || get(item, 'properties.propertyType', '') === 'Apartment') && (
                              <div
                                onClick={() => window.location.assign(`/${item.id}/property/price/proEstimation`)}
                                className="dis-fl-row a-c ml-4 brdSmallLeft brdLight400 pl-4"
                              >
                                <div className="hide dis-fl-row-sm">
                                  <div className="pos-r h-fix-48 w-fix-48">
                                    <ProgressRing
                                      customIcon={get(item, 'proEstimation.value', 0) <= 0 && calcPercentageProEstimation(item).realPerc === 100 ? 'hourglass' : null}
                                      iconColor={{
                                        color: 'primary',
                                        sat: 400,
                                      }}
                                      progress={calcPercentageProEstimation('', item).realPerc}
                                      size={48}
                                      strokeWidth={10}
                                      circleOneStroke="#D7F0F1"
                                      circleTwoStroke={calcPercentageProEstimation('', item).realPerc === 100 ? '#218B80' : '#004D71'}
                                      showIcon={false}
                                      showIconComplete={calcPercentageProEstimation('', item).realPerc === 100}
                                    />
                                  </div>
                                </div>
                                <div className="pl-2">
                                  <span className="txtLight600 fsize-300 dis-b">{translateTo('Pro estimation', lang)}</span>
                                  <span className="txtBlue700 fweight-600 dis-b">
                                    <span>{calcPercentageProEstimation('', item).realPerc}% </span>
                                    <span>{translateTo('complete', lang)}</span>
                                  </span>
                                </div>
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
              </>
            ) : (
              <div className="brdSmall brdRadius brdLight200 ov-h bgWhite">
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover mb-1 w-perc-100 h-perc-100 h-fix-208 pos-r`}
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                />
                {
                  checkFavorite() && (
                    <div className="tag-container dis-fl-row a-c">
                      <BrixelIcon
                        icon="favorite-fill"
                        color="red"
                        className="type-tag pos-a favorite"
                      />
                    </div>
                  )
                }
                {
                  get(item, 'tags', []).length > 0 && (
                    <div className="tag-container pos-a dis-fl-row a-c jc-b">
                      {
                        item.tags.map((tag, i) => (
                          <p
                            key={`itmTgs_${i.toString()}`}
                            className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                          >
                            <span className="type">{translateTo(getTypeText(tag), lang)}</span>
                          </p>
                        ))
                      }
                    </div>
                  )
                }
                <div className="info dis-fl-col jc-b">
                  <div className="top dis-fl-col notranslate px-3 pt-3">
                    <span className="fweight-600 fsize-500 txtDark700 ellipsis one notranslate">
                      {get(item, 'title', '')}
                    </span>
                    <span className="fsize-300 txtDark700 mt-1 notranslate">
                      {get(item, 'location.zip', '')} {get(item, 'location.city', '')}
                      {
                        get(item, 'location.countryCode', 'CH') === 'CH' && (
                          <>
                            {` (${get(item, 'location.stateCode', '')})`}
                          </>
                        )
                      }
                    </span>
                  </div>
                  <div className="bottom a-c txtDark700 px-3 mt-2 mb-2">
                    
                    {
                      item && get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (
                        <div className="txtGreen400 dis-f a-b">
                          <span className="fsize-300 ff-mono notranslate">
                            {get(item, 'price.currency', '')}
                          </span>
                          <span className="fsize-500 ff-mono notranslate ml-1">
                            {Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}
                          </span>
                        </div>
                      ) : (
                        <span className="txtGreen400 fsize-500">
                          {translateTo(get(item, 'status', null) === 'sold' ? 'Sold' : 'On Request', lang)}
                        </span>
                      )
                    }
                  
                  </div>
                  <span className="hr lighter" />
                  <div className="mid dis-fl-row a-c fsize-300 px-3 pt-1 txtDark400 pb-2">
                    <div className="dis-f a-c flex-wrap">
                      <div className="div pt-small-2">
                        <span>
                          {translateTo(get(item, 'properties.propertyType', ''), lang)}
                        </span>
                      </div>
                      <div className="notranslate">
                        <span className="px-1 notranslate"> &middot; </span>
                        <span>
                          <span className="notranslate">
                            {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                          </span>
                          <span className="notranslate ml-1">
                            {get(item, 'location.countryCode', 'CH') === 'PT' ? '' : `${get(item, 'properties.typology.bedrooms', 0) ? translateTo('Rooms', lang) : ''}`}
                          </span>
                        </span>
                        {
                          get(item, 'properties.typology.bedrooms') > 0 && (
                            <span className="px-1 notranslate"> &middot; </span>
                          )
                        }
                        {
                          get(item, 'properties.typology.livingArea.value', 0) && (
                            <span className="notranslate">
                              <span className="notranslate">
                                {get(item, 'properties.typology.livingArea.value', 0)}
                              </span>
                              <span className="notranslate"> m2</span>
                            </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        
        {
          type === 'own' && (
            <>
              <span className="hr mt-3 lighter mb-1" />
              
              <div
                className={`dis-fl-col dis-fl-row-sm a-c-sm jc-b-sm flex-wrap ${has(item, 'published') && item.published === false ? '' : ''}`}
              >
                
                {
                  has(item, 'published') && item.published === false ? (
                    <div
                      className="dis-fl-col dis-fl-row-sm"
                    >
                      <div className="dis-fl-row-sm">
                        
                        {
                          get(item, 'tags', []).length > 0 && item.tags.includes('pre-market') ? (
                            <>
                              <p className="pl-1 fsize-300 txtLight600" dangerouslySetInnerHTML={{ __html: `<span>${translateTo('Your property is visible on our pre-market.', lang)}</span> <a href="/${item.id}/marketing" class="fsize-300 fweight-500 txtBlue700 cur-poi ml-1 td-u lh-in btnInline">${translateTo('Learn more.', lang)}</a>` }} />
                            </>
                          ) : (
                            <>
                              <p className="pl-1 fsize-300 txtLight600" dangerouslySetInnerHTML={{ __html: `<span>${translateTo('Your property is <strong class="lh-in fweight-600">not</strong> visible to any buyers.', lang)}</span>` }} />
                              <a
                                href={`/${item.id}/marketing`}
                                className="fsize-300 fweight-500 txtBlue700 cur-poi ml-1 td-u p-0 btnInline"
                              >
                                {translateTo('Change it here.', lang)}
                              </a>
                            </>
                          )
                        }
                      
                      </div>
                    </div>
                  ) : (
                    <div
                      className="dis-fl-col dis-fl-row-sm ta-l"
                    >
                      <div className="dis-fl-row-sm">
                        <p className="pl-1 fsize-300 txtLight600">
                          <span>{translateTo('Your property is visible on our market.', lang)}</span>
                        </p>
                      </div>
                    </div>
                  )
                }
                <div className="pt-1 pt-sm-0 ml-sm-a dis-fl-col dis-fl-row-sm a-c">
                  {
                    isSmallLoading[`loadPackage${get(item, 'id', '')}`] === false && (
                      <div>
                        <span>
                          {translateTo('Your plan:', lang)}
                        </span>
                        <span
                          className="ml-1 td-u cur-poi"
                          onClick={() => history.push(`/${item.id}/upgrade`)}
                        >
                          {get(selectActiveServicePackage(), 'name', 'Basic')}
                        </span>
                      </div>
                    )
                  }
                  <div className="dis-fl-col dis-fl-row-sm w-perc-100-sm">
                    <BrixelButtonSecondary
                      className="ml-sm-2 my-1 my-sm-0"
                      rounded
                      label={translateTo('Edit', lang)}
                      onClick={() => history.push(`/${item.id}/home`)}
                    />
                    <BrixelButtonPrimary
                      className="ml-sm-2"
                      rounded
                      label={translateTo('Request test drive', lang)}
                      onClick={() => history.push(`/${item.id}/trialRequest?url=/sell`)}
                    />
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  );
};

MarketCard.propTypes = {
  companyListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  estimation: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGenerateBestimate: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  item: PropTypes.object,
  lang: PropTypes.string.isRequired,
  layout: PropTypes.string,
  onSetActiveProperty: PropTypes.func,
  preventClick: PropTypes.bool,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCard.defaultProps = {
  item: null,
  onSetActiveProperty: () => '',
  layout: null,
  preventClick: false,
  type: '',
};

const mapStateToProps = (state) => ({
  companyListings: get(state, 'companies.companyListings.data', []),
  allProperties: get(state, 'market.allProperties.data', []),
  estimation: get(state, 'property.estimation', {}),
  favoritesProperties: get(state, 'market.favoritesProperties.data', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties.data', []),
  newProperties: get(state, 'market.newProperties.data', []),
  ownerProperties: get(state, 'market.ownerProperties.data', []),
  preMarketProperties: get(state, 'market.preMarketProperties.data', []),
  premiumProperties: get(state, 'market.premiumProperties.data', []),
  skeleton: get(state, 'common.skeleton', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
