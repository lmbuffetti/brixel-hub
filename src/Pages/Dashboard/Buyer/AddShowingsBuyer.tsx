import React, {useEffect, useState} from 'react';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {
  initializeForm,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerSmallOff} from '../../../actions/CommonActions';
import {
  createPropertyVisitBooking,
  getActiveSingleProperty,
  getActiveSinglePropertyBookings,
} from '../../../actions/PropertyActions';
import {QuestionsList} from '../../../resources/SingleProperty/AddShowings';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import type {AddShowingsBuyerType} from '../../../@types/Pages/Dashboard/Buyer/AddShowingsBuyer';
import FlowScreen from '../../../components/FlowScreen';

const AddShowingsBuyer = (props: AddShowingsBuyerType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    formValue,
    handleCreatePropertyVisitBooking,
    handleGetActiveSinglePropertyBookings,
    handleGetActiveSingleProperty,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang));

  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (activeSingleProperty.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id, loggedInUser.id]);

  useEffect(() => {
    setQuestions(QuestionsList(lang))
  }, [formValue, lang]);

  useEffect(() => {
    if (propID && loggedInUser.id) {
      const data2 = {
        id: propID,
        data: {
          user: loggedInUser.id,
        },
        smallLoader: 'getBooking',
      };
      handleGetActiveSinglePropertyBookings(data2);
    }
  }, [propID, loggedInUser]);


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

  useEffect(() => {
    if (isSmallLoading.sendData === false) {
      history.push(`/buyer/${activeSingleProperty.id}/home`);
    }
  }, [isSmallLoading]);

  const saveData = () => {
    const data = {
      page: activeSingleProperty.id,
      slots: formValue.scheduleVisitFree,
      buyer: {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        language: lang,
      },
      getByUser: loggedInUser.id,
      message: formValue.message,
      smallLoader: 'sendData',
    };
    handleCreatePropertyVisitBooking(data);
  };

  return (
    <FlowScreen
      baseURL={`/buyer/${activeSingleProperty.id}/scheduleVisit`}
      formName="Showings"
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
    ...get(state, 'brixelForm.Showings.values', {}),
    name: get(state, 'user.loggedInUser.user.name', null),
    phone: {
      prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode?.dial_code) || countryPhoneCode?.dial_code,
      number: get(state, 'user.loggedInUser.user.phone.number', ''),
    },
    email: get(state, 'user.loggedInUser.user.email', null),
  };
  return ({
    activeSingleCompany,
    activeSinglePropertyBookingSlots: get(state, 'property.activeSinglePropertyBookingSlots', []),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    errorValue: get(state, 'brixelForm.Showings.syncErrors', {}),
    formValue: get(state, 'brixelForm.Showings.values', {}),
    initialValues,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('Showings', value));
  },
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
