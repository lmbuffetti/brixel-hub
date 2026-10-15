import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonPrimary, BrixelButtonText, BrixelStatus } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { change, reset } from '@brixel-io/brixel-components/dist/form';
import { updatePortalsReview } from '../../actions/PropertyActions';
import { setModal } from '../../actions/CommonActions';
import { MarketingModalData } from '../../resources/SingleProperty/marketingModal';
import api from '../../controllers/api/config';
const Portals = (props) => {
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleProperty, 
    // changeFieldValue,
    customPortals, handleSetModal, handleUpdatePortalsReview, isSmallLoading, lang, modal, } = props;
    // STATE
    const [status, setStatus] = useState();
    const [portalsList, setPortalsList] = useState(null);
    // URL PARAMS
    const propID = get(match, 'propID', null);
    const MarketingModal = MarketingModalData(lang);
    // GET PORTALS STATUS
    const checkPortalsOnline = () => {
        let isOnline = false;
        if (portalsList && portalsList.length > 0) {
            let counter = portalsList.length;
            portalsList.forEach((el) => {
                if (el.exportEnabled === true)
                    counter++;
                if (el.exportEnabled === null || el.exportEnabled === false)
                    counter--;
            });
            if (counter === 0) {
                isOnline = false;
            }
            if (counter > 0) {
                isOnline = true;
            }
        }
        return isOnline;
    };
    // ASSIGN COLOR AND TEXT BY STATUS
    useEffect(() => {
        if (portalsList && portalsList.length > 0) {
            if (activeSingleProperty.portalsReview) {
                setStatus({
                    text: translateTo('Review', lang),
                    color: 'Yellow400',
                    state: 'review',
                });
            }
            else if (checkPortalsOnline() === true) {
                setStatus({
                    text: translateTo('Published', lang),
                    color: 'Green400',
                    state: 'published',
                });
            }
            else {
                setStatus({
                    text: translateTo('Unpublished', lang),
                    color: 'Red400',
                    state: 'unpublished',
                });
            }
        }
    }, [portalsList]);
    const getPortals = () => {
        let portals = [];
        const callArray = [];
        const call = api.portals.getPortals(activeSingleProperty.id)
            .then((res) => {
            if (res.meta.status === 200) {
                portals = res.data;
            }
        })
            .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
        });
        callArray.push(call);
        Promise.allSettled(callArray).then(() => {
            setPortalsList(portals);
        });
    };
    useEffect(() => {
        if (activeSingleProperty.id) {
            getPortals();
        }
    }, [activeSingleProperty]);
    // CHANGE PORTALS REVIEW
    const changeReviewStatus = () => {
        const data = {
            page: propID,
            smallLoader: 'saveMarketingPortal',
            status: checkPortalsOnline() ? 'offline' : 'online',
        };
        handleUpdatePortalsReview(data);
    };
    const onClickRequest = (state, type = 'request') => {
        const bodyText = MarketingModal[state][type].body.replace(':companyPrice', `${get(activeSingleCompany, 'country.currency')} ${get(activeSingleCompany, 'meta.portals.price')}`);
        handleSetModal({
            state: true,
            layout: 'xlarge',
            bodyClassColor: 'bgWhite',
            title: MarketingModal[state][type].title,
            body: bodyText,
            small: true,
            titleImg: MarketingModal[state][type].titleImg,
            classContainer: 'dis-b ta-c',
            classImg: 'mx-a w-fix-64 mb-3',
            bodyActionsClass: 'dis-f a-c jc-c mt-5 mb-3',
            bodyInnerClass: 'max-w-fix-384 m-a ta-c',
            classTitle: 'ta-c',
            /* showSupport: type === 'success', */
            /* supportLayout: 'inline', */
            multiBodyActions: type === 'success' ? [
                {
                    btnType: 'Primary',
                    name: translateTo('Ok thanks', lang),
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
                    name: translateTo('Confirm', lang),
                    round: true,
                    className: 'ml-1',
                    func: () => changeReviewStatus(),
                },
            ],
        });
    };
    useEffect(() => {
        if (get(modal, 'multiBodyActions', []).length > 1 && isSmallLoading.saveMarketingPortal === true) {
            modal.multiBodyActions[1].isLoading = isSmallLoading.saveMarketingPortal;
            handleSetModal(modal);
        }
        if (isSmallLoading.saveMarketingPortal === false) {
            const stateText = status?.state === 'published' ? 'unpublishPage' : 'publishPage';
            onClickRequest(stateText, 'success');
        }
    }, [isSmallLoading]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "bgWhite p-4 brdRadius" },
            React.createElement("div", { className: "dis-f jc-b a-c mb-2" },
                React.createElement("h5", null, translateTo('Publish on portals', lang)),
                React.createElement("div", { className: `brdSmall px-2 py-1 brd${status?.color} txt${status?.color} brdRadius` }, translateTo(status?.text || '', lang))),
            React.createElement("div", { className: "mb-4" }, checkPortalsOnline() ? (React.createElement("p", null, translateTo('Your property is published on following portals:', lang))) : (React.createElement("div", null,
                React.createElement("p", null, translateTo('Reach a wide audience and publish your property on the biggest portals', lang)),
                React.createElement("ul", { className: "checkList fsize-300 green mt-2 txtText700" },
                    React.createElement("li", null, translateTo('Manage all your listings in one place', lang)),
                    React.createElement("li", null, translateTo('Publish all your listings with one click', lang)),
                    React.createElement("li", null,
                        React.createElement("span", null, translateTo('Valid for', lang)),
                        React.createElement("span", { className: "mx-small-4" }, get(activeSingleCompany, 'meta.portals.duration', 6)),
                        React.createElement("span", null, translateTo('months', lang))),
                    React.createElement("li", null, translateTo('Homegate, ImmoScout24, Comparis, Newhome and many more.', lang)))))),
            React.createElement("div", { className: "portalsList mt-3" },
                checkPortalsOnline() && portalsList && portalsList.length > 0 && portalsList.map((portal, i) => (React.createElement(React.Fragment, { key: `prt_${i.toString()}` }, portal.children.length === 0 ? (portal.exportEnabled ? (React.createElement(React.Fragment, null, portal.url ? (React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: portal.url, className: "dis-f a-c" },
                    React.createElement(BrixelStatus, { color: `${portal.exportEnabled ? 'green' : 'red'}` }),
                    React.createElement("span", { className: `fsize-300 ${portal.exportEnabled ? 'txtGreen400' : 'txtText900'} td-u ml-1` }, portal.portal.displayName))) : (React.createElement("div", { className: "dis-f a-c" },
                    React.createElement(BrixelStatus, { color: `${portal.exportEnabled ? 'green' : 'red'}` }),
                    React.createElement("span", { className: "fsize-300 txtText900 ml-1" }, portal.portal.displayName))))) : (React.createElement("div", { className: "dis-f a-c singlePortal" },
                    React.createElement(BrixelStatus, { color: "red" }),
                    React.createElement("span", { className: "fsize-300 txtText900 ml-1 no-transform" }, portal.portal.displayName)))) : (portal.children.length > 0 && portal.children.map((portalChild, j) => (React.createElement(React.Fragment, { key: `prtChld_${j.toString()}` }, portal.exportEnabled ? (React.createElement(React.Fragment, null, portalChild.url ? (React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: portalChild.url, className: "dis-f a-c" },
                    React.createElement(BrixelStatus, { color: `${portal.exportEnabled ? 'green' : 'red'}` }),
                    React.createElement("span", { className: `fsize-300 ${portal.exportEnabled ? 'txtGreen400' : 'txtText900'} no-transform td-u ml-1` }, portalChild.portal.displayName))) : (React.createElement("div", { className: "dis-f a-c" },
                    React.createElement(BrixelStatus, { color: `${portal.exportEnabled ? 'green' : 'red'}` }),
                    React.createElement("span", { className: "fsize-300 txtText900 ml-1" }, portalChild.portal.displayName))))) : (React.createElement("div", { className: "dis-f a-c singlePortal" },
                    React.createElement(BrixelStatus, { color: "red" }),
                    React.createElement("span", { className: "fsize-300 txtText900 ml-1 no-transform" }, portalChild.portal.displayName)))))))))),
                Object.keys(customPortals).map((key, i) => (React.createElement(React.Fragment, { key: `cstPrt_${i.toString()}` }, customPortals[key] && !key.toLocaleLowerCase().includes('url') && (React.createElement(React.Fragment, null, customPortals[`${key}Url`] ? (React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: customPortals[`${key}Url`], className: "dis-f a-c" },
                    React.createElement(BrixelStatus, { color: "green" }),
                    React.createElement("span", { className: "fsize-300 txtGreen400 td-u ml-1" }, translateTo(key, lang)))) : (React.createElement("div", { className: "dis-f a-c" },
                    React.createElement(BrixelStatus, { color: "green" }),
                    React.createElement("span", { className: "fsize-300 txtText900 ml-1" }, translateTo(key, lang)))))))))),
            React.createElement("div", { className: "dis-f a-c jc-fe mt-5" }, checkPortalsOnline() ? (React.createElement(React.Fragment, null,
                React.createElement(BrixelButtonText, { label: translateTo('Take Page offline', lang), theme: "red", rounded: true, onClick: () => onClickRequest('unpublishPortals', 'request'), isLoading: isSmallLoading.pageReview }))) : (React.createElement(React.Fragment, null, status?.state !== 'review' && (React.createElement(BrixelButtonPrimary, { label: translateTo('Request to publish', lang), rounded: true, onClick: () => onClickRequest('publishPortals', 'request'), isLoading: isSmallLoading.pageReview }))))))));
};
Portals.propTypes = {
    activeSingleCompany: PropTypes.object.isRequired,
    activeSingleProperty: PropTypes.object.isRequired,
    customPortals: PropTypes.object.isRequired,
    // formValue: PropTypes.object.isRequired,
    handleSetModal: PropTypes.func.isRequired,
    handleUpdatePortalsReview: PropTypes.func.isRequired,
    isSmallLoading: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    modal: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
    // const formValue = get(state, 'brixelForm.Property.values', {});
    const activeSingleProperty = get(state, 'property.activeSingleProperty', {});
    return ({
        activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
        activeSingleProperty,
        customPortals: get(activeSingleProperty, 'customPortals', {}),
        // formValue,
        lang: get(state, 'common.language', 'en'),
        isSmallLoading: get(state, 'common.isSmallLoading', {}),
        modal: get(state, 'common.modal', {}),
    });
};
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    reset(form, data) {
        (dispatch(reset(form, data)));
    },
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleUpdatePortalsReview: bindActionCreators(updatePortalsReview, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Portals);
