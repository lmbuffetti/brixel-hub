import React, { useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Helpers } from '@brixel/brixel-components';
import { useParams } from 'react-router-dom';
import { setSplashType } from '../../actions/CommonActions';
import BrixelClosingTree from '../../components/BrixelClosingTree';
import { getActiveSingleDeal, setActiveSingleDeal } from '../../actions/DealActions';

const OfferDetail = (props) => {
  const match = useParams();
  const {
    activeSingleDeal,
    activeSingleProperty,
    handleGetActiveSingleDeal,
    isBuyer,
    windowDimensions,
  } = props;
  // PARAMS
  const dealID = get(match, 'dealID', null);
  const propID = get(match, 'propID', null);

  // useEffect(() => () => handleSetActiveSingleDeal({}), []);

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id !== dealID && !isBuyer) {
      const data = {
        id: dealID,
        smallLoader: 'getDeal',
      };
      handleGetActiveSingleDeal(data);
    }
  }, [dealID, activeSingleProperty]);

  return (
    <>
      <div className={`single-offer-container ${isBuyer && windowDimensions.width <= 1024 ? 'secondLevel p-2' : ''} dis-fl-col pb-4 pl-sm-1 pr-sm-2 dealsListings`}>
        <div className="hideStyle">
          {
            !isBuyer ? (
              <>
                <div className="offer-info dis-f a-c mb-1">
                  <h5>{get(activeSingleDeal, 'user.name', 'No Name')}</h5>
                  {
                    activeSingleDeal.id === 'sample' && (
                      <div className="ml-2 brdRadiusSmall brdSmall bgPrimary200 txtPrimary400 p-small-4 fsize-200 ex-tag">
                        Example only
                      </div>
                    )
                  }
                </div>
                <div className="offer-info dis-fl-row a-c mb-2 mb-md-5">
                  {
                    get(activeSingleDeal, 'user.email', null) && (
                      <a className="mr-3 txtDark700" href={`mailto:${get(activeSingleDeal, 'user.email', '')}`}>
                        {get(activeSingleDeal, 'user.email', '')}
                      </a>
                    )
                  }
                  {
                    get(activeSingleDeal, 'user.email', null) && (
                      <a className="mr-3 txtDark700" href={`tel:${get(activeSingleDeal, 'user.phone', '')}`}>
                        {Helpers.telephoneFormat(get(activeSingleDeal, 'user.phone', ''))}
                      </a>
                    )
                  }
                </div>
              </>
            ) : (
              <div>
                <h3 className="mb-3 hide dis-b-lg">Closing</h3>
                <div className="dis-fl-col backPanel hide-lg">
                  <h5 className="sectionTitle">Closing</h5>
                </div>
              </div>
            )
          }
          <BrixelClosingTree
            propID={propID}
            isBuyer={isBuyer}
            offer={{}}
          />
        </div>
      </div>
    </>
  );
};

OfferDetail.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  handleGetActiveSingleDeal: PropTypes.func.isRequired,
  isBuyer: PropTypes.bool,
  windowDimensions: PropTypes.object.isRequired,
};

OfferDetail.defaultProps = {
  isBuyer: false,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(OfferDetail);
