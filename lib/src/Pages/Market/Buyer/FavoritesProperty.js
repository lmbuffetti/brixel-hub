import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import emptyFav from '../../../images/empty-fav.svg';
import translateTo from '../../../utils/translation';
import FavoritesPropertyList from './FavoritesPropertyList';
import FavoritesPropertyMap from './FavoritesPropertyMap';
const FavoritesProperty = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { lang, wishlistProperties, } = props;
    // STATE
    const [view, setView] = useState('list');
    useEffect(() => {
        if (get(history, 'location.pathname', '').includes('map'))
            setView('map');
        else
            setView('list');
    }, [get(history, 'location.pathname', null)]);
    const onClickMapNav = () => {
        if (view === 'map')
            history.push('/buy/favorites/list');
        else
            history.push('/buy/favorites/map');
    };
    return (React.createElement("div", { className: `container dis-fl-col h-perc-100 ${view === 'map' ? '' : 'pb-10'}` },
        wishlistProperties.total === 0 ? (React.createElement("div", { className: 'dis-fl-col a-c py-8' },
            React.createElement("img", { width: "440", src: emptyFav, alt: "" }),
            React.createElement("div", { className: "max-w-fix-320 ta-c mt-3" },
                React.createElement("h3", { className: "fweight-600 mb-2" }, translateTo('No Properties yet here', lang)),
                React.createElement("p", { className: "txtText400" }, translateTo('Add properties by clicking the heart icon of a property card from the listing.', lang)),
                React.createElement("p", { className: "txtText400" }),
                React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Go to listing', lang), rightIcon: "arrow-right-small", className: "ml-a mr-a mt-3", onClick: () => history.push('/buy/searchProfile/all/1') })))) : (React.createElement("div", { className: "dis-fl-row-sm dis-fl-col a-c jc-b my-2 my-sm-3" },
            React.createElement("h4", { className: "fweight-600 fsize-400 fsize-sm-600 mb-1 mb-sm-0" },
                React.createElement("span", null, translateTo('Saved properties', lang)),
                React.createElement("span", { className: "ml-1" },
                    "(",
                    wishlistProperties.total || '-',
                    ")")),
            React.createElement("div", null,
                React.createElement(BrixelButtonSecondary, { rounded: true, label: view === 'map' ? translateTo('List view', lang) : translateTo('Map view', lang), leftIcon: view === 'map' ? 'lists' : 'roadmap', theme: "text", themeSat: 900, onClick: () => onClickMapNav() })))),
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/list", element: React.createElement(FavoritesPropertyList, null) }),
            React.createElement(Route, { path: "/map", element: React.createElement(FavoritesPropertyMap, null) }),
            React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: "/buy/favorites/list" }) }))));
};
const mapStateToProps = (state) => ({
    lang: get(state, 'common.language', 'en'),
    wishlistProperties: get(state, 'market.wishlistProperties', {}),
});
export default compose(connect(mapStateToProps, null))(FavoritesProperty);
