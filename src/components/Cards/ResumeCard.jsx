import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonPrimary, BrixelIcon, FormatValue } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// property thumb
import resumeHouse from '../../images/BrxielComingTown/resumeHouse.svg';
import resumeApartment from '../../images/BrxielComingTown/resumeApartement.svg';
import resumeLand from '../../images/BrxielComingTown/resumeLand.svg';
import resumeCommercial from '../../images/BrxielComingTown/resumeCommercial.svg';

// COMPONENT USED ON ONBOARDING TO SHOW THE PREVIEW OF CREATED PROPERTY
const ResumeCard = (props) => {
  // PROPS
  const {
    formValue,
    onClick,
    title,
    btnLabel,
  } = props;

  const defImg = () => {
    switch (get(formValue, 'properties.propertyType', null)) {
      case 'Apartment':
        return resumeApartment;
      case 'House':
        return resumeHouse;
      case 'Land':
        return resumeLand;
      case 'Commercial':
        return resumeCommercial;
      default:
        return resumeHouse;
    }
  };

  useEffect(() => {
    if (document) document.body.classList.add('flowResume');
    return () => {
      //  clean up
      if (document) document.body.classList.remove('flowResume');
    };
  }, []);

  return (
    <div className="dis-f flex-wrap w-perc-100 pt-4 pt-sm-10">
      <div className="w-perc-100 w-perc-sm-50 pr-sm-3">
        <div className="max-w-fix-400 ml-a mr-a mr-sm-0 pb-4">
          <h2
            className="fadeAnim px-2 px-sm-0 mb-0 mb-sm-5 fweight-600 txtWhite ta-c ta-l-sm"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div className="hide dis-b-sm">

            <div className="mt-5">
              <div className="dis-f mb-2 pos-r">
                <BrixelIcon className="tickIcon" icon="check" saturationTxt={300} color="green" />

                <p className="dis-b fweight-600 fsize-500 txtWhite">Get a free price indication</p>
              </div>
              <div className="dis-f mb-2 pos-r">
                <BrixelIcon className="tickIcon" icon="check" saturationTxt={300} color="green" />
                <p className="dis-b fweight-600 fsize-500 txtWhite">Prepare your property for sale</p>
              </div>
              <div className="dis-f mb-2 pos-r">
                <BrixelIcon className="tickIcon" icon="check" saturationTxt={300} color="green" />
                <p className="dis-b fweight-600 fsize-500 txtWhite"> Test drive our services</p>
              </div>
            </div>
            <BrixelButtonPrimary
              className="mt-4"
              rounded
              rightIcon="arrow-right-small"
              theme="red"
              label={btnLabel || 'Save'}
              onClick={() => onClick()}
            />
          </div>
        </div>
      </div>
      <div className="w-perc-100 w-perc-sm-50 pl-sm-3 px-2 px-sm-0">
        {/* Property Card */}
        <div className="scaleAnim bgWhite max-w-fix-352 mr-a ml-a ml-sm-0 brdRadius shadow-2dp ov-h">
          <img
            src={defImg()}
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
      <div className="hide-sm w-perc-100 dis-fl-col a-c">
        <div className="mt-5 pl-3 pr-2 mb-3">
          <div className="dis-f mb-2 pos-r">
            <BrixelIcon className="tickIcon" icon="check" saturationTxt={300} color="green" />

            <p className="dis-b fweight-600 fsize-500 txtWhite">Get a free price indication</p>
          </div>
          <div className="dis-f mb-2 pos-r">
            <BrixelIcon className="tickIcon" icon="check" saturationTxt={300} color="green" />
            <p className="dis-b fweight-600 fsize-500 txtWhite">Prepare your property for sale</p>
          </div>
          <div className="dis-f mb-2 pos-r">
            <BrixelIcon className="tickIcon" icon="check" saturationTxt={300} color="green" />
            <p className="dis-b fweight-600 fsize-500 txtWhite"> Test drive our services</p>
          </div>
        </div>
        <div className="w-perc-100 bgWhite py-5">

          <BrixelButtonPrimary
            className="ml-a mr-a"
            rounded
            rightIcon="arrow-right-small"
            theme="red"
            label={btnLabel || 'save'}
            onClick={() => onClick()}
          />
        </div>
      </div>
    </div>
  );
};

ResumeCard.propTypes = {
  formValue: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  btnLabel: PropTypes.string.isRequired,
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
