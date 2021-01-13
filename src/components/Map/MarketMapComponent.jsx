/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  Map, InfoWindow, Marker, GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { BrixelIcon } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { diff } from 'deep-object-diff';
import markerImg from '../../images/location/icon_location.svg';
import markerSimilarProperties from '../../images/location/icon_similar_properties.svg';
import { mapStyles } from '../../constants/map';

export const MarketMapComponent = (props) => {
  // PROPS
  const {
    activeProperty,
    disableZoom,
    externalControls,
    google,
    properties,
    mapType,
    onActiveProperty,
    rad,
    scrollZoom,
    showMap,
    subMinHeight,
    visible,
    zoom,
  } = props;
  // STATE
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [modalInfo] = useState({});
  const [mapTypeId, setMapTypeId] = useState('roadmap');
  const [streetViewAvailable, setStretViewAvailable] = useState(false);
  const [optMap, setOptMap] = useState({});

  // FUNCTION TO INITIALIZE THE MAP
  const fetchPlaces = (mapProps, map) => {
    // MAP DEFAULT OPTIONS
    map.setOptions({
      styles: mapStyles,
      disableDefaultUI: true,
      clickableIcons: true,
      zoomControl: externalControls ? false : !disableZoom,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false,
      scrollwheel: scrollZoom,
      gestureHandling: 'cooperative',
      mapTypeId: mapType,
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
      draggable: false,
    });

    setOptMap(map);
    // FUNCTION TO LOAD NEAR PLACES
  };

  // FUNCTION TO RE-CENTER THE MAP ON CHANGE THE LATITUDE OR LONGITUDE OR ZOOM
  useEffect(() => {
    if (Object.keys(optMap).length > 0) {
      const center = {
        lat: properties[0].location.latitude,
        lng: properties[0].location.longitude,
      };
      optMap.setZoom(10);
      optMap.panTo(center);
    }
  }, [properties, optMap.zoom, rad]);

  // FUNCTION IF ENABLED EXTERNAL CONTROLS
  const btnActions = (action) => {
    const center = {
      lat: properties[0].location.latitude,
      lng: properties[0].location.longitude,
    };
    const panorama = optMap.getStreetView();

    switch (action) {
      case 'zoomIn':
        if (mapTypeId === 'streetview') {
          panorama.setZoom(panorama.zoom + 1);
        } else {
          optMap.setZoom(optMap.zoom + 1);
        }
        break;
      case 'zoomOut':
        if (mapTypeId === 'streetview') {
          panorama.setZoom(panorama.zoom - 1);
        } else {
          optMap.setZoom(optMap.zoom - 1);
        }
        break;
      case 'roadmap':
        setMapTypeId('roadmap');
        optMap.setMapTypeId('roadmap');
        panorama.setVisible(false);
        break;
      case 'satellite':
        setMapTypeId('satellite');
        optMap.setMapTypeId('satellite');
        panorama.setVisible(false);
        break;
      case 'streetview':
        panorama.setPosition(center);
        panorama.setOptions({
          linksControl: false,
          panControl: false,
          enableCloseButton: false,
          addressControl: false,
          zoomControl: false,
          addressControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_CENTER,
          },
        });
        panorama.setPov(({
          heading: 0,
          pitch: 0,
        }));
        setMapTypeId('streetview');
        panorama.setVisible(true);
        break;
      default:
      // do nothing
    }
  };

  // FUNCTION FORM MARKERS MAP
  const onSelProperty = (type, id) => {
    onActiveProperty(id);
  };

  return (
    // Important! Always set the container height explicitly
    <>
      {
        (externalControls && showMap) && (
          <div className="actionMaps">
            {
              streetViewAvailable && (
                <div className="switchBtn shadow-4dp mr-1">
                  <div
                    className={`btn-action ${mapTypeId === 'streetview' ? 'active' : ''}`}
                    onClick={() => btnActions('streetview')}
                  >
                    <BrixelIcon
                      icon="streetview"
                    />
                  </div>
                  <div
                    className={`btn-action ${mapTypeId === 'roadmap' ? 'active' : ''}`}
                    onClick={() => btnActions('roadmap')}
                  >
                    <BrixelIcon
                      icon="roadmap"
                    />
                  </div>
                  <div
                    className={`btn-action ${mapTypeId === 'satellite' ? 'active' : ''}`}
                    onClick={() => btnActions('satellite')}
                  >
                    <BrixelIcon
                      icon="satellite"
                    />
                  </div>
                </div>
              )
            }
            <div className="switchBtn shadow-4dp">
              <div
                className="btn-action"
                onClick={() => btnActions('zoomIn')}
              >
                <BrixelIcon
                  icon="plus"
                />
              </div>
              <div
                className="btn-action"
                onClick={() => btnActions('zoomOut')}
              >
                <BrixelIcon
                  icon="min"
                />
              </div>
            </div>
          </div>
        )
      }
      <div className={`h-perc-100 min-h-fix-400 pos-r ${subMinHeight}`}>
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
          {
            properties.map((item, i) => (
              <Marker
                key={i.toString()}
                position={{
                  lat: get(item, 'location.latitude', 200),
                  lng: get(item, 'location.longitude', 200),
                }}
                icon={activeProperty === item.id ? markerImg : markerSimilarProperties}
                onClick={() => onSelProperty('click', item.id)}
                // onMouseover={() => onSelProperty('enter', item.id)}
                // onMouseout={() => onSelProperty('leave', item.id)}
              />
            ))
          }
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
  disableZoom: PropTypes.bool,
  externalControls: PropTypes.bool,
  google: PropTypes.object.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapType: PropTypes.string,
  onActiveProperty: PropTypes.func.isRequired,
  rad: PropTypes.number,
  scrollZoom: PropTypes.bool,
  showMap: PropTypes.bool,
  subMinHeight: PropTypes.string,
  visible: PropTypes.bool,
  zoom: PropTypes.number,
};

MarketMapComponent.defaultProps = {
  activeProperty: null,
  disableZoom: false,
  externalControls: false,
  mapType: 'roadmap',
  rad: null,
  scrollZoom: false,
  showMap: true,
  subMinHeight: '',
  visible: true,
  zoom: 10,
};

export const MapComponent = React.memo(MarketMapComponent, (prevProps, nextProps) => {
  const prevLat = get(prevProps, 'properties', null);
  const nextLat = get(nextProps, 'properties', null);
  const propDiff = diff(prevLat, nextLat);
  return (
    Object.keys(propDiff).length === 0 &&
    prevProps.activeProperty === nextProps.activeProperty
  );
});

export default compose(
  GoogleApiWrapper({
    apiKey: (baseByData.googleMaps),
    libraries: ['geometry', 'drawing', 'places'],
  }),
  withRouter,
)(MapComponent);
