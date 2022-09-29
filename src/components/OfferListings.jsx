/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelAvatar,
  Helpers,
  BrixelStatus,
  ListingsHeaderFilter,
} from '@brixel/brixel-components';
import translateTo from '../utils/translation';
import { compose } from 'redux';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import emptyOffer from '../images/empty-offer.svg';
import femaleAvatar from '../images/female-avatar.png';

const OfferListings = (props) => {
  const {
    activeSingleProperty,
    data,
    getConfigEnv,
    lang,
    onChangeLocation,
  } = props;
  // URL PARAMS
  
  const getStatusColor = useCallback((status) => {
    if (status === 'pending') return 'Yellow';
    if (status === 'accepted') return 'Green';
    if (status === 'declined') return 'Red';
    return 'Red';
  }, []);
  
  return (
    <>
      <div className="w-perc-100 txtDark700 dealsListings">
        <h3 className="mb-3 hide dis-b-lg">{translateTo('Closing', lang)}</h3>
        {/* <div className="dis-f">
          <div className="fixedIcon w-perc-100">
            <BrixelButtonIcon
              className="hide-md"
              icon="arrow-left-small"
              theme="dark"
              ghost
              onClick={() => history.push(`/${propID}/property`)}
            />
          </div>
        </div> */}
        
        {
          get(data[0], 'deal', null) === 'sample' && (
            <div className="ta-c txtDark700">
              <h5 className="ta-c">{translateTo('There are no offers yet.', lang)}</h5>
              <p
                dangerouslySetInnerHTML={{ __html: translateTo('As soon as a buyer makes a first offer it will appear here. You can manage the whole closing process directly here. Until the notary. <b>Feel free to explore our example offer.</b>', lang) }}
                className="ta-c max-w-fix-544 ml-a mr-a mt-3 mb-5"
              />
            </div>
          )
        }
        
        <div className={`${get(data[0], 'deal', null) === 'sample' ? 'empty-state' : ''} offers listings-wrapper w-perc-100`}>
          <div className="content-wrapper pos-r w-perc-100">
            <div className="listings-container">
              <ListingsHeaderFilter
                lang={lang}
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
                          <Fragment key={`off_${i.toString()}`}>
                            <div className="results fsize-300 row-cols-4 dis-f brdRadius shadow-1dp mb-2 px-1 py-small-12 bgWhite">
                              
                              <div className="row-section pl-1 dis-f a-c name">
                                <div className="wrapper dis-f a-c">
                                  <div className="cur-poi" onClick={() => onChangeLocation(`/${activeSingleProperty.id}/closing/${offer.deal}`)}>
                                    {
                                      offer.deal === 'sample' ? (
                                        <img loading="lazy" width="40" alt="female avatar" src={femaleAvatar} />
                                      ) : (
                                        <BrixelAvatar
                                          baseURL={getConfigEnv.shortPath}
                                          name={get(offer, 'user.name', null) ? get(offer, 'user.name', '') : get(offer, 'user.email', '')}
                                          profileId={get(offer, 'user.id', '')}
                                        />
                                      )
                                    }
                                  </div>
                                  <div
                                    className={`link pl-2 ${!get(offer, 'user.name', null) ? 'no-name' : ''} cur-poi ${offer.deal === 'sample' ? 'ex-tag' : ''}`}
                                    onClick={() => onChangeLocation(`/${activeSingleProperty.id}/closing/${offer.deal}`)}
                                  >
                                    {get(offer, 'user.name', 'No Name')}
                                    {
                                      offer.deal === 'sample' && (
                                        <div className="tagLabel brdRadiusSmall brdSmall bgPrimary200 txtPrimary400 p-small-4 fsize-200">
                                          Example only
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                              
                              <div className="row-section pl-1 dis-f a-c amount">
                                <span className="date txtDark700">{get(offer, 'offer.currency', 0)} {Helpers.formatNumberValue(get(offer, 'offer.amount', 0), get(offer, 'offer.currency', 0))}</span>
                              </div>
                              
                              <div className="row-section pl-1 dis-f a-c date">
                                {
                                  get(offer, 'offer.createdAt', null) ? (
                                    <span className="date txtDark200">{DateTime.fromMillis(offer.offer.createdAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}</span>
                                  ) : (
                                    <span className="date txtDark200">-</span>
                                  )
                                }
                              </div>
                              
                              <div className="row-section pl-1 dis-f a-c status">
                                <div className="dis-f a-c w-perc-100 pr-1">
                                  <BrixelStatus
                                    className="mr-1"
                                    color={getStatusColor(get(offer, 'offer.status', 0))}
                                  />
                                  <span className={`fsize-300 txt${getStatusColor(get(offer, 'offer.status', 0))}400 tt-c`}>
                                    {translateTo(get(offer, 'offer.status', 0), lang)}
                                  </span>
                                </div>
                              </div>
                            
                            </div>
                          </Fragment>
                        ))
                      )
                    }
                    {
                      get(data[0], 'deal', null) === 'sample' && (
                        <>
                          <img loading="lazy" width="100%" alt="empty" src={emptyOffer} />
                        </>
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
  lang: PropTypes.string.isRequired,
};

OfferListings.defaultProps = {};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(OfferListings);
