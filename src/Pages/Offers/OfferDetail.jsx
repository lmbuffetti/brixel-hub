import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { BrixelButtonIcon, Helpers } from '@brixel/brixel-components';
import { setSplashType } from '../../actions/CommonActions';
import BrixelClosingTree from '../../components/BrixelClosingTree';
import { getActiveSingleDeal, setActiveSingleDeal } from '../../actions/DealActions';

const OfferDetail = (props) => {
  const {
    activeSingleDeal,
    activeSingleProperty,
    handleGetActiveSingleDeal,
    handleSetActiveSingleDeal,
    history,
    isBuyer,
    match,
  } = props;
  // PARAMS
  const dealID = get(match, 'params.dealID', null);

  useEffect(() => () => handleSetActiveSingleDeal({}), []);

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id !== dealID && !isBuyer) {
      const data = {
        id: dealID,
        smallLoader: true,
      };
      handleGetActiveSingleDeal(data);
    }
  }, [dealID, activeSingleProperty]);

  return (
    <>
      <div className="single-offer-container dis-fl-col pb-8 py-md-4 px-0 px-sm-2">
        {
          !isBuyer ? (
            <>
              <BrixelButtonIcon
                icon="arrow-left-small"
                theme="dark"
                ghost
                bgTransparent
                className="mb-3"
                onClick={() => history.push(`/${activeSingleProperty.id}/offers`)}
              />
              <div className="dis-f a-c mb-1">
                <h3>{get(activeSingleDeal, 'user.name', 'No Name')}</h3>
                {
                  activeSingleDeal.id === 'sample' && (
                    <div className="ml-2 brdRadiusSmall brdSmall bgPrimary200 txtPrimary400 p-small-4 fsize-200 ex-tag">
                      Example only
                    </div>
                  )
                }
              </div>
              <div className="offer-info dis-fl-row a-c mb-5">
                {
                  get(activeSingleDeal, 'user.email', null) && (
                    <a className="mr-3 txtDark700" href={`mailto:${get(activeSingleDeal, 'user.email', '')}`}>
                      {get(activeSingleDeal, 'user.email', '')}
                    </a>
                  )
                }
                {
                  get(activeSingleDeal, 'user.email', null) && (
                    <a className="mr-3 txtDark700" href={'tel:get(activeSingleDeal, \'user.phone\', \'\')'}>
                      {Helpers.telephoneFormat(get(activeSingleDeal, 'user.phone', ''))}
                    </a>
                  )
                }
              </div>
            </>
          ) : (
            <h3 className="mb-3">Deal</h3>
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
  activeSingleProperty: PropTypes.object.isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  handleGetActiveSingleDeal: PropTypes.func.isRequired,
  handleSetActiveSingleDeal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isBuyer: PropTypes.bool,
  match: PropTypes.object.isRequired,
};

OfferDetail.defaultProps = {
  isBuyer: false,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(OfferDetail);
