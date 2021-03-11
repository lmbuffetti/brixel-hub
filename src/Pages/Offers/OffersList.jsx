import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonPrimary, FormatValue } from '@brixel/brixel-components';
import CoverPropertyImage from '../../components/CoverPropertyImage';

const OffersList = (props) => {
  const {
    history,
  } = props;

  return (
    <>
      <div className="jc-c h-perc-lg-100 pos-r a-t" id="offersDashboard">
        <div>
          <div className="w-perc-100 px-1">
            <div className="p-0 w-perc-100 dis-fl-col jc-b row-a-b col-12 pt-1">
              <h3>Offers List</h3>
              <BrixelButtonPrimary
                label="GO TO DETAIL"
                onClick={() => history.push('./offers/15')}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default compose(
  withRouter,
  connect(null, null),
)(OffersList);
