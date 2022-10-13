import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
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
import translateTo from '../utils/translation';
import has from 'lodash/has';
import { setModal, setSplashType } from '../actions/CommonActions';
import Loading from './Loading';
import SplashScreen from './SplashScreen';
import { setCookie } from '../utils/helpers';
import { setEstimation } from '../actions/PropertyActions';
import startBestimate from '../images/Bestimate/startBestimate.svg';

const BestimateCardOverlay = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSinglePropertyId,
    bestimate,
    clearEstimation,
    handleSetModal,
    lang,
    setBestimateMessage,
    setPropertyEstimation,
    setSplashScreen,
    type,
  } = props;

  const onCloseBestimateResult = () => {
    setCookie('brixelMarketBestimate', true);
    if (setBestimateMessage) setBestimateMessage(true);
    if (clearEstimation) setPropertyEstimation({});
    if (type === 'modal') handleSetModal({});
    else setSplashScreen('');
  };

  const openSupport = (e) => {
    e.preventDefault();
    history.push(`/${activeSinglePropertyId.id}/trialRequest/remote?url=/sell`);
  };

  return (
    <>
      <SplashScreen
        className="result-popup centered"
        closeOutside={false}
      >
        <div className="dis-f jc-fe">
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
          {
            get(bestimate, 'higherValue', 0) === 0 ? (
              <>
                <h3>{translateTo('Bestimate® is missing 🙁', lang)}</h3>
                <span className="max-w-fix-448 ta-c txtDark700 py-2">
                  {translateTo('We could not calculate your Bestimate®. No problem. Our support team will do it for you manually.', lang)}
                </span>

                <img loading="lazy" src={startBestimate} alt="Generating Bestimate" className="w-fix-96 my-5" />

                <div className="dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100">
                  <span
                    className="pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi"
                    onClick={() => {
                      onCloseBestimateResult();
                    }}
                  >
                    <span>{translateTo('Thanks, not now', lang)}</span>
                  </span>
                  <BrixelButtonPrimary
                    rounded
                    label={translateTo('Contact support', lang)}
                    className="m-a"
                    onClick={(e) => openSupport(e)}
                    rightIcon="arrow-right"
                  />
                </div>
              </>
            ) : (
              <>
                <h3 dangerouslySetInnerHTML={{ __html: translateTo('This is your Bestimate<sup>®</sup>', lang) }} />
                <>
                  <p className="ta-c mt-2 txtDark700">
                    {translateTo('Your property is worth up to', lang)}
                  </p>
                  <p className="fsize-600 ff-mono txtPrimary700 fweight-600 mb-3 mt-2">{get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'}</p>
                </>
                <span className="txtDark700">
                  {translateTo('Similar transactions were sold within this price range.', lang)}
                </span>
                <div className="pt-2 pb-3 max-w-fix-480 w-perc-100">
                  <div className="ff-mono txtPrimary700 fsize-300 ta-c bestimate-range dis-f jc-c">
                    <span> {get(bestimate, 'currency', '')} {bestimate.lowerValue ? Helpers.formatNumberValue(get(bestimate, 'lowerValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'} </span>
                    <span className="w-fix-120" />
                    <span> {get(bestimate, 'currency', '')} {bestimate.higherValue ? Helpers.formatNumberValue(get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-'}</span>
                  </div>
                  <span className="bestimate-bar"> </span>
                </div>
                {
                  get(bestimate, 'alfredo', false) === true && (
                    <span
                      dangerouslySetInnerHTML={{ __html: translateTo('Bestimate<sup>®</sup> is a first price indication calculated with a few inputs. It is based on real property transactions, as well as an average of current market values. For a more accurate and complete estimation, we suggest booking an on-site appointment with one of our experts (limited to specific areas).', lang)}}
                      className="txtDark200 max-w-fix-480 mb-5"
                    />
                  )
                }
                {
                  get(bestimate, 'iazi', false) === true && (
                    <span
                      className="txtDark200 max-w-fix-480 mb-5"
                      dangerouslySetInnerHTML={{ __html:  translateTo('Bestimate<sup>®</sup> is calculated based on similar transactions. This is a first price indication calculated with few inputs. To have a more accurate estimation we suggest to book our free on-site estimation.', lang)}}
                    />
                  )
                }
                <BrixelButtonPrimary
                  label={translateTo('ok, got it!', lang)}
                  rounded
                  className="w-perc-100 max-w-fix-192"
                  onClick={() => onCloseBestimateResult()}
                />
              </>
            )
          }
        </div>
      </SplashScreen>
    </>
  );
};

BestimateCardOverlay.propTypes = {
  activeSinglePropertyId: PropTypes.string.isRequired,
  bestimate: PropTypes.object.isRequired,
  clearEstimation: PropTypes.bool,
  handleSetModal: PropTypes.func,
  lang: PropTypes.string.isRequired,
  setBestimateMessage: PropTypes.func,
  setPropertyEstimation: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  type: PropTypes.string,
};

BestimateCardOverlay.defaultProps = {
  clearEstimation: true,
  setBestimateMessage: null,
  type: 'splashScreen',
};

const mapStateToProps = (state) => ({
  bestimate: get(state, 'property.estimation.result', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
  setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BestimateCardOverlay);
