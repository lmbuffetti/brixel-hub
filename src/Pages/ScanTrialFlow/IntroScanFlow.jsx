/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import ScanTrialPlaceholder from '../../images/scanTrial/placeholderScanTrial.png';

function IntroScanFlow(props) {
  return (
    <main id="rewards" className="pb-4 h-perc-100 txtDark700">
      <h3 className="mb-2">Get a free on-site appointment by one of our experts.</h3>
      <p className="mb-5">Here are your main advantages of it:</p>
      <div className="row">
        <div className="col-4">
          <img src={ScanTrialPlaceholder} alt="text-1" />
          <h5 className="mt-2 mb-1">First impressions matter.</h5>
          <p>Our experts will capture your property in its best possible light to stand out in the market. You can use these photos also <b>for free</b> in the Basic package.</p>
        </div>
        <div className="col-4">
          <img src={ScanTrialPlaceholder} alt="text-1" />
          <h5 className="mt-2 mb-1">Get only qualified buyers.</h5>
          <p>We will offer you a 3D tour of your property to improve the quality of your visitors. You can test the 3D tour <b>7 days for free</b>. No strings attached.</p>
        </div>
        <div className="col-4">
          <img src={ScanTrialPlaceholder} alt="text-1" />
          <h5 className="mt-2 mb-1">Know what your property is worth.</h5>
          <p>You will get to know what&apos;s the fair market value of your property thanks to a full estimation by our experts.</p>
        </div>
      </div>

      <h4 className="mt-5 mb-3">How does it work?</h4>

      <ol className="olLgNum">
        <li>
          <h5>Schedule your appointment.</h5>
          <p>Send us your request and add some date suggestions to it. We will connect you with one of our experts to find a suitable date.</p>
        </li>
        <li>
          <h5>Prepare your property.</h5>
          <p>Once you've sent us the relevant documents for the estimation, make sure your property is clean and styled for the scan.</p>
        </li>
        <li>
          <h5>Open the door</h5>
          <p>Our experts will do a full scan of your property to use it for photos, floor plans and a 3D tour. This digital twin of your property also helps to get an accurate estimation value.</p>
        </li>
        <li>
          <h5>Review the result.</h5>
          <p>We will upload the results directly into your hub. Depending on your plan you can use the full experience at least for 7 days as a trial.</p>
        </li>
      </ol>

    </main>
  );
}

IntroScanFlow.propTypes = {

};

IntroScanFlow.defaultProps = {
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(IntroScanFlow);
