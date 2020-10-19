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
  BrixelButtonIcon, BrixelBookingCard,
} from '@brixel/brixel-components';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { getActiveSinglePropertyBookings } from '../../../actions/PropertyActions';

// COMPONENTS

const ShowingsBuyer = (props) => {
  // PROPS
  const {
    activeSinglePropertyBooking,
    formValue,
    handleGetActiveSinglePropertyBookings,
    history,
    lang,
    loggedInUser,
    match,
  } = props;
  // STATE
  const [bookingSlot, setBookingSlot] = useState([]);

  const propID = get(match, 'params.propId', null);

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
      activeSinglePropertyBooking.map((slot) => {
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
    }
  }, [activeSinglePropertyBooking]);

  // FUNCTION TO GROUP DATE BY MONTH
  const gorupByMonth = () => {
    const grouped = groupBy(bookingSlot, (d) => {
      if (d.slot.start) return moment.unix(d.slot.start).format('MM.YYYY');
      return moment(d.slot.slot).format('MM.YYYY');
    });
    return grouped || {};
  };

  return (
    <div className="secondLevel h-perc-md-100">
      <div className="cardSecondLevel">
        <div className="dis-f jc-b a-c mb-3">
          <BrixelButtonIcon
            className="shadow-3dp hide-md"
            icon="arrow-simple-left"
            background="White"
            color="primary"
            saturationTxt={400}
            noBorder
            onClick={() => history.push('../page')}
          />
          <h5 className="m-a m-md-0 sectionTitle">
            Showings
          </h5>
        </div>
        <div className="dis-fl-col a-c">
          {
            Object.keys(gorupByMonth()).map((key, e) => (
              <React.Fragment key={e.toString()}>
                <h6 className="txtLight400 mt-3 mb-1">
                  <span>{moment(key, 'MM.YYYY').format('MMMM')}</span>
                  &nbsp;-&nbsp;
                  <span>{moment(key, 'MM.YYYY').format('YYYY')}</span>
                </h6>
                <div className="scheduleGrid">
                  {
                    gorupByMonth()[key].map((day, g) => (
                      <div key={g.toString()}>
                        <BrixelBookingCard
                          countryLang={lang}
                          dimensionsFixed={false}
                          className="mb-1"
                          slot={day.slot}
                          buyer={day.buyer}
                          onAdd={() => history.push(`/${propID}/listings/showings/addBooking/${day.id}`)}
                          insertBooking={day.slot.status === 'free'}
                          showActions={moment(day.slot.slot).isAfter(moment(), 'hour')}
                        />
                      </div>
                    ))
                  }
                </div>
              </React.Fragment>
            ))
          }
          <h5 className="my-3">Request your showing</h5>
          <BrixelButtonPrimary
            rounded
            label="Add dates"
            rightIcon="calendar-add"
            onClick={() => history.push(`/buyer/property/${propID}/showings/add`)}
          />
        </div>
      </div>
    </div>
  );
};

ShowingsBuyer.propTypes = {
  activeSinglePropertyBooking: PropTypes.arrayOf(PropTypes.object),
  formValue: PropTypes.object.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

ShowingsBuyer.defaultProps = {
  activeSinglePropertyBooking: [],
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  lang: get(state, 'user.loggedInUser.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsBuyer);
