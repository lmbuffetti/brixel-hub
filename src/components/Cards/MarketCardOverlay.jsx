/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import pullAt from 'lodash/pullAt';
import compact from 'lodash/compact';
import {
  BrixelButtonSecondary,
  BrixelButtonIcon,
  BrixelIcon,
} from '@brixel/brixel-components';
import * as FormatValue from '@brixel/brixel-components/dist/utils/normalizeFormat';
import * as Helpers from '@brixel/brixel-components/dist/utils/helper';
// import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import CoverPropertyImage from '../CoverPropertyImage';
import CardImageText from '../Skeleton/CardImageText';
import { setSplashType } from '../../actions/CommonActions';
// import Map from './Map/Maps';
import { fullExtraFeatures } from '../../utils/propertyData';
import {
  setActiveSingleProperty, setEstimation, setActiveMarketOverlayProperty, getEstimation,
} from '../../actions/PropertyActions';
import { mapStyles } from '../../constants/map';

const MarketCard = (props) => {
  // PROPS
  const {
    // history,
    activeIndex,
    className,
    fullCard,
    item,
    // preventClick,
    // setMarketOverlayProperty,
    // setSplashScreen,
    propertyList,
    onToggleCard,
    skeleton,
    type,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [fullScreenCard, setFullScreenCard] = useState(fullCard);
  const [mapFormatStyle, setMapFormatStyle] = useState({ });

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  useEffect(() => {
    if (!skeleton[type] && coverImgLoaded) {
      setRemoveSkeleton(true);
    }
  }, [skeleton, coverImgLoaded]);

  useEffect(() => {
    let style = '';
    mapStyles.map((mapitem) => {
      Object.keys(mapitem).map((subitem) => {
        // console.log(item, subitem);
        if (mapitem.featureType) {
          if (subitem === 'featureType') {
            style += `&style=feature:${mapitem[subitem]}`;
          }
          if (subitem === 'elementType') {
            style += `|element:${mapitem[subitem]}`;
          }
        }
        return null;
      });
      return null;
    });
    let imgLocation = 'https://generator.brixel.io/images/icon_location.png';
    let marker = `&markers=icon:${imgLocation}|${get(item, 'location.latitude', 0)},${get(item, 'location.longitude', 0)}`;
    if (get(item, 'tags', []).includes('pre-market')) {
      imgLocation = 'https://generator.brixel.io/images/circle_map.png';
      marker = '';
    }
    setMapFormatStyle({
      style,
      markers: marker,
      // merged: res.data,
    });
  }, []);

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

  const openDetailCard = () => {
    if (item.id === get(propertyList, `[${activeIndex}].id`, null)) {
      onToggleCard(!fullScreenCard);
      setFullScreenCard(!fullScreenCard);
    }
  };

  return (
    <div className={`${className} h-perc-100`}>
      {
        (!removeSkeleton || !item) && (
          <CardImageText type={type} />
        )
      }
      <div
        className={`market-card w-fix-376 ov-a pb-6 h-perc-100 dis-fl-col brdRadius shadow-3dp pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} bgWhite m-a ${fullScreenCard ? 'market-card-fullscreen' : ''}`}
        // onClick={(e) => (type !== 'own' ? openCard(e) : '')}
      >
        <>
          <div className="pos-r">
            <CoverPropertyImage
              loadedImg={(val) => setCoverImgLoaded(val)}
              className={`${isPreMarket() ? 'pre-market' : ''} cover brdRadius mb-2 w-perc-100 pos-r ${fullScreenCard ? 'h-fix-224 h-fix-sm-344 h-fix-md-488' : 'h-fix-224'} ${!fullScreenCard && item.id === get(propertyList, `[${activeIndex}].id`, null) ? 'cur-poi' : ''}`}
              coverPhoto={get(item, 'coverPhoto.bigPath', undefined)}
              propertyType={get(item, 'properties.propertyType', undefined)}
              onClick={() => (!fullScreenCard ? openDetailCard() : '')}
            />
            {
              fullScreenCard && !fullCard && (
                <BrixelButtonIcon
                  onClick={() => openDetailCard()}
                  className="pos-a x-c bt mb-neg-4 shadow-1dp"
                  theme="white"
                  icon="arrow-simple-up"
                />
              )
            }
          </div>
          {
            get(item, 'tags', []).length > 0 && (
              <div className="tag-container pos-a dis-fl-row a-c jc-b">
                {
                  item.tags.map((tag, i) => (
                    <p
                      key={`itm_${i.toString()}`}
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
        <div className="info dis-fl-col jc-b p-2 p-sm-3">
          <div className="dis-f jc-b a-c">
            <h5 className="txtDark700 ellipsis one notranslate mb-2">
              {get(item, 'title', '')}
            </h5>
            {/*
              fullScreenCard && (
                <BrixelButtonPrimary
                  onClick={() => window.open(`${baseByData.pageUrl}${item.stub}`, '_blank')}
                  rounded
                  label="Go to hub"
                  rightIcon="arrow-right-small"
                />
              )
            */}
          </div>

          <div className="mid dis-fl-col fsize-300 pt-1 pb-3 txtDark400">
            <div>
              <div className={fullScreenCard ? 'dis-f flex-wrap' : ''}>
                <div className={fullScreenCard ? 'flex-50 pr-0 pr-sm-3' : 'w-perc-100'}>
                  { /* SECTION: PRICE */ }
                  {
                    ((fullScreenCard && !get(item, 'tags', []).includes('pre-market')) || !fullScreenCard) && (
                      <>
                        <span className="fsize-100 txtDark500 pb-small-4">Price</span>
                        <div className="dis-f a-c jc-b">
                          {
                            get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (
                              <>
                                <div>
                                  <span className="fsize-200 notranslate txtGreen400"><sub>{get(item, 'price.currency', '')} &nbsp;</sub> </span>
                                  <span className="fsize-300 notranslate ff-mono txtGreen400">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                                </div>
                                <div className="dis-f a-c txtDark500 notranslate">
                                  <span className="fsize-100 pr-1 notranslate"> {get(item, 'price.currency', '')}  </span>
                                  <span className="ff-mono notranslate"> {Helpers.formatNumberValue(get(item, 'price.pricePerM2', 0).toFixed(), get(item, 'price.currency', ''))} </span>
                                  <span className="fsize-200 notranslate">/m2 </span>
                                </div>
                              </>
                            ) : (
                              <span className="txtGreen400 fweight-500 ff-mono">On Request</span>
                            )
                          }
                        </div>
                        <hr className="lighter my-1" />
                      </>
                    )
                  }
                  { /* SECTION: PROPERTY TYPE - ROOMS - LIVING AREA */ }
                  <div className="dis-f a-c jc-b flex-wrap">
                    <div className="dis-fl-col">
                      <span className="fsize-100 txtDark500 pb-small-4">
                        {get(item, 'location.countryCode', 'CH') === 'PT' ? 'Typology' : `${get(item, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`}
                      </span>
                      <span className="notranslate txtDark500 ff-mono">
                        {FormatValue.formatRooms(get(item, 'properties.typology.bedrooms', 0), get(item, 'location.countryCode', 'CH'))}
                      </span>
                    </div>
                    <div className="dis-fl-col">
                      <span className="fsize-100 txtDark500 pb-small-4"> Living space</span>
                      {
                        get(item, 'properties.typology.livingArea.value', 0) && (
                          <span className="notranslate">
                            <span className="notranslate txtDark500 ff-mono">
                              {get(item, 'properties.typology.livingArea.value', 0)}
                            </span>
                            <span className="notranslate fsize-200"> <sub>m2 </sub></span>
                          </span>
                        )
                      }
                    </div>
                    <div className="dis-fl-col">
                      <span className="fsize-100 txtDark500 pb-small-4"> Year</span>
                      <span className="notranslate txtDark500 ff-mono"> {get(item, 'properties.building.built', '0000')} </span>
                    </div>

                  </div>
                  {
                    fullScreenCard && (
                      <>
                        { /* SECTION: EXTRA FEATURE */}
                        {
                          !get(item, 'tags', []).includes('pre-market') && fullExtraFeatures(item).length > 0 && (
                            <div className="mt-5">
                              <span className="fsize-100 txtDark500 pb-small-4 mt-5">Highlights</span>
                              <div className="row mx-0 pt-1">
                                {
                                  fullExtraFeatures(item).map((key, i) => (
                                    <div key={`fllExt_${i.toString()}`} className="dis-f flex-50 a-c mb-2">
                                      <BrixelIcon
                                        icon={get(key, 'icon', '')}
                                        color="green"
                                        background="light"
                                        saturation={100}
                                        saturationTxt={700}
                                      />
                                      <div className="fsize-300 pl-2 txtDark500">
                                        <span className="dis-b">{get(key, 'label', '')}</span>
                                        {
                                          get(key, 'subtitle', null) && (
                                            <span className="">{get(key, 'subtitle', '')}</span>
                                          )
                                        }
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          )
                        }
                        {
                          get(item, 'tags', []).includes('pre-market') && (
                            <div className="mt-5">
                              <h6 className="fsize-100 fweight-400 txtDark500 pb-small-4">About Pre-Market</h6>
                              <p className="txtDark700">This property is not yet on sale and exclusively visible for registered buyers on Brixel. You can favorite this property to get informed about all updates from the owner.</p>
                            </div>
                          )
                        }
                      </>
                    )
                  }
                </div>
                {
                  fullScreenCard && (
                    <div className="flex-50 pl-0 pl-sm-3">
                      { /* SECTION: LOCATION */}
                      <h6 className="fsize-100 txtDark500 pb-small-4">Location</h6>
                      {
                        get(item, 'tags', []).includes('pre-market') ? (
                          <p
                            className="mb-2 fsize-300 txtDark500"
                          >{get(item, 'location.zip', null) ? `${get(item, 'location.zip', '')} ` : ''}{get(item, 'location.city', '')}
                          </p>
                        ) : (
                          <p
                            className="mb-2 fsize-300 txtDark500"
                          >{`${get(item, 'location.name', null) ? `${get(item, 'location.name', '')} ` : ''}`}{`${get(item, 'location.streetNumber', null) ? `${get(item, 'location.streetNumber', '')} ` : ''}`}{get(item, 'location.zip', null) ? `${get(item, 'location.zip', '')} ` : ''}{get(item, 'location.city', '')}
                          </p>
                        )
                      }
                      {
                        get(item, 'tags', []).includes('pre-market') ? (
                          <div
                            className="mapsImage w-perc-100 brdRadius h-fix-224 pos-r"
                            style={{
                              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?size=750x400&scale=2&center=${get(item, 'location.latitude', 0)},${get(item, 'location.longitude', 0)}&maptype=satellite&zoom=15&${mapFormatStyle.style}${mapFormatStyle.markers}&key=${baseByData.googleMapsGenerator})`,
                            }}
                          >
                            <div className="redCircleMap" />
                          </div>
                        ) : (
                          <div
                            className="mapsImage w-perc-100 brdRadius  h-fix-224"
                            style={{
                              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?size=750x400&scale=2&center=${get(item, 'location.latitude', 0)},${get(item, 'location.longitude', 0)}&maptype=satellite&zoom=16&${mapFormatStyle.style}${mapFormatStyle.markers}&key=${baseByData.googleMapsGenerator})`,
                            }}
                          />
                        )
                      }
                    </div>
                  )
                }
              </div>
              {
                fullScreenCard && (
                  <div className="">
                    { /* SECTION TEXT DETAILS */ }
                    {
                      !get(item, 'tags', []).includes('pre-market') && (
                        <>
                          <div className="mt-5 max-w-fix-536">
                            <h6 className="fsize-100 fweight-400 txtDark500 pb-small-4">Learn more</h6>
                            <ul className="darkCheckList dis-in txtDark500">

                              <li>See all photos.</li>
                              <li>Take virtual visit.</li>
                              <li>Access documents.</li>
                              <li>Schedule visit &amp; contact seller.</li>
                            </ul>
                          </div>
                          <div className="dis-f jc-c mt-5">
                            <BrixelButtonSecondary
                              onClick={() => window.open(`${baseByData.pageUrl}${item.stub}`, '_blank')}
                              rounded
                              label="Open full page"
                              leftIcon="link-open"
                            />
                          </div>
                        </>
                      )
                    }
                  </div>
                )
              }
            </div>

          </div>

          <div className="bottom a-c txtDark700 pt-1" />
        </div>
      </div>
    </div>
  );
};

// {get(item, 'location.zip', '')} {get(item, 'location.city', '')}
//               {
//                 get(item, 'location.countryCode', 'CH') === 'CH' && (
//                   <>
//                     {` (${get(item, 'location.stateCode', '')})`}
//                   </>
//                 )
//               }

MarketCard.propTypes = {
  // history: PropTypes.object.isRequired,
  activeIndex: PropTypes.number,
  className: PropTypes.string,
  fullCard: PropTypes.bool,
  item: PropTypes.object,
  propertyList: PropTypes.arrayOf(PropTypes.object),
  onToggleCard: PropTypes.func,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCard.defaultProps = {
  activeIndex: 0,
  className: '',
  fullCard: false,
  item: null,
  onToggleCard: () => '',
  propertyList: [],
  type: '',
};

const mapStateToProps = (state) => ({
  skeleton: get(state, 'common.skeleton', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleSetActiveSingleProperty: bindActionCreators(setActiveSingleProperty, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
