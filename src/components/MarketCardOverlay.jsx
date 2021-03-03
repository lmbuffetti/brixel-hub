/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import pullAt from 'lodash/pullAt';
import compact from 'lodash/compact';
import {
  BrixelButtonPrimary,
  BrixelIcon,
  Helpers,
  FormatValue,
} from '@brixel/brixel-components';
// import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';
import { setSplashType } from '../actions/CommonActions';
import Map from './Map/Maps';
import { fullExtraFeatures } from '../utils/propertyData';
import {
  setActiveSingleProperty, setEstimation, setActiveMarketOverlayProperty, getEstimation,
} from '../actions/PropertyActions';
import { mapStyles } from '../constants/map';
import {
  cutValue, roundFifty, roundFiveThousand, convertColorToHue,
} from '../utils/helpers';

const MarketCard = (props) => {
  // PROPS
  const {
    // history,
    className,
    item,
    // preventClick,
    // setMarketOverlayProperty,
    // setSplashScreen,
    onToggleCard,
    skeleton,
    type,
  } = props;
  // STATE
  const [coverImgLoaded, setCoverImgLoaded] = useState(false);
  const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [isPreMarket, setIsPreMarket] = useState(false);
  const [fullScreenCard, setFullScreenCard] = useState(false);
  const [mapFormatStyle, setMapFormatStyle] = useState({ });

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
    let style = '';
    mapStyles.map((item) => {
      Object.keys(item).map((subitem) => {
        // console.log(item, subitem);
        if (item.featureType) {
          if (subitem === 'featureType') {
            style += `&style=feature:${item[subitem]}`;
          }
          if (subitem === 'elementType') {
            console.log(item[subitem]);
            style += `|element:${item[subitem]}`;
          }
        }
        return null;
      });
      return null;
    });
    let imgLocation = 'https://generator.brixel.io/images/icon_location.png';
    if (get(item, 'tags', []).includes('pre-market')) {
      imgLocation = 'https://generator.brixel.io/images/circle_map.png';
    }
    setMapFormatStyle({
      style,
      markers: `&markers=icon:${imgLocation}|${item.location.latitude},${item.location.longitude}|scale:4`,
      // merged: res.data,
    });
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
    if (!fullScreenCard) {
      onToggleCard(true);
      setFullScreenCard(true);
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
        className={`market-card w-fix-376 ov-h h-perc-100 dis-fl-col brdRadius shadow-1dp pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} bgWhite m-a ${fullScreenCard ? 'market-card-fullscreen' : ''}`}
        // onClick={(e) => (type !== 'own' ? openCard(e) : '')}
      >
        <>
          <div className="pos-r">
            <CoverPropertyImage
              loadedImg={(val) => setCoverImgLoaded(val)}
              className={`${isPreMarket ? 'pre-market' : ''} cover brdRadius mb-2 w-perc-100 h-perc-100 pos-r ${fullScreenCard ? 'h-fix-320' : 'h-fix-160 cur-poi'}`}
              coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(item, 'properties.propertyType', undefined)}
              onClick={() => openDetailCard()}
            />
            {
              !get(item, 'tags', []).includes('pre-market') && fullScreenCard && (
                <BrixelButtonPrimary
                  onClick={() => window.open(`${baseByData.pageUrl}${item.stub}`, '_blank')}
                  className="pos-a x-c bt mb-3"
                  rounded
                  label="open"
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
        <div className="info dis-fl-col jc-b px-3">
          <h5 className="txtDark700 ellipsis one notranslate mb-2">
            {get(item, 'title', '')}
          </h5>

          <div className="mid dis-fl-col fsize-300 pt-1 txtDark400">
            { /* SECTION: PRICE */ }
            <h6 className="fsize-100 txtDark200">Price</h6>
            <div className="dis-f a-c jc-b">
              {
                get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (
                  <>
                    <div>
                      <span className="fsize-400 notranslate txtGreen400">{get(item, 'price.currency', '')} &nbsp; </span>
                      <span className="fsize-500 notranslate ff-mono txtGreen400">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                    </div>
                    <div className="dis-f a-c">
                      <span className="fsize-100 pr-1 txtDark700"> {get(item, 'price.currency', '')} </span>
                      <span className="ff-mono txtDark700"> {Helpers.formatNumberValue(get(item, 'price.pricePerM2', 0).toFixed(), get(item, 'price.currency', ''))} </span>
                      <span className="fsize-100 txtDark700 ff-mono">/m2</span>
                    </div>
                  </>
                ) : (
                  <span className="txtGreen400 fsize-300 fweight-500">On Request</span>
                )
              }
            </div>
            { /* SECTION: PROPERTY TYPE - ROOMS - LIVING AREA */ }
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
            {
              fullScreenCard && (
                <div>
                  { /* SECTION: LOCATION */ }
                  <h6 className="fsize-100 txtDark200">Location</h6>
                  {
                    get(item, 'tags', []).includes('pre-market') ? (
                      <p className="mb-2">{get(item, 'location.zip', null) ? `${get(item, 'location.zip', '')} ` : ''}{get(item, 'location.city', '')}</p>
                    ) : (
                      <p className="mb-2">{`${get(item, 'location.name', null) ? `${get(item, 'location.name', '')} ` : ''}`}{`${get(item, 'location.streetNumber', null) ? `${get(item, 'location.streetNumber', '')} ` : ''}`}{get(item, 'location.zip', null) ? `${get(item, 'location.zip', '')} ` : ''}{get(item, 'location.city', '')}</p>
                    )
                  }
                  {
                    get(item, 'tags', []).includes('pre-market') ? (
                      <div
                        className="mapsImage w-perc-100 h-fix-320"
                        style={{
                          backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?size=750x400&scale=2&center=${get(item, 'location.latitude', 0)},${get(item, 'location.longitude', 0)}&maptype=satellite&zoom=14&${mapFormatStyle.style}${mapFormatStyle.markers}&key=${baseByData.googleMapsGenerator})`,
                        }}
                      />
                    ) : (
                      <div
                        className="mapsImage w-perc-100 h-fix-320"
                        style={{
                          backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?size=750x400&scale=2&center=${get(item, 'location.latitude', 0)},${get(item, 'location.longitude', 0)}&maptype=satellite&zoom=14&${mapFormatStyle.style}${mapFormatStyle.markers}&key=${baseByData.googleMapsGenerator})`,
                        }}
                      />
                    )
                  }

                  { /* SECTION: EXTRA FEATURE */}
                  {
                    !get(item, 'tags', []).includes('pre-market') && fullExtraFeatures(item).length > 0 && (
                      <div>
                        <div className="row">
                          {
                            fullExtraFeatures(item).map((key, i) => (
                              <div key={i.toString()} className="singleItem col-md-6 mb-3">
                                <BrixelIcon
                                  icon={get(key, 'icon', '')}
                                  color="green"
                                  background="white"
                                  saturation={0}
                                  saturationTxt={700}
                                />
                                <div>
                                  <span className="dis-b">{get(key, 'label', '')}</span>
                                  {
                                    get(key, 'subtitle', null) && (
                                      <span className="body2">{get(key, 'subtitle', '')}</span>
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

                  { /* SECTION TEXT DETAILS */ }
                  {
                    get(item, 'tags', []).includes('pre-market') ? (
                      <div>
                        <h6 className="fsize-100 txtDark200">About Pre-Market</h6>
                        <p>This property is not yet on sale and exclusively visible for registered buyers on Brixel. You can favorite this property to get informed about all updates from the owner.</p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <h6 className="fsize-100 txtDark200">There is more</h6>
                        <ul className="darkCheckList">
                          <li>See all photos</li>
                          <li>Take virtual visit</li>
                          <li>Access documents</li>
                          <li>Schedule visit & contact buyer</li>
                        </ul>
                      </div>
                    )
                  }
                </div>
              )
            }

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
  className: PropTypes.string,
  item: PropTypes.object,
  // preventClick: PropTypes.bool,
  // setMarketOverlayProperty: PropTypes.func.isRequired,
  // setSplashScreen: PropTypes.func.isRequired,
  onToggleCard: PropTypes.func,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCard.defaultProps = {
  className: '',
  item: null,
  onToggleCard: () => '',
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketCard);
