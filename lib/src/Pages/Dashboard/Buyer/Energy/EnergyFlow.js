import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { translateTo } from '@brixel-io/brixel-components/dist';
import FlowScreen from '../../../../components/FlowScreen';
import { QuestionsList } from '../../../../resources/Dashboard/EnergyCertificate';
import { bindActionCreators } from 'redux';
import { getActiveSingleProperty } from '../../../../actions/PropertyActions';
import { spinnerSmall } from '../../../../actions/CommonActions';
import api from '../../../../controllers/api/config';
import { getBuyerDeal } from '../../../../actions/DealActions';
const EnergyFlow = ({ activeSingleDeal, activeSingleProperty, formValue, handleGetActiveSingleProperty, handleGetBuyerDeal, handleSetSmallLoading, lang, }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const QuestionData = QuestionsList(lang);
    const match = useParams();
    const propID = match?.propID || '';
    useEffect(() => {
        if (propID && propID !== activeSingleProperty?.id) {
            const data = {
                fullVersion: false,
                smallLoader: 'property',
                id: propID,
            };
            handleGetActiveSingleProperty(data);
        }
        if (!activeSingleDeal.id) {
            const buyerDealData = {
                id: propID,
                actionsStub: 'make-offer',
            };
            handleGetBuyerDeal(buyerDealData);
        }
    }, [propID]);
    const saveData = () => {
        handleSetSmallLoading({ sendData: true });
        const data = {
            ...formValue,
        };
        if (activeSingleDeal?.id) {
            api.deal.sendSequestVerifiedEnergyCertificate(data, activeSingleDeal?.id)
                .then((res) => {
                if (res.meta.status === 200) {
                    setCurrentIndex(currentIndex + 1);
                }
                handleSetSmallLoading({ sendData: false });
            });
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(FlowScreen, { baseURL: `/buyer/${propID}/energy/energyFlow`, onChangeCurrentIndex: (index) => setCurrentIndex(index), formName: "currentIndex", onSaveData: () => saveData(), QuestionsList: QuestionData, closeLink: `/buyer/${propID}/home`, newCurrentIndex: currentIndex, closeLabel: translateTo('Back to home', lang) })));
};
const mapStateToProps = (state) => ({
    activeSingleDeal: state?.deal?.activeSingleDeal || {},
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    formValue: state?.brixelForm?.energyRequest?.values || {},
    lang: state?.common?.language || 'en',
});
const mapDispatchToProps = (dispatch) => ({
    handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
    handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(EnergyFlow);
