/* eslint-disable react-hooks/exhaustive-deps */
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  FormatValue,
  Helpers,
  ProgressRing,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { BrixelMap } from '@brixel/brixel-components/dist/map';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { bindActionCreators, compose } from 'redux';
import { setModal, setSplashType } from '../../actions/CommonActions';
import { generateEstimation } from '../../actions/EstimationActions';
import {
  getEstimation,
  getPackageProperty,
  setActiveMarketOverlayProperty,
  setActiveMarketOverlayPropertyLists,
  setActiveSingleProperty,
  setEstimation,
} from '../../actions/PropertyActions';
import { addNotInterested, updateFavorite } from '../../actions/UserActions';
import ModalPropertyCard from '../../Pages/Market/Buyer/ModalPropertyCard';
import NotInterestedConfirmModal from '../../Pages/Market/Buyer/NotInterestedConfirmModal';
import { calcPercentageProEstimation, completedBestimate, getCookie, setCookie } from '../../utils/helpers';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';

const MarketCard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const settingSlider = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '8px',
    arrows: false,
    dots: true,
    lazyLoad: 'progressive',
  };
  // PROPS
  const {
    companyListings,
    favoritesProperties,
    handleGenerateBestimate,
    handleGetEstimation,
    handleGetPackageProperty,
    handleSetModal,
    handleMarkNotInterested,
    handleUpdateFavorites,
    isSmallLoading,
    item,
    lang,
    layout,
    loggedInUser,
    onSetActiveProperty,
    preventClick,
    setMarketOverlayProperty,
    setPropertyEstimation,
    setSplashScreen,
    skeleton,
    type,
    wishlistProperties,
  } = props;
  // STATE
  const [isShowLocationCard, setIsShowLocationCard] = useState(false);
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [isFullVisitble, setIsFullVisitble] = useState(false);

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    setRemoveSkeleton(true);
  }, [skeleton, coverImgLoaded]);
  
  useEffect(() => {
    if (item.tags.includes('pre-market') || item.hideAddress) {
      setIsFullVisitble(false);
    } else {
      setIsFullVisitble(true)
    }
  }, [item.id]);
  

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
    if (layout === 'singleOwnCard' && type === 'own') {
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
    let findIndex = favoritesProperties.findIndex((prop) => prop.id === get(item, 'id', null));
    if (findIndex < 0) findIndex = wishlistProperties.findIndex((prop) => prop.id === get(item, 'id', null));
    return findIndex > -1;
  };
  
  const saveFavorite = (action) => {
    const data = {
      act: action,
      id: item.id,
      property: item,
      data: {
        email: get(loggedInUser, 'email', ''),
        language: loggedInUser.lang,
      },
    };
    handleUpdateFavorites(data);
    handleSetModal({ state: false });
  }
  
  const onRemoveProperty = () => {
    const isHideModal = getCookie('brixelHideNotInterested');
    if (isHideModal === true || isHideModal === 'true') {
      handleMarkNotInterested(item.id);
      handleSetModal({ state: false });
    } else {
      handleSetModal({
        state: true,
        component: React.createElement(NotInterestedConfirmModal, {lang, onClick: handleMarkNotInterested(item.id)}),
        small: true,
        layout: 'large',
        bodyClassColor: 'white',
      })
    }
  }
  
  const onOpenCard = () => {
    if (item.tags.includes('pre-market')) {
      const propsModal = {
        lang,
        property: item,
        onRemoveProperty: onRemoveProperty(),
        saveFavorite: (act) => saveFavorite(act),
        onClose: () => handleSetModal({state: false}),
        isFavorite: checkFavorite(),
      };
      handleSetModal({
        hideHeader: true,
        state: true,
        component: React.createElement(ModalPropertyCard, propsModal),
        small: true,
        layout: 'xlarge',
        bodyClassColor: 'white p-0',
        hideClose: true,
      })
    } else {
      window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
    }
  }
  
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
  
  const getColor = (text) => {
    switch (text) {
      case 'new': {
        return 'Blue200';
      }
      case 'updated': {
        return 'Yellow';
      }
      case 'premium': {
        return 'Red';
      }
      case 'pre-market': {
        return 'Blue200';
      }
      default:
    }
  };
  
  const iconTag = (text) => {
    switch (text) {
      case 'new':
        return 'star-new';
      default:
        return null;
    }
  }
  
  const textColor = (text) => {
    switch (text) {
      case 'new': {
        return 'Blue700';
      }
      case 'updated': {
        return 'Yellow';
      }
      case 'premium': {
        return 'Red';
      }
      case 'pre-market': {
        return 'Blue700';
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
        className={`market-card ov-hs h-perc-100 pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} `}
        // onClick={(e) => (type !== 'own' ? openCard(e) : '')}
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
                { /* IMAGES */ }
                {
                  isShowLocationCard ? (
                    <div>
                      <BrixelMap
                        className="w-perc-100 h-fix-208"
                        gestureHandling="auto"
                        baseByData={baseByData}
                        lang={lang}
                        hideLocation={!isFullVisitble}
                        minHeight={208}
                        externalControls={false}
                        center={{
                          lat: item.location.latitude,
                          lng: item.location.longitude,
                        }}
                        type={'satellite'}
                        marker={item}
                        zoom={14}
                      />
                    </div>
                  ) : (
                    <>
                      {
                        get(item, 'photos', []).length > 0 ? (
                          <div className="h-fix-208">
                            <Slider {...settingSlider}>
                              {
                                item.photos.map((photo, index) => (
                                  <div
                                    key={`itm_${index.toString()}`}
                                    className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover mb-1 w-perc-100 h-fix-200 h-perc-100 pos-r`}
                                  >
                                    <img src={`${baseByData.shortPath}${photo.path}`} key={`photo${index.toString()}`} />
                                  </div>
                                ))
                              }
                            </Slider>
                          </div>
                        ) : (
                          <CoverPropertyImage
                            loadedImg={(val) => setCoverImgLoaded(val)}
                            className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover mb-1 w-perc-100 h-perc-100 h-fix-208 pos-r`}
                            coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                            propertyType={get(item, 'properties.propertyType', undefined)}
                          />
                        )
                      }
                    </>
                  )
                }
                { /* HEADER ICONS / TAGS */ }
                <div className="dis-f a-c jc-b pos-a-fix x-l-0 x-t-0 w-perc-100 p-2">
                  { /* TAGS LIST */ }
                  <div>
                    {
                      get(item, 'tags', []).length > 0 && (
                        <div className="dis-fl-row a-c jc-b">
                          {
                            item.tags.map((tag, i) => (
                              <p
                                key={`itmTgs_${i.toString()}`}
                                className={`type-tag pos-r non-favorite fsize-200 fweight-500 mr-1 bg${getColor(tag)} txt${textColor(tag)} dis-f a-c brdRadiusSmall px-1 py-small-4`}
                              >
                                {
                                  iconTag(tag) && (
                                    <BrixelIcon
                                      iconSize="w-fix-16"
                                      className="mr-1"
                                      icon={iconTag(tag)}
                                      color={textColor(tag, true)}
                                      saturationTxt={0}
                                    />
                                  )
                                }
                                <span className="type">{translateTo(getTypeText(tag), lang)}</span>
                              </p>
                            ))
                          }
                        </div>
                      )
                    }
                  </div>
                  <div>
                    <BrixelIcon
                      color="green"
                      rounded
                      background="white"
                      saturation={0}
                      icon="location-pin-simple"
                      onClick={() => setIsShowLocationCard(!isShowLocationCard)}
                    />
                    <BrixelIcon
                      isLoading={isSmallLoading[`notInterested-${item.id}`]}
                      className="mx-1"
                      color="blue"
                      saturationTxt={700}
                      rounded
                      background="white"
                      saturation={0}
                      icon="eye-hidden"
                      onClick={() => onRemoveProperty()}
                    />
                    <BrixelIcon
                      isLoading={isSmallLoading[`favorite-${item.id}`]}
                      rounded
                      background="white"
                      saturation={0}
                      icon={checkFavorite() ? 'favorite-fill' : 'favorite'}
                      color="red"
                      onClick={() => saveFavorite(checkFavorite() ? 'remove' : 'add')}
                    />
                  </div>
                </div>
                <div className="info dis-fl-col jc-b">
                  <div className="top dis-fl-col notranslate px-3 pt-3">
                    <span
                      className="fsize-300 txtDark700 mt-1 notranslate cur-poi"
                      onClick={() => onOpenCard()}
                    >
                      {get(item, 'location.zip', '')} {get(item, 'location.city', '')}
                      {
                        get(item, 'location.countryCode', 'CH') === 'CH' && (
                          <>
                            {` (${get(item, 'location.stateCode', '')})`}
                          </>
                        )
                      }
                    </span>
                    <span
                      className="fweight-600 fsize-500 txtDark700 ellipsis one notranslate cur-poi"
                      onClick={() => onOpenCard()}
                    >
                      {get(item, 'title', '')}
                    </span>
                  </div>
                  <div className="bottom a-c txtDark700 px-3 mt-2 mb-2">
                    <span className="fsize-300 dis-b txtAltGrey400">
                      {translateTo('Price', lang)}
                    </span>
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
                    <div className="dis-f a-c jc-b flex-wrap w-perc-100">
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400">
                          {translateTo('Rooms', lang)}
                        </span>
                        <span className="ff-mono fszie-400 txtBlack">
                          {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                        </span>
                      </div>
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400">
                          {translateTo('Size', lang)}
                        </span>
                        <span className="ff-mono fszie-400 txtBlack">
                          {get(item, 'properties.typology.livingArea.value', 0)} m2
                        </span>
                      </div>
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400">
                          {translateTo('Year built', lang)}
                        </span>
                        <span className="ff-mono fszie-400 txtBlack">
                          {get(item, 'properties.building.built', 0)}
                        </span>
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
  handleMarkNotInterested: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  item: PropTypes.object,
  lang: PropTypes.string.isRequired,
  layout: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  onSetActiveProperty: PropTypes.func,
  preventClick: PropTypes.bool,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
  wishlistProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MarketCard.defaultProps = {
  item: null,
  onSetActiveProperty: () => '',
  layout: null,
  preventClick: false,
  type: '',
};

const mapStateToProps = (state) => ({
  allProperties: get(state, 'market.allProperties.data', []),
  companyListings: get(state, 'companies.companyListings.data', []),
  estimation: get(state, 'property.estimation', {}),
  favoritesProperties: get(state, 'market.favoritesProperties.data', []),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lastViewedProperties: get(state, 'market.lastViewedProperties.data', []),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  newProperties: get(state, 'market.newProperties.data', []),
  ownerProperties: get(state, 'market.ownerProperties.data', []),
  preMarketProperties: get(state, 'market.preMarketProperties.data', []),
  premiumProperties: get(state, 'market.premiumProperties.data', []),
  skeleton: get(state, 'common.skeleton', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleMarkNotInterested: bindActionCreators(addNotInterested, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
