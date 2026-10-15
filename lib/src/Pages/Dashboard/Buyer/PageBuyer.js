import React from 'react';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonPrimary, BrixelIcon, FormatValue } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { change, reset } from '@brixel-io/brixel-components/dist/form';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { updatePublishedReview } from '../../../actions/PropertyActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
const PageBuyer = (props) => {
    // PROPS
    const { activeSingleProperty, lang, } = props;
    // URL PARAMS
    // FUNCTION TO GO TO PREVIEW OR LIVE PAGE
    const onClickPreview = () => {
        let url;
        if (activeSingleProperty.published) {
            url = `${baseByData?.pageUrl}${activeSingleProperty.stub}`;
            window.open(url, '_blank');
        }
        else {
            url = `${baseByData?.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${get(window, 'location.href', '')}`;
            window.location.assign(url);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "hide dis-f-lg jc-b max-w-fix-1024" },
            React.createElement("h3", { className: "mb-3 hide dis-b-lg  fweight-600" }, translateTo('Brixel Page', lang)),
            React.createElement("div", { className: "" },
                React.createElement(BrixelButtonPrimary, { leftIcon: "eye", label: translateTo(activeSingleProperty.published ? 'Open' : 'Preview', lang), rounded: true, onClick: () => onClickPreview() }))),
        React.createElement("div", { className: "dis-f h-perc-lg-100" },
            React.createElement("div", { className: "secondLevel dis-fl-col w-perc-100 h-perc-lg-100" },
                React.createElement("div", { className: "pos-r" },
                    React.createElement("div", { className: "dis-f backPanel hide-lg" },
                        React.createElement("div", { className: "dis-f jc-b a-bl w-perc-100 pt-small-2" },
                            React.createElement("h5", { className: "sectionTitle" }, translateTo('Brixel Page', lang)),
                            React.createElement("div", { className: "" },
                                React.createElement(BrixelButtonPrimary, { leftIcon: "eye", label: translateTo('Preview', lang), rounded: true, onClick: () => onClickPreview() }))))),
                React.createElement("div", { className: "boxCard flex-1" },
                    React.createElement("div", { className: "brixelPageWrapper dis-fl-col cardInfoBox" },
                        React.createElement("div", { className: "pb-4" },
                            React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "websitePage brdRadius ov-h shadow-3dp pos-r cur-poi", onClick: () => onClickPreview() },
                                    React.createElement("div", { className: "dis-f bgText25 p-1" },
                                        React.createElement("div", { className: "square brdCircle w-fix-8 bgRed400 mr-1" }),
                                        React.createElement("div", { className: "square brdCircle w-fix-8 bgYellow400 mr-1" }),
                                        React.createElement("div", { className: "square brdCircle w-fix-8 bgGreen400" })),
                                    React.createElement("div", { className: "image-ratio" },
                                        React.createElement(CoverPropertyImage, { className: "cover", size: "M", coverPhoto: get(activeSingleProperty, 'coverPhoto.url', undefined), propertyType: get(activeSingleProperty, 'properties.propertyType', undefined) })),
                                    React.createElement("div", { className: "cardPageInfo" },
                                        React.createElement("div", { className: "w-fix-80 bgPrimary400 opacity5 h-fix-8 mb-1" }),
                                        React.createElement("h6", null, activeSingleProperty.title),
                                        React.createElement("div", { className: "dis-f jc-b a-c mt-2" },
                                            React.createElement("div", { className: "w-fix-40 bgText200 opacity5 h-fix-8" }),
                                            React.createElement("div", { className: "w-fix-40 bgText200 opacity5 h-fix-8" })),
                                        React.createElement("div", { className: "dis-f jc-b a-c mt-3" },
                                            React.createElement("div", { className: "w-fix-24 bgText200 opacity5 h-fix-8" }),
                                            React.createElement("div", { className: "w-fix-24 bgText200 opacity5 h-fix-8" }),
                                            React.createElement("div", { className: "w-fix-24 bgText200 opacity5 h-fix-8" })),
                                        React.createElement("div", { className: "dis-f jc-b a-c pb-3" },
                                            React.createElement("h6", { className: "w-fix-24 ff-mono" }, FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH'))),
                                            React.createElement("h6", { className: "w-fix-24 ff-mono" }, get(activeSingleProperty, 'properties.typology.livingArea.value', 0)),
                                            React.createElement("h6", { className: "w-fix-24 ff-mono" }, get(activeSingleProperty, 'properties.typology.building.built', 0))),
                                        React.createElement("div", { className: "contactPageCard" },
                                            React.createElement("div", { className: "contactUser" },
                                                React.createElement(BrixelIcon, { icon: "account" })),
                                            React.createElement("div", { className: "button" }))))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    reset(form, data) {
        (dispatch(reset(form, data)));
    },
    handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(PageBuyer);
