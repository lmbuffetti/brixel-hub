/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonTertiary,
  BrixelTabs,
  BrixelTimeSlots,
  BrixelBookingCard,
} from '@brixel/brixel-components';
import {
  savePropertyVisitSchedule,
  createPropertyVisitSchedule,
  savePropertyVisitBooking,
} from '../../actions/PropertyActions';

const Showings = (props) => {
  // PROPS
  const {
    changeFieldValue,
    history,
    formValue,
    handleSavePropertyVisitBooking,
    handleSavePropertyVisitSchedule,
    handleCreatePropertyVisitSchedule,
    isSmallLoading,
    match,
    reset,
  } = props;
  // STATE
  const [activeTab, setActiveTab] = useState('');
  const [manageAvailability, setManageAvailability] = useState(false);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  const saveData = () => {
    // Update schedule
    if (has(formValue, 'schedule.id')) {
      const data = {
        scheduleId: formValue.schedule.id,
        data: {
          page: formValue.id,
          slots: formValue.schedule.slots,
        },
      };
      handleSavePropertyVisitSchedule(data);
    } else {
      // Create schedule
      const data = {
        page: formValue.id,
        slots: formValue.schedule.slots,
      };
      handleCreatePropertyVisitSchedule(data);
    }
  };

  const discardChanges = () => {
    reset('Property');
  };

  const manageBooking = (idBooking, idSlot, action) => {
    const selectBooking = get(formValue, `booking[${idBooking}]`, []);
    if (has(selectBooking, `slots[${idSlot}]`)) selectBooking.slots[idSlot].status = action;
    changeFieldValue(`booking[${idBooking}]`, selectBooking);
    const data = {
      scheduleId: get(formValue, `booking[${idBooking}].id`, []),
      data: {
        message: get(formValue, `booking[${idBooking}].message`, []),
        page: propID,
        slots: get(formValue, `booking[${idBooking}].slots`, []),
        buyer: get(formValue, `booking[${idBooking}].buyer`, []),
      }
    };
    handleSavePropertyVisitBooking(data);
    console.log(selectBooking);
  };

  return (
    <div className="showings secondLevel h-perc-100 dis-fl-col">
      <div className="h-perc-100 dis-fl-col">
        <div className={`dis-fl-row ${manageAvailability ? 'jc-fs mb-0' : 'jc-b mb-2'} a-c`}>
          {
            !manageAvailability ? (
              <div className="headerSection p-1">
                <div className="pos-r">
                  <BrixelButtonIcon
                    className="shadow-2dp"
                    icon="close-small"
                    color="primary"
                    saturationTxt={400}
                    bgTransparent
                    noBorder
                    onClick={() => history.push(`${propID}/listings`)}
                  />
                  <h5>Showing</h5>
                </div>
              </div>
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
            <div className="dis-fl-col h-perc-100">
              <div>
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
              </div>
              <div className="h-perc-100 pb-2 ov-a">
                {
                  formValue.booking.map((book, i) => (
                    <React.Fragment key={i.toString()}>
                      {
                        book.slots.map((day, f) =>(
                          <BrixelBookingCard
                            key={f.toString()}
                            className="mb-1"
                            slot={day}
                            buyer={book.buyer}
                            onAccept={() => manageBooking(i, f, 'accepted')}
                            onCancel={() => manageBooking(i, f, 'canceled')}
                          />
                        ))
                      }
                    </React.Fragment>
                  ))
                }
              </div>
              {/* Print showings list based on active tab */}
              {/* <PropertyList activeSection={activeTab} /> */}
            </div>
          ) : (
            <>
              <div className="max-h-perc-100 ov-a">
                <BrixelTimeSlots
                  className="zIndex1"
                  propertySlots={get(formValue, 'schedule.slots', [])}
                  onSelect={(e, value) => changeFieldValue('schedule.slots', value) }
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
                  isLoading={isSmallLoading}
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
  activeSinglePropertyBooking: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  handleSavePropertyVisitSchedule: PropTypes.func.isRequired,
  handleCreatePropertyVisitSchedule: PropTypes.func.isRequired,
  handleSavePropertyVisitBooking: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.bool.isRequired,
  formValue: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Showings.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
  notification: get(state, 'common.notification', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
  handleSavePropertyVisitBooking: bindActionCreators(savePropertyVisitBooking, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Showings);
