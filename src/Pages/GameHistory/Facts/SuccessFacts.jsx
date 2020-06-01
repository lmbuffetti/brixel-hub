import React from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import { BrixelProgressBar, BrixelButtonPrimary } from '@brixel/brixel-components';
import infoImg from '../../../images/Upgrade/info.svg';
import addFacts from '../../../images/secondLevel/addFacts.svg';
import addMoreFacts from '../../../images/secondLevel/addMoreFacts.svg';
import factsWellDone from '../../../images/secondLevel/factsWellDone.svg';

const FactsRewards = (props) => {
  const {
    history,
    match,
    totalComplete,
  } = props;
  // PARAMS URL
  const propID = get(match, 'params.propId', '');

  return (
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col a-c`}>
      <div className="dis-fl-col a-c">
        {
          totalComplete <= 9 && (
            <>
              <h5 className="ta-c mb-2">Provide all facts</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">Buyers appreciate a complete documentation. And it helps you to minimize your effort and building trust.</p>
            </>
          )
        }
        {
          totalComplete > 9 && totalComplete < 30 && (
            <>
              <h5 className="ta-c mb-2">Add more facts</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">Try to complete <span className="txtGreen400 fsize-300 lh-in"> at least 30%</span> of
                all facts to achieve this reward.</p>
            </>
          )
        }

        {
          totalComplete >= 30 && (
            <>
              <h5 className="ta-c mb-2">Well done</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300">You completed at least 30% of all facts. Interested buyers will be very pleased. </p>
            </>
          )
        }

        <div className="brdRadius max-w-fix-232 w-perc-100 m-a my-5">
          { totalComplete <= 9 && ( <img className="w-fix-148 dis-f m-a mb-2" src={addFacts} alt="Add Facts" />)}
          { totalComplete > 9 && totalComplete < 30 &&( <img className="w-fix-148 dis-f m-a mb-2" src={addMoreFacts} alt="Add More Facts" />)}
          { totalComplete >= 30 && ( <img className="w-fix-148 dis-f m-a mb-2" src={factsWellDone} alt="Facts Well Done" />)}
          <BrixelProgressBar
            rounded
            saturation={700}
            barBackground="Red"
            backgroundSaturation={100}
            progressValue={totalComplete}
            classBackground="ov-h brdRadius"
            goalValue={totalComplete > 9 && totalComplete < 30 ? 30 : null}
            showGoalValue={totalComplete > 9}
            large={window.innerWidth >= 1024}
            small={window.innerWidth < 1024}
          />
          <p className="ff-mono body2 txtPrimary700 mt-1"><span className="notranslate">{totalComplete}%</span>&nbsp;<span>completed</span></p>
        </div>
        {
          totalComplete <= 9 && (
            <>
              <BrixelButtonPrimary
                label="Let's do this"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-208 m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/facts`)}
              />
            </>
          )
        }
        {
          totalComplete > 9 && totalComplete < 30 && (
            <>
              <BrixelButtonPrimary
                label="Complete now"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-208 m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/facts`)}
              />
            </>
          )
        }
        {
          totalComplete >= 30 && (
            <>
              <BrixelButtonPrimary
                label="Edit facts"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-208 m-a"
                onClick={() => history.push(`/${propID}/rewards/achievement/facts`)}
                //onClick={() => history.push(`/${propID}/property/facts/propertyType`)}
              />
            </>
          )
        }
      </div>

      <div className="dis-fl-col px-2 px-md-4 pt-8">
        <hr className="mb-3 lighter" />
        <div className="dis-f a-t">
          <img src={infoImg} alt="Info Lamp" />
          <p className="ml-2">
            <span className="fweight-500 txtDark700 fsize-300 dis-b">Note</span>
            <span className="txtDark700 fsize-300">It is proven that more information and higher transparency increase the selling price. Try to complete as much as possible to get the best result.</span>
          </p>
        </div>
      </div>
    </main>
  )
};

FactsRewards.propTypes = {
  history: Proptypes.object.isRequired,
  match: Proptypes.object.isRequired,
  totalComplete: Proptypes.number,
}

FactsRewards.defaultProps = {
  totalComplete: 9,
}

const mapStateToProps = (state) => ({
  totalComplete: get(state, 'form.Property.values.inputSheet.totalComplete', 9),
})

export default compose (
  withRouter,
  connect(mapStateToProps, null)
)(FactsRewards);
