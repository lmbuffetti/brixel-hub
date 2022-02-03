/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  BrixelInputText,
  BrixelSelect,
  Helpers,
  ReduxField,
  change,
  reset,
  ProgressRing,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { factsOptions } from '@brixel/brixel-components/dist/constants/Facts';
import { DateTime } from 'luxon';
import { setHistory, setSplashType } from '../../actions/CommonActions';
import { InputSheets } from '../../resources/inputSheets';
import { calcPercentageProEstimation, completedBestimate } from '../../utils/helpers';

// COMPONENTS
import BestimateCardOverlay from '../../components/BestimateCardOverlay';
import { getEstimation } from '../../actions/PropertyActions';
import { generateEstimation } from '../../actions/EstimationActions';

const Price = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleProperty,
    estimation,
    formValue,
    handleGetEstimation,
    handleGenerateBestimate,
    handleSetHistory,
    proEstimation,
    setSplashScreen,
  } = props;

  // STATE
  const [Questions, setQuestions] = useState(InputSheets(formValue));
  const [selectedQuest, setSelectedQuest] = useState(null);
  // const [allSettings, setAllSettings] = useState(false);
  const [percComplete, setPercComplete] = useState(0);
  // PARAMS URL
  const propID = get(match, 'propID', null);
  const bestimateflowCompleted = completedBestimate(formValue);

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    if (selectedQuest) {
      const findCurrentId = Questions.findIndex((quest) => quest.history === selectedQuest.history);
      const quest = InputSheets(formValue)[findCurrentId];
      setQuestions(InputSheets(formValue));
      setSelectedQuest(quest);
    }
  }, [formValue]);

  useEffect(() => {
    if (get(estimation, 'result.higherValue', 0) === 0 && activeSingleProperty.id) {
      if (!has(estimation, 'result') && get(estimation, 'status', '') !== 'pending') {
        const payload = {
          reloadOnwProperties: true,
          type: 'market',
          id: activeSingleProperty.id,
          generate: bestimateflowCompleted,
        };
        handleGetEstimation(payload);
      } else if (
        has(estimation, 'result') &&
        !has(estimation, 'result.value') &&
        (
          get(estimation, 'status', '') !== 'pending' ||
          bestimateflowCompleted
        ) &&
        estimation.id &&
        (
          get(activeSingleProperty, 'location.countryCode', '') === 'CH' ||
          get(activeSingleProperty, 'location.countryCode', '') === 'PT'
        ) && (
          get(activeSingleProperty, 'properties.propertyType', '') === 'House' ||
          get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment'
        )) {
        handleGenerateBestimate(estimation.id);
      }
    }
  }, [activeSingleProperty.id, bestimateflowCompleted]);

  useEffect(() => {
    setPercComplete(calcPercentageProEstimation().realPerc);
  }, [formValue]);

  const openBestimate = () => {
    setSplashScreen({
      component: BestimateCardOverlay,
      props: {
        clearEstimation: false,
      },
    });
  };

  const onBestimateFlow = () => {
    history.push(`/${activeSingleProperty.id}/singleFlow/achievement/bestimate/step1`);
    setSplashScreen('');
    handleSetHistory({ source: `/${activeSingleProperty.id}/property/price` });
  };

  const selectDocument = (id, action) => {
    const docs = get(activeSingleProperty, 'documents', []);
    const doc = docs.find((item) => item.id === id);
    if (action === 'name' && doc) return doc.name;
    if (action === 'path' && doc) return doc.path;
    if (action === 'date' && doc) return `${DateTime.fromMillis(doc.createdAt).toFormat('dd.MM.yyyy')}, ${DateTime.fromMillis(doc.createdAt).toFormat('hh:mm')}`;
    return null;
  };

  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">Price</h3>
      <div className="secondLevel dis-fl-col w-perc-100 h-perc-lg-100">

        <div className="dis-fl-col backPanel dis-b hide-md">
          <h5 className="sectionTitle">Price</h5>
        </div>

        <div className="dis-fl-col dis-fl-row-lg a-t jc-b">
          <div className="boxCard dis-fl-col mr-2 w-perc-100 mb-5 mb-lg-0">
            <h5>Listing price</h5>

            <div className="dis-f jc-b a-c mt-3">
              <ReduxField
                ReduxFieldClass="w-perc-40 w-perc-md-30 mr-1"
                form="Property"
                component={BrixelSelect}
                design={{
                  compact: true,
                }}
                input={{
                  placeholder: 'CHF',
                  name: 'price.currency',
                  options: factsOptions.currency,
                }}
                labels={{
                  label: 'Currency',
                }}
              />
              <ReduxField
                ReduxFieldClass="w-perc-70 ml-1"
                form="Property"
                component={BrixelInputText}
                input={{
                  placeholder: '700\'000',
                  name: 'price.total',
                  unit: get(formValue, 'price.currency', ''),
                }}
                inputFormat={{
                  currency: get(formValue, 'price.currency', ''),
                  formatType: 'price',
                }}
                labels={{
                  label: 'Price',
                }}
              />
            </div>

            <div className="dis-b-md">
              <ReduxField
                ReduxFieldClass="w-perc-60 mt-2"
                form="Property"
                component={BrixelSelect}
                design={{
                  compact: true,
                }}
                input={{
                  name: 'status',
                  options: factsOptions.propertyStatus,
                }}
                labels={{
                  label: 'Status',
                }}
              />
            </div>
          </div>

          <div className="ml-md-1 w-perc-100">
            {
              (get(activeSingleProperty, 'properties.propertyType', '') === 'House' ||
              get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment' ||
                get(proEstimation, 'value', 0) > 0) && (
                <div className="dis-fl-col boxCard mb-5 pb-5">
                  <h5 className="mb-3">Pro Estimation</h5>

                  <div>
                    {
                      get(proEstimation, 'value', 0) <= 0 ? (
                        <p className="txtDark700">
                          <span dangerouslySetInnerHTML={{ __html: percComplete === 100 ? 'Your estimation is being calculated. You will receive an email with the result' : 'Complete your inputs to <span class="txtRed400 fweight-700">unlock</span> your professional estimation.' }} />
                        </p>
                      ) : (
                        <p className="txtDark700">This is your estimated value for your property.</p>
                      )
                    }
                  </div>
                  <div className="dis-f a-c w-perc-100 my-3">
                    <span className="ff-mono fsize-600 fweight-700 txtPrimary700">
                      {get(estimation, 'result.currency', '')}
                    </span>

                    {
                      get(proEstimation, 'value', 0) <= 0 ? (
                        <>
                          <div className="w-perc-100 h-fix-40 mx-1 pos-r dis-f jc-c a-c">
                            <div className="w-perc-100 h-fix-40 bgBlue100 bgBlur pos-a" />
                            <div className="pos-r zIndex1">
                              {
                                calcPercentageProEstimation().realPerc === 100 && (
                                  <p className="ff-mono fweight-700 fsize-400 txtYellow400">pending</p>
                                )
                              }
                            </div>
                          </div>
                          <BrixelIcon
                            className="notranslate"
                            color={calcPercentageProEstimation().realPerc === 100 ? 'yellow' : 'red'}
                            icon={calcPercentageProEstimation().realPerc === 100 ? 'hourglass' : 'locked'}
                          />
                        </>
                      ) : (
                        <span className="ff-mono fsize-600 fweight-700 txtPrimary700 ml-1 notranslate">{Helpers.formatNumberValue(get(proEstimation, 'value', 0).toFixed(0), get(estimation, 'result.currency', ''))}</span>
                      )
                    }

                  </div>

                  <div className="">
                    {
                      proEstimation && selectDocument(proEstimation.document, 'path') ? (
                        <div className="dis-f a-c">
                          {
                            selectDocument(proEstimation.document, 'name') ? (
                              <>
                                <BrixelIcon
                                  className="mr-1"
                                  icon="document"
                                  background="blue"
                                  saturation={100}
                                  color="blue"
                                  saturationTxt={700}
                                />
                                <div className="pl-small-4">
                                  <a
                                    className="txtDark700 fweight-600 fsize-300 dis-b"
                                    href={`${baseByData.shortPath}${selectDocument(proEstimation.document, 'path')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {selectDocument(proEstimation.document, 'name')}
                                  </a>
                                  <small className="fsize-200 fweight-500 txtLight400">
                                    {selectDocument(proEstimation.document, 'date')}
                                  </small>
                                </div>
                              </>
                            ) : (
                              <>
                                {
                                  calcPercentageProEstimation().realPerc === 100 && (
                                    <BrixelButtonSecondary
                                      rounded
                                      className="mt-2 w-fit"
                                      label="Edit inputs"
                                      ghost
                                      onClick={() => history.push(`/${propID}/property/price/formFlow`)}
                                    />
                                  )
                                }
                              </>
                            )
                          }
                        </div>
                      ) : (
                        <>
                          <div className="dis-f a-c">
                            <ProgressRing
                              progress={calcPercentageProEstimation().realPerc}
                              size={45}
                              strokeWidth={6}
                              circleOneStroke="#DCDDDE"
                              circleTwoStroke={calcPercentageProEstimation().realPerc === 100 ? '#218B80' : '#004D71'}
                              showIcon={false}
                              showIconComplete={calcPercentageProEstimation().realPerc === 100}
                            />
                            <div className="ml-2">
                              <p className="fsize-300 txtDark700">Estimation inputs</p>
                              <p className={`ff-mono fweight-700 ${calcPercentageProEstimation().realPerc === 100 ? 'txtGreen600' : 'txtPrimary700'}`}>
                                <span className="mr-1 notranslate">{calcPercentageProEstimation().realPerc}%</span>
                                <span>completed</span>
                              </p>
                            </div>
                          </div>

                          {
                            calcPercentageProEstimation().realPerc === 100 ? (
                              <BrixelButtonSecondary
                                rounded
                                className="mt-5 w-fit"
                                label="Edit inputs"
                                ghost
                                onClick={() => history.push(`/${propID}/property/price/formFlow`)}
                              />
                            ) : (
                              <BrixelButtonPrimary
                                rounded
                                className="w-fit mt-5"
                                label="Complete now"
                                onClick={() => history.push(`/${propID}/property/price/formFlow`)}
                              />
                            )
                          }
                        </>
                      )
                    }
                  </div>
                </div>
              )
            }

            <div className="boxCard dis-fl-col">
              {
                get(estimation, 'result.higherValue', 0) > 0 ? (
                  <>
                    <h5 className="mb-3">Bestimate®</h5>
                    <p className="txtDark700">Your property is worth up to</p>

                    <div className="dis-f a-c w-perc-100 mt-3 ">
                      <span className="ff-mono fsize-600 fweight-700 txtPrimary700">
                        <span>{get(estimation, 'result.currency', '')}</span>
                        <span className="ml-1">{Helpers.formatNumberValue(get(estimation, 'result.higherValue', 0).toFixed(0), get(estimation, 'result.currency', ''))}</span>
                      </span>
                    </div>

                    <BrixelButtonSecondary
                      rounded
                      className="mt-5 w-fit"
                      label="Open"
                      ghost
                      onClick={() => openBestimate()}
                    />
                  </>
                ) : (
                  <>
                    {
                      ((get(estimation, 'status', null) !== 'pending' || !bestimateflowCompleted) && ((get(activeSingleProperty, 'properties.propertyType', '') === 'House' || get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment'))) ? (
                        <>
                          <h5 className="mb-3">Get a free price indication.</h5>
                          <p className="txtDark700">Compare your property to real transaction data to better define the pricing.</p>
                          <BrixelButtonPrimary
                            rounded
                            label="Get free Bestimate&reg;"
                            className="mt-3 w-fit"
                            onClick={() => onBestimateFlow()}
                            rightIcon="arrow-right"
                          />
                        </>
                      ) : (
                        <>
                          <h5 className="mb-3">Bestimate® is missing 🙁</h5>
                          <p className="txtDark700">We could not calculate your Bestimate®. No problem. Our support team will do it for you manually.</p>
                          <BrixelButtonSecondary
                            rounded
                            className="mt-3 w-fit"
                            label="Contact support"
                            onClick={() => history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/${activeSingleProperty.id}/property/price`)}
                          />
                        </>
                      )
                    }
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Price.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleGenerateBestimate: PropTypes.func.isRequired,
  handleGetEstimation: PropTypes.func.isRequired,
  handleSetHistory: PropTypes.func.isRequired,
  proEstimation: PropTypes.object,
  setSplashScreen: PropTypes.func.isRequired,
};

Price.defaultProps = {
  proEstimation: {},
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  proEstimation: get(state, 'brixelForm.Property.values.proEstimation', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  handleGetEstimation: bindActionCreators(getEstimation, dispatch),
  handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
  handleSetHistory: bindActionCreators(setHistory, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Price);
