/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  // BrixelButtonPrimary,
  BrixelButtonSecondary,
  // BrixelIcon,
  BrixelInputText,
  BrixelSelect,
  Helpers,
  BrixelButtonText,
  ReduxField,
  change,
  reset, BrixelButtonIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { factsOptions } from '@brixel/brixel-components/dist/constants/Facts';
import { setSplashType } from '../../actions/CommonActions';
import { InputSheets } from '../../resources/inputSheets';
import { calcPercentageFacts } from '../../utils/helpers';

// COMPONENTS
// import ProgressRing from '../../components/ProgressRing';
import BestimateCardOverlay from '../../components/BestimateCardOverlay';

const Price = (props) => {
  const {
    changeFieldValue,
    estimation,
    formValue,
    history,
    match,
    setSplashScreen,
    windowDimensions,
  } = props;

  // STATE
  const [Questions, setQuestions] = useState(InputSheets(formValue));
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [allSettings, setAllSettings] = useState(false);
  // PARAMS URL
  const propID = get(match, 'params.propId', null);

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    if (calcPercentageFacts().calcPerc !== calcPercentageFacts().savedPerc) {
      const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
      inputSheet.totalComplete = calcPercentageFacts().calcPerc;
      changeFieldValue('inputSheet', inputSheet);
    }
    if (selectedQuest) {
      const findCurrentId = Questions.findIndex((quest) => quest.history === selectedQuest.history);
      const quest = InputSheets(formValue)[findCurrentId];
      setQuestions(InputSheets(formValue));
      setSelectedQuest(quest);
    }
  }, [formValue]);

  useEffect(() => {
    if (windowDimensions.width <= 1024) {
      setTimeout(() => {
        const hubDashboard = document.getElementsByClassName('hubDashboard')[0];
        if (hubDashboard) hubDashboard.classList.add('secondLevelActive');
      }, 10);
    }
  }, []);

  const openBestimate = () => {
    setSplashScreen({
      component: BestimateCardOverlay,
      props: {
        clearEstimation: false,
      },
    });
  };

  return (
    <div className="factsWrapper dis-f h-perc-lg-100">

      <div className="secondLevel dis-fl-col w-perc-100 h-perc-lg-100">

        <div className="hideStyle dis-fl-col backPanel dis-b hide-md">
          <div className="fixedIcon w-perc-100">
            <BrixelButtonIcon
              className=""
              icon="arrow-left-small"
              theme="dark"
              ghost
              onClick={() => history.push(`/${propID}/property`)}
            />
          </div>
          <h5 className="sectionTitle">Price</h5>
        </div>

        <h3 className="mb-3 hide dis-b-md">Price</h3>

        <div className="hideStyle dis-f-md a-t jc-b px-2 p-lg-0">
          <div className="dis-fl-col boxCard mr-2 w-perc-100 mb-5 mb-lg-0">
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

            <div className={`${allSettings ? '' : 'hide'} dis-b-md`}>
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

              <hr className="lighter mt-3 mb-3" />

              <p className="txtDark200 mb-3">For what price did you buy the property?</p>

              <ReduxField
                ReduxFieldClass="w-perc-80"
                form="Property"
                component={BrixelInputText}
                input={{
                  placeholder: '700\'000',
                  name: 'properties.building.purchasePrice',
                  unit: get(formValue, 'price.currency', ''),
                }}
                inputFormat={{
                  currency: get(formValue, 'price.currency', ''),
                  formatType: 'price',
                }}
                labels={{
                  label: 'Purchase price',
                }}
              />

              <ReduxField
                ReduxFieldClass="w-perc-60 mt-2"
                form="Property"
                component={BrixelInputText}
                input={{
                  placeholder: 'MM/YYYY',
                  name: 'properties.building.purchaseDate',
                }}
                inputFormat={{
                  formatType: 'date-mm:yyyy',
                }}
                labels={{
                  label: 'Purchase date',
                }}
              />
            </div>

            {
              windowDimensions.width <= 1024 && (
                <div className="mt-2">
                  <BrixelButtonText
                    label={allSettings ? 'Fewer settings' : 'Show all settings'}
                    onClick={() => setAllSettings(!allSettings)}
                    rightIcon={allSettings ? 'minus-small' : 'plus-small'}
                  />
                </div>
              )
            }
          </div>

          <div className="ml-md-1 w-perc-100">
            {/*
            <div className="dis-fl-col boxCard mb-5 pb-5">
              <h5 className="mb-3">Pro Estimation</h5>

              <p className="txtDark700">Complete your inputs to <span className="txtRed400 fweight-700">unlock</span> your professional estimation.</p>

              <div className="dis-f a-c w-perc-100 my-3">
                <span className="ff-mono fsize-600 fweight-700 txtPrimary700">CHF</span>
                <div className="w-perc-100 h-fix-40 bgBlue100 bgBlur mx-1" />
                <BrixelIcon
                  color="red"
                  icon="locked"
                />
              </div>

              <div className="dis-f a-c">
                <ProgressRing
                  progress={get(formValue, 'inputSheet.totalComplete', 0)}
                  size={45}
                  strokeWidth={6}
                  circleOneStroke="#DCDDDE"
                  circleTwoStroke="#387AFF"
                  showIcon={false}
                />
                <div className="ml-2">
                  <p>Inputs</p>
                  <p className="ff-mono fweight-700 txtPrimary700">
                    <span className="mr-1 notranslate">{get(formValue, 'inputSheet.totalComplete', 0)}%</span>
                    <span>completed</span>
                  </p>
                </div>
              </div>

              <BrixelButtonPrimary
                rounded
                className="w-fit mt-5"
                label="Complete now"
              />

            </div>
            */}
            <div className="dis-fl-col boxCard pb-5">
              <h5 className="mb-3">Bestimate®</h5>

              <p className="txtDark700">Your property is worth up to</p>

              <div className="dis-f a-c w-perc-100 mt-3 ">
                {
                  get(estimation, 'result.higherValue', 0) > 0 && (
                    <span className="ff-mono fsize-600 fweight-700 txtPrimary700">
                      <span>{get(estimation, 'result.currency', '')}</span>
                      <span className="ml-1">{Helpers.formatNumberValue(get(estimation, 'result.higherValue', 0).toFixed(0), get(estimation, 'result.currency', ''))}</span>
                    </span>
                  )
                }
              </div>

              <BrixelButtonSecondary
                rounded
                className="mt-5 w-fit"
                label="Open"
                ghost
                onClick={() => openBestimate()}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Price.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  estimation: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Price.defaultProps = {
};

const mapStateToProps = (state) => ({
  estimation: get(state, 'property.estimation', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)));
  },
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Price);
