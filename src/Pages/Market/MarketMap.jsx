/* eslint-disable react-hooks/exhaustive-deps */
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { BrixelMap } from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { setWindowDimensions } from '../../actions/CommonActions';

const MarketMap = (props) => {
  // PROPS
  const {
    activeProperty,
    onActiveProperty,
    properties,
    lang,
    showMap,
    subMinHeight,
    windowDimensions,
    zoom,
  } = props;
  const mapRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(0);
  
  // FUNCTION FORM MARKERS MAP
  const onSelProperty = (id) => {
    onActiveProperty(id);
  };
  
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
                onSelProperty={(id) => onSelProperty(id)}
                style={{
                  width: showMap ? '100%' : '0px',
                  height: showMap ? '100%' : '0px',
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

MarketMap.propTypes = {
  activeProperty: PropTypes.string,
  lang: PropTypes.string.isRequired,
  onActiveProperty: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMap: PropTypes.bool,
  subMinHeight: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
  zoom: PropTypes.number,
};

MarketMap.defaultProps = {
  activeProperty: null,
  showMap: true,
  subMinHeight: '',
  type: null,
  zoom: 10,
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
