/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, createRef, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { change } from 'redux-form';
import { BrixelInputText, BrixelSelect } from '@brixel/brixel-components';
import useOutsideAlerter from '../OutsideElement';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import baseByData  from '@brixel/brixel-configuration-partner/src/Settings';
import { translateTo } from '../../utils/translation';
import { diff } from 'deep-object-diff';
import Map from './Map';

export const ComponentMap =(props) => {
  // PROPS
  const {
    className,
    changeCountry,
    changeFieldValue,
    country,
    curCountry,
    disabled,
    draggable,
    formName,
    formValue,
    google,
    history,
    init,
    inputLabel,
    lang,
    latitude,
    longitude,
    multipleFieldSearch,
    showMessageToChangeAddress,
    selCountry,
    showMap,
    showSearchLocation,
    showSelectCountry,
    similarProperties,
    zoom,
    minHeight,
    subMinHeight,
  } = props;
  // STATE
  const [selectedAddress, setSelectedAddress] = useState(false);
  //const [optMap, setOptMap] = useState({});
  const inputSearch = createRef(null);
  const [newLocation, setNewLocation] = useState(formValue && formValue.location && formValue.location.address ? formValue.location.address : '');
  const [defCountry, setDefCountry] = useState('');
  const [locList, setLoclist] = useState([]);
  //const [zipList, setZiplist] = useState([]);
  const [selLocAuto, setSelLocAuto] = useState(-1);
  const [stateToken, setStateToken] = useState(null);
  const [startSearch, setStartSearch] = useState(false);

  // REF
  //const inputZipSearch = useRef(null);
  const addressRef = useRef(null);
  // TIMER TYPING
  let typingTimer;                //timer identifier
  const doneTypingInterval = 1500;

  const changeStreetName = (e) => {
    changeFieldValue(formName, 'location.streetNumber', e);
    setLoclist([]);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      setStartSearch(true);
    }, doneTypingInterval);
  };

  const changeLocation = (val, hideSearch, type) => {
    if ((showSearchLocation && inputSearch.current) || hideSearch) {
      //setNewLocation(val);
      const sessionToken = stateToken || new google.maps.places.AutocompleteSessionToken();
      var autocompleteService = new google.maps.places.AutocompleteService();
      if (!stateToken) setStateToken(sessionToken)
      let typeSearch = ["address"];
      if (type === 'cities') typeSearch = ["(regions)"];
      if (type === 'zip') typeSearch = ["(regions)"];
      if (val.length > 3) {
        //const lat = get(formValue, 'location.latitude', 0);
        //const lng = get(formValue, 'location.longitude', 0);
        //const selectedCity = get(formValue, 'location.city', 0);
        autocompleteService.getPlacePredictions(
          {
            input: val,
            sessionToken: sessionToken,
            componentRestrictions: { country: selCountry },
            types: typeSearch,
          },
          function (predictions, status) {
            if (predictions) {
              let defPredition = predictions;
              if (type === 'zip') {
                //setZiplist(predictions);
                setLoclist([]);
              }
              else {
                //setZiplist([]);
                setLoclist(defPredition);
              }
            } else {
              setLoclist([]);
              //setZiplist([]);
            }
          }
        );
      } else {
        setLoclist([]);
      }
    }
  };

  const geoCode = (adr, type) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': adr
    }, function(result, status) {
      if (status === 'OK') {
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
              formattedPlace.zip = el.long_name;
            } else if (el.types.indexOf('country') !== -1) {
              formattedPlace.country = el.long_name;
              formattedPlace.countryCode = el.short_name;
            } else if (el.types.indexOf('street_number') !== -1) {
              formattedPlace.streetNumber = el.long_name;
            } else if (el.types.indexOf('route') !== -1) {
              formattedPlace.name = el.long_name;
            }
          });
          formattedPlace.searchAddress = formattedPlace.address;
          formattedPlace.cityZip = formattedPlace.city;
          if (formattedPlace.zip) formattedPlace.cityZip = `${formattedPlace.zip} ${formattedPlace.city}`;
        }
        // if (!formattedPlace.zip && isShowZip) setShowZipCode(true);
        changeFieldValue(formName, 'location', formattedPlace);
        setSelectedAddress(true);
        //changeFieldValue(formName, 'location.latitude', formattedPlace.latitude);
        //changeFieldValue(formName, 'location.longitude', formattedPlace.longitude);
        //changeFieldValue(formName, 'location.searchAddress', formattedPlace.name);
        setLoclist([]);
        //setZiplist([]);
      }
    })
  };

  useEffect(() => {
    setDefCountry(selCountry);
  }, [selCountry]);

  useEffect(() => {
    const addressSearch = get(formValue, 'location.searchAddress', null);
    const addressSearchInit = get(init, 'location.searchAddress', null);
    const citySearch = get(formValue, 'location.cityZip', null);
    if (addressSearch && addressSearch !== addressSearchInit) {
      let fullAddress = `${addressSearch}`;
      if (citySearch) fullAddress = `${citySearch} ${addressSearch}`;
      changeLocation(fullAddress, true, 'address');
    }
  }, [get(formValue, 'location.searchAddress', null)])

  useEffect(() => {
    const search = get(formValue, 'location.cityZip', null);
    if (search) {
      let fullAddress = `${search}`;
      changeLocation(fullAddress, true, 'zip');
    }
    //setSelectedZip(false);
  }, [get(formValue, 'location.cityZip', null)])

  useEffect(() => {
    if (startSearch) {
      const search = get(formValue, 'location.address', null);
      const streetName = get(formValue, 'location.name', null);
      const streetNumber = get(formValue, 'location.streetNumber', null);
      if (search && streetNumber) {
        let fullAddress = search.split(',');
        let newAddress = '';
        fullAddress.forEach((item, i) => {
          if (i === 0) {
            newAddress = `${streetName} ${streetNumber}`;
          } else {
            newAddress += `, ${item}`;
          }
        })
        geoCode(newAddress);
      }
      setStartSearch(false);
    }
  }, [startSearch]);

  const highlight = (container) => {
    const content = container.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let start = -1;
    let end = 0;
    content.split('').forEach(function(val, i){
      if (val === newLocation.charAt(i)) end = i;
      if (start === -1 && val === newLocation.charAt(i).toLowerCase()) start = i;
    });
    return `<span>${container.substring(0,start)}</span><span class='highlight'>${container.substring(start,end+1)}</span><span>${container.substring(end+1,content.length)}</span>`;
  };

  //useOutsideAlerter(inputZipSearch, { action: 'function', func: () => setZiplist([]) });
  useOutsideAlerter(addressRef, { action: 'function', func: () => setLoclist([]) });

  const selectOpt = cloneDeep(country);
  selectOpt.unshift({
    label: `🌍 ${translateTo(lang, 'Everywhere')}`,
    value: '',
  });
  const classNameDef = !className && showMap ? 'w-perc-100 dis-fl-col' : className;
  const mapSize = !className && showMap ? 'h-fix-320' : 'h-perc-100';

  const keyUpInput = (e) => {
    let newId = selLocAuto;
    if (e.key === 'ArrowUp') {
      newId = selLocAuto <= 0 ? locList.length - 1 : selLocAuto - 1;
    }
    if (e.key === 'ArrowDown') {
      newId = selLocAuto < locList.length - 1 ? selLocAuto + 1 : 0;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSelLocAuto(newId);
    }
    if (e.key === 'Enter' && get(locList, `[${newId}].description`, null)) {
      e.preventDefault();
      geoCode(locList[newId].description);
    }
  };


  useEffect(()=> {
    const messageEl = document.getElementsByClassName('message')[0];

    const messageHtml = `Address can not be changed. Please contact <span class="cur-poi txtPrimary400 supportlink" onclick="supportLink()"> Brixel Support </span> to request a change. `
    if (showMessageToChangeAddress && messageEl) messageEl.innerHTML = messageHtml;

    window.supportLink = () => {
      history.push({state: {showSupport: true}})
    };

  })


  return (
    // Important! Always set the container height explicitly
    <div
      style={showMap ? {
        minHeight: minHeight > 0 ? `${minHeight}px` : '300px', position: 'relative',
      } : {
        minHeight: '100%', position: 'relative',
      }}
      className={`${classNameDef} ${multipleFieldSearch ? 'multiField' : ''}`}
    >
      {
        multipleFieldSearch && (
          <div className="fieldMapSearch mb-5">
            <div className="dis-f jc-b flex-wrap">
              <div className="w-perc-65 pr-1 pos-r">
                <BrixelInputText
                  className="search-box"
                  type="text"
                  ref={inputSearch}
                  label={'Address'}
                  disabled={disabled}
                  placeholder={translateTo(lang, "Write street name")}
                  input={{
                    onChange: (e) => changeFieldValue(formName, 'location.searchAddress', e),
                    onBlur: () => '',
                    onFocus: () => setSelectedAddress(false),
                    value: get(formValue, 'location.searchAddress', '') || '',
                    name: 'location.searchAddress',
                  }}
                  onKeyDown={(e) => keyUpInput(e)}
                  onClear={() => disabled ? '' : changeFieldValue(formName, 'location', { countryCode: curCountry.value, latitude: curCountry.latitude, longitude: curCountry.longitude})}
                  message={showMessageToChangeAddress ? { help: 'placeholder' } : null}
                />
                {
                  !selectedAddress && locList.length > 0 && (
                    <ul className="resultAutoComplete" ref={addressRef}>
                      {
                        locList.map((loc, i) => (
                          <li
                            className={i === selLocAuto ? 'active' : ''}
                            tabIndex={i}
                            key={i.toString()}
                            onClick={() => geoCode(loc.description)}
                            dangerouslySetInnerHTML={{ __html: highlight(get(loc, 'description', '')) }}
                          />
                        ))
                      }
                    </ul>
                  )
                }
              </div>
              <div className="w-perc-35 pl-1">
                <BrixelInputText
                  className="search-box"
                  disabled={disabled}
                  type="text"
                  ref={inputSearch}
                  label={'Street Number'}
                  placeholder={translateTo(lang, "")}
                  input={{
                    onChange: (e) => changeStreetName(e),
                    onBlur: () => '',
                    value: get(formValue, 'location.streetNumber', ''),
                    name: 'location.streetNumber',
                  }}
                />
              </div>
            </div>
          </div>
        )
      }
      {
        showSearchLocation && (
          <>
            <div className="pos-r">
              <BrixelInputText
                className="search-box w-perc-100"
                type="text"
                ref={inputSearch}
                label={inputLabel}
                placeholder={translateTo(lang, "Enter property address")}
                input={{
                  onChange: (e) => changeLocation(e),
                  onBlur: () => '',
                  value: newLocation,
                  name: 'location',
                }}
                onKeyDown={(e) => keyUpInput(e)}
              />
              {
                locList.length > 1 && (
                  <ul className="resultAutoComplete" ref={addressRef}>
                    {
                      locList.map((loc, i) => (
                        <li
                          className={i === selLocAuto ? 'active' : ''}
                          tabIndex={i}
                          key={i.toString()}
                          onClick={() => geoCode(loc.description)}
                          dangerouslySetInnerHTML={{ __html: highlight(get(loc, 'description', '')) }}
                        />
                      ))
                    }
                  </ul>
                )
              }
              {
                showSelectCountry && (
                  <div className="mt-2 mb-2">
                    <BrixelSelect
                      compact
                      className="w-perc-100 mt-1 pos-r zIndex2"
                      input={{
                        onChange: (val) => {
                          changeCountry(val.toUpperCase())
                        },
                        name: 'country',
                        value: defCountry ? defCountry.toLowerCase() : '',
                      }}
                      bigDropDown
                      options={selectOpt}
                    />
                  </div>
                )
              }
            </div>
          </>
        )
      }
      {/*  {
          showMessageToChangeAddress && (
            <p className="mt-2 mb-2 body2">
              <span>Address can not be changed. Please contact</span>
              <span onClick={() => history.push({state: {showSupport: true}})} className="cur-poi txtPrimary400 mx-1">Brixel Support</span>
              <span>to request a change.</span>
            </p>
          )
        } */}
      <div className={`${showMap ? `${multipleFieldSearch ? 'pos-r' : ''} ${subMinHeight}` : 'hide'} wrapMap ${mapSize}`}>
        {
          (
            <Map
              draggable={draggable}
              google={google}
              zoom={zoom}
              curCountry={curCountry}
              showMap={showMap}
              isDefView={latitude === 0 && longitude === 0}
              visible={showMap && (latitude !== 0 || get(curCountry, 'location.lat', 0) !== 0)}
              latitude={latitude !== 0 ? latitude : get(curCountry, 'location.lat', 0)}
              longitude={longitude !== 0 ? longitude : get(curCountry, 'location.lng', 0)}
              initialCenter={{
                lat: latitude !== 0 ? latitude : get(curCountry, 'location.lat', 0),
                lng: longitude !== 0 ? longitude : get(curCountry, 'location.lng', 0),
              }}
              style={{
                width: showMap ? '100%' : '0px',
                height: showMap ? '100%' : '0px',
              }}
              similarProperties={similarProperties}
            />
          )
        }
      </div>
    </div>
  );
};

