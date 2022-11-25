/* eslint-disable react-hooks/exhaustive-deps */
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon } from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { BrixelInputText, BrixelSelect, change, ReduxField, Validation } from '@brixel/brixel-components/dist/form';
import { BrixelMap } from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import PropTypes from 'prop-types';
/* eslint-disable array-callback-return */
import React, { createRef, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { setCountryList } from '../../actions/CommonActions';
import translateTo from '../../utils/translation';

export const MapsWithModalManual = (props) => {
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
    formName,
    formValue,
    lang,
    latitude,
    longitude,
    minHeight,
    multipleFieldSearch,
    showMap,
    showMessageToChangeAddress,
    similarProperties,
    subMinHeight,
    windowDimensions,
  } = props;
  // STATE
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [showError, setShowError] = useState(false);
  // const [optMap, setOptMap] = useState({});
  const inputSearch = createRef(null);
  const [locList, setLoclist] = useState([]);
  const [selLocAuto, setSelLocAuto] = useState(0);
  const [showManualInput, setShowManualInput] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorResult, setErrorResult] = useState(null);
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
  
  const closeModal = () => {
    setShowManualInput(false);
  };
  
  const clearField = () => {
    inputSearch.current.value = '';
    changeFieldValue(formName, 'location', {
      countryCode: curCountry.value, latitude: curCountry.latitude, longitude: curCountry.longitude, searchAddress: '',
    });
  };
  
  const classNameDef = !className && showMap ? 'w-perc-100 dis-fl-col' : className;
  const mapWindowSize = windowDimensions.width >= 1024 ? 'min-h-fix-232' : 'min-h-fix-240';
  const mapSize = !className && showMap ? mapWindowSize : 'h-perc-100';
  
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
        className={`${multipleFieldSearch ? 'multiField' : ''}`}
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
                            >
                              <BrixelIcon
                                // color={i === selLocAuto ? 'dark' : 'light'}
                                color="dark"
                                saturationTxt={700}
                                icon="location-pin-simple"
                              />
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
          <BrixelMap
            baseByData={baseByData}
            {...props}
            center={{
              lat: latitude,
              lng: longitude,
            }}
            className={`${mapSize} min-w-perc-100`}
            zoom={14}
            type="roadmap"
            externalControls={false}
            curCountry={curCountry}
            marker={formValue}
            style={{
              width: showMap ? '100%' : '0px',
              height: showMap ? '100%' : '0px',
            }}
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

export default connect(mapStateToProps, mapDispatchToProps)(MapsWithModalManual);
