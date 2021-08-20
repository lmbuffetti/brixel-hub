/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonIcon,
  BrixelButtonText,
  BrixelAvatar,
  Helpers,
  change,
  reset,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { updatePublishedReview } from '../../../actions/PropertyActions';
import { addGameHistory } from '../../../actions/GamificationActions';

const ContactBuyer = (props) => {
  // PROPS
  const {
    contacts,
    history,
    match,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  return (
    <div className="dis-f">
      <div className="secondLevel dis-fl-col">
        <div className="dis-f backPanel">
          <div className="fixedIcon w-perc-100">
            <BrixelButtonIcon
              className="hide-md"
              bgTransparent
              icon="arrow-left-small"
              theme="dark"
              ghost
              onClick={() => history.push(`/buyer/${propID}/property`)}
            />
          </div>
          <h3 className="mb-3 hide dis-b-lg">Contact</h3>
          <h5 className="sectionTitle hide-lg">Contact</h5>
        </div>
        <div className="boxCard">
          <div className="dis-f jc-b">
            <div className="dis-f">
              <BrixelAvatar
                baseURL={get(baseByData, 'shortPath', '')}
                avatarImg={get(contacts, 'avatar.thumbnailPath', null) ? `${baseByData.shortPath}${get(contacts, 'avatar.thumbnailPath', '')}` : null}
                name={get(contacts, 'name', '') ? get(contacts, 'name', '') : 'No Name'}
                size="large"
              />
              <div>
                <h5 className="ml-3 mb-0">
                  <span className="dis-b">Hello, I am</span>
                  <span className="dis-b">{get(contacts, 'name', '') ? get(contacts, 'name', '') : 'No Name'}</span>
                </h5>
                {
                  get(contacts, 'company', null) && (
                    <p className="ml-3"><span>from</span><span>&nbsp;{contacts.company}</span></p>
                  )
                }
              </div>
            </div>
            <div className="hide-lg">
              <BrixelButtonIcon
                icon="close"
                theme="dark"
                ghost
                transparent
                className="as-c"
                onClick={() => history.goBack()}
              />
            </div>
          </div>
          <div className="dis-f a-c my-3">
            {
              get(contacts, 'phone.number', null) && (
                <BrixelButtonText
                  onClick={() => window.open(`tel:${contacts.phone}`)}
                  leftIcon="call"
                  label={Helpers.telephoneFormat(contacts.phone)}
                />
              )
            }
            <BrixelButtonText
              className="ml-2"
              onClick={() => history.push(`/buyer/${propID}/property/contact/add`)}
              leftIcon="mail"
              label="Ask a question"
            />
          </div>

          {
            get(contacts, 'generalInformation', null) && (
              <div className="mb-4">
                <h6 className="overline mb-2 mt-1">INFO</h6>

                <p>
                  {get(contacts, 'generalInformation', '')}
                </p>
              </div>
            )
          }

          <div className="dis-f">
            <BrixelButtonPrimary
              rounded
              label="Schedule visit"
              onClick={() => history.push(`/buyer/${propID}/property/showings/add`)}
            />
            <BrixelButtonSecondary
              className="ml-2"
              rounded
              label="Make an offer"
              onClick={() => history.push(`/buyer/${propID}/deal`)}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

ContactBuyer.propTypes = {
  history: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

ContactBuyer.defaultProps = {
};

const mapStateToProps = (state) => ({
  contacts: get(state, 'property.activeSingleProperty.contacts[0]', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form, data) {
    (dispatch(reset(form, data)));
  },
  handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ContactBuyer);
