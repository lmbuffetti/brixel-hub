/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Helpers } from '@brixel/brixel-components';
import AnalyseImg from '../../images/scanTrial/analyse.png';
import DeliverImg from '../../images/scanTrial/deliver.png';
import YourTestImg from '../../images/scanTrial/your_test.png';
import DecideImg from '../../images/scanTrial/decide.png';

const IntroScanFlow = (props) => {
  const {
    activeSingleCompany,
  } = props;

  return (
    <main id="rewards" className="introScanFlow pb-4 h-perc-100 txtDark700">
      <h3 className="mb-2 ta-c">
        How it works
      </h3>

      <div className="row">
        <div className="col-12 col-sm-3 mb-2 mb-sm-0">
          <div className="brdRadius ov-h ta-c">
            <img className="w-perc-100" src={AnalyseImg} alt="text-1" />
            <div className="roundNumber ml-a mr-a">1</div>
            <h5 className="mt-2 mb-1">We analyse</h5>
            <p>
              We estimate your property and define the sales process with you.
            </p>
          </div>
        </div>

        <div className="col-12 col-sm-3 mb-2 mb-sm-0">
          <div className="brdRadius ov-h ta-c">
            <img className="w-perc-100" src={DeliverImg} alt="text-1" />
            <div className="roundNumber ml-a mr-a">2</div>
            <h5 className="mt-2 mb-1">We deliver</h5>
            <p>
              We capture your property and create your personal Brixel Page.
            </p>
          </div>
        </div>

        <div className="col-12 col-sm-3 mb-2 mb-sm-0">
          <div className="brdRadius ov-h ta-c">
            <img className="w-perc-100" src={YourTestImg} alt="text-1" />
            <div className="roundNumber ml-a mr-a">3</div>
            <h5 className="mt-2 mb-1">You test</h5>
            <p>
              You review our work and can test our full service on the market.
            </p>
          </div>
        </div>

        <div className="col-12 col-sm-3 mb-2 mb-sm-0">
          <div className="brdRadius ov-h ta-c">
            <img className="w-perc-100" src={DecideImg} alt="text-1" />
            <div className="roundNumber ml-a mr-a">4</div>
            <h5 className="mt-2 mb-1">You decide</h5>
            <p>
              If you are happy, you book one of our service packages or withdraw without any costs.
            </p>
          </div>
        </div>
      </div>

    </main>
  );
};

IntroScanFlow.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(IntroScanFlow);
