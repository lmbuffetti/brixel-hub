import React, {useEffect, useState} from 'react';
import {change, destroy, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
import {FinancialCalculator} from '@brixel-io/brixel-components/dist/utils/FinancialFormulas';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setModal, spinnerOff, spinnerSmallOff} from '../../../../actions/CommonActions';
import {getActiveSingleCompany} from '../../../../actions/CompanyActions';
import {getActiveSingleDeal, getBuyerDeal, saveMakeOffer} from '../../../../actions/DealActions';
import {getActiveSingleProperty} from '../../../../actions/PropertyActions';
import {multiUploadDocument} from '../../../../actions/UploadActions';
import {sendUserScanTrial} from '../../../../actions/UserActions';
import {MakeOfferQuestions} from '../../../../resources/Deals/MakeOffer';
import {getCookie, setCookie} from '../../../../utils/helpers';
import type {MakeOfferType} from '../../../../@types/Pages/Closing/Offers/Flow/MakeOffer';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import FlowScreen from '../../../../components/FlowScreen';

const MakeOffer = (props: MakeOfferType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleDeal,
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    formValue,
    handleSpinnerSmallOff,
    handleGetActiveSingleProperty,
    handleGetBuyerDeal,
    handleMultiUploadDocument,
    handleSaveMakeOffer,
    handleSetModal,
    initForm,
    initialValues,
    isSmallLoading,
    isTest,
    lang,
    loggedInUser,
    translations,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const QuestionData = MakeOfferQuestions((name, value) => changeFieldValue(name, value), (id) => setCurrentIndex(id)[0], (data) => handleSetModal(data), lang);
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionData);
  const [isToSave, setIsToSave] = useState(true);
  const price = get(formValue, 'amount', 0);
  // GET URL PARAMS
  const propID = get(match, 'id', null);
  const dealID = get(activeSingleDeal, 'id', null);

  useEffect(() => {
    if (activeSingleProperty.id !== propID) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
    initForm({});
    return () => {
      initForm({});
      handleSpinnerSmallOff();
      destroyForm();
    }
  }, []);

  useEffect(() => {
    if (activeSingleDeal.id && (get(activeSingleDeal, 'closing.stageOffer.offer.status', null) && (get(activeSingleDeal, 'closing.stageOffer.offer.amount', 0) === 0 || get(activeSingleDeal, 'closing.stageOffer.offer.status', '') !== 'rejected'))) {
      history.push({ pathname: `/buyer/${propID}/closing/${activeSingleDeal.id}` });
    }
    if (activeSingleProperty.id && !activeSingleDeal.id && loggedInUser.id && !isTest) {
      const buyerDealData = {
        id: activeSingleProperty.id,
        actionsStub: 'make-offer',
      }
      handleGetBuyerDeal(buyerDealData);
    }
    if (activeSingleProperty.id && !activeSingleDeal.id && loggedInUser.id && isTest && activeSingleCompany.id) {
      const buyerDealData = {
        id: activeSingleProperty.id,
        actionsStub: 'make-offer',
      }
      handleGetBuyerDeal(buyerDealData);
    }
  }, [activeSingleDeal.id, activeSingleProperty.id, activeSingleCompany.id, loggedInUser]);

  useEffect(() => {
    const cost = {
      equityCapital: get(formValue, 'financeBuyer.equity', undefined),
      income: get(formValue, 'financeBuyer.income', undefined),
      fixedCost: 0,
    };
    let lowCountryData = get(formValue, 'propertyLocation.countryCode', '');
    lowCountryData = lowCountryData ? lowCountryData.toLowerCase() : '';
    const financeCalc = FinancialCalculator(lowCountryData, price, cost, '');
    if (financeCalc) {
      const affordabilityData = get(financeCalc, 'affordability', 0);
      const loanToValueRatioData = get(financeCalc, 'loanToValueRatio', 0);
      changeFieldValue('affordability', affordabilityData);
      changeFieldValue('loanToValueRatio', loanToValueRatioData);
    }
  }, [get(formValue, 'financeBuyer.equity', null), get(formValue, 'financeBuyer.income', null)]);

  // SET DATA BY COMPANY
  useEffect(() => {
    if (get(activeSingleCompany, 'stub', null)) {
      const getLang = getCookie('brixelLang');
      if (get(activeSingleCompany, 'language.code', null) && !getLang && currentIndex < 2) {
        if (!loggedInUser.id) {
          const companyPhone = {
            prefix: get(activeSingleCompany, 'contact.phone.prefix', ''),
            number: '',
          };
          changeFieldValue('phone', companyPhone);
        }
      }
      changeFieldValue('company', activeSingleCompany.stub);
      setCookie('brixelStubCompany', activeSingleCompany.stub);
    }
  }, [activeSingleCompany.id]);

  // MOVE STEP FORWARD AFTER SAVING
  useEffect(() => {
    if (isSmallLoading.sendData === true && questions[currentIndex + 1]) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setIsToSave(true);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    if (activeSingleProperty.id) initForm(initialValues);
  }, [loggedInUser.id, activeSingleProperty.id]);

  // FUNCTION TO SAVE DATA
  const saveData = () => {
    const doc = get(formValue, 'document', []);
    const docs = get(formValue, 'documents', doc);
    // eslint-disable-next-line no-return-assign
    docs.forEach((_item, i) => set(docs[i], 'user', get(loggedInUser, 'id', undefined)));
    const dataDocuments = {
      allImgs: docs,
      actions: 'documents',
      pageID: propID,
      smallLoader: 'sendData',
      user: get(loggedInUser, 'id', null),
    };
    const dataForm = {
      ...formValue,
      id: dealID,
      smallLoader: 'sendData',
      saveAction: 'makeOffer',
      currency: formValue.propertyPriceCurrency,
    }
    delete dataForm.financeBuyer;
    delete dataForm.propertyLocation;
    delete dataForm.propertyPrice;
    delete dataForm.propertyPriceCurrency;
    delete dataForm.propertyLocation;
    const data = {
      ...dataForm,
      ...dataDocuments,
    };
    if (isToSave && data.amount > 0) {
      if (docs.length === 0 && activeSingleCompany.stub === 'ubs') {
        history.push(`/buyer/${propID}/financingFlow`);
      } else {
        setIsToSave(false);
        if (docs.length > 0) {
          handleMultiUploadDocument(data);
        } else {
          handleSaveMakeOffer(data);
        }
      }
    }
  };

  // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
  useEffect(() => {
    const newQuest: QuestionsListType[] = [];
    if (formValue) {
      MakeOfferQuestions((name, value) => changeFieldValue(name, value), (id) => setCurrentIndex(id), (data) => handleSetModal(data), lang).forEach((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (item.name && get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
          });
          if (isValid) newQuest.push(quests);
        } else {
          newQuest.push(quests);
        }
      });
      setQuestions(newQuest);
    }
  }, [formValue, get(formValue, 'document', null)]);

  useEffect(() => {
    if (has(formValue, 'document') && get(formValue, 'document', []).length === 0) {
      delete formValue.document;
    }
  }, [get(formValue, 'document', null)]);

  // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
  useEffect(() => {
    setQuestions(MakeOfferQuestions((name, value) => changeFieldValue(name, value), (id) => setCurrentIndex(id), (data) => handleSetModal(data), lang));
  }, [lang, translations]);

  return (
    <>
      <FlowScreen
        baseURL={`/packageFlow/${activeSingleProperty.id}/makeOffer`}
        onChangeCurrentIndex={(index) => setCurrentIndex(index)}
        formName="offerFlow"
        onSaveData={() => saveData()}
        QuestionsList={questions}
        closeLink={`/buyer/${activeSingleProperty.id}/closing`}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', { }),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', { }),
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  errorValue: get(state, 'brixelForm.offerFlow.syncErrors', {}),
  formValue: get(state, 'brixelForm.offerFlow.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', ''),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  translations: get(state, 'translations', { }),
  isTest: get(state, 'common.isTest', false),
  initialValues: {
    ...get(state, 'brixelForm.offerFlow.values', {}),
    affordabilityCheck: null,
    loanValueCheck: null,
    financeCertificate: null,
    company: get(state, 'companies.activeSingleCompany.stub', null),
    id: get(state, 'property.activeSingleProperty.id', null),
    propertyLocation: get(state, 'property.activeSingleProperty.location', {}),
    amount: get(state, 'property.activeSingleProperty.price.total', 0) || 0,
    propertyPrice: get(state, 'property.activeSingleProperty.price.total', 0) || 0,
    propertyPriceCurrency: get(state, 'property.activeSingleProperty.price.currency', ''),
    noDocument: 0,
  },
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('offerFlow', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('offerFlow', value));
  },
  destroyForm() {
    (dispatch(destroy('offerFlow')));
  },
  handleReset(data) {
    (dispatch(reset('offerFlow', data)));
  },
  handleGetActiveDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handleMultiUploadDocument: bindActionCreators(multiUploadDocument, dispatch),
  handleSaveMakeOffer: bindActionCreators(saveMakeOffer, dispatch),
  handleSendScanTrial: bindActionCreators(sendUserScanTrial, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MakeOffer);
