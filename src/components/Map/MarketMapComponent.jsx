/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import get from 'lodash/get';
import {
  Map, InfoWindow, GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { setWindowDimensions } from '../../actions/CommonActions';
import MarkerComponent from './MarkerComponent';
import { mapStyles } from '../../constants/map';

export const MarketMapComponent = (props) => {
  // PROPS
  const {
    activeProperty,
    google,
    properties,
    mapType,
    onActiveProperty,
    rad,
    showMap,
    subMinHeight,
    type,
    visible,
    windowDimensions,
    zoom,
  } = props;
  // STATE
  const [marker, setMarker] = useState([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [modalInfo] = useState({});
  const mapRef = useRef(null);
  const [optMap, setOptMap] = useState({});
  const [mapHeight, setMapHeight] = useState(0);

  // FUNCTION TO INITIALIZE THE MAP
  const fetchPlaces = (mapProps, map) => {
    // MAP DEFAULT OPTIONS
    map.setOptions({
      styles: mapStyles,
      disableDefaultUI: true,
      clickableIcons: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false,
      scrollwheel: true,
      gestureHandling: 'cooperative',
      mapTypeId: mapType,
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
      draggable: true,
    });

    setOptMap(map);
    // FUNCTION TO LOAD NEAR PLACES
  };

  // FUNCTION TO RE-CENTER THE MAP ON CHANGE THE LATITUDE OR LONGITUDE OR ZOOM
  useEffect(() => {
    if (Object.keys(optMap).length > 0) {
      let center = {
        lat: properties[0].location.latitude,
        lng: properties[0].location.longitude,
      };
      optMap.panTo(center);
      if (activeProperty) {
        const filtProp = properties.find((item) => item.id === activeProperty);
        if (filtProp) {
          center = {
            lat: filtProp.location.latitude,
            lng: filtProp.location.longitude,
          };
          if (optMap.getBounds() && !optMap.getBounds().contains(new google.maps.LatLng(filtProp.location.latitude, filtProp.location.longitude))) {
            optMap.panTo(center);
          }
        }
      }
    }
  }, [properties, optMap.zoom, rad, activeProperty]);

  // FUNCTION FORM MARKERS MAP
  const onSelProperty = (typology, id) => {
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
    // Important! Always set the container height explicitly
    <>
      <div
        ref={mapRef}
        className={`min-h-fix-400 pos-r ${subMinHeight}`}
        style={{ height: mapHeight }}
      >
        <Map
          google={google}
          onReady={(mapProps, map) => fetchPlaces(mapProps, map)}
          zoom={zoom}
          visible={visible}
          initialCenter={{
            lat: properties[0].location.latitude !== 0,
            lng: properties[0].location.longitude !== 0,
          }}
          style={{
            width: showMap ? '100%' : '0px',
            height: showMap ? '100%' : '0px',
          }}
          onClick={() => setShowInfoWindow(false)}
        >

          <MarkerComponent
            activeProperty={activeProperty}
            optMap={optMap}
            google={google}
            data={properties}
            onMarker={(val) => setMarker(val)}
            parentMarker={marker || []}
            type={type}
            onClick={(val) => onSelProperty('click', val)}

            // onMouseover={() => onSelProperty('enter', item.id)}
            // onMouseout={() => onSelProperty('leave', item.id)}
          />
          {
            modalInfo.lat && (
              <InfoWindow
                visible={showInfoWindow}
                style={{ textAlign: 'center' }}
                position={{
                  lat: modalInfo.lat,
                  lng: modalInfo.lng,
                }}
              >
                <div className="modalMaps">
                  <i style={{ backgroundImage: `url(${modalInfo.photo})` }} />
                  <div>
                    <h4>{modalInfo.title}</h4>
                    <h6>{modalInfo.subtitle}</h6>
                    <p>{`${modalInfo.distance}m`}</p>
                  </div>
                </div>
              </InfoWindow>
            )
          }
        </Map>
      </div>
    </>
  );
};

MarketMapComponent.propTypes = {
  activeProperty: PropTypes.string,
  google: PropTypes.object.isRequired,
  mapType: PropTypes.string,
  onActiveProperty: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  rad: PropTypes.number,
  showMap: PropTypes.bool,
  subMinHeight: PropTypes.string,
  type: PropTypes.string,
  visible: PropTypes.bool,
  windowDimensions: PropTypes.object.isRequired,
  zoom: PropTypes.number,
};

MarketMapComponent.defaultProps = {
  activeProperty: null,
  mapType: 'roadmap',
  rad: null,
  showMap: true,
  subMinHeight: '',
  type: null,
  visible: true,
  zoom: 10,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  GoogleApiWrapper({
    apiKey: (baseByData.googleMaps),
    libraries: ['geometry', 'drawing', 'places'],
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMapComponent);
