import React, {useEffect, useRef, useState} from 'react';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  FormatValue,
  Helpers,
  ProgressRing,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelMap} from '@brixel/brixel-components/dist/map';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import get from 'lodash/get';
import has from 'lodash/has';
import orderBy from 'lodash/orderBy';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import {connect} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Slider from 'react-slick';
import {bindActionCreators, compose} from 'redux';
import {setModal, setSplashType} from '../../actions/CommonActions';
import {generateEstimation} from '../../actions/EstimationActions';
import {
  getEstimation,
  getPackageProperty,
  setActiveMarketOverlayProperty,
  setActiveMarketOverlayPropertyLists,
  setActiveSingleProperty,
  setEstimation,
} from '../../actions/PropertyActions';
import {addNotInterested, updateFavorite} from '../../actions/UserActions';
import api from '../../controllers/api/config';
import testdrive from '../../images/Market/testDriveSell.svg';
import ModalPropertyCard from '../../Pages/Market/Buyer/ModalPropertyCard';
import NotInterestedConfirmModal from '../../Pages/Market/Buyer/NotInterestedConfirmModal';
import {calcPercentageProEstimation, completedBestimate, getCookie, setCookie} from '../../utils/helpers';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
import type {MarketCardProps} from '../../@types/components/Cards/MarketCard';
import type {ServicePackageType} from '@brixel/brixel-components/dist/@types/Model';

