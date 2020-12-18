/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Map, InfoWindow, Marker, Circle,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, change } from '@brixel/brixel-components';
import get from 'lodash/get';
import markerImg from '../../images/location/icon_location.svg';
import markerSimilarProperties from '../../images/location/icon_similar_properties.svg';
import { mapCaptionData, mapStyles, getDistance } from '../../constants/map';
import { compareArray } from '../../utils/helpers';

const images = require.context('../../images', true);

export const ComponentMap = (props) => {
  // PROPS
  const {
    changeFieldValue,
    curCountry,
    draggable,
    disableZoom,
    externalControls,
    formName,
    google,
    isDefView,
    latitude,
    longitude,
    mapType,
    moveMarker,
    rad,
    nearBy,
    scrollZoom,
    showMap,
    similarProperties,
    subMinHeight,
    visible,
    zoom,
  } = props;
  // STATE
  const [selectedPlace, setSelectedPlace] = useState([]);
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
      const service = new google.maps.places.PlacesService(map);
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

      Object.keys(mapCaptionData).map(async (keys) => {
        await mapCaptionData[keys].keywordsInclude.map(async (query) => {
          const placeRequest = {
            location: center,
            type: [query],
            radius: 1000,
          };
          await service.nearbySearch(placeRequest, async (res) => {
            const curPlace = selectedPlace;
            compareArray(res, mapCaptionData[keys].keywordsExclude).map((val) => {
              let photo;
              if (val.photos && val.photos[0]) {
                photo = val.photos[0].getUrl();
              }
              const urlImg = mapCaptionData[keys].iconSettings.icon.url;
              const iconImg = images(`./${urlImg}`);
              val.iconSettings = mapCaptionData[keys].iconSettings;
              val.iconSettings.icon.newUrl = iconImg;
              // ACTIVE ICON
              const urlImgActive = mapCaptionData[keys].iconSettings.activeIcon.url;
              val.iconSettings.icon.newUrlActive = images(`./${urlImgActive}`);
              val.distance = getDistance({ lat: latitude, lng: longitude }, {
                lat: val.geometry.location.lat(),
                lng: val.geometry.location.lng(),
              });
              val.photo = photo;
              curPlace.push(val);
              return null;
            });
            setSelectedPlace([
              ...selectedPlace,
            ]);
          });
        });
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
      if (latitude === 44.82 && longitude === 4.31) optMap.setZoom(4);
      else if (isDefView) optMap.setZoom(6);
      else optMap.setZoom(14);
      optMap.panTo(center);
    }
  }, [latitude, longitude, optMap.zoom]);

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
            !isDefView && (
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
                onMouseover={() => console.log('mouseover')}
                onClick={() => console.log('click')}
                onMouseout={() => console.log('mouseout')}
                strokeColor="transparent"
                strokeOpacity={0}
                strokeWeight={5}
                fillColor="#FF0000"
                fillOpacity={0.2}
              />
            )
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
                key={i.toString()}
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
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  mapType: PropTypes.string,
  moveMarker: PropTypes.bool,
  nearBy: PropTypes.bool,
  rad: PropTypes.number,
  scrollZoom: PropTypes.bool,
  similarProperties: PropTypes.arrayOf(PropTypes.object),
  showMap: PropTypes.bool,
  zoom: PropTypes.number,
  subMinHeight: PropTypes.string,
  visible: PropTypes.bool,
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
  scrollZoom: false,
  rad: null,
  similarProperties: [],
  showMap: false,
  zoom: 10,
  subMinHeight: '',
  visible: true,
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(form, field, value) {
    dispatch(change(form, field, value));
  },
});

export const Maps = React.memo(ComponentMap, (prevProps, nextProps) => {
  const prevLat = get(prevProps, 'latitude', null);
  const nextLat = get(nextProps, 'latitude', null);
  const prevZoom = get(prevProps, 'zoom', null);
  const nextZoom = get(nextProps, 'zoom', null);
  return (
    prevLat === nextLat &&
    prevZoom === nextZoom
  );
});

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(ComponentMap);
