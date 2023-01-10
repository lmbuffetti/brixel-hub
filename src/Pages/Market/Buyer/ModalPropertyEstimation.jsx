import {
  BrixelButtonText,
  BrixelIcon,
  BrixelModal,
  FactsOptions,
  FormatValue,
  Helpers,
  translateTo,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { compose } from 'redux';
import CoverEstimationGreenImg from '../../../images/Market/icnEstimationGreen.svg';
import CoverEstimationYellowImg from '../../../images/Market/icnEstimationYellow.svg';

const { factsOptions } = FactsOptions;

const ModalPropertyEstimation = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    lang,
    ownerEstimations,
  } = props;
  // STATE
  const [activeEstimation, setActiveEstimation] = useState({})
  const [showDetail, setShowDetail] = useState(false)
  const [activeExtraFeatures, setActiveExtraFeatures] = useState([]);
  // URL PARAMS
  const propID = get(match, 'propID', null);

  // CONSTANTS VALUE
  const currency = get(activeEstimation, 'result.currency', 0);
  const value = Math.round(get(activeEstimation, 'result.value', 0));
  const lowerValue = Math.round(get(activeEstimation, 'result.lowerValue', 0));
  const higherValue = Math.round(get(activeEstimation, 'result.higherValue', 0));

  useEffect(() => {
    if (ownerEstimations.length > 0) {
      const getEstimation = ownerEstimations.find((est) => est.id === propID);
      if (getEstimation) setActiveEstimation(getEstimation);
    }
  }, [ownerEstimations, propID]);

  useEffect(() => {
    const localActiveExtraFeatures = get(activeEstimation, 'data.properties.extraFeatures', {});
    if (localActiveExtraFeatures) {
      Object.keys(localActiveExtraFeatures).forEach((key) => {
        if (localActiveExtraFeatures[key]) {
          const updateExtraFeature = activeExtraFeatures || [];
          const filterExtraFeatures = factsOptions.extraFeature.find((feat) => feat.value === key);
          if (filterExtraFeatures) {
            updateExtraFeature.push(filterExtraFeatures);
            setActiveExtraFeatures(updateExtraFeature);
          }
        }
      });
    }
  }, [activeEstimation]);


  const onClose = () => {
    history.push('/buy/estimations');
  }

  return (
    <BrixelModal
      clickOutsideToClose={false}
      onClose={() => onClose()}
      layout="xxlarge"
      bodyClassColor="bgWhite p-0"
      hideHeader={true}
      // multiActions={multiActions()}
    >
      <div>
        <div className={`dis-f jc-c a-c py-7 ${get(activeEstimation, 'result.available', false) ? 'bgGreen200' : 'bgYellow200'}`}>

          <BrixelIcon
            rounded
            background="white"
            saturation={0}
            color="altGrey"
            className="pos-a-fix x-r-2 x-t-2"
            icon="close-small"
            onClick={() => onClose()}
          />

          {
            get(activeEstimation, 'result.available', false) ? (
              <img src={CoverEstimationGreenImg} alt="completed estimation" />
            ) : (
              <img src={CoverEstimationYellowImg} alt="completed estimation" />
            )
          }
        </div>

        <div className="p-4">

          <h4 className="mb-3 fweight-600">
            {translateTo(get(activeEstimation, 'data.title', ''), lang)}
          </h4>

          <div className="dis-fl-col dis-fl-row-sm jc-fs">

            <div className="brdSmallRight-sm brdAltGrey100 mr-2 pr-2">
              <h6 className="fsize-300 fweight-400 txtAltGrey400 pb-1">
                {translateTo('Property worth', lang)}
              </h6>
              <p className="ff-mono dis-f a-b txtGreen400">
                <span className="mr-1 fsize-300">{currency}</span>
                <span className="fsize-500">{Helpers.formatNumberValue(value, currency)}</span>
              </p>
            </div>


            <div className="mt-1 mt-sm-0">
              <h6 className="fsize-300 fweight-400 txtAltGrey400 pb-1">
                {translateTo('Similar properties are currently worth between', lang)}
              </h6>
              <p className="ff-mono dis-f a-b txtGreen400">
                <span>
                  <span className="mr-1 fsize-400">{currency}</span>
                  <span>{Helpers.formatNumberValue(lowerValue, currency)}</span>
                </span>
                <span className="mx-2">-</span>
                <span>
                  <span className="mr-1 fsize-400">{currency}</span>
                  <span>{Helpers.formatNumberValue(higherValue, currency)}</span>
                </span>
              </p>
            </div>

          </div>

          <hr className="my-4 lighter" />

          <div className="dis-f a-t jc-b flex-wrap">
            <div>
              <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                {translateTo('Property Type', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {translateTo(get(activeEstimation, 'data.properties.propertyType', 0), lang)}
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                {translateTo('Rooms', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {FormatValue.formatRooms(get(activeEstimation, 'data.properties.typology.bedrooms', 0), get(activeEstimation, 'data.location.countryCode', 'CH'))}
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                {translateTo('Size', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {get(activeEstimation, 'data.properties.typology.livingArea.value', 0)} m2
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                {translateTo('Year built', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {get(activeEstimation, 'data.properties.building.built', 0)}
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                {translateTo('Location', lang)}
              </span>
              <span className="fsize-500 txtDark700 mt-1 notranslate">
                {get(activeEstimation, 'data.location.zip', '')} {get(activeEstimation, 'data.location.city', '')}
                {
                  get(activeEstimation, 'data.location.countryCode', 'CH') === 'CH' && (
                    <>
                      {` (${get(activeEstimation, 'data.location.stateCode', '')})`}
                    </>
                  )
                }
              </span>
            </div>
          </div>

          <hr className="my-4 lighter" />

          <BrixelButtonText
            label="Show details"
            rightIcon={showDetail ? 'arrow-simple-up' : 'arrow-simple-down'}
            bgTransparent
            onClick={() => setShowDetail(!showDetail)}
          />

          {
            showDetail && (
              <>
                <div className="dis-f a-t jc-b flex-wrap detailList mt-3">
                  {
                    get(activeEstimation, 'data.properties.building.conditionStatus', null) && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Condition', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.building.conditionStatus', 0), lang)}
                        </span>
                      </div>
                    )
                  }
                  {
                    get(activeEstimation, 'data.properties.typology.bathrooms', null) && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Bathrooms', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.typology.bathrooms', 0), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    Object.keys(get(activeEstimation, 'data.properties.building.solarOrientarion', {} )).length > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Solar orientations', lang)}
                        </span>

                        {
                          Object.keys(get(activeEstimation, 'data.properties.building.solarOrientarion', {} )).map((key, i) => (
                            <>
                              {i > 0 && (<span className="mr-1">,</span>)}
                              <span
                                key={`solar${i.toString()}`}
                                className="ff-mono fsize-500 txtBlack"
                              >
                                {translateTo(get(activeEstimation, `data.properties.building.solarOrientarion[${key}]`, {} ), lang)}
                              </span>
                            </>
                          ))
                        }
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.parking.garage', 0) > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Garage', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.parking.garage', 0), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.parking.outside', 0) > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Parking outside', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.parking.outside', 0), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.parking.underground', 0) > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Parking underground', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.parking.underground', 0), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.energy.efficiency', null) && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Energy efficiency', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.energy.efficiency', ''), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.energy.efficiencyCertified', null) && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Energy certified', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.energy.efficiencyCertified', ''), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    activeExtraFeatures.length > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtAltGrey400 mb-1">
                          {translateTo('Extra Features', lang)}
                        </span>
                        {
                          activeExtraFeatures.map((extra, i) => (
                            <>
                              {i > 0 && (<span className="mr-1">,</span>)}
                              <span
                                key={`extra${i.toString()}`}
                                className="ff-mono fsize-500 txtBlack"
                              >
                                {translateTo(extra.label, lang)}
                              </span>
                            </>
                          ))
                        }
                      </div>
                    )
                  }
                </div>
              </>

            )
          }

        </div>

        <hr className="mt-2 mb-4 lighter" />

        <div className="dis-f a-c jc-b mb-4 px-3">
          <BrixelButtonText
            theme="altGrey"
            bgTransparent
            label="Close"
            onClick={() => onClose()}
          />

          {/*<BrixelButtonSecondary*/}
          {/*  rounded*/}
          {/*  label="Contact support"*/}
          {/*/>*/}
        </div>

      </div>
    </BrixelModal>
  )
}

ModalPropertyEstimation.propTypes = {
  lang: PropTypes.string.isRequired,
  ownerEstimations: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  ownerEstimations: get(state, 'market.ownerEstimations.data', []),
})

export default compose(
  connect(mapStateToProps, null),
)(ModalPropertyEstimation);
