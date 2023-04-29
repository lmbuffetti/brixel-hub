import React, {useEffect} from 'react';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {
  initializeForm,
} from '@brixel/brixel-components/dist/form';
import {
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {setModal} from '../../../../actions/CommonActions';
import {saveScheduleVisit} from '../../../../actions/PropertyActions';
import type {ScheduleVisitType} from '../../../../@types/Pages/Dashboard/Buyer/ScheduleVisit';
import translateTo from '../../../../utils/translation';

const ScheduleVisit = (props: ScheduleVisitType) => {
  // PROPS
  const {
    activeSingleDeal,
    activeSingleProperty,
    formValue,
    hanldeSaveScheduleVisit,
    handleSetModal,
    initForm,
    initialValues,
    lang,
    loggedInUser,
  } = props;

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id, loggedInUser.id, activeSingleDeal.id]);

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

  const openModalDate = () => {
    handleSetModal({
      state: true,
      layout: 'xlarge',
      small: true,
    })
  };

  return (
    <div className="rewards-container" id="rewardsDashboard">

      <h4 className="mb-3 hide dis-b-lg fweight-600">
        Add your availability dates
      </h4>


      <div>
        <h5>{translateTo('No visits scheduled!', lang)}</h5>
        <p>
          {translateTo('Request a visit to your favorite property to follow the progress here.', lang)}
        </p>
        <BrixelButtonPrimary
          className="mt-3"
          rounded
          label="Add new dates"
          rightIcon="arrow-right"
          onClick={() => openModalDate()}
        />


        <BrixelButtonPrimary
          className="mt-3"
          rounded
          label="Save"
          rightIcon="arrow-right"
          onClick={() => saveData()}
        />
      </div>

    </div>
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
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScheduleVisit);
