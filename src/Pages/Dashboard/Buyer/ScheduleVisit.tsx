import React, {useEffect, useState} from 'react';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {
  initializeForm,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerSmallOff} from '../../../actions/CommonActions';
import {
  saveScheduleVisit,
  getActiveSingleProperty,
  getScheduleVisit,
} from '../../../actions/PropertyActions';
import {QuestionsList} from '../../../resources/SingleProperty/ScheduleVisit';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import type {ScheduleVisitType} from '../../../@types/Pages/Dashboard/Buyer/ScheduleVisit';
import FlowScreen from '../../../components/FlowScreen';
import {getBuyerDeal} from '../../../actions/DealActions';

const ScheduleVisit = (props: ScheduleVisitType) => {

  const match = useParams();
  // PROPS
  const {
    activeSingleDeal,
    activeSingleProperty,
    formValue,
    hanldeSaveScheduleVisit,
    hanldeGetScheduleVisit,
    handleGetActiveSingleProperty,
    handleGetBuyerDeal,
    initForm,
    initialValues,
    lang,
    loggedInUser,
    translations,
  } = props;
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang));

  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id, loggedInUser.id, activeSingleDeal.id]);

  useEffect(() => {
    if (activeSingleProperty.id && loggedInUser.id) {
      if (!activeSingleDeal.id && loggedInUser.id) {
        const actionStub = 'user-schedule';
        handleGetBuyerDeal({ id: propID, actionStub });
      }
    }
  }, [loggedInUser]);

  useEffect(() => {
    setQuestions(QuestionsList(lang))
  }, [formValue, lang, translations]);

  useEffect(() => {
    if (activeSingleDeal.id && loggedInUser.id) {
      const data2 = {
        id: activeSingleDeal.id,
        order: 'createdAt',
        direction: 'DESC',
        smallLoader: 'getBooking',
      };
      hanldeGetScheduleVisit(data2);
    }
  }, [activeSingleDeal]);


  useEffect(() => {
    if (propID && propID !== 'propertyLists' && propID !== activeSingleProperty.id) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID]);

  const saveData = () => {
    const data = {
      data: {
        deal: formValue.deal,
        buyerAvailability: formValue.scheduleVisit,
        byuerMessage: formValue.message,
      },
      smallLoader: 'sendData',
    };
    hanldeSaveScheduleVisit(data);
  };

  return (
    <FlowScreen
      baseURL={`/buyer/${activeSingleProperty.id}/scheduleVisit`}
      formName="ScheduleVisit"
      onSaveData={() => saveData()}
      QuestionsList={questions}
    />
  );
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
  activeSingleCompany.defaultDialCode = countryPhoneCode?.dial_code;
  const initialValues = {
    ...get(state, 'deal.scheduleVisitData', []),
    deal: get(state, 'deal.activeSingleDeal.id', null),
  };
  return ({
    activeSingleCompany,
    activeScheduleVisit: get(state, 'deal.scheduleVisit', []),
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    errorValue: get(state, 'brixelForm.ScheduleVisit.syncErrors', {}),
    formValue: get(state, 'brixelForm.ScheduleVisit.values', {}),
    initialValues,
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    translations: get(state, 'common.translation', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('ScheduleVisit', value));
  },
  hanldeSaveScheduleVisit: bindActionCreators(saveScheduleVisit, dispatch),
  hanldeGetScheduleVisit: bindActionCreators(getScheduleVisit, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetBuyerDeal: bindActionCreators(getBuyerDeal, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScheduleVisit);
