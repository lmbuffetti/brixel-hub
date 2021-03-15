import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { BrixelButtonIcon, Helpers } from '@brixel/brixel-components';
import { setSplashType } from '../../actions/CommonActions';
import BrixelClosingTree from '../../components/BrixelClosingTree';
import { getActiveSingleDeal } from '../../actions/DealActions';

const OfferDetail = (props) => {
  const {
    activeSingleDeal,
    handleGetActiveSingleDeal,
    isBuyer,
    match,
  } = props;
  // PARAMS
  const dealID = get(match, 'params.dealID', null);

  useEffect(() => {
    if (activeSingleDeal.id !== dealID && !isBuyer) {
      const data = {
        id: dealID,
        smallLoader: true,
      };
      handleGetActiveSingleDeal(data);
    }
  }, [dealID]);

  console.log(props.match);
  return (
    <>
      <div className="single-offer-container dis-fl-col py-4 px-2">
        {
          !isBuyer ? (
            <>
              <BrixelButtonIcon
                icon="arrow-left-small"
                theme="dark"
                ghost
                bgTransparent
                className="mb-3"
                onClick={() => history.push(`/${activeSingleProperty.id}/property/offers`)}
              />
              <h3 className="mb-1">{get(activeSingleDeal, 'user.name', 'No Name')}</h3>
              <div className="offer-info dis-fl-row a-c mb-5">
                <span className="mr-3">{get(activeSingleDeal, 'user.email', '')}</span>
                <span>{Helpers.telephoneFormat(get(activeSingleDeal, 'user.phone', ''))}</span>
              </div>
            </>
          ) : (
            <h3 className="mb-1">Deal</h3>
          )
        }
        <BrixelClosingTree
          isBuyer={isBuyer}
          offer={{}}
        />
      </div>
    </>
  );
};

OfferDetail.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  handleGetActiveSingleDeal: PropTypes.func.isRequired,
  isBuyer: PropTypes.bool,
  setSplashScreen: PropTypes.func.isRequired,
};

OfferDetail.defaultProps = {
  isBuyer: false,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OfferDetail);
