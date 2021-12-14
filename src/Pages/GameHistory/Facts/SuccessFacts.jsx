import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelProgressBar, BrixelButtonPrimary,
} from '@brixel/brixel-components';
import infoImg from '../../../images/Upgrade/info.svg';
import addFacts from '../../../images/secondLevel/addFacts.svg';
import addMoreFacts from '../../../images/secondLevel/addMoreFacts.svg';
import factsWellDone from '../../../images/secondLevel/factsWellDone.svg';
import {
  addGameHistory,
} from '../../../actions/GamificationActions';
import { calcPercentageFacts } from '../../../utils/helpers';

const FactsRewards = (props) => {
  const history = useNavigate();
  const {
    formValue,
    handleAddGameHistory,
    match,
    totalComplete,
  } = props;
  // STATE
  const [total, setTotal] = useState(totalComplete);
  // PARAMS URL
  const propID = get(match, 'params.propId', '');
  const perc = 25;

  useEffect(() => {
    if (calcPercentageFacts('Property', formValue).calcPerc > totalComplete) {
      setTotal(calcPercentageFacts('Property', formValue).calcPerc);
    }
  }, [formValue, totalComplete]);

  useEffect(() => {
    if (total >= perc) {
      handleAddGameHistory({ stub: 'facts' });
    }
  }, [total]);

  return (
    <main id="rewards" className="w-perc-100 h-perc-100 dis-fl-col a-c">
      <div className="dis-fl-col a-c">
        {
          total <= 9 && (
            <>
              <h5 className="ta-c mb-2">Provide all facts</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">Buyers appreciate a complete documentation. And it helps you to minimize your effort and building trust.</p>
            </>
          )
        }
        {
          total > 9 && total < perc && (
            <>
              <h5 className="ta-c mb-2">Add more facts</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">Try to complete <span className="txtGreen400 fsize-300 lh-in"> at least {perc}%</span> of
                all facts to achieve this reward.
              </p>
            </>
          )
        }

        {
          total >= perc && (
            <>
              <h5 className="ta-c mb-2">Well done</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">You completed at least {perc}% of all facts. Interested buyers will be very pleased. </p>
            </>
          )
        }

        <div className="brdRadius max-w-fix-232 w-perc-100 m-a my-5">
          { total <= 9 && (<img className="w-fix-148 dis-f m-a mb-2" src={addFacts} alt="Add Facts" />)}
          { total > 9 && total < perc && (<img className="w-fix-148 dis-f m-a mb-2" src={addMoreFacts} alt="Add More Facts" />)}
          { total >= perc && (<img className="w-fix-148 dis-f m-a mb-2" src={factsWellDone} alt="Facts Well Done" />)}
          <BrixelProgressBar
            rounded
            saturation={700}
            barBackground="Red"
            backgroundSaturation={100}
            progressValue={total}
            classBackground="ov-h brdRadius"
            goalValue={total > 9 && total < perc ? perc : null}
            showGoalValue={false}
            large={window.innerWidth >= 1024}
            small={window.innerWidth < 1024}
          />
          <p className="ff-mono body2 txtPrimary700 mt-1"><span className="notranslate">{total}%</span>&nbsp;<span>completed</span></p>
        </div>
        {
          total <= 9 && (
            <>
              <BrixelButtonPrimary
                label="Let's do this"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => history.push(`/${propID}/singleFlow/achievement/facts`)}
              />
            </>
          )
        }
        {
          total > 9 && total < perc && (
            <>
              <BrixelButtonPrimary
                label="Complete now"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => (total < perc ? history.push(`/${propID}/singleFlow/achievement/facts`) : history.push(`/${propID}/property/facts/propertyType`))}
              />
            </>
          )
        }
        {
          total >= perc && (
            <>
              <BrixelButtonPrimary
                label="Edit facts"
                rounded
                rightIcon="arrow-right"
                className="m-a"
                onClick={() => history.push(`/${propID}/property/facts/propertyType`)}
              />
            </>
          )
        }
      </div>

      <div className="dis-fl-col px-2 px-lg-4 pt-8">
        <hr className="mb-3 lighter" />
        <div className="dis-f a-t">
          <img src={infoImg} alt="Info Lamp" />
          <p className="ml-2 mb-3 mb-lg-0">
            <span className="fweight-500 txtDark700 fsize-300 dis-b">Note</span>
            <span className="txtDark700 fsize-300">It is proven that more information and higher transparency increase the selling price. Try to complete as much as possible to get the best result.</span>
          </p>
        </div>
      </div>
    </main>
  );
};

FactsRewards.propTypes = {
  formValue: PropTypes.object.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  totalComplete: PropTypes.number,
};

FactsRewards.defaultProps = {
  totalComplete: 9,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Property.values', { }),
  totalComplete: get(state, 'brixelForm.Property.values.inputSheet.totalComplete', 9),
});

const mapDispatchToProps = (dispatch) => ({
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(FactsRewards);
