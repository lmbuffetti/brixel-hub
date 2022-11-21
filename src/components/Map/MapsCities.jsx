/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelIcon } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { BrixelInputText, change } from '@brixel/brixel-components/dist/form';
import { GoogleApiWrapper } from 'google-maps-react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
/* eslint-disable array-callback-return */
import React, { createRef, useEffect, useRef, useState } from 'react';
import Geocode from 'react-geocode';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { setCountryList } from '../../actions/CommonActions';
import translateTo from '../../utils/translation';
import useOutsideAlerter from '../OutsideElement';
import Map from './Map';

export const MapsCities = (props) => {
  // PROPS
  const {
    blockScroll,
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
    lang,
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
      if (type === 'cities') typeSearch = ['(cities)', '(regions)'];
      if (type === 'zip') typeSearch = ['(regions)'];
      if (val.length > 3) {
        const searchList = [];
        const searcCountry = selCountry === 'all' ? '' : selCountry;
        typeSearch.forEach((typesSearch) => {
          autocompleteService.getPlacePredictions(
            {
              input: val,
              sessionToken,
              componentRestrictions: { country: searcCountry },
              types: [typesSearch],
            },
            (predictions) => {
              if (predictions) {
                searchList.push(...predictions);
                setLoclist(searchList);
              }
            },
          );
        });
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
        // if (!formattedPlace.zip && isShowZip) setShowZipCode(true);
        const splittedAddress = formattedPlace.address.split(',');
        formattedPlace.name = splittedAddress[0];
        if (input) input.onChange(formattedPlace.latitude);
        changeFieldValue(formName, 'changeCountry', formattedPlace.countryCode);
        changeFieldValue(formName, 'location', {
          countryCode: get(formValue, 'location.countryCode', ''),
        });
        const locations = get(formValue, 'locations', []);
        locations.push(formattedPlace);
        changeFieldValue(formName, 'locations', locations);
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
        // const getWrapStreetNumber = document.getElementsByClassName('streetNumber')[0];
        // getWrapStreetNumber.querySelector('input').focus();
        // changeFieldValue(formName, 'location.latitude', formattedPlace.latitude);
        // changeFieldValue(formName, 'location.longitude', formattedPlace.longitude);
        changeFieldValue(formName, 'location.searchAddress', '');
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
      changeLocation(fullAddress, true, 'cities');
    }
  }, [get(formValue, 'location.searchAddress', null)]);

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
    content.split('').forEach((val, i) => {
      if (val === newLocation.charAt(i)) end = i;
      if (start === -1 && val === newLocation.charAt(i).toLowerCase()) start = i;
    });
    return `<span>${container.substring(0, start)}</span><span class='highlight'>${container.substring(start, end + 1)}</span><span>${container.substring(end + 1, content.length)}</span>`;
  };

  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF DROPDOWN ADDRESS LISTS
  // useOutsideAlerter(inputZipSearch, { action: 'function', func: () => setZiplist([]) });
  useOutsideAlerter(addressRef, { action: 'function', func: () => setLoclist([]) });

  const classNameDef = !className && showMap ? 'w-perc-100 dis-fl-col' : className;
  const mapSize = !className && showMap ? 'h-fix-320' : 'h-perc-100';

  // FUNCTION TO MANAGE KEY-CHANGE
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

  // FUCNTION TO DELETE SELECTED CITY
  const deleteLocation = (loc) => {
    const locationsList = get(formValue, 'locations', []);
    const findIndex = locationsList.findIndex((item) => item.address === loc.address);
    locationsList.splice(findIndex, 1);
    changeFieldValue(formName, 'locations', locationsList);
  };

  useEffect(() => {
    const resultBox = addressRef.current;
    if (resultBox && !blockScroll) resultBox.scrollIntoView({ behavior: 'smooth' });
  }, [locList.length]);

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
          <div className="fieldMapSearch">
            <div className="dis-f jc-b flex-wrap">
              <div className="w-perc-100 pos-r">
                <BrixelInputText
                  className="search-box"
                  type="search"
                  ref={inputSearch}
                  label={translateTo('Zip / City', lang)}
                  disabled={disabled}
                  placeholder={translateTo('Search for zip or city...', lang)}
                  input={{
                    onChange: (e) => (disabled ? '' : changeFieldValue(formName, 'location.searchAddress', e)),
                    onBlur: () => '',
                    onFocus: () => (disabled ? '' : setSelectedAddress(false)),
                    value: get(formValue, 'location.searchAddress', '') || '',
                    name: 'location.searchAddress',
                  }}
                  onKeyDown={(e) => (disabled ? '' : keyUpInput(e))}
                  onClear={() => (disabled ? '' : changeFieldValue(formName, 'location', { countryCode: curCountry.value, latitude: curCountry.latitude, longitude: curCountry.longitude }))}
                  message={showMessageToChangeAddress ? { help: 'placeholder' } : null}
                  iconLeft="location-pin-simple"
                  large
                />
                {
                  !selectedAddress && locList.length > 0 && !disabled && (
                    <ul
                      className="resultAutoComplete notranslate"
                      ref={addressRef}
                      // style={{ maxHeight: `calc(100vh - ${resultBoxHeight}px)` }}
                    >
                      {
                        locList.map((loc, i) => (
                          <li
                            className={i === selLocAuto ? 'active' : ''}
                            tabIndex={i}
                            key={`loc_${i.toString()}`}
                            onClick={() => geoCode(loc.description)}
                          >
                            <BrixelIcon
                              color={i === selLocAuto ? 'dark' : 'light'}
                              saturationTxt={700}
                              icon="location-pin-simple"
                            />
                            <div className="singleLoc" dangerouslySetInnerHTML={{ __html: highlight(get(loc, 'description', '')) }} />
                          </li>
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
      {
        get(formValue, 'locations', null) && get(formValue, 'locations', []).length > 0 && (
          <div className="locationsListMap">
            <div className="dis-f a-c flex-wrap notranslate">
              {
                get(formValue, 'locations', []).map((loc, i) => (
                  <div
                    key={`frm_${i.toString()}`}
                    className="dis-f brdRadius50 a-c jc-fs bgBlue100 px-2 py-1 mb-1 w-fit mr-2"
                  >
                    <span className="">{loc.name}{loc.name !== loc.city && (<>, {loc.city}</>)}</span>
                    <BrixelIcon
                      className="fSizePx12 ml-1"
                      icon="close-small"
                      color="blue"
                      saturationTxt={700}
                      onClick={() => deleteLocation(loc)}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        )
      }
      <div className={`${showMap ? `${multipleFieldSearch ? 'pos-r' : ''} ${subMinHeight}` : 'hide'} wrapMap ${mapSize}`}>
        {
          showMap && (
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
              points={get(formValue, 'locations', [])}
              rad={get(formValue, 'location.radius', null)}
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

MapsCities.propTypes = {
  blockScroll: PropTypes.bool,
  changeFieldValue: PropTypes.func.isRequired,
  className: PropTypes.string,
  country: PropTypes.arrayOf(PropTypes.object),
  curCountry: PropTypes.object,
  disabled: PropTypes.bool,
  draggable: PropTypes.bool,
  formName: PropTypes.string,
  formValue: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired,
  handleUpdateCountry: PropTypes.func.isRequired,
  init: PropTypes.object.isRequired,
  input: PropTypes.object,
  lang: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  minHeight: PropTypes.number,
  multipleFieldSearch: PropTypes.bool,
  selCountry: PropTypes.string.isRequired,
  showMap: PropTypes.bool,
  showMessageToChangeAddress: PropTypes.bool,
  showSearchLocation: PropTypes.bool,
  similarProperties: PropTypes.arrayOf(PropTypes.object),
  subMinHeight: PropTypes.string,
  zoom: PropTypes.number,
};

MapsCities.defaultProps = {
  blockScroll: true,
  className: '',
  country: [],
  curCountry: {},
  disabled: false,
  draggable: false,
  formName: '',
  input: null,
  multipleFieldSearch: false,
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
  const lat = get(state, 'property.activeSingleProperty.location.latitude', 10);
  const lng = get(state, 'property.activeSingleProperty.location.longitude', 10);
  return ({
    country: get(state, 'common.country', {}),
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
)(MapsCities);
