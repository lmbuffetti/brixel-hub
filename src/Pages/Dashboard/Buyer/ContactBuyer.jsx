/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
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
        <div>
          <div className="dis-f">
            <BrixelAvatar
              avatarImg={get(contacts, 'avatar.thumbnailPath', null) ? `${baseByData.shortPath}${get(contacts, 'avatar.thumbnailPath', '')}` : null}
              name={get(contacts, 'name', '') ? get(contacts, 'name', '') : ''}
              size="large"
            />
            <div>
              <h5 className="ml-3 mb-0">
                <span className="dis-b">Hello, I am</span>
                <span className="dis-b">{contacts.name}</span>
              </h5>
              {
                has(contacts, 'company') && (
                  <p className="ml-3"><span>from</span><span>&nbsp;{contacts.company}</span></p>
                )
              }
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
