import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import translateTo from '../../../../utils/translation';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
import BannerFullSize from '../../../../components/BannerFullSize';
import DocumentIcon from '../../../../images/documentsIcon/documentFull.svg';
import lightBulbIcon from '../../../../images/offer-flow/light-bulb.svg';
import SearchGreenIcn from '@brixel-io/brixel-components/dist/images/IconsColored/general/SearchGreen.svg';
import medelIcon from '../../../../images/offer-flow/medel.svg';
import BannerOfferDefault from '../../../../images/dashboard/bannerOffer-deafault.svg';
import { BrixelIcon } from '@brixel-io/brixel-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getActiveSingleOffer, getProofOfFinancing } from '../../../../actions/DealActions';
import { bindActionCreators } from 'redux';
import MakeOfferPropertyCardVertical from '../../../../components/Cards/MakeOfferPropertyCardVertical';
import ContactPageCard from '../../../../components/Cards/ContactPageCard';
import { setModal } from '../../../../actions/CommonActions';
import MakeOfferModalUpdate from './MakeOffer/MakeOfferModalUpdate';
import MakeOfferModalView from './MakeOffer/MakeOfferModalView';
import MakeOfferTimeline from './MakeOffer/MakeOfferTimeline';
import ProofOfFinancingModalPrepare from './ProofOfFinancing/ProofOfFinancingModalPrepare';
const SingleOffer = ({ activeProofofFinancing, activeSingleOffer, dealID, handleGetActiveSingleOffer, handleGetProofofFinancing, handleSetModal, lang, }) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const propID = match?.propID || '';
    useEffect(() => {
        if (dealID) {
            handleGetActiveSingleOffer({ id: dealID, smallLoader: 'getOffer' });
            handleGetProofofFinancing({ id: dealID, smallLoader: 'getProofOfFinancing' });
        }
    }, [dealID]);
    const updateOffer = () => {
        handleSetModal({
            clickOutsideToClose: false,
            bodyClassColor: 'p-0 dis-fl-col',
            bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
            title: translateTo('Make new offer', lang),
            state: true,
            small: true,
            titleTop: true,
            titleTopClass: 'fweight-600 fsize-500 ml-1',
            layout: 'large',
            component: React.createElement(MakeOfferModalUpdate, { closeModal: () => handleSetModal({}) }),
        });
    };
    const viewOffer = () => {
        handleSetModal({
            clickOutsideToClose: false,
            bodyClassColor: 'p-0 dis-fl-col',
            bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
            state: true,
            small: true,
            hideHeader: true,
            layout: 'fullscreen',
            component: React.createElement(MakeOfferModalView, { closeModal: () => handleSetModal({}) }),
        });
    };
    const openPrepareModal = () => {
        handleSetModal({
            clickOutsideToClose: false,
            bodyClassColor: 'p-0 dis-fl-col',
            bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
            state: true,
            small: true,
            title: translateTo('To ensure a smooth process, please prepare the following documents:', lang),
            titleTop: true,
            titleTopClass: 'fweight-600 fsize-500 pl-2 pl-sm-0',
            layout: 'large',
            component: React.createElement(ProofOfFinancingModalPrepare, null),
        });
    };
    if (!activeSingleOffer) {
        return React.createElement("div", null);
    }
    const getOfferBackground = () => {
        if (activeSingleOffer?.status === 'accepted')
            return 'Green';
        if (activeSingleOffer?.status === 'pending')
            return 'Yellow';
        if (activeSingleOffer?.status === 'rejected')
            return 'Red';
        return 'light';
    };
    const getOfferTextColor = () => {
        if (activeSingleOffer?.status === 'accepted')
            return 'Green400';
        if (activeSingleOffer?.status === 'pending')
            return 'Yellow400';
        if (activeSingleOffer?.status === 'rejected')
            return 'Red400';
        return 'Text900';
    };
    const getStatusIcon = () => {
        if (activeSingleOffer?.status === 'accepted')
            return 'check-thin';
        if (activeSingleOffer?.status === 'pending')
            return 'clock';
        if (activeSingleOffer?.status === 'rejected')
            return 'close-small';
        return 'clock';
    };
    const handleScrollToBottom = () => {
        // Get the 'innerWrap' div
        history.push(history.location.pathname, { state: { openSupport: true } });
        const innerWrap = document.querySelector('.hubDasContent');
        if (innerWrap) {
            setTimeout(() => {
                innerWrap.scrollTop = innerWrap.scrollHeight;
            }, 100);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: 'hide dis-f-lg mb-3 a-c' },
            React.createElement("h3", { className: "fweight-600" }, translateTo(activeSingleOffer.id ? 'Your Offer' : 'Offer', lang)),
            activeSingleOffer?.status && (React.createElement("div", { className: `status-box mt-a mb-a ml-2 dis-if a-c as-fs brdRadius px-1 py-small-4 bg${getOfferBackground()}100` },
                React.createElement(BrixelIcon, { iconSize: 'w-fix-16', color: getOfferBackground(), className: 'mr-1', icon: getStatusIcon() }),
                React.createElement("span", { className: `txt${getOfferTextColor()} fsize-200 fweight-500` }, translateTo(activeSingleOffer?.status.charAt(0).toUpperCase() + activeSingleOffer?.status.slice(1), lang))))),
        React.createElement("div", { className: "dis-f h-perc-lg-100" },
            React.createElement("div", { className: "dis-fl-col w-perc-100 h-perc-lg-100" },
                React.createElement("div", { className: "dis-f hide-lg" },
                    React.createElement(SectionMobileTitle, { title: activeSingleOffer.id ? 'Your Offer' : 'Offer' }),
                    activeSingleOffer?.status && (React.createElement("div", { className: `status-box dis-f a-b as-fe mb-2 ml-2 brdRadius px-1 py-small-4 bg${getOfferBackground()}50` },
                        React.createElement(BrixelIcon, { iconSize: 'w-fix-16', color: getOfferBackground(), className: 'mr-1', icon: getStatusIcon() }),
                        React.createElement("span", { className: `txt${getOfferTextColor()} fsize-200 fweight-500` }, translateTo(activeSingleOffer?.status.charAt(0).toUpperCase() + activeSingleOffer?.status.slice(1), lang))))),
                activeSingleOffer.id ? (React.createElement("div", { className: "dis-fl-col-rev dis-fl-row-md" },
                    React.createElement("div", { className: "w-perc-100 max-w-fix-md-344" },
                        React.createElement("div", null,
                            React.createElement("h4", { className: "mb-2 fsize-500 fweight-600 mt-2 mt-md-0" }, translateTo('Property details', lang)),
                            React.createElement(MakeOfferPropertyCardVertical, null)),
                        React.createElement("div", { className: "mt-3" },
                            React.createElement("h5", { className: "mb-2 fsize-500 fweight-600" }, translateTo('Contact', lang)),
                            React.createElement(ContactPageCard, null))),
                    React.createElement("div", { className: "pl-md-5 w-perc-md-70" },
                        React.createElement("h5", { className: "mb-2 fweight-600 mt-3 mt-md-0" }, translateTo('Progress', lang)),
                        activeSingleOffer.status === 'pending' && !activeProofofFinancing?.id && (React.createElement(BannerFullSize, { className: "mb-2", smallSize: false, type: "green", lang: lang, image: activeSingleOffer?.documents?.length > 0 ? SearchGreenIcn : DocumentIcon, title: activeSingleOffer?.documents?.length > 0 ? 'Ready to explore better rates?' : 'Need a proof of financing?', description: activeSingleOffer?.documents?.length > 0 ? ['Even if you have proof of financing, our partner can provide a free, no-obligation mortgage offer. Ensure you get the best deal possible.'] : ['Order a non-binding proof of financing from our trusted partners before making an offer. It can help you secure the best deal.'], button: {
                                label: 'Apply',
                                iconRight: 'arrow-right',
                                onClick: () => history.push(`/buyer/${propID}/offerFlow/proofFinancing`),
                                type: 'primary',
                            } })),
                        activeSingleOffer?.status === 'rejected' && (React.createElement(BannerFullSize, { smallSize: true, smallIcon: true, className: "mb-2", type: "default", lang: lang, image: lightBulbIcon, description: ['Your offer was rejected.', 'If you\'re still interested, feel free to propose a new price.'], button: {
                                label: 'Add new offer',
                                iconLeft: 'plus',
                                onClick: () => updateOffer(),
                                type: 'primary',
                            } })),
                        activeSingleOffer?.status === 'accepted' && (React.createElement(BannerFullSize, { smallSize: true, smallIcon: true, className: "mb-2", type: "green", lang: lang, image: medelIcon, description: ['Congratulations on reaching an agreement!', 'You will be contacted shortly to proceed with the next steps.'] })),
                        React.createElement(MakeOfferTimeline, { activeSingleOffer: activeSingleOffer, handleViewOffer: () => viewOffer(), lang: lang })))) : (React.createElement("div", null,
                    activeProofofFinancing !== null && (React.createElement(React.Fragment, null, activeProofofFinancing?.id ? (React.createElement(React.Fragment, null, (activeProofofFinancing?.calculationResults?.affordabilityCheck && activeProofofFinancing?.calculationResults?.loanValueCheck) ? (React.createElement(React.Fragment, null,
                        React.createElement(BannerFullSize, { smallSize: false, type: "green", lang: lang, image: DocumentIcon, title: "You applied for a proof of financing with our partners", description: ['They will review your information.'], button: {
                                label: 'Start preparing',
                                iconRight: 'arrow-right',
                                onClick: () => openPrepareModal(),
                                type: 'primary',
                            } }))) : (React.createElement(React.Fragment, null,
                        React.createElement(BannerFullSize, { smallSize: false, type: "red", lang: lang, image: DocumentIcon, title: "Unfortunately, you're not eligible for proof of financing at this time", description: ['You can still proceed with submitting an offer or contact the support.'], button: {
                                label: 'Contact support',
                                iconRight: 'arrow-right',
                                onClick: () => {
                                    handleScrollToBottom();
                                },
                                type: 'primary',
                            } }))))) : (React.createElement(React.Fragment, null,
                        React.createElement(BannerFullSize, { smallSize: false, type: "green", lang: lang, image: DocumentIcon, title: "Need a proof of financing?", description: ['Order a non-binding proof of financing from our trusted partners before making an offer. It can help you secure the best deal.'], button: {
                                label: 'Apply',
                                iconRight: 'arrow-right',
                                onClick: () => history.push(`/buyer/${propID}/offerFlow/proofFinancing`),
                                type: 'primary',
                            } }))))),
                    React.createElement(BannerFullSize, { smallSize: false, className: "mt-2", type: "default", lang: lang, image: BannerOfferDefault, title: "Ready to make an offer?", description: ['Send your proposal and take the first steps to buy your dream home.'], button: {
                            label: 'Add offer',
                            iconLeft: 'plus',
                            onClick: () => history.push(`/buyer/${propID}/offerFlow/makeOffer`),
                            type: 'primary',
                        } })))))));
};
const mapStateToProps = (state) => ({
    activeProofofFinancing: state?.deal.activeProofofFinancing || null,
    activeSingleOffer: state?.deal.activeSingleOffer || null,
    dealID: state?.deal?.activeSingleDeal?.id || null,
    lang: state?.common?.language || 'en',
});
const mapDispatchToProps = (dispatch) => ({
    handleGetActiveSingleOffer: bindActionCreators(getActiveSingleOffer, dispatch),
    handleGetProofofFinancing: bindActionCreators(getProofOfFinancing, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(SingleOffer);
