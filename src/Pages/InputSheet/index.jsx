/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reduxForm, Field } from 'redux-form';
import get from 'lodash/get';
import { diff } from 'deep-object-diff';
import {
  BrixelButtonIcon, BrixelButtonPrimary,
  BrixelExtraFeature, BrixelInputQuality, BrixelSelect, BrixelTags,
  BrixelInputText, BrixelInputStepNumber, BrixelRadioButton, BrixelIcon,
  BrixelTextArea, BrixelCheckbox, BrixelInputScale, FactsOptions,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  setModal, setNotification,
} from '../../actions/CommonActions';
import LoadingSimple from '../../components/LoadingSimple';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { uploadDocument, deleteDocument } from '../../actions/UploadActions';
import { InputSheets } from '../../resources/inputSheets';

// COMPONENTS
import Loading from '../../components/Loading';
// import { getActiveSingleUser } from '../../actions/UserActions';
import { updateProperty, getProperty } from '../../actions/PropertyActions';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    errorValue, isLoading, match, history, formValue, handleSaveProperty, getUser, reset,
    initialValues, loggedInUser, setUserActiveProperty, singleUserPropertyList, setPreventExit,
    handleUploadDocument, handleDeleteDocument, handleSetModal, notification, setNotification,
    isUnsavedChangesModal, setUnsavedModal,
  } = props;

  const { factsOptions } = FactsOptions;

  // STATE
  const [uploadFile, setUploadFile] = useState({});
  const [Questions, setQuestions] = useState([]);
  const propID = get(match, 'params.propID', null);
  const { documents } = formValue;

  useEffect(() => {
    const id = get(match, 'params.propId', null);
    if (id) {
      setUserActiveProperty({id})
    }
    setQuestions(InputSheets('en'))
  }, []);

  // UPLOAD DOCUMENTS
  const saveDocuments = (e) => {
    e.preventDefault();
    handleUploadDocument(uploadFile);
  };

  // SAVE DOCUMENTS ON LOCAL STATE
  const loadFile = (e) => {
    e.preventDefault();
    let name = e.target.files[0].name || Date.now() / 1000;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      const data = {
        name,
        user: loggedInUser.id,
        isBrochure: false,
        file: reader.result,
        pageID: propID,
      };
      setUploadFile(data);
      handleSetModal({
        state: true,
        title: 'Edit File',
        body: `<div className="brixel-popup-content">
                <div className="edit-title-box ng-scope">
                  <input type="text" value=${name} onChange=${(i) => { name = i.target.value; }} />
                </div>
              </div>`,
        action: {
          name: 'Save file',
          func: (f) => saveDocuments(f),
        },
      });
    };
  };

  // REMOVE DOCUMENTS
  const deleteDocs = (e, idDocs) => {
    e.preventDefault();
    const data = {
      id: idDocs,
      pageID: propID,
    };
    handleDeleteDocument(data);
  };

  const saveData = () => {
    const data = {
      id: propID,
      data: formValue,
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)

    handleSaveProperty(data);
  };

  const discardChanges = () => {
    reset('InputSheet');
  };

  const closeNotificationBar = () => {
    setNotification({ state: false });
  };

  useEffect(() => {
    if (Object.keys(diff(initialValues, formValue)).length > 0) {
      setNotification({
        state: true,
        type: 'info',
        label: 'You have unsaved changes',
        actions:
          [
            { type: 'primary', label: 'Save', func: () => saveData() },
            { type: 'secondary', label: 'Discard changes', func: () => discardChanges() },
          ],
      });
    } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'success') {
      setTimeout(() => closeNotificationBar(), 2000);
    } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'info') {
      setNotification({ state: false });
    }
  }, [formValue]);

  if (!formValue.id) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <div className="container dis-fl-col">

        <div className="manager-bar pt-md-5 pr-md-1 pb-md-0 pl-md-3 dis-fl-col shadow-1dp">

          <div className="actions mb-7 dis-fl-row jc-b">
            <div className="address-container dis-fl-row">
              <BrixelButtonIcon
                color="Dark"
                saturationTxt={700}
                icon="arrow-simple-left"
                className="shadow-3dp mr-2"
                background="White"
                noBorder
                onClick={() => history.push('../')}
              />
              <h3>Input Sheet</h3>
              <h6 className="ml-3">{formValue.location.address}</h6>
            </div>
          </div>
        </div>

        {
          Questions.map((quest, i) => (
            <div key={i.toString()}>
              <h2>{quest.title}</h2>
              {
                quest.inputs.map((input, f) => (
                  <div key={f.toString()}>
                    {
                      input.type === 'Map' ? (
                        <>
                          <div className="mb-20 pos-r zIndex1">
                            <Field
                              name={input.name}
                              label={input.label}
                              component={() => (
                                <Maps
                                  zoom={14}
                                  scrollZoom
                                  moveMarker
                                  draggable
                                  showSearchLocation
                                  showSelectCountry={true}
                                  showMap={true}
                                  isShowZip={false}
                                  className="w-perc-100"
                                />
                              )}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="dis-f a-c jc-b">
                          <div
                            className={`${input.classNameBox || ''} dis-f a-c jc-b w-perc-100`}
                            tabIndex="-1"
                          >
                            <Field
                              className="w-perc-100"
                              inputClassName={input.className || ''}
                              name={input.name}
                              label={input.label}
                              icons={quest.icons}
                              component={quest.component}
                              fluid={true}
                              options={input.options}
                              validate={input.validation}
                              type={input.type}
                              step={+input.step}
                              min={input.min}
                              deactivable={false}
                              placeholder={input.placeholder || ''}
                              meta={{
                                dirty: formValue[input.name] && errorValue[input.name] !== true,
                                invalid: true,
                              }}
                              modal={null}
                              message={{
                                help: null,
                                error: errorValue[input.name],
                              }}
                              minLenghtNum={input.minLenghtNum || null}
                              maxLengthNum={input.maxLenghtNum || null}
                            />
                            {
                              input.unit && (
                                <span className="pl-2">{input.unit}</span>
                              )
                            }
                          </div>
                        </div>
                      )
                    }
                    <p className="body2">{input.help}</p>
                  </div>
                ))
              }
            </div>
          ))
        }


        <hr />
        <hr />
        <hr />
        <hr />

        <div className="input-sheet-main pt-5 pb-5 pl-4 pr-4">

          { /* SECTION: ADDRESS */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Address</h2>
            <div className="col-md-5 p-md-0">
              <Maps
                showSearchLocation
                inputLabel="What's the exact address of the property?"
              />
            </div>
          </div>

          { /* SECTION: PROPERTY */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Property</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="properties.propertyType"
                label="Property Type"
                component={BrixelRadioButton}
                options={factsOptions.propertyType}
                deactivable={false}
              />
              {
                formValue.properties && formValue.properties.propertyType === 'House' && (
                  <Field
                    className="mb-2"
                    name="properties.building.typeHouseCode"
                    label="What's the type of the house?"
                    component={BrixelRadioButton}
                    options={factsOptions.typeHouseCode}
                  />
                )
              }
              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <>
                    <Field
                      className="mb-2"
                      name="properties.building.typeFlatBuildingCode"
                      label="What's the type of the building?"
                      component={BrixelRadioButton}
                      options={factsOptions.typeFlatBuildingCode}
                    />
                    <Field
                      className="mb-2"
                      name="properties.building.typeFlatCode"
                      label="What's the type of the apartment?"
                      component={BrixelRadioButton}
                      options={factsOptions.typeFlatCode}
                    />
                  </>
                )
              }
              <Field
                className="mb-2"
                name="properties.building.built"
                label="What's the construction year?"
                placeholder="YYYY (ex.: 2020)"
                component={BrixelInputText}
                type="number"
              />
              <Field
                className="mb-2"
                name="properties.building.quality"
                label="What's the building quality of the whole building?"
                component={BrixelInputScale}
                options={factsOptions.quality}
                modal={{
                  message: 'Know more about building quality',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Building quality',
                    body: 'With this variable, the basic structure independent of its current condition is assessed. Pay attention to following points: the modes of construction; the quality of the materials used in construction, insulation, glazing; the kitchen and bath furnishing; the quality of outdoor and environment design; the quality of the plan (floor plan, lighting conditions, access to rooms etc.); quality of heatgeneration and distribution.' +
                          'Exceptional quality: Very good noise insulation (within the building and from outside); heat insulation surpasses common standard; no problems with humidity or airtightness; very good indoor climate; ideal room layout with developable reserves; superior kitchen and sanitation; particular construction parts can easily be replaced; very good room proportions; versatile view from within and from outside; many green areas with exquisite planting and generous seating areas.' +
                          'Good quality: Good noise insulation (within the building and from outside); heat insulation fulfill current standard; no problems with humidity or airtightness; good indoor climate; good room layout; contemporary kitchen and sanitation; particular construction parts can be replaced with little effort; good room proportions; good view from within and from outside; many green areas with harmonic planting and generous seating areas.' +
                          'Fair quality: Noise insulation (within the building and from outside) with small defects; sufficient heat insulation; small problems with humidity or airtightness; sufficient indoor climate; fair room layout; obsolete but fully working kitchen and sanitation; particular construction parts can only be replaced with some effort; no architectural attractiveness; marginal view from within and from outside; appropriate green areas with ordinary planting and seating areas.' +
                          'Poor quality: Noise insulation with defects; heat insulation is below average and not fulfilling current standard; obvious problems with humidity or airtightness; insufficient indoor climate; insufficient room layout; obsolete kitchen and sanitation with small defects; particular construction parts can only be replaced with much effort; missing architectural attractiveness; no view from within and from outside; litle green areas and seating areas.',
                  }),
                }}
              />

              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <Field
                    className="mb-2"
                    name="properties.typology.numberOfFlats"
                    label="How many apartments are there in the whole building?"
                    component={BrixelInputStepNumber}
                    step={1}
                  />
                )
              }
              <Field
                className="mb-2"
                name="properties.building.isPropertyRenovated"
                label="Is the property renovated?"
                component={BrixelRadioButton}
                options={factsOptions.isPropertyRenovatedOptions}
                modal={{
                  message: 'Know more about renovations',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Renovations',
                    body: 'If a major renovation of the object has taken place, please enter the corresponding year.' +
                          'A major renovation is defined as work on the whole building. This includes the facade (heat insulation, windows), new heating, kitchen or bathroom. All investments within 3-5 years can be combined.' +
                          'In order to be considered as a major renovation at least 15-20% of the building insurance value has to be reinvested.',
                  }),
                }}
              />
              <Field
                className="mb-2"
                name="properties.building.renovated"
                label="If yes, when was the property last time renovated?"
                placeholder="YYYY (ex.: 2020)"
                component={BrixelInputText}
                type="number"
              />
              <Field
                className="mb-2"
                name="description.investment"
                label="What has been renovated?"
                component={BrixelTextArea}
              />
              <Field
                className="mb-2"
                name="properties.building.isNeedRenovation"
                label="Are there some major renovation works needed within the next years?"
                component={BrixelRadioButton}
                options={factsOptions.yesNoOpt}
              />
              <Field
                className="mb-2"
                name="description.needRenovation"
                label="What renovation works are needed within the next years?"
                placeholder="Ex.: Ceilings, etc."
                component={BrixelTextArea}
              />
              <Field
                className="mb-2"
                name="properties.building.conditionCode"
                label="In which condition is the property?"
                component={BrixelInputScale}
                options={factsOptions.quality}
                modal={{
                  message: 'Know more about property condition',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Building quality',
                    body: 'To assess the condition of a building, consider the building shell (facade, windows, roof), the supporting structure, the general technical systems (heating, sanitation, principal electrical distribution, ventilation system, elevator) and the expansion of general surfaces (cellar rooms, washrooms and drying rooms, staircases etc.).' +
                          'Exceptional quality: Everything is as good as new and fully working. The building is maximal 5 years old or is completely renovated within the last 3 years.' +
                          'Good quality: Everything is fully working but show traces of use. The building is 5-15 years old or is completely renovated within the last 3-10 years.' +
                          'Fair quality: Everything is already used and show clear traces of use and wear with small functional defects. The building is 15-30 years old or is completely renovated within the last 10-25 years. Partial replacement is needed.' +
                          'Poor quality: Everything is already used and show clear traces of use with some parts having defects or not working anymore. The building is more than 30 years old or is completely renovated more than 25 years ago. Complete replacement is needed.',
                  }),
                }}
              />
              <Field
                className="mb-2"
                name="properties.typology.numberOfFloors"
                label="How many floors does the building have?"
                component={BrixelInputStepNumber}
                step={1}
              />
              <Field
                className="mb-2"
                name="properties.typology.livingArea.value"
                label="What's the net living space of the property?"
                component={BrixelInputText}
                type="number"
              />
              {
                formValue.properties && formValue.properties.propertyType === 'House' && (
                  <>
                    <Field
                      className="mb-2"
                      name="properties.typology.lotArea.value"
                      label="What's the lot size?"
                      component={BrixelInputText}
                      type="number"
                    />
                    <Field
                      className="mb-2"
                      name="properties.typology.constructedVolume.value"
                      label="What's the house volume?"
                      modal={{
                        message: 'Know more about volume here',
                        func: () => handleSetModal({
                          state: true,
                          title: 'Volume',
                          body: '<span>The volume of the building must also include the volume of the garage(s). Note that the volume of underground parking has to be included in the total volume of investment properties only.' +
                                'Enter the volume in m³. You can find the value in your buildings insurance.</span>',
                        }),
                      }}
                      component={BrixelInputText}
                      type="number"
                    />
                    <Field
                      className="mb-2"
                      name="properties.typology.constructedVolumeCode"
                      label="What's the volume standard?"
                      modal={{
                        message: 'Know more about volume standard here',
                        func: () => handleSetModal({
                          state: true,
                          title: 'Volume standard',
                          body: 'Define the corresponding volume norm that is used to calculate your volume.' +
                                'Please be aware that the price can differ a lot depending on the correct norm. You can find this information in your buildings insurance.',
                        }),
                      }}
                      component={BrixelRadioButton}
                      options={factsOptions.constructedVolumeCode}
                    />
                  </>
                )
              }
              <Field
                className="mb-2"
                name="properties.typology.bedrooms"
                label="How many rooms does the property have?"
                component={BrixelInputStepNumber}
                step={0.5}
              />
              <Field
                className="mb-2"
                name="properties.typology.bathrooms"
                label="How many bathrooms does the property have?"
                component={BrixelInputStepNumber}
                step={1}
              />
              <Field
                className="mb-2"
                name="properties.typology.separateToilets"
                label="How many separate toilets does the property have?"
                component={BrixelInputStepNumber}
                step={1}
              />
              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <Field
                    className="mb-2"
                    name="properties.building.multiStoreyApartment"
                    label="Does the apartment have multiple floors?"
                    component={BrixelRadioButton}
                    options={factsOptions.multiStoreyApartmentOptions}
                  />
                )
              }
              <Field
                className="mb-2"
                name="properties.typology.balconyArea.value"
                label="What's the surface of the balcony?"
                component={BrixelInputText}
                type="number"
                message={{ help: 'Please enter "0" if there is no balcony' }}
              />
              <Field
                className="mb-2"
                name="properties.typology.gardenArea.value"
                label="What's the size of the garden?"
                component={BrixelInputText}
                type="number"
                message={{ help: 'Please enter "0" if there is no garden' }}
              />
              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <>
                    <Field
                      className="mb-2"
                      name="properties.typology.floorNumber"
                      label="On which floor is the apartment's entrance?"
                      component={BrixelInputStepNumber}
                      step={1}
                    />
                    <Field
                      className="mb-2"
                      name="properties.building.qualityWithinBuilding"
                      label="What's the location quality of your apartment compared to the other ones in the building?"
                      component={BrixelInputQuality}
                      options={factsOptions.quality}
                      modal={{
                        message: 'Know more about apartment quality within building here',
                        func: () => handleSetModal({
                          state: true,
                          title: 'Apartment quality within building',
                          body: 'The quality within the building assesses the pros and cons of a specific apartment compared to the rest of the building. For example, if all apartments are heading to the main street, no apartment has a specific disadvantage. If there are some apartments heading to the quiet backyard, these apartments have a unique advantage compared to the other ones.' +
                                'The most important criteria are the location in the building (floor), the orientation (view) and solar radiation, the number of adjacent apartments and exterior walls, the noise exposure (internally and from outside), access to elevator (if existing) and the number of apartments at the staircase.' +
                                'Exceptional location: The apartment is the best one in the building with a unique advantages (e.g. bedroom heading to the quite side, three exterior walls etc.).' +
                                'Good location: The apartment is one of the more attractive ones in the building (e.g. much solar radiation, two exterior walls but with bedroom heading to the main street).' +
                                'Fair location: The apartment is one of the less attractive ones in the building (e.g. is located between other apartments and the staircase, morning sun only but with bedroom heading to the quiet side). ' +
                                'Poor location: The apartment is one of the least attractive ones in the building, probably with some specific disadvantages (e.g. bedroom beside the garage entrance, no solar radiation etc.).',
                        }),
                      }}
                    />
                    <Field
                      className="mb-2"
                      name="properties.building.apartmentQuality"
                      label="In which condition is the apartment?"
                      component={BrixelInputQuality}
                      options={factsOptions.quality}
                      modal={{
                        message: 'Know more about apartment condition here',
                        func: () => handleSetModal({
                          state: true,
                          title: 'Apartment condition',
                          body: 'Please consider the condition of kitchen, bathrooms, living rooms, bedrooms, the linings, walls and ceilings for the assessment.' +
                                'Exceptional condition: Everything is as good as new and working. All construction parts are maximal 4 years old or are renovated within the last 3 years.' +
                                'Good condition: Everything is perfectly working but show traces of use. All construction parts are 4-10 years old or are renovated within the last 3-8 years.' +
                                'Fair condition: Everything is already used and show clear traces of use with some parts having minor defects. All construction parts are 10-25 years old or are renovated within the last 8-20 years.' +
                                'Poor condition: Everything is already used with clear traces of use and some parts having defects or not working anymore. All construction parts are more than 25 years old and are not renovated within the last 20 years.',
                        }),
                      }}
                    />
                  </>
                )
              }
              <Field
                className="mb-2"
                name="properties.typology.qualityAmenities"
                label="How good are the property's amenities?"
                component={BrixelInputScale}
                options={factsOptions.amentitiesQuality}
              />
              <Field
                name="properties.building.secondaryResidence"
                label="Is the property a holiday home?"
                component={BrixelRadioButton}
                options={factsOptions.secondaryResidenceOptions}
                modal={{
                  message: 'Know more about holiday home here',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Holiday home',
                    body: 'A holiday home is not used as the main residence. If you have a holiday home in a non-touristic area,' +
                          'the precision of the valuation is slightly lower due to the limited number of comparable objects.',
                  }),
                }}
              />
            </div>
          </div>

          { /* SECTION: SECONDARY ROOMS */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Secondary Rooms</h2>
            <div className="col-md-5 p-md-0">
              {
                formValue.properties && formValue.properties.propertyType === 'House' && (
                  <Field
                    className="mb-2"
                    name="properties.building.expandableAttic"
                    label="Is the attic expandable?"
                    component={BrixelRadioButton}
                    options={factsOptions.expandableAttic}
                    message={{ help: 'Please answer "no" if it is not permitted to expand the attic (e.g. flat roof, exceeding of utilization factor).' }}
                  />
                )
              }
              <Field
                className="mb-2"
                name="properties.building.expandableAtticArea.value"
                label="What's the size of the attic?"
                component={BrixelInputText}
                type="number"
                message={{ help: 'Please enter "0" if there is no attic.' }}
              />
              <Field
                className="mb-2"
                name="properties.typology.basement"
                label="Is there a basement?"
                component={BrixelRadioButton}
                options={factsOptions.basementOptions}
              />
              <Field
                className="mb-2"
                name="properties.typology.basementArea.value"
                label="What's the size of the basement?"
                component={BrixelInputText}
                type="number"
                message={{ help: 'Please enter "0" if there is no separate basement.' }}
              />
              <Field
                className="mb-2"
                name="properties.building.properties.typology.storeroom"
                label="Is there a storeroom?"
                component={BrixelRadioButton}
                options={factsOptions.yesNoOpt}
              />
              <Field
                className="mb-2"
                name="properties.building.properties.typology.storeroomArea.value"
                label="What's the size of the storeroom?"
                component={BrixelInputText}
                type="number"
                message={{ help: 'Please enter "0" if there is no separate storeroom.' }}
              />
              <Field
                className="mb-2"
                name="properties.typology.collectiveSpaces"
                label="Is there some other collective used spaces?"
                component={BrixelRadioButton}
                options={factsOptions.yesNoOpt}
              />
              <Field
                name="properties.typology.collectiveSpacesArea.value"
                label="What's the size of collective used spaces?"
                component={BrixelInputText}
                type="number"
                message={{ help: 'Please enter keywords and a short description.' }}
              />
            </div>
          </div>

          { /* SECTION: PARKING */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Parking</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="properties.parking.garage"
                label="How many external parking lots belong to the property?"
                component={BrixelInputStepNumber}
                step={1}
              />
              <Field
                className="mb-2"
                name="properties.parking.garagePrice"
                label="Price pergarage parking lot"
                component={BrixelInputText}
                type="number"
              />
              <Field
                className="mb-2"
                name="properties.parking.outside"
                label="How many garage parking lots belong to the property?"
                component={BrixelInputStepNumber}
                step={1}
              />
              <Field
                className="mb-2"
                name="properties.parking.outsidePrice"
                label="Price for extrenal parking lot"
                component={BrixelInputText}
                type="number"
              />
              <Field
                className="mb-2"
                name="properties.parking.underground"
                label="How many underground parking lots belong to the property?"
                component={BrixelInputStepNumber}
                step={1}
              />
              <Field
                name="properties.parking.undergroundPrice"
                label="Price per underground parking lot"
                component={BrixelInputText}
                type="number"
              />
            </div>
          </div>

          { /* SECTION: EXTRA FEATURES */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Extra Features</h2>
            <div className="col-md-5 p-md-0">
              <Field name="properties.extraFeatures" label="Extra Features" component={BrixelExtraFeature} options={factsOptions.extraFeature} />
            </div>
          </div>

          { /* SECTION: FACILITIES & MATERIALS */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Facilities & Materials</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="properties.energy.heating"
                label="What's the heating system?"
                component={BrixelCheckbox}
                options={factsOptions.heating}
              />
              <Field
                className="mb-2"
                name="properties.energy.solar"
                label="Is there a solar plant?"
                component={BrixelRadioButton}
                options={factsOptions.solarOptions}
                modal={{
                  message: 'Know more about solar plants here',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Solar plant',
                    body: 'Solar plants are installed photovoltaic system or integrated photovoltaic systems.',
                  }),
                }}
              />
              <Field
                className="mb-2"
                name="properties.energy.ac"
                label="Is there an air conditioner?"
                component={BrixelRadioButton}
                options={factsOptions.acOptions}
              />
              <Field
                className="mb-2"
                name="properties.building.windows.insulation"
                label="Is there a window insulation?"
                component={BrixelRadioButton}
                options={factsOptions.windowsInsulationOptions}
              />
              <Field
                className="mb-2"
                name="properties.building.windows.materials"
                label="What is the material of the windows?"
                component={BrixelCheckbox}
                options={factsOptions.windows}
              />
              <Field
                className="mb-2"
                name="properties.building.blinds.materials"
                label="What's the material of the blinds?"
                component={BrixelTextArea}
              />
              <Field
                className="mb-2"
                name="properties.building.floors.materials"
                label="What's the material of the floors?"
                component={BrixelTextArea}
                message={{ help: 'Please note the rooms and materials as keywords.' }}
              />
              <Field
                className="mb-2"
                name="properties.building.kitchen.materials"
                label="What's the equipment and materials in the kitchen?"
                component={BrixelTextArea}
                modal={{
                  message: 'Know more about kitchen materials here',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Kitchen materials',
                    body: 'Please try to answer as accurate as possible to be used in the selling brochure.' +
                          'This includes the material of the floor and covers as well as type and brand of all kitchen equipments such as cooktops, fridge and dishwasher.',
                  }),
                }}
              />
              <Field
                name="properties.building.bathrooms.materials"
                label="What's the equipments and materials in the bathrooms?"
                component={BrixelTextArea}
                modal={{
                  message: 'Know more about bathroom materials here',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Bathroom materials',
                    body: 'Please try to answer as accurate as possible to be used in the selling brochure. This includes the material of the floor and covers as well as the sink or the shower.',
                  }),
                }}
              />
            </div>
          </div>


          { /* SECTION: LAND REGISTER */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Land Register</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="properties.building.landRegister.owner"
                label="Who's the current owner of the property?"
                component={BrixelInputText}
              />
              <Field
                className="mb-2"
                name="properties.building.landRegister.contact"
                label="What are the seller's contact data?"
                component={BrixelTextArea}
                message={{ help: 'Please enter the full name, phone number and e-mail address.' }}
              />
              <Field
                className="mb-2"
                name="properties.building.landRegister.cadaster"
                label="What's the cadaster nr. of the property?"
                component={BrixelInputText}
                type="text"
              />
              <Field
                className="mb-2"
                name="properties.building.landRegister.propertyIndex"
                label="What's the index nr. of the property?"
                component={BrixelInputText}
                type="text"
              />
              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <Field
                    className="mb-2"
                    name="properties.typology.officialApartmentNumber"
                    label="What's the official apartment nr.?"
                    component={BrixelInputText}
                    type="text"
                  />
                )
              }
              <Field
                className="mb-2"
                name="properties.building.valueRelevantServitude"
                label="Is there a value-relevant building right or servitude on the property?"
                component={BrixelRadioButton}
                options={factsOptions.valueRelevantServitudeOptions}
              />
              <Field
                name="properties.building.rightsAndServitudes"
                label="Which?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'If yes, please describe in keywords.' }}
              />
            </div>
          </div>

          { /* SECTION: FINANCIAL INFORMATION */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Financial Information</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="properties.building.maintenanceCost"
                label="What are the additional costs per year?"
                component={BrixelInputText}
                type="text"
              />
              <Field
                className="mb-2"
                name="price.financial.additionalCosts"
                label="How are these additional costs calculated?"
                component={BrixelInputText}
                type="number"
              />
              <Field
                className="mb-2"
                name="price.notional"
                label="What's the current notional rental value?"
                component={BrixelInputText}
                type="text"
              />
              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <>
                    <Field
                      className="mb-2"
                      name="properties.building.renewalTotalAmount.value"
                      label="What's the total amount of the renewal funds?"
                      component={BrixelInputText}
                      type="number"
                    />
                    <Field
                      className="mb-2"
                      name="properties.building.renewalOwnerAmount.value"
                      label="What's the owner's amount of the renewal funds?"
                      component={BrixelInputText}
                      type="number"
                    />
                    <Field
                      className="mb-2"
                      name="properties.building.ownershipPermil"
                      label="What's the owner's share of the co-ownership?"
                      component={BrixelInputText}
                      type="number"
                      message={{ help: 'Please enter the share per mill (‰).' }}
                    />
                    <Field
                      name="properties.building.condominiumOwners"
                      label="How many condominium owners are there?"
                      component={BrixelInputText}
                      type="number"
                    />
                  </>
                )
              }
              <Field
                className="mb-2"
                name="properties.building.mortgage"
                label="Mortgage Type"
                component={BrixelRadioButton}
                options={factsOptions.mortgage}
                message={{ help: 'Select type of mortgage' }}
              />
              <Field
                name="properties.building.mortgageEnd"
                label="When does the mortgage end?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'If Mortgage Type is fixed insert the end of Mortgage' }}
              />
            </div>
          </div>

          { /* SECTION: DESCRIPTION */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Description</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="description.highlight"
                label="What are the highlights of the property?"
                component={BrixelTextArea}
              />
              <Field
                className="mb-2"
                name="description.location"
                label="What is special about the location of the property?"
                component={BrixelTextArea}
              />
              <Field
                className="mb-2"
                name="description.roomLayout"
                label="Room layout"
                component={BrixelTextArea}
              />
              <Field
                name="description.neighborsRelationship"
                label="How's the relationship with the neighbors?"
                component={BrixelTextArea}
              />
            </div>
          </div>

          { /* SECTION: SURROUNDINGS & DISTANCES */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Surroundings & distances</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="location.distances.publicTransport"
                label="What's the distance to the next public transport stop?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
              <Field
                className="mb-2"
                name="location.distances.shopping"
                label="What's the distance to the next grocery?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
              <Field
                className="mb-2"
                name="location.distances.highway"
                label="What's the distance to the next highway?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
              <Field
                className="mb-2"
                name="location.distances.kindergarten"
                label="What's the distance to the next kindergarten?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
              <Field
                className="mb-2"
                name="location.distances.primarySchool"
                label="What's the distance to the next primary school?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
              <Field
                className="mb-2"
                name="location.distances.highSchool"
                label="What's the distance to the next high school?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
              <Field
                className="mb-2"
                name="location.distances.nature"
                label="What's the distance to the next recreation area?"
                component={BrixelInputText}
                type="text"
                message={{ help: 'Please enter the distance in meters.' }}
              />
            </div>
          </div>

          { /* SECTION: SALES STRATEGY & PRICE */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Sales stragey & price</h2>
            <div className="col-md-5 p-md-0">
              <Field
                className="mb-2"
                name="properties.typology.availability"
                label="Availability of sale"
                component={BrixelRadioButton}
                options={factsOptions.availability}
              />
              {
                formValue.properties && formValue.properties.typology && formValue.properties.typology.availability === 'other' && (
                  <Field
                    className="mb-2"
                    name="properties.typology.availabilityText"
                    label="What's the preferred time of sale?"
                    component={BrixelInputText}
                    type="text"
                  />
                )
              }
              <Field
                className="mb-2"
                name="properties.salesStrategy.reasonToSell"
                label="What's the reason to sell?"
                component={BrixelInputText}
              />
              <Field
                className="mb-2"
                name="properties.salesStrategy.criteriaBuyers"
                label="Are there some special selection criteria for the potential buyers?"
                component={BrixelInputText}
              />
              <Field
                className="mb-2"
                name="properties.salesStrategy.processShowing"
                label="How do you want to process the showings?"
                component={BrixelInputText}
                message={{ help: 'Please tell us how you want to coordinate the dates and if there are any fixed blocks.' }}
              />
              <Field
                className="mb-2"
                name="price.currency"
                label="Currency"
                component={BrixelSelect}
                options={factsOptions.currency}
              />
              <Field
                className="mb-2"
                name="price.total"
                label="What is the selling price of the property?"
                component={BrixelInputText}
                type="number"
                modal={{
                  message: 'Know more about the price here',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Property price',
                    body: 'The selling price usually covers the price for the property, for all parkings and the transfer of any renewal funds.',
                  }),
                }}
              />
              <Field
                className="mb-2"
                name="properties.salesStrategy.feesSplit"
                label="How do you want to split the fees?"
                component={BrixelInputText}
                modal={{
                  message: 'Know more about split fees here',
                  func: () => handleSetModal({
                    state: true,
                    title: 'Split fees',
                    body: 'This usually includes the fees for the notary, the land register and taxes.',
                  }),
                }}
              />
              <Field
                className="mb-2"
                name="properties.salesStrategy.offersConditions"
                label="Conditions for the offers and negotiation?"
                component={BrixelInputText}
              />
              <Field
                name="properties.salesStrategy.supportContract"
                label="Support for the contract and notary?"
                component={BrixelInputText}
              />
            </div>
          </div>

          { /* SECTION: DOCUMENTS */ }
          <div className="input-sheet-tab p-md-3 mb-5">
            <h2 className="mb-3">Documents</h2>
            <div className="col-md-12 p-md-0">
              <p>Upload extract from the land register</p>
              <p>Upload building insurance policy</p>
              <p>Upload former estimation</p>
              <p>Upload floor plans</p>
              <p>Upload other documents</p>
              <p>PUBLIC/PRIVATE DOCUMENTS?</p>
              {
                formValue.properties && formValue.properties.propertyType === 'Apartment' && (
                  <span>Upload condominium reglement</span>
                )
              }
              <div className="pos-r document-container mt-3">

                <div className={`${documents && documents.length > 0 ? 'dis-fl-row' : 'dis-fl-col empty-state a-c'}`}>
                  {
                    (documents && documents.length > 0) ? (
                      <>
                        <input type="file" name="document" onChange={(e) => loadFile(e)} />
                        <span>Upload Document (.pdf)</span>
                        <h5>Max. file size 15MB</h5>
                        {
                          documents.map((doc, i) => (
                            <li key={i.toString()} className="dis-f">
                              {doc.name}

                              <Field name={`documents[${i}].tags`} label="New tag" className="mb-3" component={BrixelTags} />

                              <BrixelButtonPrimary
                                color="red"
                                label="Remove"
                                onClick={(e) => deleteDocs(e, doc.id)}
                              />
                            </li>
                          ))
                        }
                      </>
                    ) : ( // Empty state
                      <>
                        <div className="upload-container dis-fl-col a-c mb-5 max-w-fix-600 max-h-fix-400 p-8">
                          <BrixelIcon
                            icon="document"
                          />
                          <h3>Upload Documents</h3>
                          <input type="file" name="document" onChange={(e) => loadFile(e)} />
                          <span>Upload Document (.pdf)</span>
                          <h5>Max. file size 15MB</h5>
                        </div>
                        <h4>(Upload files such as Selling Brochures, Floorplans, Contracts, etc.)</h4>
                        <p>
                          <span>No documents have been added yet.</span>
                        </p>
                        <p>
                          <span>Documents will be shown on your Page and anyone will be able to download them.</span>
                        </p>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

InputSheet.propTypes = {
  isLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  singleUserPropertyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUserActiveProperty: PropTypes.func.isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  // handleDeleteDocument: PropTypes.func.isRequired,
  // handleUploadDocument: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  // setPreventExit: PropTypes.func.isRequired,
  // setUnsavedModal: PropTypes.func.isRequired,
  isUnsavedChangesModal: PropTypes.object,
};

InputSheet.defaultProps = {
  isUnsavedChangesModal: {},
  isLoading: false,
};

const InputSheetForm = reduxForm({
  // a unique name for the form
  form: 'InputSheet',
  enableReinitialize: true,
})(InputSheet);

const mapStateToProps = (state) => {
  const formValue = get(state, 'property.singleUserActiveProperty', {});
  if (formValue.price) {
    delete formValue.history;
    delete formValue.owner;
    delete formValue.price.history;
  }
  return ({
    errorValue: get(state, 'form.InputSheet.syncErrors', {}),
    formValue: get(state, 'form.InputSheet.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    activeSingleUser: get(state, 'user.activeSingleUser', {}),
    singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
    notification: get(state, 'common.notification', {}),
    initialValues: get(state, 'property.property', {}),
    loggedInUser: get(state, 'user.loggedUser', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('InputSheet', field, value));
  },
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  // getUser: bindActionCreators(getActiveSingleUser, dispatch),
  setUserActiveProperty: bindActionCreators(getProperty, dispatch),
  handleSaveProperty: bindActionCreators(updateProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setNotification: bindActionCreators(setNotification, dispatch),
  // setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(InputSheetForm);
