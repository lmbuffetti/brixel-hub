import { BrixelAvatar, BrixelStatus, Helpers, ListingsHeaderFilter } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import { DateTime } from 'luxon';
import React, { Fragment, useCallback } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import emptyOffer from '../images/empty-offer-skeleton.svg';
import femaleAvatar from '../images/female-avatar.png';
import translateTo from '../utils/translation';
const OfferListings = (props) => {
    const { activeSingleProperty, data, lang, onChangeLocation, } = props;
    // URL PARAMS
    const getStatusColor = useCallback((status) => {
        if (status === 'pending')
            return 'Yellow';
        if (status === 'accepted')
            return 'Green';
        if (status === 'declined')
            return 'Red';
        return 'Red';
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "w-perc-100 txtText900 dealsListings" },
            React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Closing', lang)),
            get(data[0], 'deal', null) === 'sample' && (React.createElement("div", { className: "ta-c txtText900" },
                React.createElement("h5", { className: "ta-c" }, translateTo('There are no offers yet.', lang)),
                React.createElement("p", { dangerouslySetInnerHTML: { __html: translateTo('As soon as a buyer makes a first offer it will appear here. You can manage the whole closing process directly here. Until the notary. <b>Feel free to explore our example offer.</b>', lang) }, className: "ta-c max-w-fix-544 ml-a mr-a mt-3 mb-5" }))),
            React.createElement("div", { className: `${get(data[0], 'deal', null) === 'sample' ? 'empty-state' : ''} offers listings-wrapper w-perc-100` },
                React.createElement("div", { className: "content-wrapper pos-r w-perc-100" },
                    React.createElement("div", { className: "listings-container" },
                        React.createElement(ListingsHeaderFilter, { lang: lang, className: "users-filter", searchType: "Users", labels: [
                                translateTo('Name', lang),
                                translateTo('Amount', lang),
                                translateTo('Date', lang),
                                translateTo('Status', lang),
                            ], activeSearchText: "", activeSortDirection: "", activeCompany: "", applyFilter: () => '' }),
                        React.createElement("div", { className: "table-container pt-small-12" },
                            React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "results-container" },
                                    data.length > 0 && (data.map((offer, i) => (React.createElement(Fragment, { key: `off_${i.toString()}` },
                                        React.createElement("div", { className: "results fsize-300 row-cols-4 dis-f brdRadius shadow-1dp mb-2 px-1 py-small-12 bgWhite" },
                                            React.createElement("div", { className: "row-section pl-1 dis-f a-c name" },
                                                React.createElement("div", { className: "wrapper dis-f a-c" },
                                                    React.createElement("div", { className: "cur-poi", onClick: () => onChangeLocation(`/${activeSingleProperty.id}/closing/${offer.deal}`) }, offer.deal === 'sample' ? (React.createElement("img", { loading: "lazy", width: "40", alt: "female avatar", src: femaleAvatar })) : (React.createElement(BrixelAvatar, { avatarImg: offer.user?.avatarUrl, name: get(offer, 'user.name', null) ? get(offer, 'user.name', '') : get(offer, 'user.email', ''), profileId: get(offer, 'user.id', '') }))),
                                                    React.createElement("div", { className: `link pl-2 ${!get(offer, 'user.name', null) ? 'no-name' : ''} cur-poi ${offer.deal === 'sample' ? 'ex-tag' : ''}`, onClick: () => onChangeLocation(`/${activeSingleProperty.id}/closing/${offer.deal}`) },
                                                        get(offer, 'user.name', 'No Name'),
                                                        offer.deal === 'sample' && (React.createElement("div", { className: "tagLabel brdRadiusSmall brdSmall bgPrimary100 txtPrimary400 p-small-4 fsize-200" }, "Example only"))))),
                                            React.createElement("div", { className: "row-section pl-1 dis-f a-c amount" },
                                                React.createElement("span", { className: "date txtText900" },
                                                    get(offer, 'offer.currency', 0),
                                                    " ",
                                                    Helpers.formatNumberValue(get(offer, 'offer.amount', 0), get(offer, 'offer.currency', '')))),
                                            React.createElement("div", { className: "row-section pl-1 dis-f a-c date" }, get(offer, 'offer.createdAt', null) ? (React.createElement("span", { className: "date txtText600" }, DateTime.fromMillis(offer.offer.createdAt, { locale: lang }).toFormat('d LLL yyyy, H:mm'))) : (React.createElement("span", { className: "date txtText600" }, "-"))),
                                            React.createElement("div", { className: "row-section pl-1 dis-f a-c status" },
                                                React.createElement("div", { className: "dis-f a-c w-perc-100 pr-1" },
                                                    React.createElement(BrixelStatus, { className: "mr-1", color: getStatusColor(get(offer, 'offer.status', 0)) }),
                                                    React.createElement("span", { className: `fsize-300 txt${getStatusColor(get(offer, 'offer.status', 0))}400 tt-c` }, translateTo(get(offer, 'offer.status', ''), lang))))))))),
                                    get(data[0], 'deal', null) === 'sample' && (React.createElement(React.Fragment, null,
                                        React.createElement("img", { loading: "lazy", width: "100%", alt: "empty", src: emptyOffer }))))))))))));
};
const mapStateToProps = (state) => ({
    lang: get(state, 'common.language', 'en'),
});
export default compose(connect(mapStateToProps, null))(OfferListings);
