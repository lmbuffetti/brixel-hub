/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import set from 'lodash/set';
import pullAt from 'lodash/pullAt';
import compact from 'lodash/compact';
import {
  Helpers,
  FormatValue,
} from '@brixel/brixel-components';
// import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import CoverPropertyImage from './CoverPropertyImage';
import CardImageText from './Skeleton/CardImageText';
import { setSplashType } from '../actions/CommonActions';
import {
  setActiveSingleProperty, setEstimation, setActiveMarketOverlayProperty, getEstimation,
} from '../actions/PropertyActions';

const MarketCard = (props) => {
  // PROPS
  const {
    // history,
    item,
    // preventClick,
    // setMarketOverlayProperty,
    // setSplashScreen,
    skeleton,
    type,
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

  /* const openCard = (e) => {
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
      } else if (type === 'favorite') {
        history.push({
          pathname: `/buyer/property/${item.id}/page`,
          state: { section: 'Market' },
        });
      } else window.open(`${baseByData.pageUrl}${item.stub}`, '_blank');
      // TODO: Estimation opens overlay
    }
  }; */

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
        className={`market-card w-fix-376 ov-h h-perc-100 dis-fl-col brdRadius shadow-1dp pos-r ${removeSkeleton && item ? '' : 'pos-a opacity0'} bgWhite m-a`}
        // onClick={(e) => (type !== 'own' ? openCard(e) : '')}
      >
        <>
          <CoverPropertyImage
            loadedImg={(val) => setCoverImgLoaded(val)}
            className={`${isPreMarket ? 'pre-market' : ''} cover brdRadius mb-2 w-perc-100 h-perc-100 h-fix-160 pos-r`}
            coverPhoto={get(item, 'coverPhoto.galleryThumbnailPath', undefined)}
            propertyType={get(item, 'properties.propertyType', undefined)}
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
        <div className="info dis-fl-col jc-b px-3">
          <h5 className="txtDark700 ellipsis one notranslate mb-2">{get(item, 'title', '')}</h5>

          <div className="mid dis-fl-col fsize-300 pt-1 txtDark400">
            <div className="dis-f a-c jc-b">
              {
                get(item, 'price.total', 0) !== 0 && get(item, 'status', null) === 'on-sale' ? (
                  <>
                    <>
                      <span className="fsize-300 fweight-600 notranslate">{get(item, 'price.currency', '')} &nbsp; </span>
                      <span className="fsize-300 fweight-600 notranslate">{Helpers.formatNumberValue(get(item, 'price.total', 0), get(item, 'price.currency', ''))}</span>
                    </>
                    <>
                      <span className="fsize-100 pr-1 txtDark700"> {get(item, 'price.currency', '')} </span>
                      <span className="ff-mono txtDark700"> {Helpers.formatNumberValue(get(item, 'price.pricePerM2', 0).toFixed(), get(item, 'price.currency', ''))} </span>
                      <span className="fsize-100 txtDark700 ff-mono">/m2</span>
                    </>
                  </>
                ) : (
                  <span className="txtGreen400 fsize-300 fweight-500">On Request</span>
                )
              }
            </div>
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

          <div className="bottom a-c txtDark700 pt-1" />
        </div>
      </div>
    </>
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
  item: PropTypes.object,
  // preventClick: PropTypes.bool,
  // setMarketOverlayProperty: PropTypes.func.isRequired,
  // setSplashScreen: PropTypes.func.isRequired,
  skeleton: PropTypes.object.isRequired,
  type: PropTypes.string,
};

MarketCard.defaultProps = {
  item: null,
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
