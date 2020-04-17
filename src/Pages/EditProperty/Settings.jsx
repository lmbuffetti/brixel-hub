/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  BrixelRadioButton,
  BrixelSwitchButton, BrixelButtonSecondary,
  FactsOptions,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { deleteActiveSingleProperty } from '../../actions/PropertyActions';
import Loading from '../../components/Loading';

const Settings = (props) => {
  const {
    formValue,
    handleDeleteActiveSingleProperty,
    match,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);

  const { factsOptions } = FactsOptions;

  const deletePage = () => {
    const data = {
      id: propID,
    };
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this page?')) {
      handleDeleteActiveSingleProperty(data);
    }
  };

  if (!formValue.id) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <div className="dis-fl-col mt-2 px-2">
        <h6>Settings</h6>
        <div className="manager-settings-tab visibility-container p-md-0 mb-5">
          <h2 className="mb-3">Page Visibility</h2>
          <Field
            className="mb-2"
            name="published"
            label="Published"
            component={BrixelSwitchButton}
          />
          {
            formValue.published && (
              <div className="mb-2">
                <a target="_blank" rel="noopener noreferrer" label="published-link" href={`${baseByData.pageUrl}${formValue.stub}`}>
                  {`${baseByData.pageUrl}${formValue.stub}`}
                </a>
              </div>
            )
          }
          <Field
            className="mb-2"
            name="listed"
            label="Brixel Market"
            component={BrixelSwitchButton}
          />
          <Field
            className="mb-2"
            name="portals.homegate"
            label="Homegate"
            component={BrixelSwitchButton}
          />
          <Field
            className="mb-2"
            name="portals.immoscout24"
            label="ImmoScout24"
            component={BrixelSwitchButton}
          />
          <Field
            className="mb-3"
            name="language"
            label="Page language"
            component={BrixelRadioButton}
            options={factsOptions.languages}
          />
          <BrixelButtonSecondary
            label="Permanently delete this page"
            color="Red"
            onClick={() => deletePage()}
          />
        </div>
      </div>
    </>
  );
};

Settings.propTypes = {
  formValue: PropTypes.object.isRequired,
  handleDeleteActiveSingleProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Settings.defaultProps = {
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'form.Property.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleDeleteActiveSingleProperty: bindActionCreators(deleteActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Settings);
