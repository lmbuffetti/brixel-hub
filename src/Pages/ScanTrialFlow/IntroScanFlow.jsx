/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import AnalyseImg from '../../images/scanTrial/analyse.png';
import DeliverImg from '../../images/scanTrial/deliver.png';
import YourTestImg from '../../images/scanTrial/your_test.png';
import DecideImg from '../../images/scanTrial/decide.png';

const IntroScanFlow = () => (
  <main id="rewards" className="introScanFlow pb-2 pb-sm-4 h-perc-100 txtDark700">
    <h2 className="mb-6 ta-c fweight-600">
      How it works
    </h2>
    <div className="hide dis-b-sm mb-1">
      <div className="row">
        <div className="col-3">
          <div className="ov-h ta-c">
            <img className="w-perc-100 max-w-fix-160" src={AnalyseImg} alt="text-1" />
          </div>
        </div>

        <div className="col-3">
          <div className="ov-h ta-c">
            <img className="w-perc-100 max-w-fix-160" src={DeliverImg} alt="text-1" />
          </div>
        </div>

        <div className="col-3">
          <div className="ov-h ta-c">
            <img className="w-perc-100 max-w-fix-160" src={YourTestImg} alt="text-1" />
          </div>
        </div>

        <div className="col-3">
          <div className="ov-h ta-c">
            <img className="w-perc-100 max-w-fix-160" src={DecideImg} alt="text-1" />
          </div>
        </div>
      </div>

      <div className="row">
        <span className="divider-line" />
      </div>
    </div>

    <div className="row">

      <div className="col-12 col-sm-3 mb-2 mb-sm-0">
        <div className="brdRadius ov-h ta-c">
          <img className="w-perc-100 max-w-fix-160 hide-sm" src={AnalyseImg} alt="text-1" />
          <div className="roundNumber ml-a mr-a">1</div>
          <h4 className="fweight-600 my-3 mb-1">We analyse</h4>
          <p className="max-w-fix-280 m-a">
            We estimate your property and define the sales process with you.
          </p>
        </div>
      </div>

      <div className="col-12 col-sm-3 mb-2 mb-sm-0">
        <div className="brdRadius ov-h ta-c">
          <img className="w-perc-100 max-w-fix-160 hide-sm" src={DeliverImg} alt="text-1" />
          <div className="roundNumber ml-a mr-a">2</div>
          <h4 className="fweight-600 my-3 mb-1">We deliver</h4>
          <p className="max-w-fix-280 m-a">
            We capture your property and create your personal Brixel Page.
          </p>
        </div>
      </div>

      <div className="col-12 col-sm-3 mb-2 mb-sm-0">
        <div className="brdRadius ov-h ta-c">
          <img className="w-perc-100 max-w-fix-160 hide-sm" src={YourTestImg} alt="text-1" />
          <div className="roundNumber ml-a mr-a">3</div>
          <h4 className="fweight-600 my-3 mb-1">You test</h4>
          <p className="max-w-fix-280 m-a">
            You review our work and can test our full service on the market.
          </p>
        </div>
      </div>

      <div className="col-12 col-sm-3 mb-2 mb-sm-0">
        <div className="brdRadius ov-h ta-c">
          <img className="w-perc-100 max-w-fix-160 hide-sm" src={DecideImg} alt="text-1" />
          <div className="roundNumber ml-a mr-a">4</div>
          <h4 className="fweight-600 my-3 mb-1">You decide</h4>
          <p className="max-w-fix-280 m-a">
            If you are happy, you book one of our service packages or withdraw without any costs.
          </p>
        </div>
      </div>
    </div>

  </main>
);

export default compose(
  withRouter,
)(IntroScanFlow);
