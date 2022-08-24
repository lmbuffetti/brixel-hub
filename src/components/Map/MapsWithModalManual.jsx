/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, {
  useState, createRef, useEffect, useRef,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  GoogleApiWrapper,
} from 'google-maps-react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  BrixelButtonIcon,
  translateTo,
} from '@brixel/brixel-components';
import {
  BrixelInputText,
  BrixelSelect,
  ReduxField,
  Validation,
  change,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import useOutsideAlerter from '../OutsideElement';
import Map from './Map';
import { setCountryList } from '../../actions/CommonActions';

export const MapsWithModalManual = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleCompany,
    changeFieldValue,
    className,
    country,
    curCountry,
    disabled,
    formName,
    formValue,
    google,
    handleUpdateCountry,
    init,
    lang,
    latitude,
    longitude,
    minHeight,
    multipleFieldSearch,
    onSubmit,
    selCountry,
    showMap,
    showMessageToChangeAddress,
    showSearchLocation,
    similarProperties,
    subMinHeight,
    syncErrors,
    windowDimensions,
  } = props;
  // STATE
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [showError, setShowError] = useState(false);
  // const [optMap, setOptMap] = useState({});
  const inputSearch = createRef(null);
  const [locList, setLoclist] = useState([]);
  // const [zipList, setZiplist] = useState([]);
  const [selLocAuto, setSelLocAuto] = useState(0);
  const [stateToken, setStateToken] = useState(null);
  const [startSearch, setStartSearch] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorResult, setErrorResult] = useState(null);
  const [idLocaSel, setIdLocaSel] = useState(0);
  // REF
  // const inputZipSearch = useRef(null);
  const addressRef = useRef(null);
  
  useEffect(() => {
    const checkPath = get(history, 'location.pathname', '').split('/');
    if (checkPath[checkPath.length - 1] === 'locationInput') {
      setSelectedAddress(false);
      changeFieldValue('location.latitude', null);
      changeFieldValue('location.longitude', null);
    }
  }, [history.location.pathname]);
  
  useEffect(() => {
    setTimeout(() => {
      const getCurStep = document.getElementById('searchInputWrap');
      if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
        getCurStep.querySelector('input[type="number"]').focus();
      } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
        getCurStep.querySelector('input[type="text"]').focus();
      }
    }, 100);
  }, []);
  
  useEffect(() => {
    const { body } = document;
    if (body) {
      if (showManualInput) body.classList.add('overlayOpen');
      else body.classList.remove('overlayOpen');
    }
  }, [showManualInput]);
  
  // FUNCTION TO EXTRACT DATA FROM SELECTED ADDRESS
  const geoCode = (adr, action) => {
    const defAdr = adr.split(',');
    Geocode.setApiKey('AIzaSyDHqV6i45MbGQVKOr2Md-8IzWeO7J1zGmg');
    if (selCountry.toLowerCase() !== 'ch') Geocode.setLanguage(selCountry.toLowerCase());
    setSelectedAddress(true);
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
        changeFieldValue(formName, 'changeCountry', formattedPlace.countryCode);
        let currentLocation = get(formValue, 'location', {});
        currentLocation = {
          ...currentLocation,
          ...formattedPlace,
          searchAddress: formattedPlace.address,
        };
        
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
        setLoclist([]);
        setLoadingAddress(false);
        setShowManualInput(false);
        if (action === 'submit') onSubmit();
        // setZiplist([]);
      })
      .catch(() => {
        // eslint-disable-next-line no-use-before-define
        changeLocation(get(formValue, 'location.zip', ''), true, 'zip', true);
      });
  };
  
  // FUNCTION FOR THE AUTOCOMPLETE - start only if value more then 3 characters - val.length
  const changeLocation = (val, hideSearch, type, showErrorLoc = false) => {
    if ((showSearchLocation && inputSearch.current) || hideSearch) {
      const sessionToken = stateToken || new google.maps.places.AutocompleteSessionToken();
      const autocompleteService = new google.maps.places.AutocompleteService();
      if (!stateToken) setStateToken(sessionToken);
      let typeSearch = [get(props, 'searchType', 'address')];
      if (type === 'cities') typeSearch = ['(regions)'];
      if (type === 'zip') typeSearch = ['(regions)'];
      if (val.length >= 3) {
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
                setLoclist([]);
                if (defPredition) {
                  changeFieldValue(formName, 'locationsList', defPredition);
                  geoCode(defPredition[0].description);
                }
              } else {
                setLoclist(defPredition);
                changeFieldValue(formName, 'locationsList', defPredition);
              }
            } else {
              setLoclist([]);
              changeFieldValue(formName, 'locationsList', []);
              if (showErrorLoc) {
                setErrorResult(translateTo(`We can't find that location please try again or contact our <a href="mailto:${get(activeSingleCompany, 'contact.email', 'support@brixel.io')}">support team</a>`, lang));
              }
              setLoadingAddress(false);
              // setZiplist([]);
            }
          },
        );
      } else {
        setLoclist([]);
      }
    }
  };
  
  const saveCurrentLocation = () => {
    const address = get(formValue, 'location.name', '');
    const zipCode = get(formValue, 'location.zip', '');
    const city = get(formValue, 'location.city', '');
    const streetNumber = get(formValue, 'location.streetNumber', '');
    const getRealCountry = country.find(((item) => item.value === get(formValue, 'location.countryCode', 'all')));
    const searchAddr = `${address} ${streetNumber}, ${zipCode} ${city} ${getRealCountry.full}`;
    
    const manualSyncError = cloneDeep(get(syncErrors, 'location', {}));
    delete manualSyncError.latitude;
    let invalidField = false;
    if (Validation.required(zipCode) !== true || Validation.required(address) !== true) {
      invalidField = true;
    }
    if (invalidField) {
      setShowError(true);
    } else {
      setShowError(false);
      geoCode(searchAddr);
      setLoadingAddress(true);
    }
  };
  
  // FUNCTION TO LOAD AUTOCOMPLETE FUNCTION ON CHANGE searchAddress
  useEffect(() => {
    const addressSearch = get(formValue, 'location.searchAddress', null);
    const addressSearchInit = get(init, 'location.searchAddress', null);
    const citySearch = get(formValue, 'location.cityZip', null);
    if (addressSearch && addressSearch !== addressSearchInit && !selectedAddress) {
      let fullAddress = `${addressSearch}`;
      if (citySearch) fullAddress = `${citySearch} ${addressSearch}`;
      changeLocation(fullAddress, true, 'address');
    }
    setSelectedAddress(false);
    if (!selectedAddress) {
      changeFieldValue(formName, 'location.name', addressSearch);
    }
    if (isEmpty(addressSearch)) {
      changeFieldValue(formName, 'location', { countryCode: curCountry.value, latitude: curCountry.latitude, longitude: curCountry.longitude });
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
    const stringToSplit = get(formValue, 'location.searchAddress', '');
    content.split('').forEach((val, i) => {
      if (val === stringToSplit.charAt(i)) end = i;
      if (start === -1 && val === stringToSplit.charAt(i).toLowerCase()) start = i;
    });
    return `<span class="txtDark200 fweight-300">${container.substring(0, start)}</span><span class='highlight'>${container.substring(start, end + 1)}</span><span class="txtDark200 fweight-300">${container.substring(end + 1, content.length)}</span>`;
  };
  
  // FUNCTION TO MANAGE THE CLICK OUTSIDE OF DROPDOWN ADDRESS LISTS
  // useOutsideAlerter(inputZipSearch, { action: 'function', func: () => setZiplist([]) });
  useOutsideAlerter(addressRef, { action: 'function', func: () => setLoclist([]) });
  
  const classNameDef = !className && showMap ? 'w-perc-100 dis-fl-col' : className;
  const mapWindowSize = windowDimensions.width >= 1024 ? 'h-fix-232' : 'h-fix-240';
  const mapSize = !className && showMap ? mapWindowSize : 'h-perc-100';
  
  // FUNCTION TO MANAGE KEY-CHANGE
  const keyUpInput = (e) => {
    let newId = selLocAuto || 0;
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
      setSelectedAddress(false);
      geoCode(locList[newId].description, 'submit');
    }
    setIdLocaSel(newId);
  };
  
  useEffect(() => {
    if (!get(formValue, 'location.latitude', 0) && get(history, 'location.pathname', '').includes('locationInputResume')) {
      if (get(formValue, 'locationsList', []).length > 0) {
        geoCode(formValue.locationsList[idLocaSel].description);
      } else {
        setShowManualInput(true);
      }
    }
  }, [get(history, 'location.pathname', null)]);
  
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
  }, [locList.length]);
  
  const closeModal = () => {
    setShowManualInput(false);
  };
  
  const clearField = () => {
    inputSearch.current.value = '';
    changeFieldValue(formName, 'location', {
      countryCode: curCountry.value, latitude: curCountry.latitude, longitude: curCountry.longitude, searchAddress: '',
    });
  };
  
  return (
    // Important! Always set the container height explicitly
    <>
      {
        !multipleFieldSearch && (
          <div
            className={`wrapManualAddress ${showManualInput ? 'active' : ''}`}
          >
            <div className="addressInner pos-r">
              <BrixelButtonIcon
                className="pos-a-fix x-r-1 x-t-1 zIndex2"
                ghost
                icon="close"
                theme="dark"
                onClick={() => closeModal()}
              />
              <div className="w-perc-100 px-2 px-sm-5 m-a pt-5 h-perc-100 ov-y-a pb-5 pb-sm-0">
                <h3 className="mt-3 mb-5 w-perc-100 pr-4">
                  {translateTo('Please edit your address manually.', lang)}
                </h3>
                <div className="">
                  <div className="dis-f editLocation">
                    <ReduxField
                      multiple={false}
                      forceToShowError={showError && Validation.required(get(formValue, 'location.name')) !== true}
                      ReduxFieldClass="pr-1 w-perc-75"
                      form={formName}
                      design={{
                        className: 'mb-2 zIndex1',
                        showIconValidation: false,
                        large: true,
                      }}
                      input={{
                        name: 'location.name',
                        validate: [Validation.required],
                      }}
                      labels={{
                        label: translateTo('Street name', lang),
                      }}
                      meta={{
                        invalid: true,
                        dirty: true,
                        message: {
                          error: translateTo('Please insert a valid address'),
                        },
                      }}
                      component={BrixelInputText}
                    />
                    <ReduxField
                      ReduxFieldClass="pl-1 w-perc-25"
                      form={formName}
                      design={{
                        className: 'mb-2 zIndex1',
                        showIconValidation: false,
                        large: true,
                      }}
                      input={{
                        name: 'location.streetNumber',
                      }}
                      labels={{
                        label: translateTo(windowDimensions.width < 590 ? 'Nr.' : 'Number', lang),
                      }}
                      component={BrixelInputText}
                    />
                  </div>
                  
                  <div className="dis-f a-t jc-b">
                    <ReduxField
                      multiple={false}
                      showIconValidation={false}
                      forceToShowError={showError && (Validation.required(get(formValue, 'location.zip', null)) !== true)}
                      ReduxFieldClass="w-perc-50 w-perc-sm-40 pr-1"
                      form={formName}
                      design={{
                        className: 'mb-2 zIndex1',
                        showIconValidation: false,
                        large: true,
                      }}
                      input={{
                        name: 'location.zip',
                        validate: [Validation.zipCode, Validation.required],
                      }}
                      inputFormat={{
                        formatType: `zipCode-${get(formValue, 'location.countryCode', null)}`,
                        country: get(formValue, 'location.countryCode', null),
                      }}
                      meta={{
                        invalid: true,
                        dirty: true,
                        message: {
                          error: translateTo('Please insert a valid zip code', lang),
                        },
                      }}
                      labels={{
                        label: translateTo('Zip code', lang),
                      }}
                      component={BrixelInputText}
                    />
                    <ReduxField
                      showIconValidation={false}
                      ReduxFieldClass="pl-1 w-perc-50 w-perc-sm-60"
                      form={formName}
                      design={{
                        className: 'mb-2 zIndex1',
                        showIconValidation: false,
                        large: true,
                      }}
                      input={{
                        name: 'location.city',
                      }}
                      labels={{
                        label: translateTo('City', lang),
                      }}
                      component={BrixelInputText}
                    />
                  </div>
                  <ReduxField
                    showIconValidation={false}
                    form={formName}
                    design={{
                      wrapClass: 'w-perc-60',
                      className: 'mb-2 zIndex1',
                      showIconValidation: false,
                      large: true,
                    }}
                    input={{
                      name: 'location.countryCode',
                      options: country,
                    }}
                    labels={{
                      label: translateTo('Country', lang),
                    }}
                    component={BrixelSelect}
                  />
                </div>
              </div>
              {
                errorResult && (
                  <p className="px-5 pt-3 txtRed400" dangerouslySetInnerHTML={{ __html: translateTo(errorResult) }} />
                )
              }
              <div
                className={`footerAction shadow-1dp-top normStep ${errorResult ? 'mt-2' : 'mt-sm-5'}`}
              >
                <div className="pos-r p-2">
                  <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-b jc-fe-sm">
                    <BrixelButtonSecondary
                      rounded
                      className="mr-3"
                      label={translateTo("Cancel", lang)}
                      onClick={() => closeModal()}
                    />
                    <BrixelButtonPrimary
                      rounded
                      theme="green"
                      themeSat={500}
                      label={translateTo("Save Address", lang)}
                      onClick={() => saveCurrentLocation()}
                      isLoading={loadingAddress}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div
        style={showMap ? {
          minHeight: minHeight > 0 ? `${minHeight}px` : '', position: 'relative',
        } : {
          minHeight: '100%', position: 'relative',
        }}
        className={`${classNameDef} ${multipleFieldSearch ? 'multiField' : ''}`}
      >
        {
          // IF multipleFieldSearch SHOW THE FIELDS STREET NAME AND STREET NUMBER
          multipleFieldSearch && (
            <div className="fieldMapSearch mb-1" id="searchInputWrap">
              <div className="dis-f jc-b flex-wrap">
                <div className="w-perc-100 pos-r">
                  <BrixelInputText
                    disableAutocomplete
                    className="search-box"
                    type="search"
                    ref={inputSearch}
                    label={translateTo("Address", lang)}
                    disabled={disabled}
                    placeholder="Write street name"
                    input={{
                      onChange: (e, name) => (disabled ? '' : changeFieldValue(formName, name || 'location.searchAddress', e)),
                      onBlur: () => '',
                      // onFocus: () => (disabled ? '' : setSelectedAddress(false)),
                      value: get(formValue, 'location.searchAddress', '') || '',
                      name: 'location.searchAddress',
                    }}
                    onKeyDown={(e) => (disabled ? '' : keyUpInput(e))}
                    onClear={() => (disabled ? '' : clearField())}
                    message={showMessageToChangeAddress ? { help: 'placeholder' } : null}
                    iconLeft="location-pin-simple"
                    large
                  />
                  {
                    !selectedAddress && locList.length > 0 && !disabled && (
                      <ul className="resultAutoComplete notranslate" ref={addressRef}>
                        {
                          locList.map((loc, i) => (
                            <li
                              className={i === selLocAuto ? 'active' : ''}
                              tabIndex={i}
                              key={`loc_${i.toString()}`}
                              onClick={() => geoCode(loc.description, 'submit')}
                            >
                              <BrixelIcon
                                // color={i === selLocAuto ? 'dark' : 'light'}
                                color="dark"
                                saturationTxt={700}
                                icon="location-pin-simple"
                              />
                              <div className="singleLoc" dangerouslySetInnerHTML={{ __html: highlight(`${get(loc, 'terms[0].value', '')}, ${get(loc, 'terms[1].value', '')}`) }} />
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
          <div className="dis-f jc-b a-c mt-3 mt-sm-4 px-2">
            <div className="fweight-500 txtDark700 pr-1 pr-sm-0">
              <span>{get(formValue, 'location.name', '')}</span>
              {
                get(formValue, 'location.streetNumber', null) && (
                  <span className="ml-1 dis-ib">{get(formValue, 'location.streetNumber', '')}</span>
                )
              }
              <span className="fweight-400 txtDark200 fsize-200 dis-b">{get(formValue, 'location.cityZip', '')}</span>
            </div>
            <BrixelButtonSecondary
              label={translateTo("Edit", lang)}
              rounded
              small={windowDimensions.width < 590}
              onClick={() => setShowManualInput(true)}
            />
          </div>
        )
      }
    </>
  );
};

MapsWithModalManual.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
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
  lang: PropTypes.string.isRequired,
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
  windowDimensions: PropTypes.object.isRequired,
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

const mapStateToProps = (state, ownProps) => {
  const formName = get(ownProps, 'formName', Object.keys(get(state, 'brixelForm'))[0]);
  const propsLat = get(ownProps, 'latitude', 0);
  const propsLng = get(ownProps, 'longitude', 0);
  const lat = get(state, 'property.activeSingleProperty.location.latitude', propsLat);
  const lng = get(state, 'property.activeSingleProperty.location.longitude', propsLng);
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    country: get(state, 'common.country', []),
    formName,
    formValue: get(state, `brixelForm[${formName}].values`, {}),
    init: get(state, `brixelForm[${formName}].initial`, {}),
    lang: get(state, 'common.language', 'en'),
    latitude: get(state, `brixelForm.[${formName}].values.location.latitude`, lat),
    longitude: get(state, `brixelForm.[${formName}].values.location.longitude`, lng),
    property: get(state, `brixelForm[${formName}].values`, {}),
    syncErrors: get(state, `brixelForm[${formName}].syncErrors`, {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(form, field, value) {
    dispatch(change(form, field, value));
  },
  handleUpdateCountry: bindActionCreators(setCountryList, dispatch),
});

export default compose(
  GoogleApiWrapper((props) => ({
    apiKey: (baseByData.googleMaps),
    language: props.lang,
    libraries: ['geometry', 'drawing', 'places'],
  })),
  connect(mapStateToProps, mapDispatchToProps),
)(MapsWithModalManual);
