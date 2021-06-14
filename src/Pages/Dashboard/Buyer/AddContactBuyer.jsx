/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelModal,
  BrixelIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { createPropertyVisitBooking } from '../../../actions/PropertyActions';
import { spinnerSmallOff } from '../../../actions/CommonActions';
import ContactForm from '../../../components/ContactForm';
import 'react-input-range/lib/css/index.css';

// COMPONENTS

const AddContactBuyer = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    handleSpinnerSmallOff,
    history,
    isSmallLoading,
  } = props;
  const [currentStep, setCurrentStep] = useState('message');
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (isSmallLoading.sendMessage === 'savedBooking' || isSmallLoading.sendMessage === 'sentMessage') {
      setCurrentStep('sentMessage');
      handleSpinnerSmallOff();
    }
  }, [isSmallLoading]);

  const buttonActions = () => {
    let btn = null;
    if (currentStep === 'message') {
      btn = [
        {
          name: 'Send',
          func: () => setAction('send'),
          btnType: 'Primary',
          className: 'mr-1',
          bkg: 'primary',
          isLoading: isSmallLoading.sendMessage === true,
          sat: 400,
          round: true,
        },
      ];
    }
    return btn;
  };

  return (
    <BrixelModal
      multiActions={buttonActions()}
      onClose={() => history.push(`/buyer/${activeSingleProperty.id}/property/contact`)}
      id="contact-foreground"
      layout="large"
    >
      {
        currentStep === 'message' && (
          <div className="dis-fl-col test">
            <section className="titleSection">
              <h4 className="mb-2 txtDark700">About you</h4>
              <h5 className="heading6 txtDark700">How can we reach you?</h5>
              <div className="min-h-
              fix-320"
              >
                <ContactForm
                  action={action}
                  onChangeAction={(val) => setAction(val)}
                />
              </div>
            </section>
          </div>
        )
      }
      {
        currentStep === 'sentMessage' && (
          <div id="messageSent" className="dis-fl-col jc-b h-perc-100 mb-2-neg">
            <section className="titleSection">
              <h6 className="mb-1 txtGreen400 dis-f a-bl">
                YOUR MESSAGE WAS SENT
              </h6>
              <h4 className="mb-2 txtDark700">Thank you</h4>
              <h5 className="heading6 txtDark700">We will contact you as soon as possible.</h5>
            </section>
            <section className="bodySection mx-2-neg px-2 bgWhite shadow-1dp brdRadiusTop pt-2 pb-4 mx-sm-5-neg px-sm-5 mb-1-neg">
              <p className="mb-2"><b>Here are 3 tips for a smooth process</b></p>

              <ul>
                <li>
                  <BrixelIcon icon="tour" color="green" background="green" saturation={200} saturationTxt={700} />
                  <div>
                    <span>Make sure you visited the</span>&nbsp;
                    <span
                      className="txtPrimary400 cur-poi"
                      onClick={() => window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}/explore/tour`, '_blank')}
                    >
                      <span>3D Tour</span>
                    </span>
                  </div>
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="favorite-house" color="green" background="green" saturation={200} saturationTxt={700} />
                  Do not forget to favorite the property to keep all the information in one place
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="money" color="green" background="green" saturation={200} saturationTxt={700} />
                  Get in touch with your bank about financing before you visit
                </li>
              </ul>
            </section>
          </div>
        )
      }
    </BrixelModal>
  );
};

AddContactBuyer.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleSpinnerSmallOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
  activeSingleCompany.defaultDialCode = countryPhoneCode.dial_code;
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSingleCompany,
    formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', { }),
    userLang: get(state, 'user.loggedInUser.language', 'en'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AddContactBuyer);
