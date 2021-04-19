/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, {
  useState, createRef, useEffect, useRef,
} from 'react';
import { withRouter } from 'react-router-dom';
import {
  GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelInputText,
  BrixelSelect,
  ReduxField,
  Validation,
  change,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import useOutsideAlerter from '../OutsideElement';
import Map from './Map';
import { setCountryList } from '../../actions/CommonActions';

export const MapsWithModalManual = (props) => {
  // PROPS
  const {
    changeFieldValue,
    className,
    country,
    curCountry,
    disabled,
    draggable,
    formName,
    formValue,
    google,
    handleUpdateCountry,
    history,
    init,
    input,
    latitude,
    longitude,
    minHeight,
    multipleFieldSearch,
    selCountry,
    showMap,
    showMessageToChangeAddress,
    showSearchLocation,
    similarProperties,
    subMinHeight,
    syncErrors,
    zoom,
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
  const [showManualInput, setShowManualInput] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorResult, setErrorResult] = useState(null);

  // REF
  // const inputZipSearch = useRef(null);
  const addressRef = useRef(null);

  useEffect(() => {
    if (!get(formValue, 'location.latitude', 0) && get(history, 'location.pathname', '').includes('locationInputResume')) {
      if (get(formValue, 'locationsList', []).length > 0) {
        geoCode(formValue.locationsList[0].description);
      } else {
        setShowManualInput(true);
      }
    }
  }, [get(history, 'location.pathname', null)]);

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
      if (val.length > 3) {
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
                if (defPredition) {
                  changeFieldValue(formName, 'locationsList', defPredition);
                  geoCode(defPredition[0].description);
                }
              } else {
                // setZiplist([]);
                setLoclist(defPredition);
                changeFieldValue(formName, 'locationsList', defPredition);
              }
            } else {
              setLoclist([]);
              changeFieldValue(formName, 'locationsList', []);
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
    console.log(adr);
    Geocode.fromAddress(adr)
      .then((result) => {
        const formattedPlace = cloneDeep(get(formValue, 'location', {}));
        formattedPlace.country = get(formattedPlace, 'country', null);
        formattedPlace.countryCode = get(formattedPlace, 'countryCode', null);
        formattedPlace.name = get(formattedPlace, 'name', null);
        formattedPlace.vicinity = get(formattedPlace, 'vicinity', null);
        formattedPlace.address = get(formattedPlace, 'address', null);
        formattedPlace.geometry = get(formattedPlace, 'geometry', null);
        formattedPlace.latitude = get(formattedPlace, 'latitude', null);
        formattedPlace.longitude = get(formattedPlace, 'longitude', null);
        formattedPlace.state = get(formattedPlace, 'state', null);
        formattedPlace.stateCode = get(formattedPlace, 'stateCode', null);
        formattedPlace.zip = get(formattedPlace, 'zip', null);
        formattedPlace.city = get(formattedPlace, 'city', null);

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
          // formattedPlace.searchAddress = formattedPlace.address;
          formattedPlace.cityZip = formattedPlace.city;
          if (formattedPlace.zip) formattedPlace.cityZip = `${formattedPlace.zip} ${formattedPlace.city}`;
        }

        if (has(formattedPlace, 'countryName')) formattedPlace.countryName = formattedPlace.country;
        // if (!formattedPlace.zip && isShowZip) setShowZipCode(true);
        if (input) input.onChange(formattedPlace.latitude);
        changeFieldValue(formName, 'changeCountry', formattedPlace.countryCode);
        let currentLocation = get(formValue, 'location', {});
        currentLocation = {
          ...currentLocation,
          ...formattedPlace,
        };
        console.log(currentLocation, get(formValue, 'location.city', null));
        if (
          currentLocation.city !== get(formValue, 'location.city', null) ||
          currentLocation.zip !== get(formValue, 'location.zip', null)
        ) {
          setErrorResult('The zip code is wrong!');
          setLoclist([]);
          setLoadingAddress(false);
        } else {
          changeFieldValue(formName, 'location', currentLocation);
          const existCountry = country.find((item) => item.value === formattedPlace.countryCode);
          if (typeof existCountry === 'undefined') {
            const newListcountry = country;
            newListcountry.push({
              value: formattedPlace.countryCode,
              label: formattedPlace.country,
            });
            handleUpdateCountry(newListcountry);
          }
          // changeFieldValue(formName, 'location.latitude', formattedPlace.latitude);
          // changeFieldValue(formName, 'location.longitude', formattedPlace.longitude);
          // changeFieldValue(formName, 'location.searchAddress', formattedPlace.name);
          setLoclist([]);
          setLoadingAddress(false);
          setShowManualInput(false);
        }
        // setZiplist([]);
      })
      .catch((error) => {
        console.log(error);
        changeLocation(get(formValue, 'location.zip', ''), true, 'zip');
      });
  };

  const saveCurrentLocation = () => {
    const address = get(formValue, 'location.name', '');
    const zipCode = get(formValue, 'location.zip', '');
    const city = get(formValue, 'location.city', '');
    const streetNumber = get(formValue, 'location.streetNumber', '');
    const getRealCountry = country.find(((item) => item.value === get(formValue, 'location.countryCode', 'all')));
    const searchAddr = `${address} ${streetNumber}, ${zipCode} ${city} ${getRealCountry.full}`;
    geoCode(searchAddr);
    setLoadingAddress(true);
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
    e.preventDefault();
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
    if (dropdownEl) dropdownEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [locList.length]);

  const enableButtonManualInsert = () => {
    const manualSyncError = cloneDeep(get(syncErrors, 'location', {}));
    delete manualSyncError.latitude;
    const invalidField = false;
    Object.keys(manualSyncError).forEach((key) => {
      // if (manualSyncError[key] !== true && manualSyncError[key] !== null) invalidField = true;
    });
    return invalidField;
  };

  return (
    // Important! Always set the container height explicitly
    <>
      <div
        className={`wrapManualAddress ${showManualInput ? 'active' : ''}`}
      >
        <div className="p-5">
          <h3 className="mb-5 w-perc-100">
            Please edit your location details.
          </h3>
          <ReduxField
            form={formName}
            design={{
              className: 'mb-2 zIndex1',
            }}
            input={{
              name: 'location.countryCode',
              options: country,
            }}
            labels={{
              label: 'Name',
            }}
            component={BrixelSelect}
          />
          <div className="dis-f">
            <ReduxField
              ReduxFieldClass="pr-1 w-perc-75"
              form={formName}
              design={{
                className: 'mb-2 zIndex1',
              }}
              input={{
                name: 'location.name',
                placeholder: 'Street name',
              }}
              labels={{
                label: 'Street name',
              }}
              component={BrixelInputText}
            />
            <ReduxField
              ReduxFieldClass="pl-1 w-perc-25"
              form={formName}
              design={{
                className: 'mb-2 zIndex1',
              }}
              input={{
                name: 'location.streetNumber',
                placeholder: 'Street number',
              }}
              labels={{
                label: 'Street Number',
              }}
              component={BrixelInputText}
            />
          </div>

          <div className="dis-f a-t jc-b">
            <ReduxField
              ReduxFieldClass="w-perc-100 pr-1"
              form={formName}
              design={{
                className: 'mb-2 zIndex1',
              }}
              input={{
                name: 'location.zip',
                placeholder: 'Zip code',
                validate: [Validation.zipCode],
              }}
              inputFormat={{
                formatType: `zipCode-${get(formValue, 'location.countryCode', null)}`,
                country: get(formValue, 'location.countryCode', null),
              }}
              meta={{
                invalid: true,
                dirty: true,
              }}
              labels={{
                label: 'Zip code',
              }}
              component={BrixelInputText}
            />
            <ReduxField
              ReduxFieldClass="pl-1 w-perc-100"
              form={formName}
              design={{
                className: 'mb-2 zIndex1',
              }}
              input={{
                name: 'location.state',
                placeholder: 'City',
              }}
              labels={{
                label: 'City',
              }}
              component={BrixelInputText}
            />
          </div>
          {
            errorResult && (
              <p>{errorResult}</p>
            )
          }
        </div>
        <div
          className="footerAction shadow-1dp-top normStep"
        >
          <div className="pos-r p-1 p-lg-2">
            <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-fe">
              <BrixelButtonPrimary
                label="Next"
                onClick={() => saveCurrentLocation()}
                disabled={enableButtonManualInsert()}
                isLoading={loadingAddress}
              />
            </div>
          </div>
        </div>
      </div>
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
                      onChange: (e) => (disabled ? '' : changeFieldValue(formName, 'location.searchAddress', e)),
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
                    !selectedAddress && locList.length > 0 && !disabled && (
                      <ul className="resultAutoComplete notranslate" ref={addressRef}>
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
              </div>
            </div>
          )
        }
        <div className={`${showMap ? `${multipleFieldSearch ? 'pos-r' : ''} ${subMinHeight}` : 'hide'} wrapMap ${mapSize}`}>
          <Map
            {...props}
            draggable
            google={google}
            zoom={20}
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
            moveMarker
            style={{
              width: showMap ? '100%' : '0px',
              height: showMap ? '100%' : '0px',
            }}
            similarProperties={similarProperties}
          />
        </div>
      </div>
      {
        get(history, 'location.pathname', '').includes('locationInputResume') && (
          <p>
            <span>{get(formValue, 'location.name', '')}</span>
            {
              get(formValue, 'location.streetNumber', null) && (
                <span className="ml-1">{get(formValue, 'location.streetNumber', '')}</span>
              )
            }
            <span>, {get(formValue, 'location.cityZip', '')}</span>
            <BrixelButtonText
              label="Edit"
              onClick={() => setShowManualInput(true)}
            />
          </p>
        )
      }
    </>
  );
};

