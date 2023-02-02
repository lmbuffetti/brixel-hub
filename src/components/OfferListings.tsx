import {BrixelAvatar, BrixelStatus, Helpers, ListingsHeaderFilter} from '@brixel/brixel-components';
import get from 'lodash/get';
import {DateTime} from 'luxon';
import React, {Fragment, useCallback} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import emptyOffer from '../images/empty-offer.svg';
import femaleAvatar from '../images/female-avatar.png';
import translateTo from '../utils/translation';
import type {OfferListingsType} from '../@types/components/OfferListings';

const OfferListings = (props: OfferListingsType) => {
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
      <div className="w-perc-100 txtText900 dealsListings">
        <h3 className="mb-3 hide dis-b-lg">{translateTo('Closing', lang)}</h3>
        {
          get(data[0], 'deal', null) === 'sample' && (
            <div className="ta-c txtText900">
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
                  translateTo('Name', lang),
                  translateTo('Amount', lang),
                  translateTo('Date', lang),
                  translateTo('Status', lang),
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
                                <span className="date txtText900">{get(offer, 'offer.currency', 0)} {Helpers.formatNumberValue(get(offer, 'offer.amount', 0), get(offer, 'offer.currency', ''))}</span>
                              </div>

                              <div className="row-section pl-1 dis-f a-c date">
                                {
                                  get(offer, 'offer.createdAt', null) ? (
                                    <span className="date txtText600">{DateTime.fromMillis(offer.offer.createdAt, { locale: lang }).toFormat('d LLL yyyy, H:mm')}</span>
                                  ) : (
                                    <span className="date txtText600">-</span>
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
                                    {translateTo(get(offer, 'offer.status', ''), lang)}
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

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(OfferListings);
