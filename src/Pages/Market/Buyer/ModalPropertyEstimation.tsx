import React, {useEffect, useState} from 'react';
import {
  BrixelButtonText,
  BrixelIcon,
  BrixelModal,
  FactsOptions,
  FormatValue,
  Helpers,
} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import CoverEstimationGreenImg from '../../../images/Market/icnEstimationGreen.svg';
import CoverEstimationYellowImg from '../../../images/Market/icnEstimationYellow.svg';
import type {ModalPropertyEstimationType} from '../../../@types/Pages/Market/Buyer/ModalPropertyEstimation';
import {ExtraFeatureTypeList} from '@brixel-io/brixel-components/dist/@types/components/Form/BrixelExtraFeature';
import translateTo from '../../../utils/translation';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import {generateEstimation} from '../../../actions/EstimationActions';
import {EstimationType} from '@brixel-io/brixel-components/dist/@types/Model';
import Tags from '../../../components/Tags';

const { factsOptions } = FactsOptions;

const ModalPropertyEstimation = (props: ModalPropertyEstimationType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    handleGenerateEstimation,
    isSmallLoading,
    lang,
    ownerEstimations,
  } = props;
  // STATE
  const [activeEstimation, setActiveEstimation] = useState<EstimationType>()
  const [showDetail, setShowDetail] = useState(false)
  const [activeExtraFeatures, setActiveExtraFeatures] = useState<ExtraFeatureTypeList[]>([]);
  // URL PARAMS
  const propID = get(match, 'propID', null);

  // CONSTANTS VALUE
  const currency = get(activeEstimation, 'result.currency', '');
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
          const updateExtraFeature: ExtraFeatureTypeList[] = activeExtraFeatures || [];
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

  const onUpdateEstimation = () => {
    if (activeEstimation) {
      const data = {
        id: activeEstimation.id,
        smallLoader: 'generateEstimation',
      };
      handleGenerateEstimation(data)
    }
  }

  const convertLabel = (curVal, field, type: string | null = null) => {
    const fact = factsOptions[field].find((val) => val.value === curVal);
    if (fact && type) return fact[type];
    return fact
  }

  return (
    <BrixelModal
      clickOutsideToClose={false}
      onClose={() => onClose()}
      layout="xxlarge"
      bodyClassColor="bgWhite p-0"
      hideHeader={true}
    >
      <div>
        <div className={`dis-f jc-c a-c py-7 ${get(activeEstimation, 'result.available', false) ? 'bgGreen100' : 'bgYellow100'}`}>

          <BrixelIcon
            rounded
            background="white"
            saturation={0}
            color="text"
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

        <div className="dis-f mt-2 px-2">
          {
            get(activeEstimation, 'result.available', false) ? (
              <Tags
                lang={lang}
                status="accepted"
                text="Calculated"
                message={{
                  accepted: translateTo('Calculated', lang),
                }}
              />
            ) : (
              <Tags
                lang={lang}
                status="pending"
                text="Pending"
                message={{
                  pending: translateTo('Pending', lang),
                }}
              />
            )
          }
        </div>
        <div className="p-4">

          <h4 className="mb-3 fweight-600">
            {translateTo(get(activeEstimation, 'data.title', ''), lang)}
          </h4>

          <div className="dis-fl-col dis-fl-row-sm jc-fs">

            <div className="brdSmallRight-sm brdText50 mr-2 pr-2">
              <h6 className="fsize-300 fweight-400 txtText400 pb-1">
                {translateTo('Property worth', lang)}
              </h6>
              {
                get(activeEstimation, 'result.available', false) ? (
                  <p className="ff-mono dis-f a-b txtGreen400">
                    <span className="mr-1 fsize-300">{currency}</span>
                    <span className="fsize-500">{Helpers.formatNumberValue(value, currency)}</span>
                  </p>
                ) : (
                  <p className="ff-mono dis-f a-b txtGreen400">
                    <span className="fsize-500">-</span>
                  </p>
                )
              }
            </div>


            <div className="mt-1 mt-sm-0">
              <h6 className="fsize-300 fweight-400 txtText400 pb-1">
                {translateTo('Similar properties are currently worth between', lang)}
              </h6>

              {
                get(activeEstimation, 'result.available', false) ? (
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
                ) : (
                  <p className="ff-mono dis-f a-b txtGreen400">
                    <span className="fsize-500">-</span>
                  </p>
                )
              }
            </div>
          </div>


          <hr className="my-4 lighter" />

          <div className="dis-f a-t jc-b flex-wrap">
            <div>
              <span className="fsize-300 dis-b txtText400 mb-1">
                {translateTo('Property Type', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {translateTo(get(activeEstimation, 'data.properties.propertyType', ''), lang)}
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtText400 mb-1">
                {translateTo('Rooms', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {FormatValue.formatRooms(get(activeEstimation, 'data.properties.typology.bedrooms', 0))}
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtText400 mb-1">
                {translateTo('Size', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {get(activeEstimation, 'data.properties.typology.livingArea.value', 0)} m2
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtText400 mb-1">
                {translateTo('Year built', lang)}
              </span>
              <span className="ff-mono fsize-500 txtBlack">
                {get(activeEstimation, 'data.properties.building.built', 0)}
              </span>
            </div>
            <div>
              <span className="fsize-300 dis-b txtText400 mb-1">
                {translateTo('Location', lang)}
              </span>
              <span className="fsize-500 txtText900 mt-1 notranslate">
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
            label={translateTo('Show details', lang)}
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
                        <span className="fsize-300 dis-b txtText400 mb-1">
                          {translateTo('Condition', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(convertLabel(get(activeEstimation, 'data.properties.building.conditionStatus', ''), 'conditionStatus', 'label'), lang)}
                        </span>
                      </div>
                    )
                  }
                  {
                    get(activeEstimation, 'data.properties.typology.bathrooms', 0) > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtText400 mb-1">
                          {translateTo('Bathrooms', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.typology.bathrooms', ''), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    Object.keys(get(activeEstimation, 'data.properties.building.solarOrientarion', {} )).length > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtText400 mb-1">
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
                                {translateTo(convertLabel(get(activeEstimation, `data.properties.building.solarOrientarion[${key}]`, ''), 'solarOrientation', 'label'), lang)}
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
                        <span className="fsize-300 dis-b txtText400 mb-1">
                          {translateTo('Garage', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.parking.garage', ''), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.parking.outside', 0) > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtText400 mb-1">
                          {translateTo('Parking outside', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.parking.outside', ''), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.parking.underground', 0) > 0 && (
                      <div>
                        <span className="fsize-300 dis-b txtText400 mb-1">
                          {translateTo('Parking underground', lang)}
                        </span>
                        <span className="ff-mono fsize-500 txtBlack">
                          {translateTo(get(activeEstimation, 'data.properties.parking.underground', ''), lang)}
                        </span>
                      </div>
                    )
                  }

                  {
                    get(activeEstimation, 'data.properties.energy.efficiency', null) && (
                      <div>
                        <span className="fsize-300 dis-b txtText400 mb-1">
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
                        <span className="fsize-300 dis-b txtText400 mb-1">
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
                        <span className="fsize-300 dis-b txtText400 mb-1">
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
            theme="text"
            themeSat={500}
            bgTransparent
            label={translateTo('Close', lang)}
            onClick={() => onClose()}
          />
          {
            activeEstimation && !get(activeEstimation, 'result.available', false) && (
              <BrixelButtonPrimary
                rounded
                isLoading={isSmallLoading.generateEstimation}
                label={translateTo('Refresh', lang)}
                onClick={() => onUpdateEstimation()}
              />
            )
          }
        </div>

      </div>
    </BrixelModal>
  )
}

const mapStateToProps = (state) => ({
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  ownerEstimations: get(state, 'market.ownerEstimations.data', []),
})

const mapDispatchToProps = (dispatch) => ({
  handleGenerateEstimation: bindActionCreators(generateEstimation, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ModalPropertyEstimation);
