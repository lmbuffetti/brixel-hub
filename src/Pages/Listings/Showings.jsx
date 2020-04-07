/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect } from 'react';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset } from 'redux-form';
import get from 'lodash/get';
import last from 'lodash/last';
import groupBy from 'lodash/groupBy';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  BrixelButtonIcon,
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
    history,
    match,
    reset,
  } = props;
  // STATE
  const [activeTab, setActiveTab] = useState('');
  const [manageAvailability, setManageAvailability] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [bookingSlot, setBookingSlot] = useState([]);
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    if (formValue.booking && formValue.schedule && formValue.schedule.slots) {
      const allSlots = [];
      const allUnavailableSlots = [];
      formValue.booking.map((slot) => {
        slot.slots.map((book) =>{
          allSlots.push({
            buyer: slot.buyer,
            id: slot.id,
            slot: book,
          });
          if (book.status !== 'canceled') allUnavailableSlots.push(book.slot);
        });
      });
      allSlots.sort((a,b) => moment(a.slot.slot).format('YYYYMMDDHHmm') - new moment(b.slot.slot).format('YYYYMMDDHHmm'));
      formValue.schedule.slots.map((item, i) => {
        const checkExist = allSlots.find(day => moment(day.slot.slot).format('YYYYMMDDHHmm') === moment(item).format('YYYYMMDDHHmm') && day.slot.status !== 'canceled');
        if (typeof checkExist === 'undefined' && moment(item).isAfter(moment(), 'hour')) {
          allSlots.push({
            id: i,
            slot: {
              slot: item,
              status: 'free',
            },
          })
        }
      });
      setUnavailableSlots([...allUnavailableSlots]);
      setBookingSlot([...allSlots]);
    }
  }, [formValue.booking, formValue.schedule]);

  const discardChanges = () => {
    setManageAvailability(false);
    reset('Property');
  };

  const manageBooking = (book, action) => {
    const allBook = get(formValue, `booking`, []);
    const selectSlots = allBook.find(item => item.id === book.id);
    const idSlot = selectSlots.slots.findIndex(item => moment(item.slot).format('YYYY.MM.DD HH:mm') === moment(book.slot).format('YYYY.MM.DD HH:mm'));
    selectSlots.slots[idSlot].status = action;
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

  const gorupByMonth = () => {
    const grouped = groupBy(bookingSlot, (d) => moment(d.slot.slot).format('MM.YYYY'));
    return grouped || {};
  };

  return (
    <div className="dis-f h-perc-100">
      <div className="showings secondLevel h-perc-100 dis-fl-col ml-md-1">
        <div className="showingsWrapper max-h-perc-100 dis-fl-col">
          <div className="pos-r">
            <div className="dis-f jc-b a-c mb-3">
              <BrixelButtonIcon
                className="shadow-3dp hide-md"
                icon="arrow-simple-left"
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => history.push(`${propID}/listings`)}
              />
              <h5>Showings</h5>
              <BrixelButtonIcon
                className="shadow-3dp"
                icon={manageAvailability ? "close-small" : "calendar-edit"}
                background="White"
                color="primary"
                saturationTxt={400}
                noBorder
                onClick={() => manageAvailability ? discardChanges() : setManageAvailability(!manageAvailability)}
              />
            </div>
            {
              !manageAvailability && (
                <div>
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
              <div className="pb-3">
                {
                  Object.keys(gorupByMonth()).map((key, e) => (
                    <React.Fragment key={e.toString()}>
                      <h6 className="txtLight400 mt-3 mb-1">
                        <span>{moment(key, 'MM.YYYY').format('MMMM')}</span>
                        &nbsp;-&nbsp;
                        <span>{moment(key, 'MM.YYYY').format('YYYY')}</span>
                      </h6>
                      {
                        gorupByMonth()[key].map((day, g) => (
                          <div key={g.toString()}>
                            {
                              ((!activeTab || (activeTab && day.slot.status === activeTab)) && day.slot.status !== 'canceled') && (
                                <BrixelBookingCard
                                  dimensionsFixed={false}
                                  className="mb-1"
                                  slot={day.slot}
                                  buyer={day.buyer || {}}
                                  onAccept={() => manageBooking(day, 'accepted')}
                                  onCancel={() => manageBooking(day, 'canceled')}
                                  onAdd={() => history.push(`/${propID}/listings/showings/addBooking/${day.id}`)}
                                  insertBooking={day.slot.status === 'free'}
                                  addI
                                  countryLang={'en'}
                                  showActions={moment(day.slot.slot).isAfter(moment(), 'hour')}
                                />
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
                    occupedSlots={unavailableSlots}
                    onSelect={(e, value) => changeFieldValue('schedule.slots', value) }
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
