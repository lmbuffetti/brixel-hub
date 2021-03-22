/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonBox, BrixelProgressBar } from '@brixel/brixel-components';
import get from 'lodash/get';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';
import Loadable from 'react-loadable';
import Sticker from 'react-stickyfill';
import Loading from '../../../components/Loading';
import { getOfferListings, setActiveSingleDeal } from '../../../actions/DealActions';

const Deals = Loadable({
  loader: () => import('../../Deals/Deals' /* webpackChunkName: "Deals" */),
  loading: Loading,
});

const DashboardOffer = Loadable({
  loader: () => import('../../Offers/DashboardOffer' /* webpackChunkName: "DashboardOffer" */),
  loading: Loading,
});

const ListingsDashboard = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    activeSinglePropertyDealsCount,
    handleGetOfferListings,
    history,
    match,
    offerListings,
    windowDimensions,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const getFact = () => last(history.location.pathname.split('/'));

  // ON DESKTOP REDIREECT TO /LISTINGS/PAGE
  useEffect(() => {
    if (windowDimensions && windowDimensions.width > 1024 && getFact() === 'deals') {
      history.push({ pathname: `/${propID}/deals/list` });
    }
  }, [windowDimensions, getFact()]);

  useEffect(() => {
    const data = {
      id: activeSingleProperty.id,
    };
    if (activeSingleProperty.id) handleGetOfferListings(data);
  }, [activeSingleProperty]);

  // CHECK THE STATUS OF PROPERTY
  const statusBuyer = () => {
    const totalInterest = get(activeSinglePropertyDealsCount, 'Interested.total', 0);
    const totalOffer = get(activeSinglePropertyDealsCount, 'Offer.total', 0);
    const totalVisit = get(activeSinglePropertyDealsCount, 'Visit.total', 0);

    const total = totalInterest + totalOffer + totalVisit;
    return `Total ${total}`;
  };

  // CHECK STATUS PORTALS
  const statusOffer = () => {
    if (offerListings.length > 0) return `Total ${offerListings.length}`;
    return 'No offers yet';
  };

  // CLASS FOR OPEN/CLOSE COLUMNS
  const openCloseColumn = () => {
    if (
      (history.location.pathname.includes('showings') && getFact() !== 'showings')
    ) {
      return 'closed';
    }
    return 'opened';
  };

  return (
    <div className="listings-container dis-f jc-fs h-perc-lg-100 a-t" id="listingsDashaboard">
      <Sticker>
        {
          windowDimensions.width <= 1024 && (
            <div className={`firstLevel mr-lg-2 expandableColumn ${openCloseColumn() === 'opened' ? 'mr-lg-2' : 'collapsed'}`}>

              <div className="dis-f">
                <BrixelButtonBox
                  verticalView
                  bgTransparent
                  icon="users"
                  label="Buyers"
                  labelClass="fweight-400 pb-small-6"
                  subtitle={statusBuyer()}
                  subtitleClass="fsize-200"
                  className={`w-perc-100 max-w-perc-50 mr-1 shadow-1dp brdMedium p-2 ${getFact() === 'page' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                  colorIcon="primary700"
                  backIcon="primary100"
                  onClick={() => history.push(`/${propID}/deals/list`)}
                />
                <BrixelButtonBox
                  verticalView
                  bgTransparent
                  icon="document-highlight"
                  label="Offers"
                  labelClass="fweight-400 pb-small-6"
                  subtitle={statusOffer()}
                  subtitleClass="fsize-200"
                  className={`w-perc-100 max-w-perc-50 ml-1 shadow-1dp brdMedium p-2 ${getFact() === 'portals' ? 'brdPrimary400 bgWhite' : 'brdTrans'}`}
                  colorIcon="primary700"
                  backIcon="primary100"
                  onClick={() => history.push(`/${propID}/deals/offers`)}
                  selected
                />
              </div>

              <div className="brdRadius shadow-1dp brdPrimary400 mt-1 hide">
                <div className="transparency-container">
                  <div className="dis-fl-col ta-l">
                    <BrixelButtonBox
                      bgTransparent
                      icon="users"
                      label="Buyers"
                      className="w-perc-100"
                      colorIcon="primary700"
                      backIcon="primary100 mr-1"
                      hoverEffect={false}
                    />
                  </div>
                </div>

                <div className="details dis-fl-col p-1">
                  <div className="dis-fl-row jc-b a-c mb-2">
                    <span className="mr-1 body2 w-fix-80">Request</span>
                    <div className="w-fix-304">
                      <BrixelProgressBar
                        progressValue={35}
                        saturation={700}
                      />
                    </div>
                    <span className="ml-1 body2 ff-mono txtPrimary700">12</span>
                  </div>

                  <div className="dis-fl-row jc-b a-c mb-2">
                    <span className="mr-1 body2 w-fix-80">Showings</span>
                    <div className="w-fix-304">
                      <BrixelProgressBar
                        progressValue={12}
                        saturation={700}
                      />
                    </div>
                    <span className="ml-1 body2 ff-mono txtPrimary700">5</span>
                  </div>

                  <div className="dis-fl-row jc-b a-c mb-2">
                    <span className="mr-1 body2 w-fix-80">Offers</span>
                    <div className="w-fix-304">
                      <BrixelProgressBar
                        progressValue={60}
                        saturation={700}
                      />
                    </div>
                    <span className="ml-1 body2 ff-mono txtPrimary700">8</span>
                  </div>
                </div>
              </div>

            </div>
          )
        }
      </Sticker>
      {/* <div className={`backButton jc-c mb-2 ${openCloseColumn() === 'closed' ? 'dis-b' : 'hide'}`}>
        <BrixelButtonIcon
          ghost
          icon="arrow-simple-left"
          onClick={() => history.push(`${propID}/listings/showings`)}
        />
      </div> */}
      {
        getFact() !== 'deals' && (
          <div className={`levelsWrapper zIndex2 w-perc-100 ${openCloseColumn() === 'opened' ? 'closed' : 'opened'}`}>
            {
              (
                getFact() === 'list' ||
                getFact() === 'offers' ||
                isNumber(+getFact())
              )
                ? (
                  <>
                    <Route path="/:propId/deals/list" component={Deals} />
                    <Route path="/:propId/deals/offers" component={DashboardOffer} />
                  </>
                ) : (
                  <Redirect from="/:propId/deals/*" to={`/${propID}/deals`} />
                )
            }

          </div>
        )
      }
    </div>
  );
};

ListingsDashboard.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDealsCount: PropTypes.object.isRequired,
  handleGetOfferListings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  offerListings: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

ListingsDashboard.defaultProps = {

};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDealsCount: get(state, 'property.activeSinglePropertyDealsCount', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  offerListings: get(state, 'deal.offerListings', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetOfferListings: bindActionCreators(getOfferListings, dispatch),
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ListingsDashboard);
