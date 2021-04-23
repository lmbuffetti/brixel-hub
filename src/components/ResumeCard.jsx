import React from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon, FormatValue } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';

// COMPONENT USED ON ONBOARDING TO SHOW THE PREVIEW OF CREATED PROPERTY
const ResumeCard = (props) => {
  // PROPS
  const {
    formValue,
    title,
  } = props;

  const defImg = get(formValue, 'properties.propertyType', null) === 'Apartment' ? resumeApartment : resumeHouse;

  return (
    <div className="dis-f w-perc-100 pt-10">
      <div className="flex-1 max-w-fix-400">
        <h2
          className="fadeAnim mb-5 fweight-600 txtWhite"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div className="mt-5">
          <div className="dis-f mb-1 pos-r">
            <BrixelIcon className="tickIcon" icon="check" saturationTxt="300" color="green" />
            <p className="dis-b fweight-600 fsize-500 txtWhite">Compare to your local market</p>
          </div>
          <div className="dis-f mb-1 pos-r">
            <BrixelIcon className="tickIcon" icon="check" saturationTxt="300" color="green" />
            <p className="dis-b fweight-600 fsize-500 txtWhite">Get free price indication</p>
          </div>
          <div className="dis-f mb-1 pos-r">
            <BrixelIcon className="tickIcon" icon="check" saturationTxt="300" color="green" />
            <p className="dis-b fweight-600 fsize-500 txtWhite">Simulate your sale for free</p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {/* Property Card */}
        <div className="scaleAnim bgWhite max-w-fix-344 m-a brdRadius shadow-4dp ov-h">
          <img
            src={defImg}
            className="dis-b"
            alt={formValue.propertyType || 'House'}
          />
          <div className="pt-1 pb-2 px-2">
            {
              formValue.location && (
                <p className="body2 cutRow txtPrimary400">
                  {formValue.location.address}
                </p>
              )
            }
            <h6 className="mt-1 mb-5">{formValue.pageTitle || 'Title'}</h6>
            <div className="dis-f jc-b a-c">
              <p className="dis-f a-c">
                <BrixelIcon icon="bed" className="mr-1" />
                <span className="ff-mono body2">{FormatValue.formatRooms(get(formValue, 'properties.typology.bedrooms', 0), get(formValue, 'location.countryCode', ''))}</span>
              </p>
              <p className="dis-f a-c">
                <BrixelIcon icon="plans" className="mr-1" />
                {
                  get(formValue, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                    <span className="ff-mono body2">{get(formValue, 'properties.typology.grossArea.value', 0)} m2</span>
                  ) : (
                    <span className="ff-mono body2">{get(formValue, 'properties.typology.livingArea.value', 0)} m2</span>
                  )
                }
              </p>
              <p className="dis-f a-c">
                <BrixelIcon icon="house-built" className="mr-1" />
                <span className="ff-mono body2">
                  {get(formValue, 'properties.building.built', '0000')}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ResumeCard.propTypes = {
  formValue: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.GetStarted.values', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ResumeCard);
