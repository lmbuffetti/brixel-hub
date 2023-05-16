/* eslint-disable react-hooks/exhaustive-deps */
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {BrixelInputText, BrixelSelect, change, ReduxField, Validation} from '@brixel/brixel-components/dist/form';
import {BrixelAutocomplete, BrixelMap} from '@brixel/brixel-components/dist/map';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setCountryList} from '../../actions/CommonActions';
import translateTo from '../../utils/translation';
import type {MapsWithModalManualType} from '../../@types/components/Maps/MapsWithModalManual';
import {LocationType} from '@brixel/brixel-components/dist/@types/Model';

const MapsWithModalManual = (props: MapsWithModalManualType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    changeFieldValue,
    className = '',
    country = [],
    formName,
    formValue,
    lang,
    showMap,
    syncErrors,
    windowDimensions,
  } = props;
  // STATE
  const [showError, setShowError] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [updateAddress, setUpdateAddress] = useState(0);

  useEffect(() => {
    const checkPath = get(history, 'location.pathname', '').split('/');
    if (checkPath[checkPath.length - 1] === 'locationInput') {
      changeFieldValue(formName, 'location.latitude', null);
      changeFieldValue(formName, 'location.longitude', null);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    setTimeout(() => {
      const getCurStep = document.getElementById('searchInputWrap') as HTMLInputElement;
      if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
        const numberEl = getCurStep.querySelector('input[type="number"]') as HTMLInputElement;
        if (numberEl) numberEl.focus();
      } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
        const textEl = getCurStep.querySelector('input[type="text"]') as HTMLInputElement;
        if (textEl) textEl.focus();
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

  const saveCurrentLocation = () => {
    const address = get(formValue, 'location.name', '');
    const zipCode = get(formValue, 'location.zip', '');
    const city = get(formValue, 'location.city', '');
    const streetNumber = get(formValue, 'location.streetNumber', '');
    const getRealCountry = country.find(((item) => item.value === get(formValue, 'location.countryCode', 'all')));
    if (getRealCountry) {
      const searchAddr = `${address} ${streetNumber}, ${zipCode} ${city} ${getRealCountry.full}`;
      changeFieldValue(formName, 'location.searchAddress', searchAddr);
    }
    const manualSyncError: LocationType = cloneDeep(get(syncErrors, 'location', {}));
    delete manualSyncError.latitude;
    let invalidField = false;
    if (Validation.required(zipCode) !== true || Validation.required(address) !== true) {
      invalidField = true;
    }
    if (invalidField) {
      setShowError(true);
    } else {
      setUpdateAddress(updateAddress + 1);
      setShowError(false);
      setLoadingAddress(true);
    }
  };

  const mapWindowSize = windowDimensions.width >= 1024 ? 'h-fix-232' : 'h-fix-240';
  const mapSize = !className && showMap ? mapWindowSize : 'h-perc-100';

  const closeModal = () => {
    setShowManualInput(false);
  };

  return (
    // Important! Always set the container height explicitly
    <>
      {
        baseByData && get(formValue, 'location.countryCode', null) && (
          <>
            <BrixelAutocomplete
              label="Address"
              input={{
                value: get(formValue, 'location.searchAddress', ''),
                name: 'autocomplete',
              }}
              lang={lang}
              baseByData={baseByData}
              country={get(formValue, 'location.countryCode', 'pt')}
              useOnlyFunction={true}
              updateAddress={updateAddress}
              onSelectAddress={(val) => {
                setShowManualInput(false);
                setLoadingAddress(false);
                changeFieldValue(formName, 'location.latitude', val.latitude);
                changeFieldValue(formName, 'location.longitude', val.longitude);
                changeFieldValue(formName, 'location.name', val.name);
              }}
            />
            <BrixelMap
              externalControls={false}
              className={mapSize}
              baseByData={baseByData}
              marker={formValue}
              gestureHandling="none"
              center={{
                lat: get(formValue, 'location.latitude', 0),
                lng: get(formValue, 'location.longitude', 0),
              }}
              lang={lang}
            />
          </>
        )
      }
      {
        showManualInput && (
          <div
            className={`wrapManualAddress ${showManualInput ? 'active' : ''}`}
          >
            <div className="addressInner pos-r">
              <BrixelButtonIcon
                className="pos-a-fix x-r-2 x-t-2 zIndex2"
                bgTransparent
                small
                icon="close"
                theme="text"
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
                          error: translateTo('Please insert a valid address', lang),
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
              <div
                className="footerAction shadow-1dp-top normStep"
              >
                <div className="pos-r p-2">
                  <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-b jc-fe-sm">
                    <BrixelButtonSecondary
                      rounded
                      className="mr-3"
                      label={translateTo('Cancel', lang)}
                      onClick={() => closeModal()}
                    />
                    <BrixelButtonPrimary
                      rounded
                      theme="green"
                      themeSat={500}
                      label={translateTo('Save Address', lang)}
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
      <div className="dis-f jc-b a-c mt-3 mt-sm-4 px-2">
        <div className="fweight-500 txtText900 pr-1 pr-sm-0">
          <span>{get(formValue, 'location.name', '')}</span>
          {
            get(formValue, 'location.streetNumber', null) && (
              <span className="ml-1 dis-ib">{get(formValue, 'location.streetNumber', '')}</span>
            )
          }
          <span className="fweight-400 txtText600 fsize-200 dis-b">{get(formValue, 'location.cityZip', '')}</span>
        </div>
        <BrixelButtonSecondary
          label={translateTo('Edit', lang)}
          rounded
          small={windowDimensions.width < 590}
          onClick={() => setShowManualInput(true)}
        />
      </div>
    </>
  );
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
  connect(mapStateToProps, mapDispatchToProps),
)(MapsWithModalManual);
