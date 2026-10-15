import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelButtonText, BrixelIcon, FormatValue, } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { BrixelSwitchButton, change, reset } from '@brixel-io/brixel-components/dist/form';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { useParams } from 'react-router-dom';
import { setModal } from '../../actions/CommonActions';
import { updatePublishedReview } from '../../actions/PropertyActions';
import CoverPropertyImage from '../../components/CoverPropertyImage';
import { MarketingModalData } from '../../resources/SingleProperty/marketingModal';
const Page = (props) => {
    const match = useParams();
    // PROPS
    const { activeSingleProperty, changeFieldValue, formValue, handleSetModal, handleUpdatePublishedReview, isSmallLoading, lang, modal, } = props;
    // STATE
    const [status, setStatus] = useState();
    // URL PARAMS
    const propID = get(match, 'propID', null);
    const MarketingModal = MarketingModalData(lang);
    // ASSIGN COLOR AND TEXT BY STATUS
    useEffect(() => {
        if (activeSingleProperty.publishReview) {
            setStatus({
                text: 'Review',
                color: 'Yellow400',
                state: 'review',
            });
        }
        else if (activeSingleProperty.published) {
            setStatus({
                text: 'Published',
                color: 'Green400',
                state: 'published',
            });
        }
        else {
            setStatus({
                text: 'Unpublished',
                color: 'Red400',
                state: 'unpublished',
            });
        }
    }, [activeSingleProperty]);
    // GET PAGE STATUS
    const changeReviewStatus = () => {
        const data = {
            page: propID,
            smallLoader: 'saveMarketingPage',
            status: status?.state === 'published' ? 'offline' : 'online',
        };
        handleUpdatePublishedReview(data);
    };
    // FUNCTION TO GO TO PREVIEW OR LIVE PAGE
    const onClickPreview = () => {
        let url;
        if (formValue.published) {
            url = `${baseByData?.pageUrl}${activeSingleProperty.stub}`;
            window.open(url, '_blank');
        }
        else {
            url = `${baseByData?.pageUrl}preview/${activeSingleProperty.stub}?hubUrl=${get(window, 'location.href', '')}`;
            window.location.assign(url);
        }
    };
    const onClickRequest = (state, type = 'request') => {
        handleSetModal({
            state: true,
            layout: 'xlarge',
            title: MarketingModal[state][type].title,
            body: MarketingModal[state][type].body,
            small: true,
            titleImg: MarketingModal[state][type].titleImg,
            bodyInnerClass: 'max-w-fix-384 m-a ta-c',
            bodyClassColor: 'bgWhite',
            classContainer: 'dis-b ta-c',
            classImg: 'mx-a w-fix-64 mb-3',
            bodyActionsClass: 'dis-f a-c jc-c mt-5 mb-3',
            classTitle: 'ta-c',
            /* showSupport: type === 'success', */
            /* supportLayout: 'inline', */
            multiBodyActions: type === 'success' ? [
                {
                    btnType: 'Primary',
                    name: 'Ok thanks',
                    round: true,
                    func: () => handleSetModal({}),
                },
            ] : [
                {
                    btnType: 'Secondary',
                    name: translateTo('Cancel', lang),
                    round: true,
                    className: 'mr-1',
                    func: () => handleSetModal({}),
                },
                {
                    btnType: 'Primary',
                    name: translateTo('Send request', lang),
                    round: true,
                    className: 'ml-1',
                    func: () => changeReviewStatus(),
                },
            ],
        });
    };
    useEffect(() => {
        if (get(modal, 'multiBodyActions', []).length > 1 && isSmallLoading.saveMarketingPage === true) {
            modal.multiBodyActions[1].isLoading = isSmallLoading.saveMarketingPage;
            handleSetModal(modal);
        }
        if (isSmallLoading.saveMarketingPage === false) {
            const stateText = status?.state === 'published' ? 'unpublishPage' : 'publishPage';
            onClickRequest(stateText, 'success');
        }
    }, [isSmallLoading]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "bgWhite p-4 brdRadius" },
            React.createElement("div", { className: "dis-f jc-b a-c mb-2" },
                React.createElement("h5", null, translateTo('Your Brixel Page', lang)),
                React.createElement("div", { className: `brdSmall px-2 py-1 brd${status?.color} txt${status?.color} brdRadius` }, translateTo(status?.text || '', lang))),
            React.createElement("div", { className: "mb-4" }, status?.state === 'published' ? (React.createElement("div", { className: "dis-f a-c" },
                React.createElement("h6", null, translateTo('Share your page', lang)),
                React.createElement("div", { className: "dis-f jc-c a-c" },
                    React.createElement("a", { href: `https://www.facebook.com/sharer/sharer.php?u=${baseByData?.pageUrl}${formValue.stub}`, target: "_blank", rel: "noopener noreferrer", className: "dis-b ml-2" },
                        React.createElement(BrixelIcon, { icon: "facebook", color: "primary", saturationTxt: 700 })),
                    React.createElement("a", { href: `https://twitter.com/share?url=${baseByData?.pageUrl}${formValue.stub}`, target: "_blank", rel: "noopener noreferrer", className: "dis-b ml-2" },
                        React.createElement(BrixelIcon, { icon: "twitter", color: "primary", saturationTxt: 700 }))))) : (React.createElement("p", null, translateTo('Present your property with an unique property website.', lang)))),
            React.createElement("div", { className: "websitePage brdRadius ov-h shadow-3dp pos-r cur-poi", onClick: () => onClickPreview() },
                React.createElement("div", { className: "image-ratio" },
                    React.createElement(CoverPropertyImage, { size: "M", className: "cover", coverPhoto: get(formValue, 'coverPhoto.url', undefined), propertyType: get(formValue, 'properties.propertyType', undefined) })),
                React.createElement("div", { className: "cardPageInfo" },
                    React.createElement("div", { className: "w-fix-80 bgPrimary400 opacity5 h-fix-8 mb-1" }),
                    React.createElement("h6", null, translateTo(formValue.title, lang)),
                    React.createElement("div", { className: "dis-f jc-b a-c mt-2" },
                        React.createElement("div", { className: "w-fix-40 bgText200 opacity5 h-fix-8" }),
                        React.createElement("div", { className: "w-fix-40 bgText200 opacity5 h-fix-8" })),
                    React.createElement("div", { className: "dis-f jc-b a-c mt-3" },
                        React.createElement("div", { className: "w-fix-24 bgText200 opacity5 h-fix-8" }),
                        React.createElement("div", { className: "w-fix-24 bgText200 opacity5 h-fix-8" }),
                        React.createElement("div", { className: "w-fix-24 bgText200 opacity5 h-fix-8" })),
                    React.createElement("div", { className: "dis-f jc-b a-c pb-3" },
                        React.createElement("h6", { className: "w-fix-24 ff-mono" }, FormatValue.formatRooms(get(formValue, 'properties.typology.bedrooms', 0), get(formValue, 'location.countryCode', 'CH'))),
                        React.createElement("h6", { className: "w-fix-24 ff-mono" }, get(formValue, 'properties.typology.livingArea.value', 0)),
                        React.createElement("h6", { className: "w-fix-24 ff-mono" }, get(formValue, 'properties.typology.building.built', 0))),
                    React.createElement("div", { className: "contactPageCard" },
                        React.createElement("div", { className: "contactUser" },
                            React.createElement(BrixelIcon, { icon: "account" })),
                        React.createElement("div", { className: "button" })))),
            React.createElement("div", { className: "dis-f a-c jc-b mt-5 flex-wrap jc-c" }, status?.state === 'published' ? (React.createElement(React.Fragment, null,
                React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('View your page', lang), rightIcon: "eye", onClick: () => onClickPreview(), className: "mb-1 mr-2" }),
                React.createElement(BrixelButtonText, { label: translateTo('Take Page offline', lang), theme: "red", rounded: true, onClick: () => onClickRequest('unpublishPage', 'request'), isLoading: isSmallLoading.pageReview, className: "mb-1" }))) : (React.createElement(React.Fragment, null,
                React.createElement(BrixelButtonSecondary, { rounded: true, label: translateTo('Preview your page', lang), rightIcon: "eye", onClick: () => onClickPreview(), className: "mb-1 mr-2" }),
                status?.state !== 'review' && (React.createElement(BrixelButtonPrimary, { label: translateTo('Request to publish', lang), rounded: true, onClick: () => onClickRequest('publishPage', 'request'), isLoading: isSmallLoading.pageReview, className: "mb-1" })))))),
        status?.state === 'published' && (React.createElement("div", { className: "pos-r w-perc-100 bgWhite p-3 my-5 brdRadius shadow-1dp" },
            React.createElement("h4", { className: "mb-3" }, translateTo('Request visits', lang)),
            React.createElement(BrixelSwitchButton, { className: "body2 row-reverse jc-b mt-2", label: translateTo('Allow people to request visits on Brixel Page', lang), input: {
                    onChange: (val) => changeFieldValue('allowVisits', val),
                    name: 'allowVisits',
                    value: formValue.allowVisits,
                } })))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    company: get(state, 'companies.activeSingleCompany', {}),
    formValue: get(state, 'brixelForm.Property.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    modal: get(state, 'common.modal', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    reset(form, data) {
        (dispatch(reset(form, data)));
    },
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Page);
