/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import without from 'lodash/without';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
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
import Loadable from 'react-loadable';
import LoadingSimple from '../../components/LoadingSimple';

const AddShowings = Loadable({
  loader: () => import('./AddShowings' /* webpackChunkName: "AddShowings" */),
  loading: LoadingSimple,
});

const Showings = (props) => {
  // PROPS
  const {
    changeFieldValue,
    formValue,
    handleSavePropertyVisitBooking,
    handleSavePropertyVisitSchedule,
    handleCreatePropertyVisitSchedule,
    history,
    isSmallLoading,
    match,
    reset,
  } = props;
  // STATE
  const [activeTab, setActiveTab] = useState('');
  const [manageAvailability, setManageAvailability] = useState(false);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

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

  const manageBooking = (book, action) => {
    const allBook = get(formValue, `booking`, []);
    const selectSlots = allBook.find(item => item.id === book.id);
    const idSlot = selectSlots.slots.findIndex(item => moment(item.slot).format('YYYY.MM.DD HH:mm') === moment(book.slot).format('YYYY.MM.DD HH:mm'));
    selectSlots.slots[idSlot].status = action;
    if (action === 'canceled') {
      selectSlots.slots.splice(idSlot, 1);
    }
    const data = {
      scheduleId: book.id,
      data: {
        message: get(selectSlots, `message`, []),
        page: propID,
        slots: selectSlots.slots,
        buyer: book.buyer,
      }
    };
    handleSavePropertyVisitBooking(data);
  };

  const getBooking = (slot) => {
    const allBook = cloneDeep(formValue.booking);
    const curBook = allBook.map((book, i) => {
      const filteredData = book.slots.filter(book => moment(book.slot).format('YYYY.MM.DD HH:mm') === moment(slot).format('YYYY.MM.DD HH:mm'));
      if (filteredData.length > 0) {
        return filteredData.map((filt) => {
          filt.buyer = book.buyer;
          filt.id = book.id;
          return filt;
        });
      }
      return null;
    });
    return without(curBook, null);
  };

  const gorupByMonth = () => {
    const selectedSlots = get(formValue, 'schedule.slots', []);
    const grouped = groupBy(selectedSlots, (d) => moment(d).format('MM.YYYY'));
    return grouped || {};
  };

  return (
    <div className="dis-f h-perc-100 ov-h">
      <div className="showings secondLevel h-perc-100 dis-fl-col">
        <div className="max-h-perc-100 dis-fl-col">
          <div className=" pos-r px-2 pt-2 px-md-3 pt-md-3">
            <div className="dis-f jc-b a-c">
              <BrixelButtonIcon
                className="shadow-3dp hide-md"
                icon="arrow-simple-left"
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => setManageAvailability(!manageAvailability)}
              />
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
                  Object.keys(gorupByMonth()).map((key, e) => (
                    <React.Fragment key={e.toString()}>
                      <h6 className="txtLight400 mb-1">
                        <span>{moment(key, 'MM.YYYY').format('MMMM')}</span>
                        &nbsp;-&nbsp;
                        <span>{moment(key, 'MM.YYYY').format('YYYY')}</span>
                      </h6>
                      {
                        gorupByMonth()[key].map((day, g) => (
                          <div key={g.toString()}>
                            {
                              getBooking(day).length > 0 ? (
                                <>
                                  {
                                    getBooking(day).map((book, i) => (
                                      <React.Fragment key={i.toString()}>
                                        {
                                          book && book.map((day, f) =>(
                                            <React.Fragment key={f.toString()}>
                                              {
                                                (activeTab === '' || (day.status && day.status === activeTab && moment(day.slot).isAfter(moment(), 'day'))) && (
                                                  <BrixelBookingCard
                                                    dimensionsFixed={false}
                                                    className="mb-1"
                                                    slot={day}
                                                    buyer={day.buyer || {}}
                                                    onAccept={() => manageBooking(day, 'accepted')}
                                                    onCancel={() => manageBooking(day, 'canceled')}
                                                    countryLang={'en'}
                                                    showActions={moment(day.slot).isAfter(moment(), 'day')}
                                                  />
                                                )
                                              }
                                            </React.Fragment>
                                          ))
                                        }
                                      </React.Fragment>
                                    ))
                                  }
                                </>
                              ) : (
                                <>
                                  {
                                    moment(day).isAfter(moment(), 'day') && (
                                      <BrixelBookingCard
                                        dimensionsFixed={false}
                                        className="mb-1"
                                        slot={{slot: day}}
                                        buyer={{}}
                                        onAccept={() => manageBooking(day, 'accepted')}
                                        onCancel={() => manageBooking(day, 'canceled')}
                                        countryLang={'en'}
                                        insertBooking={true}
                                        onAdd={() => history.push(`/${propID}/listings/showings/addBooking/${g}`)}
                                      />
                                    )
                                  }
                                </>
                              )
                            }

                          </div>
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
      {
        getFact() !== 'showings' && (
          <Route
            path={'/:propId/listings/showings/addBooking/:idShowing'}
            exact
            component={AddShowings}
          />
        )
      }
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
