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
import { DateTime } from 'luxon';
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
    userLang,
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
          return a.slot.start - b.slot.start;
        }
        return a.slot.slot - b.slot.slot;
      });
      setBookingSlot([...allSlots]);
    } else {
      setBookingSlot([]);
    }
  }, [activeSinglePropertyBooking]);

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
        <div className="dis-f backPanel">
          <div className="fixedIcon w-perc-100">
            <BrixelButtonIcon
              className="hide-md"
              icon="arrow-left-small"
              theme="dark"
              ghost
              onClick={() => history.push(`/buyer/${propID}/property`)}
            />
          </div>
          <h5 className="sectionTitle">
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
                      title={DateTime.fromISO(extractDate(day.slot.slot), { locale: userLang }).toFormat('cccc - dd LLL yyyy')}

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
  userLang: PropTypes.string.isRequired,
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
  userLang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSetActiveSinglePropertyBookings: bindActionCreators(setActiveSinglePropertyBookings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsBuyer);
