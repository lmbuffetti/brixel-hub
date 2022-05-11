/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect, Suspense,
} from 'react';
import {
  Route, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import last from 'lodash/last';
import groupBy from 'lodash/groupBy';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
  BrixelTabs,
  BrixelTimeSlots,
  BrixelBookingCard,
} from '@brixel/brixel-components';
import {
  change,
  reset,
} from '@brixel/brixel-components/dist/form';
import { DateTime } from 'luxon';
import lazyWithRetry from '../../components/LazyWithRetry';
import Loading from '../../components/Loading';
import {
  getActiveSinglePropertyBookings,
  savePropertyVisitSchedule,
  createPropertyVisitSchedule,
  savePropertyVisitBooking,
} from '../../actions/PropertyActions';
import ShowingPlaceholder from '../../images/Listings/showing_placeholder.svg';

const AddShowings = lazyWithRetry(() => import('./AddShowings'));

const Showings = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    changeFieldValue,
    formValue,
    initialValues,
    handleSavePropertyVisitBooking,
    handleGetActiveSinglePropertyBookings,
    lang,
    handleReset,
  } = props;
  // STATE
  const [activeTab, setActiveTab] = useState('');
  const [manageAvailability, setManageAvailability] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [bookingSlot, setBookingSlot] = useState([]);
  // URL PARAMS
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // GET BOOKING
  useEffect(() => {
    const data = {
      id: propID,
      smallLoader: 'property',
    };
    handleGetActiveSinglePropertyBookings(data);
  }, []);

  // SET BOOKING
  useEffect(() => {
    if (formValue.booking && formValue.schedule && formValue.schedule.slots) {
      const allSlots = [];
      const allUnavailableSlots = [];
      formValue.booking.map((slot) => {
        slot.slots.map((book) => {
          allSlots.push({
            buyer: slot.buyer,
            id: slot.id,
            slot: book,
          });
          if (book.status !== 'canceled') allUnavailableSlots.push(book.slot);
        });
      });
      allSlots.sort((a, b) => a.slot.slot - b.slot.slot);
      formValue.schedule.slots.map((item, i) => {
        const checkExist = allSlots.find((day) => day.slot.slot === item && day.slot.status !== 'canceled');
        if (typeof checkExist === 'undefined' && item > DateTime.now().toMillis()) {
          allSlots.push({
            id: i,
            slot: {
              slot: item,
              status: 'free',
            },
          });
        }
      });
      setUnavailableSlots([...allUnavailableSlots]);
      setBookingSlot([...allSlots]);
    }
  }, [formValue.booking, formValue.schedule]);

  // DISCARD BOOKING
  const discardChanges = () => {
    setManageAvailability(false);
    handleReset(initialValues);
  };

  // MANAGE BOOKING VISIT
  const manageBooking = (book, action) => {
    const allBook = get(formValue, 'booking', []);
    const selectSlots = allBook.find((item) => item.id === book.id);
    const idSlot = selectSlots.slots.findIndex((item) => DateTime.fromSQL(item.slot).toFormat('yyyy.LL.dd HH:mm') === DateTime.fromSQL(book.slot).toFormat('yyyy.LL.dd HH:mm') || DateTime.fromSQL(item.slot).toFormat('yyyy.LL.dd HH:mm') === DateTime.fromSQL(book.slot.slot).toFormat('yyyy.LL.dd HH:mm'));
    selectSlots.slots[idSlot].status = action;
    const data = {
      scheduleId: book.id,
      data: {
        message: get(selectSlots, 'message', []),
        page: propID,
        slots: selectSlots.slots,
        buyer: book.buyer,
      },
    };
    handleSavePropertyVisitBooking(data);
  };

  // FUNCTION TO GROUP DATE BY MONTH
  const gorupByMonth = () => {
    const grouped = groupBy(bookingSlot, (d) => {
      const getOnlyDate = d.slot.slot ? d.slot.slot.split(' ')[0] : null;
      if (getOnlyDate) {
        return DateTime.fromSQL(getOnlyDate).toFormat('LL.yyyy');
      }
      return null;
    });
    return grouped || {};
  };

  return (
    <div className="dis-f">
      <div className="showings secondLevel dis-fl-col ml-lg-1">
        <div className="showingsWrapper dis-fl-col">
          <div className="pos-r">
            <div className={`dis-f jc-b a-c ${!manageAvailability ? 'mb-3' : ''}`}>
              <BrixelButtonIcon
                className={`shadow-3dp hide-md ${manageAvailability ? 'opacity0' : ''}`}
                icon="arrow-simple-left"
                ghost
                onClick={() => history.push(`/${propID}/marketing`)}
              />
              <h5 className="sectionTitle">Showings</h5>
              <BrixelButtonIcon
                icon={manageAvailability ? 'close-small' : 'calendar-edit'}
                ghost
                onClick={() => (manageAvailability ? discardChanges() : setManageAvailability(!manageAvailability))}
              />
            </div>

            {
              !manageAvailability && Object.keys(gorupByMonth()).length > 0 && (
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
            {
              !manageAvailability && Object.keys(gorupByMonth()).length === 0 && (
                <div className="ta-c mt-2">
                  <img className="h-fix-120" src={ShowingPlaceholder} alt="Showings Placeholder" />
                  <h5 className="ta-c mt-2 mb-2">Setup your first showing</h5>
                  <BrixelButtonPrimary
                    className="m-a"
                    rounded
                    label="Add dates"
                    rightIcon="calendar-add"
                    onClick={() => setManageAvailability(true)}
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
                    <React.Fragment key={`gpMnt_${e.toString()}`}>
                      <h6 className="txtLight400 mt-3 mb-1">
                        <span>{DateTime.fromFormat(key, 'LL.yyyy').toFormat('LLLL')}</span>
                        &nbsp;-&nbsp;
                        <span>{DateTime.fromFormat(key, 'LL.yyyy').toFormat('yyyy')}</span>
                      </h6>
                      {
                        gorupByMonth()[key].map((day, g) => (
                          <div key={`grpMnt_${g.toString()}`}>
                            {
                              ((!activeTab || (activeTab && day.slot.status === activeTab)) && day.slot.status !== 'canceled') && (
                                <BrixelBookingCard
                                  countryLang={lang}
                                  dimensionsFixed={false}
                                  className="mb-1"
                                  slot={day.slot}
                                  buyer={day.buyer}
                                  onAccept={() => manageBooking(day, 'accepted')}
                                  onCancel={() => manageBooking(day, 'canceled')}
                                  onAdd={() => history.push(`/${propID}/marketing/showings/addBooking/${day.id}`)}
                                  insertBooking={day.slot.status === 'free'}
                                  showActions={DateTime.fromSQL(day.slot.slot).toMillis() > DateTime.now().toMillis()}
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
                <div className="dis-f jc-c dis-b-md mb-3">
                  <p className="max-w-fix-264 body2 txtDark400"> Select your availability </p>
                </div>
                <div className="max-h-perc-100 ov-a">
                  <BrixelTimeSlots
                    countryLang={lang}
                    className="zIndex1"
                    propertySlots={get(formValue, 'schedule.slots', [])}
                    occupedSlots={unavailableSlots}
                    onSelect={(e, value) => changeFieldValue('schedule.slots', value)}
                  />
                </div>
              </>
            )
          }
        </div>
      </div>
      {
        getFact() !== 'showings' && (
          <Suspense fallback={<Loading isLoading />}>
            <Route
              path="/:propID/marketing/showings/addBooking/:idShowing"
              element={<AddShowings />}
            />
          </Suspense>
        )
      }
    </div>
  );
};

Showings.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleSavePropertyVisitBooking: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string,
  handleReset: PropTypes.func.isRequired,
};

Showings.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'brixelForm.Property.values', {}),
  initialValues: get(state, 'brixelForm.Property.initialValues', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  notification: get(state, 'common.notification', []),
  lang: get(state, 'user.loggedInUser.user.language', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleReset(data) {
    (dispatch(reset('Property', data)));
  },
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
  handleSavePropertyVisitBooking: bindActionCreators(savePropertyVisitBooking, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Showings);
