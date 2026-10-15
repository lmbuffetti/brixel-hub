import React, { useRef, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonText, BrixelDropdownMini, BrixelModalConfirm, FormatValue, Helpers, useOutsideAlerter, } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../actions/CommonActions';
import { deleteEstimation } from '../../actions/EstimationActions';
import CoverEstimationGreenImg from '../../images/Market/icnEstimationGreen.svg';
import CoverEstimationYellowImg from '../../images/Market/icnEstimationYellow.svg';
import translateTo from '../../utils/translation';
import Tags from '../Tags';
const MarketCardFavorites = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleProperty, handleDeleteEstimation, handleSetModal, lang, } = props;
    // STATE
    const [actionDetailsOpen, setActionDetailsOpen] = useState({
        id: null,
        active: false,
    });
    const actionRef = useRef(null);
    const openProperty = () => {
        history.push(`/buy/estimations/${activeSingleProperty.id}`);
    };
    const onConfirmDelete = () => {
        handleDeleteEstimation({ id: activeSingleProperty.id, reloadBuyerEstimations: true });
        handleSetModal({ state: false });
    };
    const onDeleteEstimation = () => {
        handleSetModal({
            state: true,
            component: React.createElement(BrixelModalConfirm, {
                title: translateTo('Are you sure?', lang),
                lang: lang,
                message: translateTo('You can confirm to delete this estimation.', lang),
                confirm: () => onConfirmDelete(),
                cancel: () => handleSetModal({ state: false }),
            }),
            small: true,
            layout: 'large',
            bodyClassColor: 'white',
        });
    };
    // Function to close the small menus when we click outside
    useOutsideAlerter(actionRef, {
        action: 'function',
        func: () => {
            setActionDetailsOpen({
                id: null,
                active: false,
            });
        },
    });
    return (React.createElement("div", { className: "mb-3" },
        React.createElement("div", { className: "dis-fl-col dis-fl-row-sm brdRadius brdSmall brdText100 ov-h" },
            React.createElement("div", { className: `w-perc-100 w-fix-sm-200 h-fix-200 dis-f jc-c a-c ${get(activeSingleProperty, 'result.available', false) ? 'bgGreen100' : 'bgYellow100'}` }, get(activeSingleProperty, 'result.available', false) ? (React.createElement("img", { src: CoverEstimationGreenImg, alt: "completed estimation" })) : (React.createElement("img", { src: CoverEstimationYellowImg, alt: "completed estimation" }))),
            React.createElement("div", { className: "w-perc-100 dis-fl-col p-2" },
                React.createElement("div", { className: "dis-fl-col-rev dis-fl-row-sm a-t jc-b" },
                    React.createElement("div", { className: "w-perc-100" },
                        React.createElement("span", { className: "fsize-300 txtText700 mb-1 ta-l" },
                            get(activeSingleProperty, 'data.location.zip', ''),
                            " ",
                            get(activeSingleProperty, 'data.location.city', ''),
                            get(activeSingleProperty, 'data.location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(activeSingleProperty, 'data.location.stateCode', '')})`))),
                        React.createElement("h3", { className: "cur-poi fSizePx18", onClick: () => openProperty() }, translateTo(get(activeSingleProperty, 'data.title', ''), lang)),
                        React.createElement(BrixelButtonText, { label: translateTo('View details', lang), rightIcon: "link-open", bgTransparent: true, onClick: () => openProperty() })),
                    React.createElement("div", { className: "dis-f jc-b w-perc-100" },
                        React.createElement("div", { className: "dis-f a-c ml-a-sm" },
                            React.createElement(Tags, { lang: lang, status: get(activeSingleProperty, 'result.available', false) ? 'completed' : 'pending', text: "Offer", message: {
                                    completed: translateTo('Calculated', lang),
                                    pending: translateTo('Pending', lang),
                                } })),
                        React.createElement("div", { className: "ml-1" },
                            React.createElement("div", { className: "dis-fl-row a-c pos-r" },
                                React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", icon: "options-vertical", onClick: () => setActionDetailsOpen({
                                        id: actionDetailsOpen.id === activeSingleProperty.id ? null : activeSingleProperty.id,
                                        active: !actionDetailsOpen.active,
                                    }) }),
                                (actionDetailsOpen.id === activeSingleProperty.id && actionDetailsOpen.active) && (React.createElement(BrixelDropdownMini, { topOffset: 50, rightAligned: true, ref: actionRef, links: [
                                        {
                                            label: translateTo('Delete', lang),
                                            className: 'txtRed400',
                                            clickFunc: () => onDeleteEstimation(),
                                        },
                                    ] })))))),
                React.createElement("div", { className: "dis-f jc-b a-b mt-a pt-2" },
                    React.createElement("div", { className: "fsize-300 txtText700" },
                        React.createElement("div", { className: "dis-f a-c jc-fs flex-wrap w-perc-100" },
                            React.createElement("div", { className: "bottom a-c txtText900 brdSmallRight-sm mb-1 mb-sm-0 brdText100 pr-6 mr-6" },
                                React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Price', lang)),
                                get(activeSingleProperty, 'result.higherValue', null) && (React.createElement("div", { className: "txtGreen400 dis-f a-b" },
                                    React.createElement("span", { className: "fsize-300 ff-mono notranslate" }, get(activeSingleProperty, 'result.currency', 'EUR')),
                                    React.createElement("span", { className: "fsize-500 ff-mono notranslate ml-1" }, Helpers.formatNumberValue(Math.round(get(activeSingleProperty, 'result.higherValue', 0)), get(activeSingleProperty, 'result.currency', 'EUR')))))),
                            React.createElement("div", { className: 'dis-f' },
                                React.createElement("div", null,
                                    React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Rooms', lang)),
                                    React.createElement("span", { className: "ff-mono fszie-400 txtBlack" }, FormatValue.formatRooms(get(activeSingleProperty, 'data.properties.typology.bedrooms', 0), get(activeSingleProperty, 'data.location.countryCode', 'CH')))),
                                React.createElement("div", { className: "mx-4" },
                                    React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Size', lang)),
                                    React.createElement("span", { className: "ff-mono fszie-400 txtBlack" },
                                        get(activeSingleProperty, 'data.properties.typology.livingArea.value', 0),
                                        " m2")),
                                React.createElement("div", null,
                                    React.createElement("span", { className: "fsize-300 dis-b txtText400" }, translateTo('Year built', lang)),
                                    React.createElement("span", { className: "ff-mono fszie-400 txtBlack" }, get(activeSingleProperty, 'data.properties.building.built', 0)))))))))));
};
const mapStateToProps = (state) => ({
    wishlistProperties: get(state, 'market.wishlistProperties.data', []),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleDeleteEstimation: bindActionCreators(deleteEstimation, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(MarketCardFavorites);
