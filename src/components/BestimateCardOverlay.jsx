import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  connect,
} from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  Helpers,
} from '@brixel/brixel-components';
import has from 'lodash/has';
import { setSplashType } from '../actions/CommonActions';
import Loading from './Loading';
import SplashScreen from './SplashScreen';
import { setCookie } from '../utils/helpers';
import { setEstimation } from '../actions/PropertyActions';

const BestimateCardOverlay = (props) => {
  const {
    bestimate,
    clearEstimation,
    setBestimateMessage,
    setPropertyEstimation,
    setSplashScreen,
  } = props;

  const onCloseBestimateResult = () => {
    setCookie('brixelMarketBestimate', true);
    if (setBestimateMessage) setBestimateMessage(true);
    if (clearEstimation) setPropertyEstimation({});
    setSplashScreen('');
  };

  return (
    <>
      <SplashScreen
        className="result-popup"
        closeOutside={false}
      >
        <div className="dis-f jc-fe mb-2">
          <BrixelButtonIcon
            ghost
            theme="dark"
            icon="close-small"
            onClick={() => onCloseBestimateResult()}
          />
        </div>
        <div className="dis-fl-col jc-c a-c pb-2 pos-r">
          {
            !has(bestimate, 'higherValue') && (
              <>
                <Loading isLoading />
              </>
            )
          }
          <h3>This is your Bestimate<sup>&reg;</sup>  </h3>
          <>
            <p className="ta-c mt-2 txtDark700"> Your property is worth up to </p>
            <p className="fsize-600 ff-mono txtPrimary700 fweight-600 mb-3 mt-2">{get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'}</p>
          </>
          <span className="txtDark700"> Similar transactions were sold within this price range. </span>
          <div className="pt-2 pb-3 max-w-fix-480 w-perc-100">
            <div className="ff-mono txtPrimary700 fsize-300 ta-c besitmate-range dis-f jc-c">
              <span> {get(bestimate, 'currency', '')} {bestimate.lowerValue ? Helpers.formatNumberValue(get(bestimate, 'lowerValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'} </span>
              <span className="w-fix-120" />
              <span> {get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'}</span>
            </div>
            <span className="besitmate-bar"> </span>
          </div>
          {
            get(bestimate, 'alfredo', false) === true && (
              <span className="txtDark200 max-w-fix-480 mb-5">
                Bestimate<sup>&reg;</sup> is a first price indication calculated with a few inputs. It is based on real property transactions, as well as an average of current market values. For a more accurate and complete estimation, we suggest booking an on-site appointment with one of our experts (limited to specific areas).
              </span>
            )
          }
          {
            get(bestimate, 'iazi', false) === true && (
              <span className="txtDark200 max-w-fix-480 mb-5">
                Bestimate<sup>&reg;</sup> is calculated based on similar transactions. This is a first price indication calculated with few inputs. To have a more accurate estimation we suggest to book our free on-site estimation.
              </span>
            )
          }
          <BrixelButtonPrimary
            label="ok, got it!"
            rounded
            className="w-perc-100 max-w-fix-192"
            onClick={() => onCloseBestimateResult()}
          />
        </div>
      </SplashScreen>
    </>
  );
};

BestimateCardOverlay.propTypes = {
  bestimate: PropTypes.object.isRequired,
  clearEstimation: PropTypes.bool,
  setBestimateMessage: PropTypes.func,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
};

BestimateCardOverlay.defaultProps = {
  clearEstimation: true,
  setBestimateMessage: null,
};

const mapStateToProps = (state) => ({
  bestimate: get(state, 'property.estimation.result', {}),
});

const mapDispatchToProps = (dispatch) => ({
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(BestimateCardOverlay);
