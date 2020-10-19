/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useRef, useCallback, useEffect,
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
import { getActiveSinglePropertyBookings } from '../../../actions/PropertyActions';
import scheduleCalendar from '../../../images/schedule-calendar.svg';

// COMPONENTS

const ShowingsBuyer = (props) => {
  // PROPS
  const {
    activeSinglePropertyBooking,
    formValue,
    handleGetActiveSinglePropertyBookings,
    history,
    loggedInUser,
    match,
  } = props;

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
            activeSinglePropertyBooking.length > 0 ? (
              <ul className="w-perc-100">
                {
                  activeSinglePropertyBooking.map((item, i) => (
                    <li
                      key={i.toString()}
                      className="ta-l"
                    >
                      {
                        item.slots.map((day, f) => (
                          <div key={f.toString()}>
                            <p>{day.slot} <span>{day.status}</span></p>
                          </div>
                        ))
                      }
                    </li>
                  ))
                }
              </ul>
            ) : (
              <img src={scheduleCalendar} alt="Schedule a Visit" />
            )
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
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

ShowingsBuyer.defaultProps = {
  isSmallLoading: null,
};

const mapStateToProps = (state) => ({
  activeSinglePropertyBooking: get(state, 'property.activeSinglePropertyBooking', []),
  formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ShowingsBuyer);
