/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import {
  Map, InfoWindow, Marker, Circle,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon } from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import { change } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import markerImg from '../../images/location/icon_location.svg';
import markerSimilarProperties from '../../images/location/icon_similar_properties.svg';
import { mapStyles } from '../../constants/map';

export const ComponentMap = (props) => {
  // PROPS
  const {
    changeFieldValue,
    curCountry,
    disableZoom,
    draggable,
    externalControls,
    formName,
    google,
    isDefView,
    lang,
    latitude,
    longitude,
    mapType,
    moveMarker,
    nearBy,
    points,
    rad,
    scrollZoom,
    showMap,
    showRadar,
    similarProperties,
    subMinHeight,
    visible,
    zoom,
  } = props;
  // STATE
  // const [selectedPlace, setSelectedPlace] = useState([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [modalInfo] = useState({});
  const [mapTypeId, setMapTypeId] = useState('roadmap');
  const [streetViewAvailable, setStretViewAvailable] = useState(false);
  const [optMap, setOptMap] = useState({});

  // FUNCTION TO INITIALIZE THE MAP
  const fetchPlaces = (mapProps, map) => {
    const center = {
      lat: latitude !== 0 ? latitude : get(curCountry, 'location.lat', null),
      lng: longitude !== 0 ? longitude : get(curCountry, 'location.lng', null),
    };
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
      draggable,
    });

    setOptMap(map);
    // FUNCTION TO LOAD NEAR PLACES
    if (nearBy) {
      const streetViewService = new google.maps.StreetViewService();
      const STREETVIEW_MAX_DISTANCE = 50;
      const latLng = new google.maps.LatLng(center.lat, center.lng);
      streetViewService.getPanoramaByLocation(latLng, STREETVIEW_MAX_DISTANCE, (streetViewPanoramaData, status) => {
        if (status === google.maps.StreetViewStatus.OK) {
          setStretViewAvailable(true);
        } else {
          setStretViewAvailable(false);
        }
      });
    }
  };

  // FUNCTION TO RE-CENTER THE MAP ON CHANGE THE LATITUDE OR LONGITUDE OR ZOOM
  useEffect(() => {
    if (Object.keys(optMap).length > 0) {
      const center = {
        lat: latitude,
        lng: longitude,
      };
      if (zoom === 20) optMap.setZoom(16);
      else if (latitude === 44.82 && longitude === 4.31) optMap.setZoom(4);
      else if (points.length > 0) optMap.setZoom(12);
      else if (rad) optMap.setZoom(13);
      else if (isDefView) optMap.setZoom(6);
      else optMap.setZoom(14);
      optMap.panTo(center);
    }
  }, [latitude, longitude, optMap.zoom, rad, points]);

  // FUNCTION IF ENABLED EXTERNAL CONTROLS
  const btnActions = (action) => {
    const center = {
      lat: latitude,
      lng: longitude,
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

  // FUNCTION WHEN THE MARKER IS MOVED
  const onMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    changeFieldValue(formName, 'location.latitude', lat);
    changeFieldValue(formName, 'location.longitude', lng);
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

      <div className={showMap ? `h-perc-100 ${subMinHeight}` : 'hide'}>
        <Map
          google={google}
          onReady={(mapProps, map) => fetchPlaces(mapProps, map)}
          zoom={zoom}
          visible={visible}
          initialCenter={{
            lat: latitude !== 0,
            lng: longitude !== 0,
          }}
          style={{
            width: showMap ? '100%' : '0px',
            height: showMap ? '100%' : '0px',
          }}
          onClick={() => setShowInfoWindow(false)}
        >
          {
            !isDefView && !showRadar && (
              <Marker
                position={{
                  lat: latitude,
                  lng: longitude,
                }}
                icon={markerImg}
                draggable={moveMarker}
                onDragend={(t, map, coord) => onMarkerDragEnd(coord)}
              />
            )
          }
          {
            rad && (
              <Circle
                radius={rad * 1000}
                center={{
                  lat: latitude,
                  lng: longitude,
                }}
                strokeColor="transparent"
                strokeOpacity={0}
                strokeWeight={5}
                fillColor="#FF0000"
                fillOpacity={0.5}
              />
            )
          }
          {
            points.map((item, i) => ([
              <Marker
                position={{
                  lat: item.latitude,
                  lng: item.longitude,
                }}
                icon={markerImg}
                key={`marker_${i.toString()}`}
              />,
              <Circle
                radius={item.radius * 1000}
                center={{
                  lat: item.latitude,
                  lng: item.longitude,
                }}
                strokeColor="transparent"
                strokeOpacity={0}
                strokeWeight={5}
                fillColor="#FF0000"
                fillOpacity={0.2}
                key={`circle_${i.toString()}`}
              />,
            ]))
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
                    <h4>{translateTo(modalInfo.title, lang)}</h4>
                    <h6>{translateTo(modalInfo.subtitle, lang)}</h6>
                    <p>{`${modalInfo.distance}m`}</p>
                  </div>
                </div>
              </InfoWindow>
            )
          }
          {
            similarProperties.map((item, i) => (
              <Marker
                position={{
                  lat: item.Latitude,
                  lng: item.Longitude,
                }}
                icon={{
                  url: markerSimilarProperties,
                  anchor: new google.maps.Point(16, 16),
                  scaledSize: new google.maps.Size(8, 8),
                }}
                draggable={false}
                key={`mp_${i.toString()}`}
              />
            ))
          }
        </Map>
      </div>
    </>
  );
};

ComponentMap.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  curCountry: PropTypes.object,
  disableZoom: PropTypes.bool,
  draggable: PropTypes.bool,
  externalControls: PropTypes.bool,
  formName: PropTypes.string,
  google: PropTypes.object.isRequired,
  isDefView: PropTypes.bool,
  lang: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  mapType: PropTypes.string,
  moveMarker: PropTypes.bool,
  nearBy: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.object),
  rad: PropTypes.number,
  scrollZoom: PropTypes.bool,
  showMap: PropTypes.bool,
  showRadar: PropTypes.bool,
  similarProperties: PropTypes.arrayOf(PropTypes.object),
  subMinHeight: PropTypes.string,
  visible: PropTypes.bool,
  zoom: PropTypes.number,
};

ComponentMap.defaultProps = {
  curCountry: {},
  disableZoom: false,
  draggable: false,
  externalControls: false,
  formName: '',
  isDefView: false,
  mapType: 'roadmap',
  moveMarker: false,
  nearBy: false,
  points: [],
  rad: null,
  scrollZoom: false,
  showMap: false,
  showRadar: false,
  similarProperties: [],
  subMinHeight: '',
  visible: true,
  zoom: 10,
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(form, field, value) {
    dispatch(change(form, field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ComponentMap);
