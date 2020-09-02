/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon, BrixelButtonPrimary, BrixelButtonTertiary } from '@brixel/brixel-components';
import CoverPropertyImage from '../../../components/CoverPropertyImage';

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
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      <div className="dis-fl-col jc-c a-c">
        <h5 className="max-w-fix-376 m-a ta-c">Great! Your property was created.</h5>
        <div className="bgWhite brdRadius shadow-4dp ov-h max-w-fix-280 w-perc-100 my-5">
          <div className="image-ratio">
            <CoverPropertyImage
              className="cover"
              coverPhoto={get(formValue, 'coverPhoto.path', undefined)}
              propertyType={get(formValue, 'properties.propertyType', undefined)}
            />
          </div>
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
                <span className="ff-mono body2">{get(formValue, 'properties.typology.bedrooms', '0')}</span>
              </p>
              <p className="dis-f a-c">
                <BrixelIcon icon="plans" className="mr-1" />
                {
                  get(formValue, 'location.countryCode', '') === 'PT' && get(formValue, 'properties.typology.grossArea.value', 0) > 0 ? (
                    <span className="ff-mono body2">{get(formValue, 'properties.typology.grossArea.value', '0')} m</span>
                  ) : (
                    <span className="ff-mono body2">{get(formValue, 'properties.typology.livingArea.value', '0')} m</span>
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
      <div className="dis-fl-col">
        <BrixelButtonPrimary
          rounded
          className="mb-2"
          label="Edit property facts"
          rightIcon="arrow-right"
          onClick={() => history.push(`/${propID}/property/facts`)}
        />
        <BrixelButtonTertiary
          label="Add new propety"
          onClick={() => history.push('/packageFlow/getStarted')}
        />
      </div>
    </main>
  );
}

SuccessHomebase.propTypes = {
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(SuccessHomebase);
