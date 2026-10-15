import React, { useEffect } from 'react';
import { BrixelButtonIcon, BrixelIcon, } from '@brixel-io/brixel-components';
import { change } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { getActiveSingleDeal, getActiveSingleOffer, } from '../../actions/DealActions';
import { setModal } from '../../actions/CommonActions';
import translateTo from '../../utils/translation';
import MakeOfferPropertyCardVertical from '../../components/Cards/MakeOfferPropertyCardVertical';
import ContactPageCard from '../../components/Cards/ContactPageCard';
import BannerFullSize from '../../components/BannerFullSize';
import MakeOfferTimeline from '../Dashboard/Buyer/Offer/MakeOffer/MakeOfferTimeline';
// import DocumentIcon from '../../images/documentsIcon/documentFull.svg';
import BannerOfferDefault from '../../images/dashboard/bannerOffer-deafault.svg';
import { getActiveSingleProperty } from '../../actions/PropertyActions';
import ReviewOfferModal from './Offer/ReviewOfferModal';
import medelIcon from '../../images/offer-flow/medel.svg';
const SingleOffer = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { activeSingleDeal, activeSingleOffer, activeSingleProperty, handleGetActiveDeal, handleGetActiveSingleOffer, handleSetModal, hanldeGetActiveSingleProperty, lang, } = props;
    const propID = get(match, 'propID', null);
    const dealID = get(match, 'dealID', null);
    useEffect(() => {
        if (activeSingleDeal.id !== dealID || !activeSingleDeal.id) {
            handleGetActiveDeal({ id: dealID, property: propID, smallLoader: 'getDeal' });
            handleGetActiveSingleOffer({ id: dealID, smallLoader: 'getOffer' });
        }
    }, [history?.location?.pathname]);
    useEffect(() => {
        if (activeSingleProperty.id !== propID || !activeSingleProperty.id) {
            hanldeGetActiveSingleProperty({ id: propID, smallLoader: 'getProperty' });
        }
    }, [propID]);
    const viewOffer = () => {
        handleSetModal({
            clickOutsideToClose: false,
            bodyClassColor: 'p-0 dis-fl-col',
            bodyInnerClass: 'h-perc-100 dis-fl-col flex-1',
            state: true,
            small: true,
            hideHeader: true,
            layout: 'fullscreen',
            component: React.createElement(ReviewOfferModal, { closeModal: () => handleSetModal({}) }),
        });
    };
    const getFirstName = () => {
        const fullName = get(activeSingleDeal, 'user.name', '');
        return fullName.split(' ')[0] || '';
    };
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
    return (React.createElement(React.Fragment, null, activeSingleOffer.id && (React.createElement("div", { className: "dashboardContainer mt-0 mt-md-3 dis-f jc-b", id: "dashboard" },
        React.createElement("div", { className: "w-perc-100" },
            React.createElement("div", { className: "single-deal dis-fl-col w-perc-100" },
                React.createElement("div", { className: "actions dis-fl-row jc-b pb-2" },
                    React.createElement("div", { className: "pt-2 pr-1 pr-lg-0 pt-lg-0" },
                        React.createElement(BrixelButtonIcon, { icon: "arrow-left-small", ghost: true, theme: "text", onClick: () => history.push(`/${propID}/prospect/${dealID}`) }))),
                React.createElement("div", { className: "dis-f h-perc-lg-100" },
                    React.createElement("div", { className: "dis-fl-col w-perc-100 h-perc-lg-100" },
                        React.createElement("div", { className: "dis-f mb-1 mb-sm-3 a-c" },
                            React.createElement("h3", { className: "fsize-500 fsize-sm-600 fweight-600" },
                                React.createElement("span", null, getFirstName()),
                                React.createElement("span", null, translateTo('\'s offer', lang))),
                            activeSingleOffer?.status && (React.createElement("div", { className: `status-box dis-f a-b
                             ml-2 brdRadius px-1 py-small-4 bg${getOfferBackground()}100` },
                                React.createElement(BrixelIcon, { iconSize: 'w-fix-16', color: getOfferBackground(), className: 'mr-1', icon: getStatusIcon() }),
                                React.createElement("span", { className: `txt${getOfferTextColor()} fsize-200 fweight-500` }, translateTo(activeSingleOffer?.status.charAt(0).toUpperCase() + activeSingleOffer?.status.slice(1), lang))))),
                        activeSingleOffer.id ? (React.createElement("div", { className: "dis-fl-col-rev dis-fl-row-md" },
                            React.createElement("div", { className: "w-perc-100 max-w-fix-md-344" },
                                React.createElement("div", null,
                                    React.createElement("h4", { className: "mb-2 fsize-500 fweight-600 mt-2 mt-md-0" }, translateTo('Property details', lang)),
                                    React.createElement(MakeOfferPropertyCardVertical, null)),
                                React.createElement("div", { className: "mt-3" },
                                    React.createElement("h5", { className: "mb-2 fsize-500 fweight-600" }, translateTo('Contact', lang)),
                                    activeSingleDeal.user && (React.createElement(ContactPageCard, { avatarIcon: {
                                            icon: 'key',
                                            color: 'red',
                                        }, className: "mb-1", contactRole: "Buyer", contactDetails: activeSingleDeal.user })),
                                    React.createElement(ContactPageCard, null))),
                            React.createElement("div", { className: "pl-md-5 w-perc-md-70" },
                                React.createElement("h5", { className: "mb-2 fweight-600 mt-2 mt-md-0" }, translateTo('Progress', lang)),
                                !activeSingleOffer?.id || activeSingleOffer?.status === 'accepted' && (React.createElement(BannerFullSize, { smallSize: true, smallIcon: true, className: "mb-2", type: "green", lang: lang, image: medelIcon, description: ['Congratulations on reaching an agreement!', 'You will be contacted shortly to proceed with the next steps.'] })),
                                React.createElement(MakeOfferTimeline, { buyerInfo: activeSingleDeal.user, activeSingleOffer: activeSingleOffer, handleViewOffer: () => viewOffer(), lang: lang, isSeller: true })))) : (React.createElement("div", null,
                            React.createElement(BannerFullSize, { smallSize: false, className: "mt-2", type: "default", lang: lang, image: BannerOfferDefault, title: "Ready to make an offer?", description: ['Send your proposal and take the first steps to buy your dream home.'], button: {
                                    label: 'Add offer',
                                    iconLeft: 'plus',
                                    onClick: () => history.push(`/buyer/${propID}/offerFlow/makeOffer`),
                                    type: 'primary',
                                } })))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleOffer: state?.deal?.activeSingleOffer || {},
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    handleGetActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
    handleGetActiveSingleOffer: bindActionCreators(getActiveSingleOffer, dispatch),
    hanldeGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(SingleOffer);
