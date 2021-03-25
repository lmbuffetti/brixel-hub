/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
// import groupBy from 'lodash/groupBy';
import moment from 'moment';
import BrixelInfoSlot from '../../../components/BrixelInfoSlot';
import { getActiveSinglePropertyBookings, setActiveSinglePropertyBookings } from '../../../actions/PropertyActions';
import showingsIMG from '../../../images/Listings/showings.svg';
import showingsEmpty from '../../../images/Listings/showing_placeholder.svg';

// COMPONENTS

const ShowingsBuyer = (props) => {
  // PROPS
  const {
    activeSinglePropertyBooking,
    formValue,
    handleGetActiveSinglePropertyBookings,
    handleSetActiveSinglePropertyBookings,
    history,
    isSmallLoading,
    loggedInUser,
    match,
  } = props;
  // STATE
  const [bookingSlot, setBookingSlot] = useState([]);

  const propID = get(match, 'params.propId', null);

  useEffect(() => () => handleSetActiveSinglePropertyBookings([]), []);

  useEffect(() => {
    if (formValue.id) {
      const data = {
        id: formValue.id,
        data: {
          user: loggedInUser.id,
        },
      };
      handleGetActiveSinglePropertyBookings(data);
    }
  }, [formValue]);

  // SET BOOKING
  useEffect(() => {
    if (activeSinglePropertyBooking.length > 0) {
      const allSlots = [];
      const allUnavailableSlots = [];
      const currentBooking = activeSinglePropertyBooking.filter((day) => day.page === formValue.id);
      currentBooking.map((slot) => {
        slot.slots.map((book) => {
          allSlots.push({
            buyer: slot.buyer,
            id: slot.id,
            slot: book,
          });
          if (book.status !== 'canceled') allUnavailableSlots.push(book.slot);
        });
      });
      allSlots.sort((a, b) => {
        if (a.slot.start) {
          return moment.unix(a.slot.start).format('YYYYMMDDHHmm') - moment.unix(b.slot.start).format('YYYYMMDDHHmm');
        }
        return moment(a.slot.slot).format('YYYYMMDDHHmm') - moment(b.slot.slot).format('YYYYMMDDHHmm');
      });
      setBookingSlot([...allSlots]);
    } else {
      setBookingSlot([]);
    }
  }, [activeSinglePropertyBooking]);

  // FUNCTION TO GROUP DATE BY MONTH
  /* const groupByMonth = () => {
    const grouped = groupBy(bookingSlot, (d) => {
      if (d.slot.start) return moment.unix(d.slot.start).format('MM.YYYY');
      return moment(d.slot.slot).format('MM.YYYY');
    });
    return grouped || {};
  }; */

  const extractDate = (date, getHours = false) => {
    if (date) {
      if (getHours) return date.split(' ').splice(1, 3).join(' ');
      return date.split(' ')[0];
    }
    return '';
  };

  if (isSmallLoading) {
    return <div />;
  }

  return (
    <div className="secondLevel h-perc-lg-100">
      <div className="cardSecondLevel">
        <div className="dis-f jc-b a-c mb-3">
          <BrixelButtonIcon
            className="hide-md"
            icon="arrow-simple-left"
            ghost
            onClick={() => history.push(`/buyer/${propID}/property`)}
          />
          <h5 className="m-a m-lg-0 sectionTitle">
            Showings
          </h5>
        </div>
        {
          bookingSlot.length > 0 ? (
            <div className="dis-fl-col a-c min-h-fix-336">
              <img src={showingsIMG} alt="Showing Buyer" />
              <h5 className="my-3">Thanks for your request.</h5>
              {
                bookingSlot.map((day, g) => (
                  <div key={g.toString()} className="w-perc-100 max-w-fix-360">
                    <BrixelInfoSlot
                      title={moment(extractDate(day.slot.slot)).format('dddd - Do MMM YYYY')}
                      subtitle={extractDate(day.slot.slot, true)}
                    />
                  </div>
                ))
              }
              <h6>
                We will contact you as soon as possible for confirmation.
              </h6>
            </div>
          ) : (
            <div className="dis-fl-col a-c min-h-fix-336">
              <img src={showingsEmpty} alt="Showing Buyer" />
              <h5 className="my-3">Request your showing</h5>
              <BrixelButtonPrimary
                rounded
                label="Add dates"
                rightIcon="calendar-add"
                onClick={() => history.push(`/buyer/${propID}/property/showings/add`)}
                className="mb-3"
              />
            </div>
          )
        }
      </div>
    </div>
  );
};

ShowingsBuyer.propTypes = {
  activeSinglePropertyBooking: PropTypes.arrayOf(PropTypes.object),
  formValue: PropTypes.object.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleSetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

ShowingsBuyer.defaultProps = {
  activeSinglePropertyBooking: [],
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  lang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSetActiveSinglePropertyBookings: bindActionCreators(setActiveSinglePropertyBookings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsBuyer);
