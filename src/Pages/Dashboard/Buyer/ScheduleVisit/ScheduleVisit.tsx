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
import {useLocation, useNavigate} from 'react-router-dom';
import {setModal} from '../../../../actions/CommonActions';
import {saveScheduleVisit} from '../../../../actions/PropertyActions';
import ScheduleVisitComponent from './ScheduleVisitComponent';
import translateTo from '../../../../utils/translation';
import Calendar from '../../../../images/dashboard/calendarState.svg';
import type {ScheduleVisitType} from '../../../../@types/Pages/Dashboard/Buyer/ScheduleVisit';

const ScheduleVisit = (props: ScheduleVisitType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
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

  const lastPart = history.location.pathname.split('/').filter(e => e).slice(-1);
  if (lastPart[0] && lastPart[0] !== 'addDate') history.push('../scheduleVisit');
  const isNewDate = lastPart[0] === 'addDate';

  const openModalDate = () => {
    history.push('./addDate');
    handleSetModal({
      state: true,
      layout: 'xlarge',
      small: true,
      component: <ScheduleVisitComponent onClick={() => ''} />,
      title: 'Add date',
      titleTop: true,
      hideClose: true,
      onClose: () => console.log('test');
    })
  };

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id, loggedInUser.id, activeSingleDeal.id]);

  useEffect(() => {
    if (isNewDate) {
      openModalDate();
    }
  }, [isNewDate]);


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
    <div className="rewards-container" id="rewardsDashboard">

      <div>
        <h4 className="mb-3 hide dis-b-lg fweight-600">
          Visit
        </h4>
        <p>

        </p>
      </div>


      <div className="ta-c bgWhite brdRadius p-4">
        <img src={Calendar} alt="Calendar" />
        <h5>{translateTo('No availability dates added.', lang)}</h5>
        <p className="max-width-440 mx-a">
          {translateTo('Tell us when you would be available to visit your favorite property. The property owner will be informed in real time of your request.', lang)}
        </p>
        <BrixelButtonPrimary
          className="mt-3 mx-a"
          rounded
          label="Add dates"
          rightIcon="plus"
          onClick={() => openModalDate()}
        />

      </div>

      <BrixelButtonPrimary
        className="mt-3 mr-0"
        rounded
        label="Save"
        rightIcon="arrow-right"
        onClick={() => saveData()}
      />

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
