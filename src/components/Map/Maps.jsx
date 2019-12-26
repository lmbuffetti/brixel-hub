/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, createRef } from 'react';
import {
  Map, InfoWindow, Marker, GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { change } from 'redux-form';
import { BrixelIcon, BrixelInputText } from '@brixel/brixel-components';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import markerImg from '../../images/location/icon_location.svg';
import baseByData  from '@brixel/brixel-configuration-partner/src/Settings';
import { mapCaptionData, mapStyles, getDistance } from '../../constants/map';
import { compareArray } from '../../utils/helpers';
import swissZipCode from '../../resources/swissZipCodes.json';

const images = require.context('../../images', true);

const Maps = (props) => {
  // STATE
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [mapTypeId, setMapTypeId] = useState('roadmap');
  const [inputSearchZip, setInputSearchZip] = useState('');
  const [errorInputSearchZip, setErrorInputSearchZip] = useState(null);
  const [streetViewAvailable, setStretViewAvailable] = useState(false);
  const [showZipCode, setShowZipCode] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [optMap, setOptMap] = useState({});
  const inputSearch = createRef(null);
  // PROPS
  const {
    longitude, latitude, google, place, mapType, zoom, draggable, property, showSearchLocation,
    scrollZoom, externalControls, disableZoom, className, changeFieldValue, moveMarker, showMap,
    inputLabel, formName,
  } = props;

  const changeLocation = (val) => {
    console.log(val);
    if (showSearchLocation && inputSearch.current) {
      setNewLocation(val);
      const autocomplete = new google.maps.places.Autocomplete(inputSearch.current);

      autocomplete.addListener('place_changed', () => {
        const formattedPlace = {};
        formattedPlace.country = null;
        formattedPlace.countryCode = null;
        formattedPlace.name = null;
        formattedPlace.vicinity = null;
        formattedPlace.address = null;
        formattedPlace.geometry = null;
        formattedPlace.latitude = null;
        formattedPlace.longitude = null;
        formattedPlace.state = null;
        formattedPlace.stateCode = null;
        formattedPlace.zip = null;
        formattedPlace.city = null;

        const location = autocomplete.getPlace();
        if (location.geometry) {
          formattedPlace.geometry = location.geometry;
          formattedPlace.latitude = location.geometry.location.lat();
          formattedPlace.longitude = location.geometry.location.lng();
        }

        if (location.name) {
          formattedPlace.name = location.name;
        }

        if (location.vicinity) {
          formattedPlace.vicinity = location.vicinity;
        }

        if (location.formatted_address) {
          setNewLocation(location.formatted_address);
          formattedPlace.address = location.formatted_address;
        }

        if (location.address_components) {
          location.address_components.map((el) => {
            if (!el.types) {
              return;
            }

            if (el.types.indexOf('administrative_area_level_1') !== -1) {
              formattedPlace.state = el.long_name;
              formattedPlace.stateCode = el.short_name;
            } else if (el.types.indexOf('locality') !== -1) {
              formattedPlace.city = el.short_name;
            } else if (el.types.indexOf('postal_code') !== -1) {
              // eslint-disable-next-line radix
              formattedPlace.zip = parseInt(el.long_name);
            } else if (el.types.indexOf('country') !== -1) {
              formattedPlace.country = el.long_name;
              formattedPlace.countryCode = el.short_name;
            } else if (el.types.indexOf('street_number') !== -1) {
              formattedPlace.streetNumber = el.long_name;
            }
          });
        }
        if (!formattedPlace.zip) setShowZipCode(true);
        optMap.setCenter({ lat: formattedPlace.latitude, lng: formattedPlace.longitude });
        changeFieldValue(formName, 'location', formattedPlace);
      });
    }
  };

  const fetchPlaces = (mapProps, map) => {
    const center = {
      lat: latitude,
      lng: longitude,
    };
    const service = new google.maps.places.PlacesService(map);
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
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
      },
      mapTypeId: mapType,
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
      draggable,
    });

    setOptMap(map);

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
            val.distance = getDistance({ lat: latitude, lng: longitude }, { lat: val.geometry.location.lat(), lng: val.geometry.location.lng() });
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
  };

  const searchByZipCode = (val) => {
    if (val.length === 4) {
      const getRegionByCode = swissZipCode.find((zip) => zip['Postleitzahl / Code Postal / Codice Postale'] === val);
      if (getRegionByCode) {
        changeFieldValue(formName, 'location.zip', getRegionByCode['Postleitzahl / Code Postal / Codice Postale']);
        changeFieldValue(formName, 'location.city', getRegionByCode['Ort / Ville / Città']);
        changeFieldValue(formName, 'location.stateCode', getRegionByCode['Abkürzung / Abréviation / Abbreviazione']);
        setErrorInputSearchZip(null);
      } else {
        setErrorInputSearchZip('Please insert a valid Swiss code');
      }
    } else {
      setErrorInputSearchZip('Please insert a valid Swiss code');
    }
    setInputSearchZip(val);
  };

  const showInfoMarker = (data) => {
    const infoModal = {
      lat: data.marker.geometry.location.lat(),
      lng: data.marker.geometry.location.lng(),
      title: data.marker.name,
      subtitle: data.marker.vicinity,
      distance: data.marker.distance,
      photo: data.marker.photo,
    };
    setModalInfo(infoModal);
    setShowInfoWindow(true);
  };

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

  const onMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    changeFieldValue(formName, 'location.latitude', lat);
    changeFieldValue(formName, 'location.longitude', lng);
  };

  const classNameDef = !className && showMap ? 'h-fix-400 w-perc-100' : className;

  return (
    // Important! Always set the container height explicitly
    <div
      style={showMap ? {
        minHeight: '300px', position: 'relative',
      } : {
        minHeight: '100%', position: 'relative',
      }}
      className={classNameDef}
    >
      {
        showSearchLocation && (
          <>
            <BrixelInputText
              className="search-box"
              type="text"
              ref={inputSearch}
              label={inputLabel}
              placeholder="Address"
              input={{
                onChange: (e) => changeLocation(e),
                onBlur: () => '',
                value: newLocation,
              }}
            />
            {
              showZipCode && (
                <>
                  <BrixelInputText
                    className="search-box"
                    type="text"
                    label="What's the ZIP code?"
                    input={{
                      onChange: (e) => searchByZipCode(e), value: inputSearchZip,
                    }}
                    meta={{
                      dirty: inputSearchZip,
                      invalid: errorInputSearchZip,
                    }}
                  />
                  {
                    errorInputSearchZip && (
                      <p>{errorInputSearchZip}</p>
                    )
                  }
                </>
              )
            }
          </>
        )
      }
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
      {
        (
          <Map
            google={google}
            onReady={(mapProps, map) => fetchPlaces(mapProps, map)}
            zoom={zoom}
            visible={showMap}
            initialCenter={{
              lat: latitude,
              lng: longitude,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            onClick={() => setShowInfoWindow(false)}
          >
            <Marker
              position={{
                lat: latitude,
                lng: longitude,
              }}
              icon={markerImg}
              draggable={moveMarker}
              onDragend={(t, map, coord) => onMarkerDragEnd(coord)}
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
        )
      }
    </div>
  );
};

Maps.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  className: PropTypes.string,
  google: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  place: PropTypes.bool,
  mapType: PropTypes.string,
  zoom: PropTypes.number,
  scrollZoom: PropTypes.bool,
  externalControls: PropTypes.bool,
  disableZoom: PropTypes.bool,
  draggable: PropTypes.bool,
  showSearchLocation: PropTypes.bool,
  moveMarker: PropTypes.bool,
  showMap: PropTypes.bool,
  inputLabel: PropTypes.string,
  formName: PropTypes.string.isRequired,
};

Maps.defaultProps = {
  className: '',
  place: false,
  mapType: 'roadmap',
  zoom: 14,
  scrollZoom: false,
  externalControls: false,
  disableZoom: false,
  draggable: false,
  showSearchLocation: false,
  showMap: false,
  moveMarker: false,
  inputLabel: '',
};

const mapStateToProps = (state) => ({
  formName: Object.keys(get(state, 'form'))[0],
  property: get(state, `form.${Object.keys(get(state, 'form'))[0]}.values`, {}),
  latitude: get(state, `form.${Object.keys(get(state, 'form'))[0]}.values.location.latitude`, 0),
  longitude: get(state, `form.${Object.keys(get(state, 'form'))[0]}.values.location.longitude`, 0),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(form, field, value) {
    dispatch(change(form, field, value));
  },
});

export default compose(
  GoogleApiWrapper({
    apiKey: (baseByData.googleMaps),
    libraries: ['geometry', 'drawing', 'places'],
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(Maps);
