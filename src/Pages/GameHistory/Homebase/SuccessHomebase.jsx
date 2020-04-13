/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, BrixelButtonPrimary, BrixelButtonTertiary } from '@brixel/brixel-components';
import resumeApartment from '../../../images/BrxielComingTown/resumeApartement.svg';
import resumeHouse from '../../../images/BrxielComingTown/resumeHouse.svg';

function SuccessHomebase(props) {
  // PROPS
  const {
    formValue,
    history,
    match,
  } = props;
  // PARAMS URL
  const propID = get(match, 'params.propId', null);

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col jc-b a-c">
      <div className="dis-fl-col jc-c a-c">
        <div className="bgWhite brdRadius shadow-4dp ov-h">
          <img
            src={formValue.propertyType === 'Apartment' ? resumeApartment : resumeHouse}
            className="dis-b"
            alt={formValue.propertyType || 'Apartment'}
          />
          <div className="pt-1 pb-2 px-2">
            {
              formValue.location && (
                <p className="body2 cutRow txtPrimary400">
                  {formValue.location.address}
                </p>
              )
            }
            <h6 className="mt-1 mb-5">{formValue.title || 'Title'}</h6>
            <div className="dis-f jc-b a-c">
              <p className="dis-f a-c">
                <BrixelIcon icon="bed" className="mr-1" />
                <span className="ff-mono body2">{get(formValue, 'properties.typology.bedrooms','0')}</span>
              </p>
              <p className="dis-f a-c">
                <BrixelIcon icon="plans" className="mr-1" />
                <span className="ff-mono body2">{get(formValue, 'properties.typology.livingArea.value', '0')} m</span>
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
        <p className="mt-3 txtDark200 m-a ta-c">Great. Your property was created. Now you have the base to use Brixel.</p>
      </div>
      <div className="dis-f jc-c mt-3">
        <BrixelButtonPrimary
          rounded
          label="Edit property facts"
          rightIcon="arrow-right"
          onClick={() => history.push(`/${propID}/property/facts`)}
        />
      </div>
      <BrixelButtonTertiary
        label="Add new propety"
        onClick={() => history.push(`/packageFlow/getStarted`)}
      />
    </main>
  );
}

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
});

const mapDispatchToProps = (dispatch) => ({
});


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SuccessHomebase);
