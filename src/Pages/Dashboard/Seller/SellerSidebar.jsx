/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelIcon,
  FactsOptions,
} from '@brixel/brixel-components';
import { DateTime } from 'luxon';
import { feedMessage } from '../../../resources/dashboardHistory';
import { getHistoryFeed } from '../../../actions/HistoryActions';

const { factsOptions } = FactsOptions;

const SellerSidebar = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    handleGetHistoryFeed,
    historyFeed,
    loggedInUser,
    packagesProperty,
  } = props;
  // STATE
  const [stepProgrss, setStepProgrss] = useState({});
  const [stepIndexProgrss, setIndexProgrss] = useState(0);

  useEffect(() => {
    if (activeSingleProperty.id) {
      const arryaStubs = [
        'page-create',
        'page-listed',
        'page-published',
        'page-scan-trial',
        'page-start-service-package',
        'page-stop-service-package',
        'page-unlisted',
        'page-unpublished',
        'pro-estimation-complete',
        'user-create-estimation',
        'user-register',
      ];
      const payloadPageHistory = {
        arryaStubs,
        id: activeSingleProperty.id,
        resultsPerPage: 50,
        offset: 0,
        order: '',
        direction: 'DESC',
        smallLoader: 'getPageHistory',
      };
      handleGetHistoryFeed(payloadPageHistory);
    }
  }, [activeSingleProperty.id]);

  useEffect(() => {
    if (activeSingleProperty.id) {
      const defState = factsOptions.progressBarOptions.find((item) => item.value === activeSingleProperty.progress.state);
      const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === activeSingleProperty.progress.state);
      if (defState.label === 'Sales Lead') defState.label = 'Onboarding';
      setStepProgrss(defState);
      setIndexProgrss(defIndexState);
    }
  }, [activeSingleProperty.id]);

  const convertFeedMessage = (stub, type, history) => {
    const data = feedMessage(loggedInUser, history, packagesProperty);
    return data[stub][type];
  };

  return (
    <div className="seller-sidebar w-perc-100 max-w-fix-368 p-3">
      <span className="txtDark700"><span>Your Progress:</span> <span className="ml-1 fweight-600">{stepProgrss.label}</span></span>
      <div className="progress-steps dis-f jc-b pos-r mb-4 mt-2">
        <span className="liner" />
        {
          factsOptions.progressBarOptions.map((progress, i) => (
            <div className={`step-item ${stepIndexProgrss >= i ? 'active' : ''}`} key={i.toString()}>
              <span>{i + 1}</span>
            </div>
          ))
        }
      </div>
      <div className="updates dis-fl-col">
        <p className="fweight-600 txtDark700 mb-2">Updates</p>

        {
          historyFeed.map((history, i) => (
            <div
              className={`update-item brdRadius brdSmall p-2 dis-f mb-2 ${convertFeedMessage(history.actionStub, 'className', history)}`}
              key={i.toString()}
            >
              <BrixelIcon
                background={convertFeedMessage(history.actionStub, 'colorIcon', history)}
                saturation={convertFeedMessage(history.actionStub, 'colorIconSat', history)}
                color={convertFeedMessage(history.actionStub, 'colorIcon', history)}
                saturationTxt={convertFeedMessage(history.actionStub, 'colorBgIconSat', history)}
                padding="p-small-12"
                icon={convertFeedMessage(history.actionStub, 'icon', history)}
                rounded
                className="as-fs"
                iconSize="large"
              />
              <div className="pl-2">
                <p className="fsize-300 txtDark600" dangerouslySetInnerHTML={{ __html: convertFeedMessage(history.actionStub, 'message', history) }} />
                {
                  !isNaN(get(history, 'createdAt', null)) && (
                    <p className="fsize-200 pt-small-4 txtLight400">
                      {DateTime.fromMillis(history.createdAt, {
                        locale: loggedInUser.language,
                      }).toFormat('d LLL yyyy, H:mm')}
                    </p>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

SellerSidebar.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleGetHistoryFeed: PropTypes.func.isRequired,
  historyFeed: PropTypes.arrayOf(PropTypes.object).isRequired,
  loggedInUser: PropTypes.object.isRequired,
  packagesProperty: PropTypes.object.isRequired,
};

SellerSidebar.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  historyFeed: get(state, 'history.historyFeed.data', []),
  loggedInUser: get(state, 'user.loggedInUser.user', null),
  packagesProperty: get(state, 'property.packagesProperty.data', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetHistoryFeed: bindActionCreators(getHistoryFeed, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SellerSidebar);
