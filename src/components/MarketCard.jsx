/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import pullAt from 'lodash/pullAt';
import compact from 'lodash/compact';
import {
  Helpers, BrixelIcon, FormatValue,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import ProgressRing from './ProgressRing';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';
import { setCookie } from '../utils/helpers';
import { setSplashType } from '../actions/CommonActions';
import { generateEstimation } from '../actions/EstimationActions';
import {
  setActiveSingleProperty,
  setEstimation,
  setActiveMarketOverlayProperty,
  setActiveMarketOverlayPropertyLists,
  getEstimation,
} from '../actions/PropertyActions';

const MarketCard = (props) => {
  // PROPS
  const {
    favoritesProperties,
    handleGetEstimation,
    handleSetActiveMarketOverlayPropertyLists,
    history,
    item,
    newProperties,
    onSetActiveProperty,
    preventClick,
    setMarketOverlayProperty,
    setPropertyEstimation,
    setSplashScreen,
    skeleton,
    type,
    handleGenerateBestimate,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [isPreMarket, setIsPreMarket] = useState(false);

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && coverImgLoaded) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);

  useEffect(() => {
    if (get(item, 'tags', []).length > 0) {
      item.tags.forEach((tag) => {
        if (tag === 'pre-market') {
          setIsPreMarket(true);
        }
      });
    }
  }, []);

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

  const openCard = (e) => {
    if (e) e.preventDefault();
    if (!preventClick) {
      if (type === 'own') {
        history.push({
          pathname: `/${item.id}/rewards/market-checker`,
          state: { section: 'Market' },
        });
      } else if (type === 'preMarket' || get(item, 'tags', []).includes('pre-market') ||
                  type === 'premium' || get(item, 'tags', []).includes('premium') ||
                  type === 'new' || get(item, 'tags', []).includes('new')) {
        setSplashScreen('marketOverlay');
        setMarketOverlayProperty(item);
        let property = null;

        if (type === 'new') {
          property = cloneDeep(newProperties);
          const indexCurrentProperty = property.findIndex((prop) => prop.id === item.id);
          const element = property[indexCurrentProperty];
          property.splice(indexCurrentProperty, 1);
          property.splice(0, 0, element);
        }
        handleSetActiveMarketOverlayPropertyLists(property);
      } else if (type === 'favorite') {
        history.push({
          pathname: `/buyer/property/${item.id}/page`,
          state: { section: 'Market' },
        });
      } else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
      // TODO: Estimation opens overlay
    }
  };

  const openBestimateOverlay = (e, location, estim, page) => {
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
        className={`market-card ov-h cur-poi h-perc-100 ${type === 'own' ? 'dis-f-sm' : 'dis-fl-col'} brdRadius px-1 pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} `}
        onClick={(e) => (type !== 'own' ? openCard(e) : '')}
      >
        {
          type === 'own' ? (
            <>
              <>
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className={`${isPreMarket ? 'pre-market' : ''} cover brdRadius mb-1 h-fix-208 w-perc-100 w-fix-sm-208`}
                  coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
                  propertyType={get(item, 'properties.propertyType', undefined)}
                  onClick={(e) => openCard(e)}
                />
                {
                  get(item, 'tags', []).length > 0 && (
                    <div className="tag-container pos-a dis-fl-row a-c jc-b">
                      {
                        item.tags.map((tag, i) => (
                          <p
                            key={i.toString()}
                            className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                          >
                            <span className="type">{getTypeText(tag)}</span>
                          </p>
                        ))
                      }
                    </div>
                  )
                }
              </>
              <div className="info dis-fl-col pl-sm-2 pl-0 w-perc-100">
                <div className="top dis-fl-col notranslate" onClick={(e) => openCard(e)}>
                  <h6 className="fweight-700 fsize-400 mb-small-4 txtDark700 ellipsis one w-perc-100 max-w-fix-496">{get(item, 'title', '')}</h6>
                  <span className="fsize-300 txtDark700 mb-1">
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
                <div
                  className="mid dis-fl-row fsize-300 txtDark400 mb-2"
                  onClick={(e) => openCard(e)}
                >
                  <div className="dis-f a-c flex-wrap">
                    <span>
                      {get(item, 'properties.propertyType', '')}
                    </span>
                    <div>
                      <span className="px-1 notranslate"> &middot; </span>
                      <span>
                        <span className="notranslate">
                          {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                        </span>
                        <span>
                          {get(item, 'location.countryCode', 'CH') === 'PT' ? '' : `${get(item, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`}
                        </span>
                      </span>
                      {
                        get(item, 'properties.typology.bedrooms') > 0 && (
                          <span className="px-1 notranslate"> &middot; </span>
                        )
                      }
                      {
                        get(item, 'properties.typology.livingArea.value', 0) > 0 && (
                          <span>
                            <span>
                              {get(item, 'properties.typology.livingArea.value', 0)}
                            </span>
                            <span> m2</span>
                          </span>
                        )
                      }
                    </div>
                  </div>
                </div>
                {/* <div className="dis-f py-1 " onClick={(e) => openCard(e)}>
                  <BrixelIcon className="fsize-200 txtDark700" icon="favorite-fill" /> <span className="fsize-200 txtDark700">&nbsp;  17</span>
                </div> */}
                <div
                  className="bottom bestimateFact dis-f fsize-300 w-perc-100"
                >
                  {
                    get(item, 'location.countryCode', null) === 'PT' && !has(item, 'properties.parking') && !has(item, 'properties.building.conditionStatus') && !has(item, 'estimation.result.value') ? (
                      <div
                        className="p-2 mr-1 brdRadius bgLight100"
                        onClick={(e) => openBestimateOverlay(e, item.location, item.estimation, item, 'new')}
                      >
                        <span className="fweight-500 txtDark100">Bestimate<sup>&reg;</sup></span>
                        <span className="dis-b fweight-600 txtPrimary400 ">
                          {
                            has(item, 'estimation.result.value') ? (
                              <>
                                <span className="notranslate">&le; {' '}
                                  {get(item, 'estimation.result.currency', '')}
                                  {' '}
                                  {Helpers.formatNumberValue(get(item, 'estimation.result.higherValue', 0).toFixed(0), get(item, 'estimation.result.currency', ''))}
                                </span>
                              </>
                            ) : (
                              <>
                                {
                                  get(item, 'location.countryCode', null) === 'PT' && !has(item, 'properties.parking') && !has(item, 'properties.building.conditionStatus') ? (
                                    <span>Get Estimation</span>
                                  ) : (
                                    <span>Pending</span>
                                  )
                                }
                              </>
                            )
                          }
                        </span>
                      </div>
                    ) : (
                      <div
                        className="p-2 mr-1 brdRadius bgLight100"
                        onClick={(e) => openBestimateOverlay(e, item.location, item.estimation, item, 'exists')}
                      >
                        <span className="fweight-500 txtDark100">Bestimate<sup>&reg;</sup></span>
                        <span className="dis-b fweight-600 txtPrimary400 ">
                          {
                            has(item, 'estimation.result.value') ? (
                              <>
                                <span className="notranslate">&le; {' '}
                                  {get(item, 'estimation.result.currency', '')}
                                  {' '}
                                  {Helpers.formatNumberValue(get(item, 'estimation.result.higherValue', 0).toFixed(0), get(item, 'estimation.result.currency', ''))}
                                </span>
                              </>
                            ) : (
                              <>
                                <span>Pending</span>
                              </>
                            )
                          }
                        </span>
                      </div>
                    )
                  }
                  <div
                    className="p-2 brdRadius bgLight100 dis-f a-c"
                    onClick={() => history.push({
                      pathname: `/${item.id}/rewards/achievement/facts`,
                      search: '',
                      state: { hideBackPage: true },
                    })}
                  >
                    <div className="w-fix-48 hide dis-b-sm">
                      <ProgressRing
                        progress={get(item, 'inputSheet.totalComplete', 0)}
                        size={45}
                        strokeWidth={2}
                        circleOneStroke="#DCDDDE"
                        circleTwoStroke="#387AFF"
                      />
                    </div>
                    <div className="ml-2 total-completed dis-fl-col">
                      <span className="fweight-500 txtDark100">Facts</span>
                      <span className="dis-fl-row a-c fweight-500 txtDark400">
                        <span className="notranslate">{get(item, 'inputSheet.totalComplete', 0)}%&nbsp;</span>
                        <span className=""> completed</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <>
                <CoverPropertyImage
                  loadedImg={(val) => setCoverImgLoaded(val)}
                  className={`${isPreMarket ? 'pre-market' : ''} cover brdRadius mb-1 w-perc-100 h-perc-100 h-fix-208 pos-r`}
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
                            key={i.toString()}
                            className={`type-tag pos-r non-favorite fsize-200 fweight-500 txtWhite mr-1 bg${getColor(tag)}`}
                          >
                            <span className="type">{getTypeText(tag)}</span>
                          </p>
                        ))
                      }
                    </div>
                  )
                }
              </>
              <div className="info dis-fl-col jc-b">
                <div className="top dis-fl-col notranslate">
                  <span className="fweight-600 fsize-300 txtDark700 ellipsis one notranslate">{get(item, 'title', '')}</span>
                  <span className="fsize-300 txtDark700 notranslate">
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
                <div className="mid dis-fl-row a-c fsize-300 pt-1 txtDark400">
                  <div className="dis-f a-c flex-wrap">
                    <span>
                      {get(item, 'properties.propertyType', '')}
                    </span>
                    <div className="notranslate">
                      <span className="px-1 notranslate"> &middot; </span>
                      <span>
                        <span className="notranslate">
                          {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                        </span>
                        <span className="notranslate">
                          {get(item, 'location.countryCode', 'CH') === 'PT' ? '' : `${get(item, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`}
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
                <div className="bottom a-c txtDark700 pt-1">

                  {
                    get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (
                      <>
                        <span className="fsize-300 fweight-600 notranslate">{get(item, 'price.currency', '')} &nbsp; </span>
                        <span className="fsize-300 fweight-600 notranslate">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                      </>
                    ) : (
                      <span className="txtGreen400 fsize-300 fweight-500">On Request</span>
                    )
                  }

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
  estimation: PropTypes.object.isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleSetActiveMarketOverlayPropertyLists: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  item: PropTypes.object,
  newProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSetActiveProperty: PropTypes.func,
  preventClick: PropTypes.bool,
  setMarketOverlayProperty: PropTypes.func.isRequired,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  handleGenerateBestimate: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCard.defaultProps = {
  item: null,
  onSetActiveProperty: () => '',
  preventClick: false,
  type: '',
};

const mapStateToProps = (state) => ({
  allProperties: get(state, 'market.allProperties.data', []),
  estimation: get(state, 'property.estimation', {}),
  favoritesProperties: get(state, 'market.favoritesProperties.data', []),
  lastViewedProperties: get(state, 'market.lastViewedProperties.data', []),
  newProperties: get(state, 'market.newProperties.data', []),
  ownerProperties: get(state, 'market.ownerProperties.data', []),
  preMarketProperties: get(state, 'market.preMarketProperties.data', []),
  premiumProperties: get(state, 'market.premiumProperties.data', []),
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
  handleSetActiveMarketOverlayPropertyLists: bindActionCreators(setActiveMarketOverlayPropertyLists, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