ComponentMap.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  changeCountry: PropTypes.func,
  className: PropTypes.string,
  country: PropTypes.arrayOf(PropTypes.object),
  curCountry: PropTypes.object,
  disableZoom: PropTypes.bool,
  disabled: PropTypes.bool,
  draggable: PropTypes.bool,
  externalControls: PropTypes.bool,
  formName: PropTypes.string,
  google: PropTypes.object.isRequired,
  multipleFieldSearch: PropTypes.bool,
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
  showMessageToChangeAddress: PropTypes.bool,
  place: PropTypes.bool,
  property: PropTypes.object.isRequired,
  scrollZoom: PropTypes.bool,
  similarProperties: PropTypes.arrayOf(PropTypes.object),
  showMap: PropTypes.bool,
  showSearchLocation: PropTypes.bool,
  showSelectCountry: PropTypes.bool,
  zoom: PropTypes.number,
  minHeight: PropTypes.number,
  subMinHeight: PropTypes.string,
};

ComponentMap.defaultProps = {
  className: '',
  curCountry: {},
  disableZoom: false,
  disabled: false,
  draggable: false,
  externalControls: false,
  formName: '',
  multipleFieldSearch: false,
  inputLabel: '',
  isShowZip: true,
  place: false,
  lang: 'en',
  mapType: 'roadmap',
  moveMarker: false,
  nearBy: false,
  showMessageToChangeAddress: false,
  showSearchLocation: false,
  showSelectCountry: false,
  scrollZoom: false,
  similarProperties: [],
  showMap: false,
  zoom: 14,
  minHeight: 0,
  subMinHeight: '',
};

const mapStateToProps = (state, props) => {
  const formName = get(props, 'formName', Object.keys(get(state, 'form'))[0]);
  const lat = get(state, `property.activeSingleProperty.location.latitude`, 0);
  const lng = get(state, `property.activeSingleProperty.location.longitude`, 0);
  return ({
    country: get(state, `common.country`, {}),
    formValue: get(state, `form[${formName}].values`, {}),
    formName,
    init: get(state, `form[${formName}].initial`, {}),
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

export const Maps = React.memo(ComponentMap, (prevProps, nextProps) => {
  const changeLocation = diff(get(prevProps, 'formValue.location', null), get(nextProps, 'formValue.location', null));
  return (
    Object.keys(changeLocation).length === 0
  )
});

export default compose(
  GoogleApiWrapper({
    apiKey: (baseByData.googleMaps),
    libraries: ['geometry', 'drawing', 'places'],
  }),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Maps);
