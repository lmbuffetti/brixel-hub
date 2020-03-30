/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import MultiStepForm from '../../components/MultiStepReduxForm';
import { UpgradeQuestions } from '../../resources/Upgrade';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';

const Upgrade = (props) => {
  // PROPS
  const {
    formValue,
    history,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(UpgradeQuestions('en'));
  const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeWindow = () => {
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url);
  };

  const chageStep = () => {
    setCurrentIndex(currentIndex + 1);
    setPosition(position + 1);
  };

  useEffect(() => {
    if (formValue.id) {
      let newQuest = [];
      UpgradeQuestions('en').map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false
            }
            return null;
          });
          if (isValid) newQuest.push(quest);
        } else {
          newQuest.push(quest);
        }
        return null;
      });
      setQuestions(newQuest);
    }
  }, [formValue]);

  const valideConditionInput = (quest) => {
    let isVerified = true;
    if (quest.condition) {
      quest.condition.map((item) => {
        if (get(formValue, item.name, null) !== item.value) {
          isVerified = false;
        }
        return null;
      });
    }
    return isVerified;
  };

  const buttonLabel = () => {
    let label;
    if (currentIndex === 0) label = 'Order now';
    else if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else label = 'Next';
    return label;
  };

  return (
    <div className="bgLight200 p-1 h-perc-100" id="upgrade">
      <div className="w-perc-100 h-perc-100 bgWhite brdRadius shadow-1dp dis-fl-col">
        <div className="dis-f jc-fe p-1 p-md-2">
          <BrixelButtonIcon
            icon="close-small"
            color="primary"
            saturationTxt={400}
            bgTransparent
            noBorder
            className="shadow-1dp"
            onClick={() => closeWindow()}
          />
        </div>
        <div
          className="slideMultiStepForm h-perc-100"
          style={{ transform: `translate(-${position * 100}vw, 0)` }}
        >
          {
            questions.map((quest, i) => (
              <>

                <div
                  className={`dis-fl-col a-c singleStepUpgrade ${quest.background || ''} ${quest.vCentered ? 'vertCentered' : ''}`}
                  key={i.toString()}
                >
                  {
                    quest.inputs ? (
                      <div className={`subcontainer ${quest.className || ''}`}>
                        <h3>{quest.title}</h3>
                        <p>{quest.subtitle}</p>
                        {
                          quest.inputs.map((input, f) => (
                            <>
                              {
                                valideConditionInput(input) && (
                                  <MultiStepForm
                                    key={f.toString()}
                                    disableNextBtn={false}
                                    formValue={formValue}
                                    onClick={() => ''}
                                    input={input}
                                  />
                                )
                              }
                            </>
                          ))
                        }
                      </div>
                    ) : (
                      <div className={`subcontainer ta-c ${quest.className || ''}`}>
                        <img src={quest.img} alt={quest.title} />
                        <h3
                          className="mt-5"
                          dangerouslySetInnerHTML={{ __html: quest.title }}
                        />
                        <p
                          className="mt-2"
                          dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                        />
                      </div>
                    )
                  }
                </div>
              </>
            ))
          }
        </div>
        <div className="dis-f p-1 p-md-2">
          <div className="max-w-fix-544 m-a">
            <BrixelButtonPrimary
              rounded
              background={questions[currentIndex -1] ? 'primary' : 'red'}
              saturation={400}
              label={buttonLabel()}
              rightIcon="arrow-right-small"
              onClick={() => questions[currentIndex +1] ? chageStep() : closeWindow()}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

Upgrade.propTypes = {
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errorValue: get(state, 'form.Property.syncErrors', {}),
  formValue: get(state, 'form.Property.values', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(Upgrade);
