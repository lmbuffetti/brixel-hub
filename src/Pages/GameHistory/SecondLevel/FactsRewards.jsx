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
    <main id="rewards" className={`w-perc-100 h-perc-100 dis-fl-col`}>
      <div className="dis-fl-col a-c">
        <div className="brdRadius max-w-fix-232 w-perc-100 m-a mt-2">
          { totalComplete <= 9 && ( <img className="mb-2 w-fix-148 dis-f m-a" src={addFacts} alt="Add Facts" />)}
          { totalComplete > 9 && totalComplete < 70 &&( <img className="mb-2 w-fix-148 dis-f m-a" src={addMoreFacts} alt="Add More Facts" />)}
          { totalComplete >= 70 && ( <img className="mb-2 w-fix-148 dis-f m-a" src={factsWellDone} alt="Facts Well Done" />)}
          <BrixelProgressBar
            rounded
            saturation={700}
            barBackground="Red"
            backgroundSaturation={100}
            progressValue={totalComplete}
            classBackground="ov-h brdRadius"
            goalValue={totalComplete > 9 ? 70 : null}
            showGoalValue={totalComplete > 9}
            large={window.innerWidth >= 768}
            small={window.innerWidth < 768}
          />
          <p className="ff-mono body2 txtPrimary700 mt-1"><span>{totalComplete}%</span>&nbsp;<span>completed</span></p>
        </div>

        {
          totalComplete >= 70 && (
            <>
              <h5 className="ta-c mt-3 mb-2">Well done</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300 mb-3">You completed at least 70% of all facts. Interested buyers will be very pleased. </p>
              <BrixelButtonPrimary
                label="Edit facts"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
                onClick={() => history.push(`/${propID}/property/facts/propertyType`)}
              />
            </>
          )
        }
        {
          totalComplete > 9 && totalComplete < 70 && (
            <>
              <h5 className="ta-c mt-3 mb-2">Add more facts</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300 mb-3">Try to complete <span className="txtGreen400">at least 70%</span> of
                all facts to achieve this reward.</p>
              <BrixelButtonPrimary
                label="Complete now"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
                onClick={() => history.push(`/${propID}/property/facts/propertyType`)}
              />
            </>
          )
        }
        {
          totalComplete <= 9 && (
            <>
              <h5 className="ta-c mt-3 mb-2">Provide all facts</h5>
              <p className="max-w-fix-376 m-a ta-c txtDark200 fsize-300 fsize-300 mb-3">Buyers appreciate a complete documentation. And it helps you to minimize your effort and building trust.</p>
              <BrixelButtonPrimary
                label="Let's do this"
                rounded
                rightIcon="arrow-right"
                className="min-w-fix-216 m-a"
                onClick={() => history.push(`/${propID}/property/facts/propertyType`)}
              />
            </>
          )
        }
      </div>

      <div className="dis-fl-col px-2 px-md-4 pt-4 pt-md-9">
        <hr className="my-3 lighter" />
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
