import React from 'react';
import { BrixelButtonIcon } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
const SectionMobileTitle = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleProperty, lang, title, } = props;
    const isBuyer = history.location.pathname.includes('buyer');
    const onClickGoBack = () => {
        if (isBuyer) {
            history.push(`/buyer/${activeSingleProperty.id}/home`);
        }
        else {
            history.push(`/${activeSingleProperty.id}/home`);
        }
    };
    return (React.createElement("div", { className: "dis-fl-col backPanel hide-lg" },
        React.createElement(BrixelButtonIcon, { small: true, className: "ml-1-neg mt-2", ghost: true, icon: "arrow-left", theme: "text", themeSat: 600, onClick: () => onClickGoBack() }),
        React.createElement("h5", { className: "sectionTitle fweight-600" }, translateTo(title, lang))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
});
export default connect(mapStateToProps, null)(SectionMobileTitle);