const MarketCard = (props: MarketCardProps) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    companyDetail = {},
    companyListings,
    favoritesProperties,
    handleGenerateBestimate,
    handleGetEstimation,
    handleGetPackageProperty,
    handleSetModal,
    handleMarkNotInterested,
    handleUpdateFavorites,
    index = -1,
    isSmallLoading,
    item,
    lang,
    layout,
    loggedInUser,
    onSetActiveProperty = () => '',
    preventClick = false,
    setMarketOverlayProperty,
    setPropertyEstimation,
    setSplashScreen,
    skeleton,
    type = '',
    wishlistProperties,
  } = props;
  // STATE
  const [isShowLocationCard, setIsShowLocationCard] = useState(false);
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [isFullVisitble, setIsFullVisitble] = useState(false);
  const [propertyServicePacakges, setPropertyServicePacakge] = useState<ServicePackageType[]>();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSlideData, setShowSlideData] = useState(false);
  const checkTag: string[] = get(item, 'tags', []);

  const settingSlider = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '8px',
    arrows: false,
    dots: false,
    beforeChange: (oldIndex, newIndex) => {
      setActiveSlide(newIndex);
    },
  };

  const imgSlide = useRef() as React.MutableRefObject<Slider>;

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    setRemoveSkeleton(true);
  }, [skeleton, coverImgLoaded]);

  useEffect(() => {
    if (item && (checkTag.includes('pre-market') || item.hideAddress)) {
      setIsFullVisitble(false);
    } else {
      setIsFullVisitble(true)
    }
    if (type === 'own' && get(item, 'id', null)) {
      api.property.packagePage(get(item, 'id', ''))
        .then((res) => setPropertyServicePacakge(res.data));
    }
  }, [get(item, 'id', null)]);

  const isPreMarket = () => item ? checkTag.includes('pre-market') : false;

  // Process tags
  useEffect(() => {
    const result: string[] = [];
    if (item && get(item, 'tags', []).length > 1) {
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
        history.push(`/${get(item,  'id', '')}/home`, { state: { section: 'Market' }} );
      } else if (type === 'preMarket' || checkTag.includes('pre-market') ||
        ((
          type === 'premium' || checkTag.includes('premium') ||
          type === 'new' || checkTag.includes('new')
        ) && type !== 'favorite' && type !== 'wishlist' && !history.location.pathname.includes('sell'))
      ) {
        window.open(`${baseByData.pageUrl}${get(item, 'stub', '')}`, '_blank');
      } else if (type === 'favorite' || type === 'wishlist') {
        history.push(`/buyer/${get(item,  'id', '')}/home`, { state: { section: 'Market' }} );
      } else window.open(`${baseByData.pageUrl}${get(item, 'stub', '')}`, '_blank');
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
            id: get(item, 'id', ''),
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
    let basicPackage: ServicePackageType | undefined = undefined;
    if (companyListings.length > 0) {
      const activeCompany = companyListings.find((cmp) => cmp.id === get(item, 'company', ''));
      if (activeCompany) {
        const activeCompanyPackages = get(activeCompany, 'servicePackages', []);
        basicPackage = activeCompanyPackages.find((pkg) => pkg.type === 'basic');
      }
      if (propertyServicePacakges && propertyServicePacakges.length > 0) {
        const activeSinglePropertyPackage = cloneDeep(propertyServicePacakges);
        if (activeSinglePropertyPackage.length > 0) {
          const sortedPackage = orderBy(activeSinglePropertyPackage, ['price.total'], ['desc']);
          const getActivePackage = sortedPackage.find((pkg) => pkg.started);
          if (getActivePackage && get(getActivePackage, 'servicePackage', null)) {
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
    if (item) {
      const data = {
        act: action,
        id: get(item,  'id', ''),
        property: item,
        data: {
          email: get(loggedInUser, 'email', ''),
          language: loggedInUser.language,
        },
      };
      handleUpdateFavorites(data);
      handleSetModal({state: false});
    }
  }

  const onRemoveProperty = () => {
    if (item) {
      const isHideModal = getCookie('brixelHideNotInterested');
      if (isHideModal === true || isHideModal === 'true') {
        handleMarkNotInterested(get(item,  'id', ''));
        handleSetModal({state: false});
      } else {
        handleSetModal({
          state: true,
          component: React.createElement(NotInterestedConfirmModal, {lang, onClick: handleMarkNotInterested(get(item,  'id', ''))}),
          small: true,
          layout: 'large',
          bodyClassColor: 'white',
        })
      }
    }
  }

  const onOpenCard = () => {
    if (item && item.tags.includes('pre-market')) {
      const propsModal = {
        lang,
        property: item,
        onRemoveProperty: () => onRemoveProperty(),
        saveFavorite: (act) => saveFavorite(act),
        onClose: () => handleSetModal({state: false}),
        isFavorite: checkFavorite(),
      };
      handleSetModal({
        hideHeader: true,
        state: true,
        component: React.createElement(ModalPropertyCard, propsModal),
        small: true,
        layout: 'xxlarge',
        bodyClassColor: 'white p-0',
        hideClose: true,
      })
    } else {
      window.open(`${baseByData.pageUrl}${get(item, 'stub', '')}`, '_blank');
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
        return '';
    }
  };

  const getColor = (text) => {
    switch (text) {
      case 'new': {
        return 'Blue200';
      }
      case 'updated': {
        return 'Green100';
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
      case 'updated':
        return 'update-property';
      default:
        return '';
    }
  }

  const textColor = (text) => {
    switch (text) {
      case 'new': {
        return 'Blue700';
      }
      case 'updated': {
        return 'Green400';
      }
      case 'premium': {
        return 'White';
      }
      case 'pre-market': {
        return 'Blue700';
      }
      default:
    }
  };

  const slideImg = (e, act, slideIndex = 0) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (imgSlide) {
      const slide = imgSlide.current;
      if (act === 'next' && slide) slide.slickNext();
      if (act === 'prev' && slide) slide.slickPrev();
      if (act === 'goTo' && slide) slide.slickGoTo(slideIndex);
    }
    return false;
  }

  return (
    <>
      {
        (!removeSkeleton || !item) && (
          <CardImageText type={type} />
        )
      }
      {
        index === 0 && (
          <>
            {
              propertyServicePacakges ? (
                <>
                  {
                    get(selectActiveServicePackage(), 'type', null) === 'basic' && (
                      <div
                        className="w-perc-100 dis-f bgBlue100 brdRadiusSmall px-2 pl-md-0 pr-md-6 mb-2 mb-sm-3 cur-poi"
                        onClick={() => history.push(`/${get(item,  'id', '')}/trialRequest?url=/sell`)}
                      >
                        <div className="hide dis-b-md">
                          <img width="176" height="158" src={testdrive} alt="testdrive" />
                        </div>
                        <div className="ml-md-5">
                          <h3 className="fsize-500 fsize-md-700 fweight-600 pt-2">
                            {translateTo('Test drive our service. No strings attached.', lang)}
                          </h3>
                          <h5 className="fweight-400 fsize-300 fsize-md-400 mt-1 mb-1 mb-sm-3 txtBlue700">
                            {
                              companyDetail && get(companyDetail, 'meta.teaserPackage.price', 0) > 0 ? (
                                <>
                                  <span>
                                    {translateTo('Get the full Brixel experience worth', lang)}
                                  </span>
                                  <span className="ml-small-4">{get(companyDetail, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(companyDetail, 'meta.teaserPackage.price', 0), get(companyDetail, 'meta.teaserPackage.currency', ''))}.</span>
                                </>
                              ) : (
                                <span>
                                  {translateTo('Get the full Brixel experience', lang)}
                                </span>
                              )
                            }
                          </h5>
                          <div>
                            <ul className="checked markerDot mt-1 mt-md-4 txtDark700 dis-fl-row-sm fsize-400 mb-2 hide">
                              <li>
                                {translateTo('Personal consultation', lang)}
                              </li>
                              <li className="pl-sm-2" dangerouslySetInnerHTML={{ __html: translateTo('Free 3D tour &amp; HD photos', lang)}} />
                              <li className="pl-sm-2">
                                {translateTo('Full estimation by an expert', lang)}
                              </li>
                            </ul>
                          </div>

                        </div>

                      </div>
                    )
                  }
                </>
              ) : (
                <div className="w-perc-100 ov-h brdRadius skeletonBg h-fix-md-152 mb-4">
                  <div className="w-fix-216 skeletonBgInner hide dis-b-md" />
                  <div className="ml-md-4 ml-2 h-perc-100 dis-fl-col w-perc-100 py-2">
                    <p className="h-fix-40 skeletonBgInner w-perc-60"> </p>
                    <p className="h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-30"> </p>
                    <p className="h-fix-16 mt-a-md mt-2 skeletonBgInner w-perc-50"> </p>
                  </div>
                </div>
              )
            }
          </>
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
                  className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 ${layout === 'singleOwnCard' ? 'w-fix-sm-184 h-fix-184 mb-sm-0' : 'w-fix-sm-216 h-fix-216'}`}
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                  onClick={() => openCard(null)}
                />
                {
                  get(item, 'tags', []).length > 0 && layout !== 'singleOwnCard' && (
                    <div className="tag-container pos-a dis-fl-row a-c jc-b">
                      {
                        get(item, 'tags', []).filter((tag) => tag !== 'new').map((tag, i) => (
                          <p
                            key={`itm_${i.toString()}`}
                            className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                            onClick={() => tag === 'pre-market' && history.push(`/${get(item,  'id', '')}/marketing/portals`)}
                          >
                            <span className="type txtWhite">
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
                      className="top dis-fl-col cur-poi"
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
                              <Link to={`/${get(item,  'id', '')}/property/price`} className="txtBlue700 fweight-600">
                                <span>{get(item, 'price.currency', 0)}</span>
                                <span className="ml-1">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', 'EUR'))}</span>
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
                              ((get(item, 'estimation.status', null) === 'pending' && completedBestimate(item)) || (get(item, 'properties.propertyType', null) === 'Commercial' || get(item, 'properties.propertyType', null) === 'Building land')) ? (
                                <span className="txtBlue700 fweight-600">
                                  {translateTo('Pending', lang)}
                                </span>
                              ) : (
                                <>
                                  {
                                    get(item, 'estimation.status', null) !== 'processed' && (
                                      <Link
                                        to={`/${get(item,  'id', '')}/singleFlow/achievement/bestimate/step1?url=/sell`}
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
                              get(item, 'estimation.status', null) === 'processed' && (get(item, 'properties.propertyType', null) === 'House' || get(item, 'properties.propertyType', null) === 'Apartment') && (
                                <div
                                  onClick={(e) => openBestimateOverlay(e, get(item, 'location', {}), get(item, 'estimation', {}), item, 'exists')}
                                  className="txtBlue700 no-state fweight-600"
                                >
                                  {get(item, 'estimation.result.currency', '')} {Helpers.formatNumberValue(get(item, 'estimation.result.higherValue', 0), get(item, 'estimation.currency', ''))}
                                </div>
                              )
                            }
                          </div>
                          {
                            (get(item, 'properties.propertyType', null) === 'House' || get(item, 'properties.propertyType', null) === 'Apartment') && (
                              <div
                                onClick={() => window.location.assign(`/${get(item,  'id', '')}/property/price/proEstimation`)}
                                className="dis-fl-row a-c ml-4 brdSmallLeft brdLight400 pl-4"
                              >
                                <div className="hide dis-fl-row-sm">
                                  <div className="pos-r h-fix-48 w-fix-48">
                                    <ProgressRing
                                      customIcon={get(item, 'proEstimation.value', 0) <= 0 && calcPercentageProEstimation('', item).realPerc === 100 ? 'hourglass' : undefined}
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
              <div
                className="brdSmall brdLight200 brdRadius ov-h bgWhite"
                // onClick={() => openCard()}
                onMouseEnter={() => setShowSlideData(true)}
                onMouseLeave={() => setShowSlideData(false)}
              >
                { /* IMAGES */ }
                {
                  isShowLocationCard ? (
                    <div>
                      <BrixelMap
                        className="w-perc-100 h-fix-216"
                        gestureHandling="auto"
                        baseByData={baseByData}
                        lang={lang}
                        hideLocation={!isFullVisitble}
                        externalControls={false}
                        center={{
                          lat: get(item, 'location.latitude', 0),
                          lng: get(item, 'location.longitude', 0),
                        }}
                        type={'satellite'}
                        marker={item}
                        zoom={14}
                      />
                    </div>
                  ) : (
                    <>
                      {
                        get(item, 'photos', []).length > 1 ? (
                          <div className="h-fix-216 pos-r">
                            <div className={`sliderControl ${showSlideData ? 'show' : ''}`}>
                              <BrixelIcon
                                rounded
                                background="white"
                                saturation={0}
                                saturationTxt={600}
                                color="altGrey"
                                icon="arrow-simple-left"
                                className="pos-a y-c zIndex2 ml-1"
                                onClick={(e) => slideImg(e, 'prev')}
                                iconSize="small"
                              />
                              <BrixelIcon
                                rounded
                                background="white"
                                saturation={0}
                                saturationTxt={600}
                                color="altGrey"
                                icon="arrow-simple-right"
                                className="pos-a y-c x-r zIndex2 mr-1"
                                iconSize="small"
                                onClick={(e) => slideImg(e, 'next')}
                              />
                            </div>

                            <ul
                              className="slick-dots pos-a x-c ta-c zIndex2 bt mb-1"
                            >
                              {
                                item && item.photos.map((photo, i) => (
                                  <li
                                    key={`dots${i.toString()}`}
                                    className={activeSlide === i ? 'slick-active' : ''}
                                    onClick={(e) => slideImg(e, 'goTo', i)}
                                  >
                                    <button>1</button>
                                  </li>
                                ))
                              }
                            </ul>
                            <Slider
                              ref={imgSlide}
                              {...settingSlider}
                            >
                              {
                                item && item.photos.map((photo, i) => (
                                  <div
                                    key={`itm_${i.toString()}`}
                                    className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-fix-216 h-perc-100 pos-r`}
                                  >
                                    <img
                                      src={`${baseByData.shortPath}${photo.path}`}
                                      alt={`Photo ${i.toString()}`}
                                      className="h-perc-100 cover w-perc-100"
                                    />
                                  </div>
                                ))
                              }
                            </Slider>
                          </div>
                        ) : (
                          <CoverPropertyImage
                            loadedImg={(val) => setCoverImgLoaded(val)}
                            className={`${isPreMarket() ? 'pre-market' : ''} ${get(item, 'tags', []).join(' ')} cover w-perc-100 h-perc-100 h-fix-216 pos-r`}
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
                            item && item.tags.map((tag, i) => (
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
                                      color={textColor(tag)}
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
                      isLoading={isSmallLoading[`notInterested-${get(item,  'id', '')}`]}
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
                      isLoading={isSmallLoading[`favorite-${get(item,  'id', '')}`]}
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
                      className="fsize-400 txtAltGrey600 notranslate cur-poi"
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
                        <span className="txtGreen400 ff-mono fsize-500">
                          {translateTo(get(item, 'status', null) === 'sold' ? 'Sold' : 'On Request', lang)}
                        </span>
                      )
                    }

                  </div>
                  <div className="mx-3">
                    <span className="hr lighter" />
                  </div>
                  <div className="mid dis-fl-row a-c fsize-300 px-3 pt-2 txtDark400 pb-2">
                    <div className="dis-f a-c jc-b flex-wrap w-perc-100">
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400">
                          {translateTo('Rooms', lang)}
                        </span>
                        <span className="ff-mono fsize-400 txtBlack">
                          {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                        </span>
                      </div>
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400">
                          {translateTo('Size', lang)}
                        </span>
                        <span className="ff-mono fsize-400 txtBlack">
                          {get(item, 'properties.typology.livingArea.value', 0)} m2
                        </span>
                      </div>
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400">
                          {translateTo('Year built', lang)}
                        </span>
                        <span className="ff-mono fsize-400 txtBlack">
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
                className={`dis-fl-col dis-fl-row-sm a-c-sm jc-b-sm flex-wrap ${has(item, 'published') && get(item, 'published', null) === false ? '' : ''}`}
              >

                {
                  get(item, 'published', null) === false ? (
                    <div
                      className="dis-fl-col dis-fl-row-sm"
                    >
                      <div className="dis-fl-row-sm">

                        {
                          item && get(item, 'tags', []).length > 0 && item.tags.includes('pre-market') ? (
                            <>
                              <p className="pl-1 fsize-300 txtLight600" dangerouslySetInnerHTML={{ __html: `<span>${translateTo('Your property is visible on our pre-market.', lang)}</span> <a href="/${get(item,  'id', '')}/marketing" class="fsize-300 fweight-500 txtBlue700 cur-poi ml-1 td-u lh-in btnInline">${translateTo('Learn more.', lang)}</a>` }} />
                            </>
                          ) : (
                            <>
                              <p className="pl-1 fsize-300 txtLight600" dangerouslySetInnerHTML={{ __html: `<span>${translateTo('Your property is <strong class="lh-in fweight-600">not</strong> visible to any buyers.', lang)}</span>` }} />
                              <a
                                href={`/${get(item,  'id', '')}/marketing`}
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
                          onClick={() => history.push(`/${get(item,  'id', '')}/upgrade`)}
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
                      onClick={() => history.push(`/${get(item,  'id', '')}/home`)}
                    />
                    <BrixelButtonPrimary
                      className="ml-sm-2"
                      rounded
                      label={translateTo('Request test drive', lang)}
                      onClick={() => history.push(`/${get(item,  'id', '')}/trialRequest?url=/sell`)}
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

const mapStateToProps = (state) => ({
  allProperties: get(state, 'market.allProperties.data', []),
  companyListings: get(state, 'companies.companyListings.data', []),
  estimation: get(state, 'property.estimation', {}),
  favoritesProperties: get(state, 'market.wishlistProperties.data', []),
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
