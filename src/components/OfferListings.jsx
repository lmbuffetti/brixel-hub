/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelAvatar, Helpers, BrixelStatus, ListingsHeaderFilter,
} from '@brixel/brixel-components';
import moment from 'moment';

const OfferListings = (props) => {
  const {
    activeSingleProperty,
    data,
    getConfigEnv,
    onChangeLocation,
  } = props;

  const getStatusColor = (status) => {
    if (status === 'pending') return 'Yellow';
    if (status === 'accepted') return 'Green';
    if (status === 'declined') return 'Red';
    return 'Red';
  };

  return (
    <>
      <div className="listings-header p-md-2 pl-md-0 p-1 w-perc-100 txtDark700">
        <div className="dis-fl-row jc-b a-c mb-3">
          <h2 className="fsize-700 fweight-500">Offers</h2>
        </div>
        <div className="offers listings-wrapper w-perc-100">
          <div className="content-wrapper pos-r w-perc-100">
            <div className="listings-container">
              <ListingsHeaderFilter
                className="users-filter"
                searchType="Users"
                labels={[
                  'Name',
                  'Amount',
                  'Date',
                  'Status',
                ]}
                activeSearchText=""
                activeSortDirection=""
                activeCompany=""
                applyFilter={() => ''}
              />
              {/* table starts */}
              <div className="table-container pt-small-12">
                <>
                  <div className="results-container">
                    {
                      data.length > 0 && (
                        data.map((offer, i) => (
                          <Fragment key={i.toString()}>
                            <div className="results fsize-300 row-cols-4 dis-f brdRadius shadow-1dp mb-2 px-1 py-small-12">

                              <div className="row-section pl-1 dis-f a-c name">
                                <div className="wrapper dis-f a-bl">
                                  <div onClick={() => onChangeLocation(`/${activeSingleProperty.id}/offers/${offer.deal}`)}>
                                    <BrixelAvatar
                                      avatarImg={get(offer, 'avatar[0]', '') ? getConfigEnv.shortPath + get(offer, 'avatar[0]', '').thumbnailPath : null}
                                      name={get(offer, 'user.name', null) ? get(offer, 'user.name', '') : get(offer, 'user.email', '')}
                                      profileId={get(offer, 'user.id', '')}
                                    />
                                  </div>
                                  <div
                                    className={`link pl-2 ${!get(offer, 'user.name', null) ? 'no-name' : ''} cur-poi`}
                                    onClick={() => onChangeLocation(`/${activeSingleProperty.id}/offers/${offer.deal}`)}
                                  >
                                    {get(offer, 'user.name', 'No Name')}
                                  </div>
                                </div>
                              </div>

                              <div className="row-section pl-1 dis-f a-c amount">
                                <span className="date txtDark700">{get(offer, 'offer.currency', 0)} {Helpers.formatNumberValue(get(offer, 'offer.amount', 0), get(offer, 'offer.currency', 0))}</span>
                              </div>

                              <div className="row-section pl-1 dis-f a-c date">
                                <span className="date txtDark200">{moment(get(offer, 'offer.createdAt', '')).format('D MMM YYYY, H:mm')}</span>
                              </div>

                              <div className="row-section pl-1 dis-f a-c status">
                                <div className="dis-f a-c w-perc-100">
                                  <BrixelStatus
                                    className="mr-1"
                                    color={getStatusColor(get(offer, 'offer.status', 0))}
                                  />
                                  <span className={`fsize-300 txt${getStatusColor(get(offer, 'offer.status', 0))}400 tt-c`}>
                                    {get(offer, 'offer.status', 0)}
                                  </span>
                                </div>
                              </div>

                            </div>
                          </Fragment>
                        ))
                      )
                    }
                  </div>
                </>
              </div>
              {/* table ends */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

OfferListings.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  getConfigEnv: PropTypes.object.isRequired,
  onChangeLocation: PropTypes.func.isRequired,
};

OfferListings.defaultProps = {};

export default OfferListings;
