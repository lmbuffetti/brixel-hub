import React from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary, BrixelIcon, FormatValue } from '@brixel/brixel-components';
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
    onClick,
    title,
  } = props;

  const defImg = get(formValue, 'properties.propertyType', null) === 'Apartment' ? resumeApartment : resumeHouse;

  return (
    <div className="dis-f flex-wrap w-perc-100 pt-10">
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
        <BrixelButtonPrimary
          label="TEST BTN"
          onClick={() => onClick()}
        />
      </div>
      <div className="flex-1">
        {/* Property Card */}
        <div className="scaleAnim bgWhite max-w-fix-352 m-a brdRadius shadow-3dp ov-h">
          <img
            src={defImg}
            className="dis-b w-perc-100"
            alt={formValue.propertyType || 'House'}
          />
          <div className="pt-2 pb-2 px-2">
            {
              formValue.location && (
                <p className="cutRow txtDark200">
                  {formValue.location.address}
                </p>
              )
            }
            <h6 className="mt-1 mb-4 fweight-600 fsize-600"> {formValue.pageTitle || 'Title'}</h6>
            <div className="dis-f jc-b a-c">
              <p className="dis-fl-col">
                <span className="txtDark200 fsize-300">
                  {get(formValue, 'location.countryCode', 'CH') === 'PT' ? 'Typology' : 'Rooms'}
                </span>
                <span className="ff-mono txtDark700">{FormatValue.formatRooms(get(formValue, 'properties.typology.bedrooms', 0), get(formValue, 'location.countryCode', ''))}</span>
              </p>
              <p className="dis-fl-col">
                <span className="txtDark200 fsize-300"> Living area </span>
                {
                  get(formValue, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                    <span className="ff-mono txtDark700">{get(formValue, 'properties.typology.grossArea.value', 0)} m2</span>
                  ) : (
                    <span className="ff-mono txtDark700">{get(formValue, 'properties.typology.livingArea.value', 0)} m2</span>
                  )
                }
              </p>
              <p className="dis-fl-col">
                <span className="txtDark200 fsize-300"> Year built </span>
                <span className="ff-mono txtDark700">
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
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

ResumeCard.defaultProps = {
  onClick: () => '',
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.GetStarted.values', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ResumeCard);
