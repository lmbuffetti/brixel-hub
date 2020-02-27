import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { BrixelIcon } from '@brixel/brixel-components';

function LocalMarketCheck(props) {
  // PROPS
  const {
    finishStep,
  } = props;

  return (
    <main id="rewards" className="pb-4">
      {
        finishStep ? (
          <>
            <h6>You already got the Market Checker Award</h6>
            <BrixelIcon icon="cup-awards" />
            <p>We update these data every day for you. Do you want to update your local market check now?</p>
          </>
        ) : (
          <>
            <h6>Congrats. You earned teh Market Checker Award and another 100 Brixels.</h6>
            <BrixelIcon icon="cup-awards" />
          </>
        )
      }
    </main>
  );
}

LocalMarketCheck.propTypes = {
  finishStep: PropTypes.bool
};

LocalMarketCheck.defaultProps = {
  finishStep: false,
};

const mapStateToProps = () => ({

});
const mapDispatchToProps = () => ({
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LocalMarketCheck);
