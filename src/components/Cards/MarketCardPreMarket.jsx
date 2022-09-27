/* eslint-disable react-hooks/exhaustive-deps */
import { translateTo } from '@brixel/brixel-components';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { setSplashType } from '../../actions/CommonActions';
import {
  setActiveSingleProperty, setEstimation, setActiveMarketOverlayProperty, getEstimation,
} from '../../actions/PropertyActions';
import { mapStyles } from '../../constants/map';

const MarketCardPreMarket = (props) => {
  // PROPS
  const {
    className,
    item,
    lang,
    loadMapImg,
    // skeleton,
    // type,
  } = props;
  // STATE
  // const [removeSkeleton, setRemoveSkeleton] = useState(false);
  const [mapFormatStyle, setMapFormatStyle] = useState({ });

  // TODO: Based on "type" prop, sent by the category, open each property on buyer dashboard/seller dashboard/page, etc.
  /* useEffect(() => {
    if (!skeleton[type]) {
      setRemoveSkeleton(true);
    }
  }, [skeleton]); */

  useEffect(() => {
    let style = '';
    mapStyles.map((mapitem) => {
      Object.keys(mapitem).map((subitem) => {
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

  return (
    <div
      className={`${className} brdRadius max-w-fix-760 mx-a bgWhite brdSmall brdLight200 ov-h`}
    >
      <div className="dis-fl-col dis-fl-row-md">
        {
          loadMapImg && (
            <div
              className="mapsImage w-perc-100 w-perc-md-50 pos-r min-h-fix-md-344 min-h-fix-216 wizardCopy-preMarketOverlay-1"
              style={{
                backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?size=350x400&scale=2&center=${get(item, 'location.latitude', 0)},${get(item, 'location.longitude', 0)}&maptype=satellite&zoom=15&${mapFormatStyle.style}${mapFormatStyle.markers}&key=${baseByData.googleMapsGenerator})`,
              }}
              id="wizard-preMarketOverlay-2"
            >
              <div className="redCircleMapPreMarket" />
            </div>
          )
        }

        <div className="w-perc-100 w-perc-md-50 p-2 p-md-4 wizardCopy-preMarketOverlay-2" id="wizard-preMarketOverlay-1">
          <h4 className="fsize-500 fsize-md-600">{translateTo(item.title, lang)}</h4>

          <div className="dis-f mt-2 mt-md-5">
            <div>
              <h4 className="fsize-500 fsize-md-600">{get(item, 'properties.typology.bedrooms', 0)}</h4>
              <p className="fsize-200 mt-small-4 mt-md-1">{translateTo('Rooms', lang)}</p>
            </div>
            <div className="ml-3">
              <h4 className="fsize-500 fsize-md-600">{get(item, 'properties.typology.livingArea.value', 0)}m2</h4>
              <p className="fsize-200 mt-small-4 mt-md-1">{translateTo('Living space', lang)}</p>
            </div>
            <div className="ml-3">
              <h4 className="fsize-500 fsize-md-600">{get(item, 'properties.building.built', 0)}</h4>
              <p className="fsize-200 mt-small-4 mt-md-1">{translateTo('Year', lang)}</p>
            </div>
          </div>

          <div className="mt-2 mt-md-3">
            <h4 className="fsize-500 fsize-md-600">{get(item, 'location.zip', 0)} {get(item, 'location.city', 0)}</h4>
            <p className="fsize-200 mt-small-4 mt-md-1">{translateTo('Location', lang)}</p>
          </div>
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

MarketCardPreMarket.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
  lang: PropTypes.string.isRequired,
  loadMapImg: PropTypes.bool,
};

MarketCardPreMarket.defaultProps = {
  className: '',
  item: null,
  loadMapImg: true,
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
)(MarketCardPreMarket);
