import { BrixelButtonText, FormatValue, Helpers } from '@brixel/brixel-components';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import CoverEstimationGreenImg from '../../images/Market/icnEstimationGreen.svg';
import CoverEstimationYellowImg from '../../images/Market/icnEstimationYellow.svg';
import translateTo from '../../utils/translation';
import Tags from '../Tags';

const MarketCardFavorites = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    lang,
  } = props;

  const openProperty = () => {
    history.push(`/buy/estimations/${activeSingleProperty.id}`)
  }

  return (
    <div className="mb-3">
      <div className="dis-fl-col dis-fl-row-sm brdRadius brdSmall brdAltGrey200 ov-h">
        <div className={`w-perc-100 w-fix-sm-200 h-fix-200 dis-f jc-c a-c ${get(activeSingleProperty, 'result.available', false) ? 'bgGreen200' : 'bgYellow200'}`}>
          {
            get(activeSingleProperty, 'result.available', false) ? (
              <img src={CoverEstimationGreenImg} alt="completed estimation" />
            ) : (
              <img src={CoverEstimationYellowImg} alt="completed estimation" />
            )
          }
        </div>

        <div className="w-perc-100 dis-fl-col p-2">
          <div className="dis-f a-t jc-b">
            <div>
              <span className="fsize-300 txtAltGrey700 mb-1 ta-l">
                {get(activeSingleProperty, 'data.location.zip', '')} {get(activeSingleProperty, 'data.location.city', '')}
                {
                  get(activeSingleProperty, 'data.location.countryCode', 'CH') === 'CH' && (
                    <>
                      {` (${get(activeSingleProperty, 'data.location.stateCode', '')})`}
                    </>
                  )
                }
              </span>
              <h3
                className="cur-poi fSizePx18"
                onClick={() => openProperty()}
              >
                {translateTo(get(activeSingleProperty, 'data.title', ''), lang)}
              </h3>
              <BrixelButtonText
                label={translateTo('View details', lang)}
                iconRight="link-open"
                bgTransparent
                onClick={() => openProperty()}
              />
            </div>
            <div>
              <div className="dis-f a-c">
                <Tags
                  lang={lang}
                  status={get(activeSingleProperty, 'result.available', false) ? 'completed' : 'pending'}
                  text="Offer"
                  message={{
                    completed: 'Calculated',
                    pending: 'Pending',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="dis-f jc-b a-b mt-a pt-2">
            <div className="fsize-300 txtDark400">
              <div className="dis-f a-c jc-fs flex-wrap w-perc-100">

                <div className="bottom a-c txtDark700 brdSmallRight-sm mb-1 mb-sm-0 brdAltGrey200 pr-6 mr-6">
                  <span className="fsize-300 dis-b txtAltGrey400">
                    {translateTo('Price', lang)}
                  </span>
                  {
                    get(activeSingleProperty, 'result.higherValue', null) && (
                      <div className="txtGreen400 dis-f a-b">
                        <span className="fsize-300 ff-mono notranslate">
                          {get(activeSingleProperty, 'result.currency', 'EUR')}
                        </span>
                        <span className="fsize-500 ff-mono notranslate ml-1">
                          {Helpers.formatNumberValue(Math.round(get(activeSingleProperty, 'result.higherValue', 0)), get(activeSingleProperty, 'result.currency', 'EUR'))}
                        </span>
                      </div>
                    )
                  }

                </div>

                <div className='dis-f'>
                  <div>
                    <span className="fsize-300 dis-b txtAltGrey400">
                      {translateTo('Rooms', lang)}
                    </span>
                    <span className="ff-mono fszie-400 txtBlack">
                      {FormatValue.formatRooms(get(activeSingleProperty, 'data.properties.typology.bedrooms', 0), get(activeSingleProperty, 'data.location.countryCode', 'CH'))}
                    </span>
                  </div>
                  <div className="mx-4">
                    <span className="fsize-300 dis-b txtAltGrey400">
                      {translateTo('Size', lang)}
                    </span>
                    <span className="ff-mono fszie-400 txtBlack">
                      {get(activeSingleProperty, 'data.properties.typology.livingArea.value', 0)} m2
                    </span>
                  </div>
                  <div>
                    <span className="fsize-300 dis-b txtAltGrey400">
                      {translateTo('Year built', lang)}
                    </span>
                    <span className="ff-mono fszie-400 txtBlack">
                      {get(activeSingleProperty, 'data.properties.building.built', 0)}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MarketCardFavorites.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});

export default compose(
  connect(mapStateToProps, null),
)(MarketCardFavorites);
