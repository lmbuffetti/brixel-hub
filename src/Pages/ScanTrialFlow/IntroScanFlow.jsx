/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
// import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import FirstImpression from '../../images/scanTrial/firstImpression.png';
import scanTrialImg2 from '../../images/scanTrial/scanTrialImg2.png';
import scanTrialImg3 from '../../images/scanTrial/scanTrialImg3.png';

const IntroScanFlow = () => (
  <main id="rewards" className="introScanFlow pb-4 h-perc-100 txtDark700">
    {/* TODO change value with dynamic data from the company */}
    <h3 className="mb-2 max-w-fix-544">Test drive our service and get the full experience worth CHF 9'900.</h3>
    <h5 className="mb-5 txtDark200">Here are your main benefits:</h5>
    <div className="row">
      <div className="col-12 col-sm-4 mb-2 mb-sm-0">
        <div className="brdRadius ov-h">
          <img className="w-perc-100" src={FirstImpression} alt="text-1" />
          <h5 className="mt-2 mb-1">First impressions matter.</h5>
          <p>Our experts will capture your property in its best possible light to stand out in the market. You can use these photos also <b>for free</b> after your trial.</p>
        </div>
      </div>
      <div className="col-12 col-sm-4 mb-2 mb-sm-0">
        <div className="brdRadius ov-h">
          <img src={scanTrialImg2} alt="text-1" />
          <h5 className="mt-2 mb-1">Get only qualified buyers.</h5>
          <p>We will offer you a 3D tour of your property to improve the quality of your visitors. You can test the 3D tour <b>7 days for free</b>. No strings attached.</p>
        </div>
      </div>
      <div className="col-12 col-sm-4 brdRadius">
        <div className="brdRadius ov-h">
          <img src={scanTrialImg3} alt="text-1" />
          <h5 className="mt-2 mb-1">Know what your property is worth.</h5>
          <p>You will get to know what's the fair market value of your property thanks to a full estimation by our experts.</p>
        </div>
      </div>
    </div>

    <h4 className="my-5">How does it work?</h4>

    <ol className="olLgNum">
      <li>
        <h5>Schedule your appointment.</h5>
        <p>Send us your request and add some date suggestions to it. Our experts will confirm your appointment.</p>
      </li>
      <li>
        <h5>Prepare your property.</h5>
        <p>Once you've sent us the relevant documents for the estimation, make sure your property is clean and styled for the scan.</p>
      </li>
      <li>
        <h5>Open the door.</h5>
        <p>Our experts will do a full scan of your property to use it for photos, floor plans and the 3D tour. This digital twin of your property also helps to get an accurate estimation value.</p>
      </li>
      <li>
        <h5>Review the result.</h5>
        <p>We will prepare everything for your marketing. You can use our full experience for 7 days as a trial. Decide afterwards if you want to continue working with us.</p>
      </li>
    </ol>

  </main>
);

export default compose(
  withRouter,
)(IntroScanFlow);
