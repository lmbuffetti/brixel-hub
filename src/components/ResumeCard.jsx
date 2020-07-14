import React from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';

const ResumeCard = (props) => {
  // PROPS
  const {
    formValue,
    title,
  } = props;

  const defImg = get(formValue, 'properties.propertyType', null) === 'Apartment' ? resumeApartment : resumeHouse;

  return (
    <div>
      <div className="scaleAnim bgWhite max-w-fix-344 m-a brdRadius shadow-4dp ov-h">
        <img
          src={defImg}
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
          <h6 className="mt-1 mb-5">{formValue.pageTitle || 'Title'}</h6>
          <div className="dis-f jc-b a-c">
            <p className="dis-f a-c">
              <BrixelIcon icon="bed" className="mr-1" />
              <span className="ff-mono body2">{get(formValue, 'properties.typology.bedrooms', 0)}</span>
            </p>
            <p className="dis-f a-c">
              <BrixelIcon icon="plans" className="mr-1" />
              <span className="ff-mono body2">{get(formValue, 'properties.typology.livingArea.value', 0)} m</span>
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
      <h5
        className="fadeAnim mt-5 ta-c"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
};

ResumeCard.propTypes = {
  formValue: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.GetStarted.values', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ResumeCard);
