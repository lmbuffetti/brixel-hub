import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../../../components/Header/PageHeader';
import PageFooter from '../../../components/Footer/PageFooter';
import ResumeOffer from './ResumeOffer';
import AddCommentReview from './AddCommentReview';
import ReviewOfferThankYou from './ReviewOfferThankYou';
import api from '../../../controllers/api/config';
import { bindActionCreators } from 'redux';
import { getActiveSingleOffer } from '../../../actions/DealActions';
import { spinnerSmall } from '../../../actions/CommonActions';
const ReviewOfferModal = ({ handleGetOffer, handleSetSmallLoading, isSmallLoading, activeSingleDeal, activeSingleOffer, closeModal, dealID, lang, }) => {
    const [formValue, setFormValue] = React.useState({
        status: 'accepted',
        note: '',
    });
    const [formStep, setFormStep] = React.useState(0);
    const changeStep = (isBack = false) => {
        if (isBack)
            setFormStep(formStep - 1);
        else
            setFormStep(formStep + 1);
    };
    const onChangeValue = (name, value) => {
        setFormValue((prev) => ({ ...prev, [name]: value }));
    };
    const saveData = () => {
        handleSetSmallLoading({ saveData: true });
        api.deal.reviewOffer(dealID, formValue)
            .then(() => {
            handleGetOffer({ id: dealID, smallLoader: 'saveData' });
            changeStep();
        });
    };
    return (React.createElement("div", { className: `dis-fl-col flex-1 ${formStep === 2 ? 'bgGreen25' : 'bgText25'}` },
        React.createElement(PageHeader, { isFlow: true, onClose: () => closeModal(), showFooter: true }),
        React.createElement("div", { className: "max-w-fix-600 px-3 mx-a w-perc-100 h-perc-100" },
            formStep === 0 && (React.createElement(ResumeOffer, { lang: lang, activeSingleDeal: activeSingleDeal, activeSingleOffer: activeSingleOffer, closeModal: () => closeModal(), onClick: (action) => {
                    onChangeValue('status', action);
                    changeStep();
                } })),
            formStep === 1 && (React.createElement(AddCommentReview, { lang: lang, changeStep: (isBack) => changeStep(isBack), onChangeValue: (name, value) => onChangeValue(name, value), onClick: () => saveData(), status: formValue.status, isLoadingSave: isSmallLoading.saveData || false })),
            formStep === 2 && (React.createElement(ReviewOfferThankYou, { closeModal: () => closeModal(), lang: lang }))),
        React.createElement(PageFooter, null)));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || null,
    activeSingleOffer: state?.deal?.activeSingleOffer || {},
    dealID: state?.deal?.activeSingleDeal?.id || '',
    formValue: state?.brixelForm?.makeOffer?.values || {},
    isSmallLoading: state?.isSmallLoading || {},
    lang: state?.common?.language || 'en',
    activeSingleDeal: state?.deal?.activeSingleDeal || {},
});
const mapDispatchToProps = (dispatch) => ({
    handleGetOffer: bindActionCreators(getActiveSingleOffer, dispatch),
    handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReviewOfferModal);
