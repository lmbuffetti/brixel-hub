import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  BrixelExtraFeature, BrixelInputQuality, BrixelSelect,
  BrixelInputText, BrixelInputStepNumber, BrixelRadioButton,
  BrixelTextArea, BrixelCheckbox, BrixelInputScale, FactsOptions,
} from '@brixel/brixel-components';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import LoadingSimple from '../../components/LoadingSimple';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Facts = (props) => {
  // PROPS
  const { formValue, langConfig } = props;

  const { factsOptions } = FactsOptions;

  const formatPrice = (value) => {
    if (!value) return '';
    return Number(value).toLocaleString(langConfig.localString);
  };

  const normalizePrice = (value) => {
    if (value.length === 0) return '';
    return Number(value.replace(/\D/g, ''));
  };

  return (
    <>

      { /* SECTION: PROPERTY TYPE */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Property type</p>
        </div>
        <Field
          className="mb-2 col-md-8 p-md-0 dis-fl-row jc-b"
          inputClassName="w-perc-100"
          name="properties.propertyType"
          component={BrixelRadioButton}
          icons
          options={factsOptions.propertyType}
          deactivable={false}
        />
      </div>

      { /* SECTION: ADDRESS */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Address</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Maps
            className="mb-7"
            zoom={14}
            inputLabel="Search for address"
            scrollZoom
            moveMarker
            draggable
            showSearchLocation
            showMap
          />
          <span className="overline mb-3">Drag the marker to change the location</span>
          <div className="dis-fl-row p-md-0 jc-b">
            <Field
              className="col-md-5 p-md-0"
              name="location.streetNumber"
              label="Property door number"
              component={BrixelInputText}
            />
            <Field
              className="col-md-5 p-md-0"
              name="location.zip"
              label="ZIP code"
              component={BrixelInputText}
              type="number"
            />
          </div>
        </div>
      </div>

      { /* SECTION: PROPERTY */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Property</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          {
            formValue.properties && formValue.properties.propertyType === 'House' && (
              <Field
                className="mb-4 dis-fl-row"
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
                  className="mb-4"
                  name="properties.building.typeFlatBuildingCode"
                  label="What's the type of the building?"
                  component={BrixelRadioButton}
                  options={factsOptions.typeFlatBuildingCode}
                />
                <Field
                  className="mb-4"
                  name="properties.building.typeFlatCode"
                  label="What's the type of the apartment?"
                  component={BrixelRadioButton}
                  options={factsOptions.typeFlatCode}
                />
              </>
            )
          }
          <Field
            className="mb-4 w-fix-216"
            name="properties.building.built"
            label="What's the construction year?"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.building.quality"
            label="What's the building quality of the whole house?"
            component={BrixelInputScale}
            options={factsOptions.quality}
          />
          <div>
            <Field
              className="mb-2 col-md-6 p-md-0"
              name="properties.building.isPropertyRenovated"
              label="Is the property renovated?"
              component={BrixelRadioButton}
              options={factsOptions.isPropertyRenovatedOptions}
            />
            <Field
              className="mb-2 w-fix-280"
              name="properties.building.renovated"
              label="When was the property last renovated?"
              component={BrixelInputText}
              type="number"
            />
          </div>
          <Field
            className="mb-6 h-fix-184"
            name="description.investment"
            label="What has been renovated?"
            component={BrixelTextArea}
          />
          <Field
            className="mb-4"
            name="properties.building.isNeedRenovation"
            label="Are there some major renovation works needed within the next years?"
            component={BrixelRadioButton}
            options={factsOptions.yesNoOpt}
          />
          <Field
            className="mb-4"
            name="description.needRenovation"
            label="What renovation works are needed within the next years?"
            component={BrixelTextArea}
          />
          {
            formValue.properties && formValue.properties.propertyType === 'Apartment' && (
              <Field
                className="mb-4"
                name="properties.building.apartmentQuality"
                label="In which condition is the apartment?"
                component={BrixelInputScale}
                options={factsOptions.quality}
              />
            )
          }
          <Field
            className="mb-4"
            name="properties.building.conditionCode"
            label="In which condition is the property?"
            component={BrixelInputScale}
            options={factsOptions.quality}
          />
          {
            formValue.properties && formValue.properties.propertyType === 'House' && (
              <Field
                className="mb-4"
                name="properties.typology.numberOfHouseFloors"
                label="How many floors does the house have?"
                component={BrixelInputStepNumber}
                step={1}
              />
            )
          }
          {
            formValue.properties && formValue.properties.propertyType === 'Apartment' && (
              <>
                <Field
                  className="mb-4"
                  name="properties.typology.numberOfFlats"
                  label="Number of apartments in building"
                  component={BrixelInputStepNumber}
                  step={1}
                />
                <Field
                  className="mb-4"
                  name="properties.typology.numberOfFloors"
                  label="How many floors are there in the whole building?"
                  component={BrixelInputStepNumber}
                  step={1}
                />
              </>
            )
          }
          <Field
            className="mb-4"
            name="properties.typology.livingArea.value"
            label="What's the net living space of the property?"
            component={BrixelInputText}
            type="number"
          />
          {
            formValue.properties && formValue.properties.propertyType === 'House' && (
              <>
                <Field
                  className="mb-4"
                  name="properties.typology.lotArea.value"
                  label="What's the lot size? (m2)"
                  component={BrixelInputText}
                  type="number"
                />
                <Field
                  className="mb-4"
                  name="properties.typology.constructedVolume.value"
                  label="What's the house's volume? (m3)"
                  component={BrixelInputText}
                  type="number"
                />
                <Field
                  className="mb-4"
                  name="properties.typology.constructedVolumeCode"
                  label="What's the volume standard?"
                  component={BrixelRadioButton}
                  options={factsOptions.constructedVolumeCode}
                />
              </>
            )
          }
          <Field
            className="mb-4"
            name="properties.typology.bedrooms"
            label="How many rooms does the house have?"
            component={BrixelInputStepNumber}
            step={0.5}
          />
          <Field
            className="mb-4"
            name="properties.typology.bathrooms"
            label="How many bathrooms does the property have?"
            component={BrixelInputStepNumber}
            step={1}
          />
          <Field
            className="mb-4"
            name="properties.typology.separateToilets"
            label="How many separate toilets does the property have?"
            component={BrixelInputStepNumber}
            step={1}
          />
          {
            formValue.properties && formValue.properties.propertyType === 'Apartment' && (
              <Field
                className="mb-4"
                name="properties.building.multiStoreyApartment"
                label="Does the apartment have multiple floors?"
                component={BrixelRadioButton}
                options={factsOptions.multiStoreyApartmentOptions}
              />
            )
          }
          <Field
            className="mb-4"
            name="properties.typology.balconyArea.value"
            label="What's the surface of the balcony? (m2)"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.typology.gardenArea.value"
            label="What's the size of the garden? (m2)"
            component={BrixelInputText}
            type="number"
          />
          {
            formValue.properties && formValue.properties.propertyType === 'Apartment' && (
              <>
                <Field
                  className="mb-4"
                  name="properties.typology.floorNumber"
                  label="On which floor is the apartment's entrance?"
                  component={BrixelInputStepNumber}
                  step={1}
                />
                <Field
                  className="mb-4"
                  name="properties.building.qualityWithinBuilding"
                  label="What's the location quality of your apartment compared to the other ones in the building?"
                  component={BrixelInputScale}
                  options={factsOptions.qualityWithinBuilding}
                />
              </>
            )
          }
          <Field
            className="mb-4"
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
          />
        </div>
      </div>

      { /* SECTION: SECONDARY ROOMS */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Secondary rooms</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          {
            formValue.properties && formValue.properties.propertyType === 'House' && (
              <Field
                className="mb-4"
                name="properties.building.expandableAttic"
                label="Is the attic expandable?"
                component={BrixelRadioButton}
                options={factsOptions.expandableAttic}
              />
            )
          }
          <Field
            className="mb-4"
            name="properties.building.expandableAtticArea.value"
            label="What's the size of the attic?"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.typology.basement"
            label="Is there a basement?"
            component={BrixelRadioButton}
            options={factsOptions.basementOptions}
          />
          <Field
            className="mb-4"
            name="properties.typology.basementArea.value"
            label="What's the size of the basement? (m2)"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.building.properties.typology.storeroom"
            label="Is there a storeroom?"
            component={BrixelRadioButton}
            options={factsOptions.yesNoOpt}
          />
          <Field
            className="mb-4"
            name="properties.building.properties.typology.storeroomArea.value"
            label="What's the size of the storeroom?"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.typology.collectiveSpaces"
            label="Is there some other collective used spaces?"
            component={BrixelRadioButton}
            options={factsOptions.yesNoOpt}
          />
          <Field
            name="properties.typology.collectiveSpacesArea.value"
            label="What's the size of collective used spaces?"
            component={BrixelInputText}
            type="text"
          />
        </div>
      </div>

      { /* SECTION: PARKING */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Parking</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            className="mb-4"
            name="properties.parking.garage"
            label="How many external parking lots belong to the property?"
            component={BrixelInputStepNumber}
            step={1}
          />
          <Field
            className="mb-4"
            name="properties.parking.garagePrice"
            label="Price per garage parking lot"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.parking.outside"
            label="How many garage parking lots belong to the property?"
            component={BrixelInputStepNumber}
            step={1}
          />
          <Field
            className="mb-4"
            name="properties.parking.outsidePrice"
            label="Price per external parking lot"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
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

      { /* SECTION: EXTRA FEATURES */}
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Extra features</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            name="properties.extraFeatures"
            label="Extra features"
            component={BrixelExtraFeature}
            options={factsOptions.extraFeature}
          />
        </div>
      </div>

      { /* SECTION: FACILITES & MATERIALS */}
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Facilities & materials</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            className="mb-4"
            name="properties.energy.heating"
            label="What's the heating system?"
            component={BrixelCheckbox}
            options={factsOptions.heating}
          />
          {
            formValue.properties && formValue.properties.propertyType === 'House' && (
              <>
                <Field
                  className="mb-4"
                  name="properties.energy.boiler.capacity"
                  label="What's the boiler capacity?"
                  component={BrixelInputText}
                  type="number"
                />
                <Field
                  className="mb-4"
                  name="properties.energy.boiler.type"
                  label="What's the boiler type"
                  component={BrixelInputText}
                  type="text"
                />
              </>
            )
          }
          <Field
            className="mb-4"
            name="properties.energy.solar"
            label="Is there a solar plant?"
            component={BrixelRadioButton}
            options={factsOptions.solarOptions}
          />
          <Field
            className="mb-4"
            name="properties.energy.ac"
            label="Is there an air conditioner?"
            component={BrixelRadioButton}
            options={factsOptions.acOptions}
          />
          <Field
            className="mb-4"
            name="properties.building.windows.insulation"
            label="Is there a window insulation?"
            component={BrixelRadioButton}
            options={factsOptions.windowsInsulationOptions}
          />
          <Field
            className="mb-4"
            name="properties.building.windows.materials"
            label="What is the material of the windows?"
            component={BrixelCheckbox}
            options={factsOptions.windows}
          />
          <Field
            className="mb-4"
            name="properties.building.blinds.materials"
            label="What's the material of the blinds?"
            component={BrixelTextArea}
          />
          <Field
            className="mb-4"
            name="properties.energy.efficiency"
            label="What's the energy efficiency of the property?"
            component={BrixelInputQuality}
            options={factsOptions.energyEfficiencyOptions}
          />
          <Field
            className="mb-4"
            name="properties.energy.minergieCertified"
            label="Is the property Minergie certified?"
            component={BrixelRadioButton}
            options={factsOptions.minergieCertifiedOptions}
          />
          <Field
            className="mb-4"
            name="properties.building.floors.materials"
            label="What's the material of the floors?"
            component={BrixelTextArea}
          />
          <Field
            className="mb-4"
            name="properties.building.kitchen.materials"
            label="What's the equipment and materials in the kitchen?"
            component={BrixelTextArea}
          />
          <Field
            name="properties.building.bathrooms.materials"
            label="What's the equipments and materials in the bathrooms?"
            component={BrixelTextArea}
          />
        </div>
      </div>

      { /* SECTION: LAND REGISTER */}
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Land register</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            className="mb-4"
            name="properties.building.landRegister.owner"
            label="Who's the current owner of the house?"
            component={BrixelInputText}
          />
          <Field
            className="mb-4"
            name="properties.building.landRegister.contact"
            label="What are the seller's contact data?"
            component={BrixelInputText}
          />
          <Field
            className="mb-4"
            name="properties.building.landRegister.cadaster"
            label="What's the cadaster nr. of the property?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="properties.building.landRegister.propertyIndex"
            label="What's the property index nr. of the property?"
            component={BrixelInputText}
            type="text"
          />
          {
            formValue.properties && formValue.properties.propertyType === 'Apartment' && (
              <Field
                className="mb-4"
                name="properties.typology.officialApartmentNumber"
                label="What's the official apartment nr.?"
                component={BrixelInputText}
                type="text"
              />
            )
          }
          <Field
            className="mb-4"
            name="properties.building.valueRelevantServitude"
            label="Is there a value-relevant building right or servitude on the property?"
            component={BrixelRadioButton}
            options={factsOptions.valueRelevantServitudeOptions}
          />
          <Field
            name="properties.building.rightsAndServitudes"
            label="Describe the servitudes"
            component={BrixelInputText}
            type="text"
          />
        </div>
      </div>

      { /* SECTION: FINANCIAL INFORMATION */}
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Financial information</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            name="properties.building.maintenanceCost"
            className="mb-4"
            label="What are the additional costs per year?"
            component={BrixelInputText}
            type="text"
            format={formatPrice}
            normalize={normalizePrice}
          />
          <Field
            className="mb-4"
            name="price.financial.additionalCosts"
            label="How are these additional costs calculated?"
            component={BrixelInputText}

          />
          {
            formValue.properties && formValue.properties.propertyType === 'Apartment' && (
              <>
                <Field
                  className="mb-4"
                  name="properties.building.renewalTotalAmount.value"
                  label="What's the total amount of the renewal funds?"
                  component={BrixelInputText}
                  type="number"
                />
                <Field
                  className="mb-4"
                  name="properties.building.renewalOwnerAmount.value"
                  label="What's the owner's amount of the renewal funds?"
                  component={BrixelInputText}
                  type="number"
                />
                <Field
                  className="mb-4"
                  name="properties.building.ownershipPermil"
                  label="What's the owner's share of the co-ownership? (‰)"
                  component={BrixelInputText}
                  type="number"
                />
                <Field
                  className="mb-4"
                  name="properties.building.condominiumOwners"
                  label="How many condominium owners are there?"
                  component={BrixelInputText}
                  type="number"
                />
              </>
            )
          }
          <Field
            name="price.notional"
            className="mb-4"
            label="What's the current notional rental value?"
            component={BrixelInputText}
            type="text"
            format={formatPrice}
            normalize={normalizePrice}
          />
          <Field
            className="mb-4"
            name="properties.building.purchaseDate"
            label="When did you buy the property?"
            component={BrixelInputText}
            type="number"
          />
          <Field
            className="mb-4"
            name="properties.building.purchasePrice"
            label="For what price did you buy the property?"
            component={BrixelInputText}
            type="number"
          />
          <Field
            name="properties.building.mortgage"
            label="Mortgage type"
            className="mb-4"
            component={BrixelRadioButton}
            options={factsOptions.mortgage}
          />
          <Field
            name="properties.building.mortgageEnd"
            label="Mortgage End"
            component={BrixelInputText}
            type="text"
          />
        </div>
      </div>

      { /* SECTION: DESCRIPTION */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Description</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            className="mb-4"
            name="description.highlight"
            label="What are the highlights of the property?"
            component={BrixelTextArea}
          />
          <Field
            className="h-fix-md-264 mb-4"
            name="description.location"
            label="What is special about the location of the house?"
            placeholder="Here you can add a description about the location around the property."
            component={BrixelTextArea}
          />
          <Field
            className="mb-4"
            name="description.roomLayout"
            label="Room layout"
            component={BrixelTextArea}
          />
          <Field
            className="mb-4"
            name="description.neighborsRelationship"
            label="How's the relationship with the neighbors?"
            component={BrixelTextArea}
          />
          <Field
            className="mb-4"
            name="location.community.basisTaxation"
            label="What is the basis of taxation in your community?"
            component={BrixelInputText}
            type="text"
            placeholder="%"
          />
          <Field
            className="mb-4"
            name="location.community.population"
            label="How many people live in your community?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="location.community.altitude"
            label="What's the altitude of your community?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            name="location.community.area"
            label="How large is the are of your community?"
            component={BrixelInputText}
            type="text"
          />
        </div>
      </div>

      { /* SECTION: SURROUNDINGS & DISTANCES */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Surroundings & distances</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            className="mb-4"
            name="location.distances.publicTransport"
            label="What's the distance to the next public transport stop?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="location.distances.shopping"
            label="What's the distance to the next grocery?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="location.distances.highway"
            label="What's the distance to the next highway?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="location.distances.kindergarten"
            label="What's the distance to the next kindergarten?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="location.distances.primarySchool"
            label="What's the distance to the next primary school?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            className="mb-4"
            name="location.distances.highSchool"
            label="What's the distance to the next high school?"
            component={BrixelInputText}
            type="text"
          />
          <Field
            name="location.distances.nature"
            label="What's the distance to the next recreation area?"
            component={BrixelInputText}
            type="text"
          />
        </div>
      </div>

      { /* SECTION: SALES STRATEGY & PRICE */ }
      <div className="manager-facts-tab col-md-7 p-md-0 dis-fl-row mb-12">
        <div className="col-md-4 p-md-0 h-perc-100">
          <p className="section-title max-w-fix-144">Sales strategy & price</p>
        </div>
        <div className="dis-fl-col col-md-8 p-md-0 h-perc-100">
          <Field
            name="status"
            label="Status"
            className="dis-fl-row mb-4"
            component={BrixelRadioButton}
            options={factsOptions.propertyStatus}
          />
          <Field
            className="mb-4"
            name="properties.typology.availability"
            label="Availability of sale"
            component={BrixelRadioButton}
            options={factsOptions.availability}
          />
          {
            formValue.properties && formValue.properties.typology && formValue.properties.typology.availability === 'other' && (
              <Field
                className="mb-4"
                name="properties.typology.availabilityText"
                label="What's the preferred time of sale?"
                component={BrixelInputText}
                type="text"
              />
            )
          }
          <Field
            className="mb-4"
            name="properties.salesStrategy.reasonToSell"
            label="What's the reason to sell?"
            component={BrixelInputText}
          />
          <Field
            className="mb-4"
            name="properties.salesStrategy.criteriaBuyers"
            label="Are there some special selection criteria for the potential buyers?"
            component={BrixelInputText}
          />
          <Field
            className="mb-2"
            name="properties.salesStrategy.processShowing"
            label="How do you want to process the showings?"
            component={BrixelInputText}
          />
          <div className="wrapper dis-fl-row col-md-12 mb-4 p-md-0">
            <Field
              name="price.currency"
              label="Currency"
              className="mr-2 p-md-0 zIndex1"
              component={BrixelSelect}
              options={factsOptions.currency}
            />
            <Field
              name="price.total"
              label="What is the selling price of the house?"
              className="col-md-9 p-md-0"
              component={BrixelInputText}
              type="text"
              format={formatPrice}
              normalize={normalizePrice}
            />
          </div>
          <Field
            className="mb-4"
            name="properties.salesStrategy.feesSplit"
            label="How do you want to split the fees?"
            component={BrixelInputText}
          />
          <Field
            className="mb-4"
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

    </>
  );
};

Facts.propTypes = {
  formValue: PropTypes.object.isRequired,
  langConfig: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  langConfig: get(state, 'common.language', {}),
});

const mapDispatchToProps = () => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(Facts);
