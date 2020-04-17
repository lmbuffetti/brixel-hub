import React  from 'react';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelIcon } from '@brixel/brixel-components';

const HomeDashboard = () => {
  const userType = 'test';

  return (
    <div className="supportCard pl-md-2 pr-md-1">
      <div>
        <BrixelIcon
          className="dis-ib fSizePx24"
          icon="question"
          background="primary"
          saturation={300}
          padding="p-small-12"
          color="white"
          saturationTxt={0}
        />
        <span className="my-1 dis-b fweight-500 txtDark700">Support</span>
        <p className="body2 txtDark500">How can I help you?</p>
      </div>
      <div>
        <BrixelIcon
          className="dis-ib mt-3"
          icon="first-time-occupancy"
          background="primary"
          padding="p-small-9"
          saturation={300}
          color="white"
          saturationTxt={0}
        />
        <span className="my-1 dis-b fweight-500 txtDark700">Upgrade</span>
        <p className="body2 txtDark500">Learn about Brixel Premium</p>
      </div>


      {
        userType === 'seller' && (
          <div className="buyer">
            <h5 className="mb-1 txtDark700">Buyer</h5>
            <div className="buyer-container dis-fl-row row-cols-3 jc-b a-c brdRadius py-2">
              <div className="dis-fl-col">
                <span className="number txtDark500">0</span>
                <span className="text">Requests</span>
              </div>
              <div className="dis-fl-col">
                <span className="number txtDark500">0</span>
                <span className="text">Visits</span>
              </div>
              <div className="dis-fl-col">
                <span className="number txtDark500">0</span>
                <span className="text">Offers</span>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
};

HomeDashboard.propTypes = {

};

HomeDashboard.defaultProps = {

};

export default compose(
  withRouter,
  connect(null, null),
)(HomeDashboard);
