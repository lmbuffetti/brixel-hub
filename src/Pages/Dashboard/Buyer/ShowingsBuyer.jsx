/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import { DateTime } from 'luxon';
import Loading from '../../../components/Loading';
import BrixelInfoSlot from '../../../components/BrixelInfoSlot';
import { getActiveSinglePropertyBookings, setActiveSinglePropertyBookings } from '../../../actions/PropertyActions';
import showingsIMG from '../../../images/Listings/showings.svg';
import showingsEmpty from '../../../images/Listings/showing_placeholder.svg';

// COMPONENTS

const ShowingsBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSinglePropertyBooking,
    formValue,
    handleGetActiveSinglePropertyBookings,
    handleSetActiveSinglePropertyBookings,
    isSmallLoading,
    loggedInUser,
    userLang,
  } = props;
  // STATE
  const [bookingSlot, setBookingSlot] = useState([]);

  const propID = get(match, 'propID', null);

  useEffect(() => () => handleSetActiveSinglePropertyBookings([]), []);

  useEffect(() => {
    if (formValue.id) {
      const data = {
        id: formValue.id,
        data: {
          user: loggedInUser.id,
        },
        smallLoader: 'getBooking',
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

  if (isSmallLoading.getBooking) {
    return (
      <div className="wrapLoader secondLevel h-perc-lg-100 min-h-fix-320">
        <Loading isLoading isSmall />
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">Showings</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="secondLevel dis-fl-col w-perc-100 h-perc-lg-100">
          <div className="dis-fl-col backPanel hide-lg">
            <h5 className="sectionTitle">Showings</h5>
          </div>
          <div className="boxCard flex-1">
            {
              bookingSlot.length > 0 ? (
                <div className="dis-fl-col a-c min-h-fix-336">
                  <img src={showingsIMG} alt="Showing Buyer" />
                  <h5 className="my-3">Thanks for your request.</h5>
                  {
                    bookingSlot.map((day, g) => (
                      <div
                        key={`bkgSlt_${g.toString()}`}
                        className="w-perc-100 max-w-fix-360"
                      >
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
                  <h5 className="my-3">{formValue.allowVisits === false ? 'Right now there are no showings available' : 'Request your showing'}</h5>
                  {
                    formValue.allowVisits && (
                      <BrixelButtonPrimary
                        rounded
                        label="Add dates"
                        rightIcon="calendar-add"
                        onClick={() => history.push(`/buyer/${propID}/property/showings/add`)}
                        className="mb-3"
                      />
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

ShowingsBuyer.propTypes = {
  activeSinglePropertyBooking: PropTypes.arrayOf(PropTypes.object),
  formValue: PropTypes.object.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleSetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
};

ShowingsBuyer.defaultProps = {
  activeSinglePropertyBooking: [],
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  lang: get(state, 'user.loggedInUser.language', 'en'),
  userLang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSetActiveSinglePropertyBookings: bindActionCreators(setActiveSinglePropertyBookings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsBuyer);
