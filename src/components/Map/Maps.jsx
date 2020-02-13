/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, createRef, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Map, InfoWindow, Marker, GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { change } from 'redux-form';
import { BrixelButtonTertiary, BrixelIcon, BrixelInputText, BrixelSelect, useOutsideAlerter } from '@brixel/brixel-components';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import markerImg from '../../images/location/icon_location.svg';
import baseByData  from '@brixel/brixel-configuration-partner/src/Settings';
import { mapCaptionData, mapStyles, getDistance } from '../../constants/map';
import { compareArray } from '../../utils/helpers';
import { translateTo } from '../../utils/translation';
const swissZipCode = require('../../resources/swissZipCodes.json');

const images = require.context('../../images', true);

const Maps = (props) => {
  // PROPS
  const {
    className,
    changeCountry,
    changeFieldValue,
    country,
    draggable,
    disableZoom,
    externalControls,
    formName,
    formValue,
    google,
    history,
    inputLabel,
    isShowZip,
    lang,
    latitude,
    longitude,
    match,
    mapType,
    moveMarker,
    nearBy,
    place,
    property,
    scrollZoom,
    selCountry,
    showMap,
    showSearchLocation,
    showSelectCountry,
    zoom,
  } = props;
  // STATE
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [mapTypeId, setMapTypeId] = useState('roadmap');
  const [inputSearchZip, setInputSearchZip] = useState('');
  const [errorInputSearchZip, setErrorInputSearchZip] = useState(null);
  const [streetViewAvailable, setStretViewAvailable] = useState(false);
  const [showZipCode, setShowZipCode] = useState(false);
  const [optMap, setOptMap] = useState({});
  const [showSelCountry, setShowSelCountry] = useState(false);
  const inputSearch = createRef(null);
  const [newLocation, setNewLocation] = useState(formValue && formValue.location && formValue.location.address ? formValue.location.address : '');
  const [defCountry, setDefCountry] = useState('');
  const [locList, setLoclist] = useState([]);
  // REF
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (showSearchLocation) {
      /*/const sessionToken = new google.maps.places.AutocompleteSessionToken();
      var autocompleteService = new google.maps.places.AutocompleteService();
      const autocomplete = new google.maps.places.Autocomplete(inputSearch.current, {
        'types': ['address'],
        componentRestrictions: { country: defCountry ? defCountry : [] },
        sessionToken: sessionToken,
      });
      console.log(sessionToken);
      autocompleteService.getPlacePredictions(
        {
          input: newLocation || 'input',
          sessionToken: sessionToken
        },
        function(predictions,status){}
      );
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
        if (!formattedPlace.zip && isShowZip) setShowZipCode(true);
        //optMap.setCenter({ lat: formattedPlace.latitude, lng: formattedPlace.longitude });
        changeFieldValue(formName, 'location', formattedPlace);
      });*/
    }
  }, []);

  useEffect(() => {
    setDefCountry(selCountry);
  }, [selCountry]);

  useEffect(() => {
    if (optMap.zoom) {
      const center = {
        lat: latitude,
        lng: longitude,
      };
      optMap.setCenter(center);
    }
  }, [longitude, latitude]);

  const changeLocation = (val) => {
    if (showSearchLocation && inputSearch.current) {
      setNewLocation(val);
      const sessionToken = new google.maps.places.AutocompleteSessionToken();
      var autocompleteService = new google.maps.places.AutocompleteService();
      if (val.length > 3) {
        autocompleteService.getPlacePredictions(
          {
            input: val,
            sessionToken: sessionToken,
            componentRestrictions: { country: selCountry },
            types: ["address"],
          },
          function (predictions, status) {
            console.log(predictions, status);
            if (predictions) {
              setLoclist(predictions);
            } else {
              setLoclist([]);
            }
          }
        );
      } else {
        setLoclist([]);
      }
    }
  };

  const fetchPlaces = (mapProps, map) => {
    const center = {
      lat: latitude,
      lng: longitude,
    };

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
                lng: val.geometry.location.lng()
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

  const geoCode = (adr) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': adr
    }, function(result, status) {
      if (status == 'OK') {
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

        const location = result[0];
        console.log(location)
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
        if (!formattedPlace.zip && isShowZip) setShowZipCode(true);
        changeFieldValue(formName, 'location', formattedPlace);
      }
    })
  };

  const highlight = (container) => {
    const content = container.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log(content, newLocation);
    let text = '';
    const oriWord = container.split('');
    let start = -1;
    let end = 0;
    content.split('').forEach(function(val, i){
      if (val === newLocation.charAt(i)) end = i;
      if (start === -1 && val === newLocation.charAt(i).toLowerCase()) start = i;
    });
    return `<span>${container.substring(0,start)}</span><span class='highlight'>${container.substring(start,end+1)}</span><span>${container.substring(end+1,content.length)}</span>`;
  };

  /*const highlight = (text) => {
    let innerHTML = text;
    const txtLow = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let index = txtLow.indexOf(newLocation);
    console.log(index, txtLow, innerHTML, newLocation);
    if (index >= 0) {
      innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
    }
    return innerHTML;
  };*/

  useOutsideAlerter(wrapperRef, { action: 'function', func: () => setLoclist([]) });

  const selectOpt = cloneDeep(country);
  selectOpt.unshift({
    label: `🌍 ${translateTo(lang, 'Everywhere')}`,
    value: '',
  });
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
            <div className="pos-r">
              <BrixelInputText
                className="search-box w-perc-100"
                type="text"
                ref={inputSearch}
                label={inputLabel}
                placeholder="Enter property address"
                input={{
                  onChange: (e) => changeLocation(e),
                  onBlur: () => '',
                  value: newLocation,
                  name: 'location',
                }}
              />
              {
                locList.length > 1 && (
                  <ul className="resultAutoComplete" ref={wrapperRef}>
                    {
                      locList.map((loc, i) => (
                        <li key={i.toString()} onClick={() => geoCode(loc.description)} dangerouslySetInnerHTML={{ __html: highlight(loc.description) }}/>
                      ))
                    }
                  </ul>
                )
              }
              {
                showSelectCountry && (
                  <div className="mt-2 mb-2">
                    {
                      showSelCountry ? (
                        <BrixelSelect
                          className="w-perc-100 max-w-fix-216 mt-1 pos-r zIndex2"
                          input={{
                            onChange: (val) => changeCountry(val),
                            name: 'country',
                            value: defCountry,
                          }}
                          options={selectOpt}
                        />
                      ) : (
                        <BrixelButtonTertiary
                          label={
                            defCountry ?
                              translateTo(lang, selectOpt.find(val => val.value === defCountry).label) :
                              `🌍 ${translateTo(lang, 'Everywhere')}`
                          }
                          onClick={() => setShowSelCountry(true)}
                        />
                      )
                    }
                  </div>
                )
              }
            </div>
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
      <div style={{ display: showMap ? '' : 'none' }}>
        {
          (
            <Map
              google={google}
              onReady={(mapProps, map) => fetchPlaces(mapProps, map)}
              zoom={zoom}
              visible={showMap && latitude !== 0}
              initialCenter={{
                lat: latitude,
                lng: longitude,
              }}
              style={{
                width: showMap ? '100%' : '0px',
                height: showMap ? '100%' : '0px',
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
    </div>
  );
};

Maps.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  changeCountry: PropTypes.func,
  className: PropTypes.string,
  country: PropTypes.arrayOf(PropTypes.object),
  disableZoom: PropTypes.bool,
  draggable: PropTypes.bool,
  externalControls: PropTypes.bool,
  formName: PropTypes.string,
  google: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isShowZip: PropTypes.bool,
  inputLabel: PropTypes.string,
  lang: PropTypes.string,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  mapType: PropTypes.string,
  match: PropTypes.object.isRequired,
  moveMarker: PropTypes.bool,
  nearBy: PropTypes.bool,
  place: PropTypes.bool,
  property: PropTypes.object.isRequired,
  scrollZoom: PropTypes.bool,
  showMap: PropTypes.bool,
  showSearchLocation: PropTypes.bool,
  showSelectCountry: PropTypes.bool,
  zoom: PropTypes.number,
};

Maps.defaultProps = {
  className: '',
  changeCountry: () => '',
  disableZoom: false,
  draggable: false,
  externalControls: false,
  formName: '',
  inputLabel: '',
  isShowZip: true,
  place: false,
  lang: 'en',
  mapType: 'roadmap',
  moveMarker: false,
  nearBy: false,
  showSearchLocation: false,
  showSelectCountry: false,
  scrollZoom: false,
  showMap: false,
  zoom: 14,
};

const mapStateToProps = (state) => {
  const formName = Object.keys(get(state, 'form'))[0];
  const lat = get(state, `property.property.location.latitude`, 0);
  const lng = get(state, `property.property.location.latitude`, 0);
  return ({
    country: get(state, `common.country`, {}),
    formValue: get(state, `form[${formName}].values`, {}),
    formName,
    lang: get(state, 'common.language', 'en'),
    property: get(state, `form[${formName}].values`, {}),
    latitude: get(state, `form.[${formName}].values.location.latitude`, lat),
    longitude: get(state, `form.[${formName}].values.location.longitude`, lng),
  });
};

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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Maps);
