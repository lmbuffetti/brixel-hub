/* eslint-disable array-callback-return */
import { BrixelButtonPrimary, translateTo } from '@brixel/brixel-components';
import get from 'lodash/get';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { getActiveSinglePropertyBookings, setActiveSinglePropertyBookings } from '../../../actions/PropertyActions';
import BrixelInfoSlot from '../../../components/BrixelInfoSlot';
import Loading from '../../../components/Loading';
import showingsEmpty from '../../../images/Listings/showing_placeholder.svg';
import showingsIMG from '../../../images/Listings/showings.svg';

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
    lang,
    loggedInUser,
  } = props;
  // STATE
  const [bookingSlot, setBookingSlot] = useState([]);
  
  const propID = get(match, 'propID', null);
  
  useEffect(() => () => handleSetActiveSinglePropertyBookings([]), []);
  
  useEffect(() => {
    if (propID) {
      const data = {
        id: propID,
        data: {
          user: loggedInUser.id,
        },
        smallLoader: 'getBooking',
      };
      handleGetActiveSinglePropertyBookings(data);
    }
  }, [propID]);
  
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
      <h3 className="mb-3 hide dis-b-lg">{translateTo('Showings', lang)}</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="secondLevel dis-fl-col w-perc-100 h-perc-lg-100">
          <div className="dis-fl-col backPanel hide-lg">
            <h5 className="sectionTitle">{translateTo('Showings', lang)}</h5>
          </div>
          <div className="boxCard flex-1">
            {
              bookingSlot.length > 0 ? (
                <div className="dis-fl-col a-c min-h-fix-336">
                  <img src={showingsIMG} alt="Showing Buyer" />
                  <h5 className="my-3">{translateTo('Thanks for your request.', lang)}</h5>
                  {
                    bookingSlot.map((day, g) => (
                      <div
                        key={`bkgSlt_${g.toString()}`}
                        className="w-perc-100 max-w-fix-360"
                      >
                        <BrixelInfoSlot
                          lang={lang}
                          title={DateTime.fromISO(extractDate(day.slot.slot), { locale: lang }).toFormat('cccc - dd LLL yyyy')}
                          subtitle={extractDate(day.slot.slot, true)}
                        />
                      </div>
                    ))
                  }
                  <h6>
                    {translateTo('We will contact you as soon as possible for confirmation.', lang)}
                  </h6>
                </div>
              ) : (
                <div className="dis-fl-col a-c min-h-fix-336">
                  <img src={showingsEmpty} alt="Showing Buyer" />
                  <h5 className="my-3">{translateTo(formValue.allowVisits === false ? 'Right now there are no showings available' : 'Request your showing', lang)}</h5>
                  {
                    formValue.allowVisits && (
                      <BrixelButtonPrimary
                        rounded
                        label={translateTo('Add dates', lang)}
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
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

ShowingsBuyer.defaultProps = {
  activeSinglePropertyBooking: [],
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSetActiveSinglePropertyBookings: bindActionCreators(setActiveSinglePropertyBookings, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsBuyer);
