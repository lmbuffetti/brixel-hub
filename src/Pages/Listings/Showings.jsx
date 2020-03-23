/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonTertiary, BrixelTabs,
  BrixelTimeSlots,
} from '@brixel/brixel-components';
import {
  savePropertyVisitSchedule, createPropertyVisitSchedule,
} from '../../actions/PropertyActions';

const Showings = (props) => {
  const {
    history,
    formValue,
    handleSavePropertyVisitSchedule,
    handleCreatePropertyVisitSchedule,
  } = props;

  const schedule = has(formValue, 'schedule.id') ? formValue.schedule : {};
  const slots = has(formValue, 'schedule.id') ? schedule.slots : [];

  const [activeTab, setActiveTab] = useState('');
  const [manageAvailability, setManageAvailability] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState(slots);

  useEffect(() => {
    document.body.classList.add('ov-h');
  }, []);

  const saveData = () => {
    // Update schedule
    if (has(schedule, 'id')) {
      const data = {
        scheduleId: schedule.id,
        data: {
          page: formValue.id,
          slots: selectedSlots,
        },
      };

      handleSavePropertyVisitSchedule(data);
    } else {
      // Create schedule
      const data = {
        page: formValue.id,
        slots: selectedSlots,
      };
      handleCreatePropertyVisitSchedule(data);
    }
  };

  const discardChanges = () => {
    setSelectedSlots(slots);
    document.body.classList.remove('ov-h');
  };

  return (
    <div className="showings secondLevel h-perc-100 dis-fl-col">
      <div className="h-perc-100 dis-fl-col">
      <div className={`dis-fl-row ${manageAvailability ? 'jc-fs mb-0' : 'jc-b mb-2'} a-c`}>
        {
          !manageAvailability ? (
            <>
              <span className="subheader">Showings</span>
              <BrixelButtonIcon
                className="shadow-3dp"
                icon="arrow-simple-right"
                background="White"
                color="dark"
                saturationTxt={700}
                noBorder
                onClick={() => {
                  document.body.classList.remove('ov-h');
                  history.push('./');
                }}
              />
            </>
          ) : (
            <>
              <BrixelButtonIcon
                className="shadow-3dp mr-3"
                icon="arrow-simple-right"
                background="White"
                color="dark"
                saturationTxt={700}
                noBorder
                onClick={() => setManageAvailability(false)}
              />
              <span className="subheader">Manage availability</span>
            </>
          )
        }
      </div>
      {
        !manageAvailability ? (
          <>
            <BrixelButtonTertiary
              className="p-0 mb-3"
              label="Manage availability"
              onClick={() => setManageAvailability(true)}
            />

            <BrixelTabs
              fullWidth
              className="facts-tabs mb-3"
              clicksList={[
                '',
                'Pending',
                'Accepted',
              ]}
              labels={[
                'All',
                'Pending',
                'Accepted',
              ]}
              activeTab={activeTab}
              onClick={(tab) => setActiveTab(tab)}
            />

            {/* Print showings list based on active tab */}
            {/* <PropertyList activeSection={activeTab} /> */}
          </>
        ) : (
          <>
            <div className="max-h-perc-100 ov-a">
              <BrixelTimeSlots
                className="zIndex1"
                propertySlots={selectedSlots}
                onSelect={(e, value) => {
                  setSelectedSlots(value);
                }}
              />
            </div>
            <div className="dis-f p-2">
              <BrixelButtonPrimary
                label='Cancel'
                background="white"
                saturation={0}
                color="dark"
                saturationTxt={400}
                rounded
                className="shadow-3dp"
                onClick={() => discardChanges()}
              />
              <BrixelButtonPrimary
                label='Save & Next'
                background="primary"
                saturation={400}
                rounded
                onClick={() => saveData()}
                //isLoading={isSmallLoading}
              />
            </div>
          </>
        )
      }
      </div>
    </div>
  );
};

Showings.propTypes = {
  history: PropTypes.object.isRequired,
  handleSavePropertyVisitSchedule: PropTypes.func.isRequired,
  handleCreatePropertyVisitSchedule: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
};

Showings.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.propertyOverview.values', {}),
  preventExit: get(state, 'common.preventExitFromScreen', false),
  isUnsavedChangesModal: get(state, 'common.unsavedChangesModal', {}),
  notification: get(state, 'common.notification', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('propertyOverview', field, value));
  },
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Showings);
