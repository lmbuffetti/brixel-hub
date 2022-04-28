/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, {
  useState, createRef, useEffect, useRef,
} from 'react';
import {
  GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { BrixelInputText, change } from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import has from 'lodash/has';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { useLocation, useNavigate } from 'react-router-dom';
import useOutsideAlerter from '../OutsideElement';
import Map from './Map';
import { setCountryList } from '../../actions/CommonActions';

export const ComponentMap = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    className,
    changeFieldValue,
    country,
    curCountry,
    disabled,
    draggable,
    formName,
    formValue,
    google,
    handleUpdateCountry,
    init,
    input,
    latitude,
    longitude,
    multipleFieldSearch,
    showMessageToChangeAddress,
    selCountry,
    showMap,
    showSearchLocation,
    similarProperties,
    zoom,
    minHeight,
    subMinHeight,
  } = props;
  // STATE
  const [selectedAddress, setSelectedAddress] = useState(false);
  // const [optMap, setOptMap] = useState({});
  const inputSearch = createRef(null);
  const [newLocation, setNewLocation] = useState(formValue && formValue.location && formValue.location.address ? formValue.location.address : '');
  const [locList, setLoclist] = useState([]);
  // const [zipList, setZiplist] = useState([]);
  const [selLocAuto, setSelLocAuto] = useState(-1);
  const [stateToken, setStateToken] = useState(null);
  const [startSearch, setStartSearch] = useState(false);

  // REF
  // const inputZipSearch = useRef(null);
  const addressRef = useRef(null);

  // FUNCTION FOR THE AUTOCOMPLETE - start only if value more then 3 characters - val.length
  const changeLocation = (val, hideSearch, type) => {
    if ((showSearchLocation && inputSearch.current) || hideSearch) {
      // setNewLocation(val);
      const sessionToken = stateToken || new google.maps.places.AutocompleteSessionToken();
      const autocompleteService = new google.maps.places.AutocompleteService();
      if (!stateToken) setStateToken(sessionToken);
      let typeSearch = [get(props, 'searchType', 'address')];
      if (type === 'cities') typeSearch = ['(regions)'];
      if (type === 'zip') typeSearch = ['(regions)'];
      if (val && val.length > 3) {
        const searcCountry = selCountry === 'all' ? '' : selCountry;
        autocompleteService.getPlacePredictions(
          {
            input: val,
            sessionToken,
            componentRestrictions: { country: searcCountry },
            types: typeSearch,
          },
          (predictions) => {
            if (predictions) {
              const defPredition = predictions;
              if (type === 'zip') {
                // setZiplist(predictions);
                setLoclist([]);
              } else {
                // setZiplist([]);
                setLoclist(defPredition);
              }
            } else {
              setLoclist([]);
              // setZiplist([]);
            }
          },
        );
      } else {
        setLoclist([]);
      }
    }
  };

  // FUNCTION TO EXTRACT DATA FROM SELECTED ADDRESS
  const geoCode = (adr) => {
    const defAdr = adr.split(',');
    Geocode.setApiKey('AIzaSyDHqV6i45MbGQVKOr2Md-8IzWeO7J1zGmg');
    if (selCountry.toLowerCase() !== 'ch') Geocode.setLanguage(selCountry.toLowerCase());
    changeFieldValue('searchAddress', adr);
    Geocode.fromAddress(adr)
      .then((result) => {
        const formattedPlace = get(formValue, 'location', {});
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

        const location = result.results[0];
        if (location.geometry) {
          formattedPlace.geometry = location.geometry;
          formattedPlace.latitude = location.geometry.location.lat;
          formattedPlace.longitude = location.geometry.location.lng;
        }

        if (location.name) {
          formattedPlace.name = location.name;
        }

        if (location.vicinity) {
          formattedPlace.vicinity = location.vicinity;
        }

        if (location.formatted_address) {
          setNewLocation(location.formatted_address);
          if (location.formatted_address.split(',').length === 2) {
            formattedPlace.address = `${location.formatted_address.split(',')[0]}, ${defAdr[1]}, ${location.formatted_address.split(',')[1]}`;
          } else {
            formattedPlace.address = location.formatted_address;
          }
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

        if (has(formattedPlace, 'countryName')) formattedPlace.countryName = formattedPlace.country;
        // if (!formattedPlace.zip && isShowZip) setShowZipCode(true);
        if (input) input.onChange(formattedPlace.latitude);
        changeFieldValue(formName, 'changeCountry', formattedPlace.countryCode);
        changeFieldValue(formName, 'location', formattedPlace);
        const existCountry = country.find((item) => item.value === formattedPlace.countryCode);
        if (typeof existCountry === 'undefined') {
          const newListcountry = country;
          newListcountry.push({
            value: formattedPlace.countryCode,
            label: formattedPlace.country,
          });
          handleUpdateCountry(newListcountry);
        }
        setSelectedAddress(true);
        // changeFieldValue(formName, 'location.latitude', formattedPlace.latitude);
        // changeFieldValue(formName, 'location.longitude', formattedPlace.longitude);
        // changeFieldValue(formName, 'location.searchAddress', formattedPlace.name);
        setLoclist([]);
        // setZiplist([]);
      });
  };

  // FUNCTION TO LOAD AUTOCOMPLETE FUNCTION ON CHANGE searchAddress
  useEffect(() => {
    const addressSearch = get(formValue, 'location.searchAddress', null);
    const addressSearchInit = get(init, 'location.searchAddress', null);
    const citySearch = get(formValue, 'location.cityZip', null);
    if (addressSearch && addressSearch !== addressSearchInit) {
      let fullAddress = `${addressSearch}`;
      if (citySearch) fullAddress = `${citySearch} ${addressSearch}`;
      changeLocation(fullAddress, true, 'address');
    }
  }, [get(formValue, 'location.searchAddress', null)]);

  // FUNCTION TO LOAD AUTOCOMPLETE FUNCTION ON CHANGE cityZip
  useEffect(() => {
    const search = get(formValue, 'location.cityZip', null);
    if (search) {
      const fullAddress = `${search}`;
      changeLocation(fullAddress, true, 'zip');
    }
    // setSelectedZip(false);
  }, [get(formValue, 'location.cityZip', null)]);

  // FUNCTION TO LOAD AUTOCOMPLETE FUNCTION ON CHANGE startSearch
  useEffect(() => {
    if (startSearch) {
      const search = get(formValue, 'location.address', null);
      const streetName = get(formValue, 'location.name', null);
      const streetNumber = get(formValue, 'location.streetNumber', null);
      if (search && streetNumber) {
        const fullAddress = search.split(',');
        let newAddress = '';
        fullAddress.forEach((item, i) => {
          if (i === 0) {
            newAddress = `${streetName} ${streetNumber}`;
          } else {
            newAddress += `, ${item}`;
          }
        });
        geoCode(newAddress);
      }
      setStartSearch(false);
    }
  }, [startSearch]);

  // FUNCTION TO HIGLIGHT THE SEARCH VALUE ON RESULTS ADDRESS
  const highlight = (container) => {
    const content = container.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let start = -1;
    let end = 0;
    if (content) {
      content.split('').forEach((val, i) => {
        if (val === newLocation.charAt(i)) end = i;
        if (start === -1 && val === newLocation.charAt(i).toLowerCase()) start = i;
      });
      return `<span>${container.substring(0, start)}</span><span class="highlight">${container.substring(start, end + 1)}</span><span>${container.substring(end + 1, content.length)}</span>`;
    }
    return container;
  };

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF DROPDOWN ADDRESS LISTS
  // useOutsideAlerter(inputZipSearch, { action: 'function', func: () => setZiplist([]) });
  useOutsideAlerter(addressRef, { action: 'function', func: () => setLoclist([]) });

  const classNameDef = !className && showMap ? 'w-perc-100 dis-fl-col' : className;
  const mapSize = !className && showMap ? 'h-fix-320' : 'h-perc-100';

  // FUNCTION TO MANAGE KEY-CHANGE
  const keyUpInput = (e) => {
    let newId = selLocAuto;
    if (locList && locList.length > 0) {
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
      if (e.key === 'Enter') e.preventDefault();
    }
  };

  // ADD MESSAGE THAT THE ADDRESS IS NOT EDITABLE
  useEffect(() => {
    const messageEl = document.getElementsByClassName('message')[0];

    const messageHtml = 'Address can not be changed. Please contact <span class="cur-poi txtPrimary400 supportlink" onclick="supportLink()"> Brixel Support </span> to request a change. ';
    if (showMessageToChangeAddress && messageEl) messageEl.innerHTML = messageHtml;

    window.supportLink = () => {
      history.push({ state: { showSupport: true } });
    };
  });

  useEffect(() => {
    const dropdownEl = addressRef.current;
    if (dropdownEl) dropdownEl.scrollIntoView({ behavior: 'smooth' });
  }, [locList && locList.length]);

  const changeFielsSaerchAddress = (val) => {
    if (!disabled) {
      changeFieldValue(formName, 'location.searchAddress', val);
      changeFieldValue(formName, 'location.name', val);
    }
  };

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
        // IF multipleFieldSearch SHOW THE FIELDS STREET NAME AND STREET NUMBER
        multipleFieldSearch && (
          <div className="fieldMapSearch mb-1">
            <div className="dis-f jc-b flex-wrap">
              <div className="w-perc-100 pos-r">
                <BrixelInputText
                  className="search-box"
                  type="text"
                  ref={inputSearch}
                  label="Address"
                  disabled={disabled}
                  placeholder="Write street name"
                  input={{
                    onChange: (val) => changeFielsSaerchAddress(val),
                    onBlur: () => '',
                    onFocus: () => (disabled ? '' : setSelectedAddress(false)),
                    value: get(formValue, 'location.searchAddress', '') || '',
                    name: 'location.searchAddress',
                  }}
                  onKeyDown={(e) => (disabled ? '' : keyUpInput(e))}
                  onClear={() => (disabled ? '' : changeFieldValue(formName, 'location', { countryCode: curCountry.value, latitude: curCountry.latitude, longitude: curCountry.longitude }))}
                  message={showMessageToChangeAddress ? { help: 'placeholder' } : null}
                />
                {
                  !selectedAddress && locList && locList.length > 0 && !disabled && (
                    <ul className="resultAutoComplete notranslate" ref={addressRef}>
                      {
                        locList.map((loc, i) => (
                          <li
                            className={i === selLocAuto ? 'active' : ''}
                            tabIndex={i}
                            key={`loc_${i.toString()}`}
                            onClick={() => geoCode(loc.description)}
                            dangerouslySetInnerHTML={{ __html: highlight(get(loc, 'description', '')) }}
                          />
                        ))
                      }
                    </ul>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
      <div className={`${showMap ? `${multipleFieldSearch ? 'pos-r' : ''} ${subMinHeight}` : 'hide'} wrapMap ${mapSize}`}>
        <Map
          {...props}
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
      </div>
    </div>
  );
};

ComponentMap.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  className: PropTypes.string,
  country: PropTypes.arrayOf(PropTypes.object),
  curCountry: PropTypes.object,
  disabled: PropTypes.bool,
  draggable: PropTypes.bool,
  formName: PropTypes.string,
  formValue: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired,
  init: PropTypes.object.isRequired,
  multipleFieldSearch: PropTypes.bool,
  handleUpdateCountry: PropTypes.func.isRequired,
  input: PropTypes.object,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  onSubmit: PropTypes.func,
  showMessageToChangeAddress: PropTypes.bool,
  selCountry: PropTypes.string,
  similarProperties: PropTypes.arrayOf(PropTypes.object),
  showMap: PropTypes.bool,
  showSearchLocation: PropTypes.bool,
  zoom: PropTypes.number,
  minHeight: PropTypes.number,
  subMinHeight: PropTypes.string,
};

ComponentMap.defaultProps = {
  className: '',
  country: [],
  curCountry: {},
  disabled: false,
  draggable: false,
  formName: '',
  input: null,
  multipleFieldSearch: false,
  onSubmit: () => '',
  selCountry: null,
  showMessageToChangeAddress: false,
  showSearchLocation: false,
  similarProperties: [],
  showMap: false,
  zoom: 14,
  minHeight: 0,
  subMinHeight: '',
};

const mapStateToProps = (state, ownProps) => {
  const formName = get(ownProps, 'formName', Object.keys(get(state, 'brixelForm'))[0]);
  const propsLat = get(ownProps, 'latitude', 0);
  const propsLng = get(ownProps, 'longitude', 0);
  const lat = get(state, 'property.activeSingleProperty.location.latitude', propsLat);
  const lng = get(state, 'property.activeSingleProperty.location.longitude', propsLng);
  return ({
    country: get(state, 'common.country', []),
    formValue: get(state, `brixelForm[${formName}].values`, {}),
    formName,
    init: get(state, `brixelForm[${formName}].initial`, {}),
    lang: get(state, 'common.language', 'en'),
    property: get(state, `brixelForm[${formName}].values`, {}),
    latitude: get(state, `brixelForm.[${formName}].values.location.latitude`, lat),
    longitude: get(state, `brixelForm.[${formName}].values.location.longitude`, lng),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(form, field, value) {
    dispatch(change(form, field, value));
  },
  handleUpdateCountry: bindActionCreators(setCountryList, dispatch),
});

export default compose(
  GoogleApiWrapper({
    apiKey: (baseByData.googleMaps),
    libraries: ['geometry', 'drawing', 'places'],
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(ComponentMap);