MapsWithModalManual.propTypes = {
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
  history: PropTypes.object.isRequired,
  init: PropTypes.object.isRequired,
  input: PropTypes.object,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  minHeight: PropTypes.number,
  multipleFieldSearch: PropTypes.bool,
  onSubmit: PropTypes.func,
  selCountry: PropTypes.string,
  showMap: PropTypes.bool,
  showMessageToChangeAddress: PropTypes.bool,
  showSearchLocation: PropTypes.bool,
  similarProperties: PropTypes.arrayOf(PropTypes.object),
  subMinHeight: PropTypes.string,
  syncErrors: PropTypes.object.isRequired,
  zoom: PropTypes.number,
};

MapsWithModalManual.defaultProps = {
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
  zoom: 16,
  minHeight: 0,
  subMinHeight: '',
};

const mapStateToProps = (state, props) => {
  const formName = get(props, 'formName', Object.keys(get(state, 'brixelForm'))[0]);
  const propsLat = get(props, 'latitude', 0);
  const propsLng = get(props, 'longitude', 0);
  const lat = get(state, 'property.activeSingleProperty.location.latitude', propsLat);
  const lng = get(state, 'property.activeSingleProperty.location.longitude', propsLng);
  return ({
    country: get(state, 'common.country', []),
    formName,
    formValue: get(state, `brixelForm[${formName}].values`, {}),
    init: get(state, `brixelForm[${formName}].initial`, {}),
    lang: get(state, 'common.language', 'en'),
    latitude: get(state, `brixelForm.[${formName}].values.location.latitude`, lat),
    longitude: get(state, `brixelForm.[${formName}].values.location.longitude`, lng),
    property: get(state, `brixelForm[${formName}].values`, {}),
    syncErrors: get(state, `brixelForm[${formName}].syncErrors`, {}),
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MapsWithModalManual);
