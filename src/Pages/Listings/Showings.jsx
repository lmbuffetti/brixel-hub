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
    setManageAvailability(false);
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
    <div className="dis-f h-perc-100 ov-h">
      <div className="showings secondLevel h-perc-100 dis-fl-col">
        <div className="max-h-perc-100 dis-fl-col">
          <div className=" pos-r px-2 pt-2 px-md-3 pt-md-3">
            <div className="dis-f jc-b a-c">
              <h5>Showings</h5>
              <BrixelButtonIcon
                className="shadow-3dp"
                icon={manageAvailability ? "close-small" : "calendar-edit"}
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => setManageAvailability(!manageAvailability)}
              />
            </div>
            {
              !manageAvailability && (
                <div className="mt-3">
                  <BrixelTabs
                    fullWidth
                    className="facts-tabs"
                    clicksList={[
                      '',
                      'pending',
                      'accepted',
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
              )
            }
          </div>
          {
            !manageAvailability ? (
              <div className="max-h-perc-100 pb-4 ov-a">
                {
                  formValue.booking.map((book, i) => (
                    <React.Fragment key={i.toString()}>
                      {
                        book.slots.map((day, f) =>(
                          <React.Fragment key={f.toString()}>
                            {
                              (activeTab === '' || (day.status && day.status === activeTab)) && (
                                <BrixelBookingCard
                                  dimensionsFixed={false}
                                  className="mb-1"
                                  slot={day}
                                  buyer={book.buyer}
                                  onAccept={() => manageBooking(i, f, 'accepted')}
                                  onCancel={() => manageBooking(i, f, 'canceled')}
                                />
                              )
                            }
                          </React.Fragment>
                        ))
                      }
                    </React.Fragment>
                  ))
                }
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
                    className="shadow-3dp w-perc-100 mr-1"
                    onClick={() => discardChanges()}
                  />
                  <BrixelButtonPrimary
                    className="shadow-3dp w-perc-100 ml-1"
                    label='Save'
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
