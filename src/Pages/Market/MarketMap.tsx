import React, {useEffect, useRef, useState} from 'react';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelMap} from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {setWindowDimensions} from '../../actions/CommonActions';
import type {MarketMapType} from '../../@types/Pages/Market/MarketMap';

const MarketMap = (props: MarketMapType) => {
  // PROPS
  const {
    activeProperty,
    properties,
    lang,
    subMinHeight = '',
    windowDimensions,
    zoom = 10,
  } = props;
  const mapRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(0);

  useEffect(() => {
    if (windowDimensions.width <= 1024) {
      setMapHeight(windowDimensions.height);
    } else {
      setMapHeight(windowDimensions.height - 64);
    }
  });

  return (
    <>
      <div className="map-inner">
        <div
          ref={mapRef}
          className={`min-h-fix-400 pos-r ${subMinHeight}`}
          style={{ height: mapHeight }}
        >
          {
            get(properties[0], 'location.latitude', null) && (
              <BrixelMap
                baseByData={baseByData}
                externalControls={false}
                activePropertyId={get(activeProperty, 'id', undefined)}
                className="w-perc-100 h-perc-100"
                gestureHandling="auto"
                lang={lang}
                zoom={zoom}
                center={{
                  lat: properties[0].location.latitude,
                  lng: properties[0].location.longitude,
                }}
                markers={properties}
              />
            )
          }
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMap);
