import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddNewOffer from './AddNewOffer';
import { setSplashType } from '../../actions/CommonActions';

const OfferDetail = (props) => {
  const {
    setSplashScreen,
  } = props;

  useEffect(() => {
    setSplashScreen({
      component: AddNewOffer,
    });
  }, []);

  return (
    <>
      <div className="jc-c h-perc-lg-100 pos-r a-t" id="offerDashboard">
        <div>
          <div className="w-perc-100 px-1">
            <div className="p-0 w-perc-100 dis-fl-col jc-b row-a-b col-12 pt-1">
              <h3>Offers Detail</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

OfferDetail.propTypes = {
  setSplashScreen: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(OfferDetail);
