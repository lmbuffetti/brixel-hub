/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelIcon,
  BrixelButtonIcon,
  BrixelProgressBar,
  BrixelButtonText,
  Helpers, translateTo,
} from '@brixel/brixel-components';
import { change } from '@brixel/brixel-components/dist/utils/ReduxForm.Functions';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import last from 'lodash/last';
import { setPageData } from '../../actions/CommonActions';
import { InputSheets } from '../../resources/SingleProperty/inputSheets';
import { calcPercentageFacts, checkBrowser } from '../../utils/helpers';

// COMPONENTS
import FactsQuestion from './FactsQuestion';

const Facts = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    changeFieldValue,
    formValue,
    handleSaveData,
    lang,
    windowDimensions,
  } = props;

  // STATE
  const [Questions, setQuestions] = useState(InputSheets('facts', lang));
  const [selectedQuest, setSelectedQuest] = useState(null);
  // PARAMS URL
  const propID = get(match, 'propID', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // FUNCTION TO CHECK IF MAIN SECTION IS FINISH OR NOT
  const checkSectionDone = (val, act = 'section') => {
    let sectionDone = true;
    val.inputs.map((item) => {
      if (item.validation) {
        const nameCondition = get(item, 'condition.name', '');
        const valA = get(formValue, nameCondition, 'a');
        if (item.conditions) {
          item.conditions.map((cond) => {
            if (sectionDone) {
              const valB = get(formValue, cond.name, 'a');
              if (valB === cond.value && (get(formValue, item.name, 'ayc') === 'ayc' || get(formValue, item.name, 'ayc') === null)) sectionDone = false;
            }
            return null;
          });
        } else if (sectionDone && (!item.condition || (item.condition && valA === item.condition.value))) {
          if (get(formValue, `inputSheet.skipSection[${item.name}]`, true) !== true) {
            sectionDone = false;
          } else if (get(formValue, item.name, 'ayc') === 'ayc' || get(formValue, item.name, 'ayc') === null) {
            sectionDone = false;
          }
        }
      } else if (Helpers.isEmpty(get(formValue, item.name, ''))) sectionDone = false;
      return null;
    });
    if (act === 'section') return sectionDone;
    return null;
  };

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    if (calcPercentageFacts().calcPerc !== calcPercentageFacts().savedPerc) {
      const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
      inputSheet.totalComplete = calcPercentageFacts().calcPerc;
      changeFieldValue('inputSheet', inputSheet);
    }
    if (selectedQuest) {
      const findCurrentId = Questions.findIndex((quest) => quest.history === selectedQuest.history);
      const quest = InputSheets('facts', lang)[findCurrentId];
      setQuestions(InputSheets('facts', lang));
      setSelectedQuest(quest);
    }
  }, [formValue]);

  // ON CHANGE HISTORY SELECT THE CORRECT QUESTIONS
  useEffect(() => {
    if (history && !selectedQuest && getFact() !== 'facts') {
      const quest = Questions.find((item) => item.history === getFact());
      setSelectedQuest(quest);
    } else if (getFact() === 'facts') {
      setSelectedQuest(null);
    }
  }, [history, getFact()]);

  // ON CLICK SELECT THE RIGHT QUESTIONS AND CHANGE THE URL
  const onSelectQuest = (quest) => {
    // TODO
    setTimeout(() => {
      history.push(`/${propID}/property/facts/${quest.history}`);
      setSelectedQuest(quest);
    }, 0);
  };

  // FUNCTION TO GO TO NEXT QUESTIONS LIST
  const onNextSection = (act) => {
    const findCurrentId = Questions.findIndex((quest) => quest.history === selectedQuest.history);
    if (findCurrentId > -1 && Questions[findCurrentId + 1]) {
      if (act === 'label') {
        return Questions[findCurrentId + 1].title;
      }
      if (act === 'click') {
        onSelectQuest(Questions[findCurrentId + 1]);
        const scrollElement = document.getElementById('bodyScroll');
        const scrollElementMobile = document.getElementById('factsQuestion');
        if (checkBrowser() > 0) {
          if (scrollElement && scrollElement.scrollTop) scrollElement.scrollTop = 0;
          if (scrollElementMobile && scrollElementMobile.scrollTop) scrollElementMobile.scrollTop = 0;
        } else {
          if (scrollElement && scrollElement.scrollTo) scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
          if (scrollElementMobile && scrollElementMobile.scrollTo) scrollElementMobile.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      handleSaveData('saveFacts');
    }
    return null;
  };

  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">{translateTo('Facts', lang)}</h3>
      <div className="dis-f h-perc-lg-100">
        <div
          className={`secondLevel w-perc-100 h-perc-lg-100 ${getFact() !== 'facts' && windowDimensions.width >= 1024 ? 'hide' : 'dis-fl-col'}`}
        >
          <div className="dis-fl-col backPanel hide-lg">
            <h5 className="sectionTitle">{translateTo('Facts', lang)}</h5>
          </div>
          <div className="boxCard flex-1">
            <div className="dis-fl-col">

              <div className="mt-3 mb-3">
                <BrixelProgressBar
                  rounded
                  saturation={700}
                  large
                  barBackground="Red"
                  backgroundSaturation={100}
                  progressValue={get(formValue, 'inputSheet.totalComplete', 0)}
                />
                <h6 className="mt-1 ff-mono txtPrimary700"><span className="notranslate">{get(formValue, 'inputSheet.totalComplete', 0)}%</span><span>&nbsp;</span><span>complete</span></h6>
              </div>
              <div className="inputSheet">
                {
                  Questions.map((quest, i) => (
                    <button
                      type="button"
                      className={`dis-b w-perc-100 accordWrap cur-poi ${selectedQuest && selectedQuest.history === quest.history ? 'active' : ''}`}
                      key={`qst_${i.toString()}`}
                      onClick={() => onSelectQuest(quest)}
                      aria-label={quest.title}
                    >
                      <div className="accordControl dis-f a-c jc-b py-small-14">
                        <div className="accordTitle dis-f a-c">
                          <BrixelIcon
                            icon="check"
                            bgTransparent
                            color="green"
                            saturationTxt={400}
                            className={`${checkSectionDone(quest) ? 'opacity10' : 'opacity0'} mx-1 dis-b fsize-400`}
                          />
                          <h4 className={`body ml-1 fweight-400 ${checkSectionDone(quest) ? 'txtDark200 td-lt' : 'txtDark200'}`}>
                            {quest.title}
                          </h4>
                        </div>
                        <BrixelIcon
                          className="fsize-400 mr-1 onHover"
                          icon="arrow-simple-right"
                          color="light"
                          saturationTxt={400}
                          bgTransparent
                        />
                      </div>

                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        {
          selectedQuest && getFact() !== 'facts' && (
            <div className="dis-f w-perc-100">
              <BrixelButtonIcon
                className="hide dis-b-md"
                icon="arrow-left-small"
                ghost
                theme="dark"
                onClick={() => history.push(`/${propID}/property/facts`)}
              />
              <div className="thirdLevel inputSheet dis-fl-col w-perc-100 ml-lg-2" id="factsQuestion">
                <div className="boxCard">
                  <div className="">
                    <FactsQuestion quest={selectedQuest} />
                    <div className="dis-f jc-fe mb-1">
                      {
                        onNextSection('label') && (
                          <BrixelButtonText
                            rightIcon="arrow-right"
                            onClick={() => onNextSection('click')}
                            label={onNextSection('label')}
                          />
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};

Facts.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveData: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Facts.defaultProps = {
};

const mapStateToProps = (state) => ({
  errorValue: get(state, 'brixelForm.Property.syncErrors', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  activeSingleUser: get(state, 'user.activeSingleUser', {}),
  singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
  notification: get(state, 'common.notification', []),
  initial: get(state, 'brixelForm.Property.initial', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  handleSaveData: bindActionCreators(setPageData, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Facts);
