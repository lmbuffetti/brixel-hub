import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelCheckbox,
  change,
} from '@brixel/brixel-components';
import FinancingQuestionImg from '../../../images/Offer/financing_question.svg';
import RegisterKey4Img from '../../../images/Offer/register_key4.svg';
import UploadKey4Img from '../../../images/Offer/upload_key4.svg';

const FinanceCertificate = (props) => {
  const {
    changeFieldValue,
    onClick,
  } = props;
  // STATE
  const [checkedBox, setCheckedBox] = useState(false);

  const continueWithoutCert = () => {
    if (checkedBox) {
      changeFieldValue('financeCertificate', 1);
    }
  };

  return (
    <div>
      <h2 className="fweight-600 max-w-fix-464 ta-c m-a">
        Apply for a financing certificate
      </h2>
      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
        <div className=" p-5">
          <p>The financing certificate is a quick, non-binding assessment of your financial situation and proof that you can afford the property you want provided by our partner key4 by UBS.</p>

          <div className="dis-f jc-b a-t mt-3">
            <div className="max-w-fix-136 dis-f-col a-c jc-fs ta-c">
              <div className="m-a w-fix-80 h-fix-80 brdCircle bgAltMist200 dis-f a-c jc-c">
                <img src={FinancingQuestionImg} alt="Answer questions about financing" />
              </div>
              <p className="fsize-300 fweight-600 ta-c">Answer questions about financing</p>
            </div>
            <div className="max-w-fix-136 dis-f-col a-c jc-fs">
              <div className="m-a w-fix-80 h-fix-80 brdCircle bgAltMist200 dis-f a-c jc-c">
                <img src={RegisterKey4Img} alt="Register on key4" />
              </div>
              <p className="fsize-300 fweight-600 ta-c">Register on key4</p>
            </div>
            <div className="max-w-fix-136 dis-f-col a-c jc-fs">
              <div className="m-a w-fix-80 h-fix-80 brdCircle bgAltMist200 dis-f a-c jc-c">
                <img src={UploadKey4Img} alt="Upload documents on key4" />
              </div>
              <p className="fsize-300 fweight-600 ta-c">Upload documents on key4</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="fsize-300">
              Please be aware that key4 offers are only valid for persons with residency in Switzerland.
            </p>
            <p className="fsize-300 mt-1">
              The non-binding certificate is issued by our partner key4 by UBS, the real estate financing platform of UBS.
            </p>
          </div>

          <BrixelButtonPrimary
            onClick={() => onClick()}
            rounded
            className="mx-a mt-3"
            label="Apply now"
            rightIcon="arrow-right"
            theme="altGreen"
            themeSat={400}
          />
        </div>

        <hr className="bgLight200" />

        <div className="p-5">
          <h6>
            Continue without financing certificate.
          </h6>

          <BrixelCheckbox
            input={{
              onChange: (val) => setCheckedBox(val[0]),
            }}
            options={[{
              label: 'I hereby confirm that I will hand in my proof of financing later.',
              value: true,
            }]}
          />

          <BrixelButtonText
            label="Continue"
            rightIcon="arrow-right"
            onClick={() => continueWithoutCert()}
          />

        </div>

      </div>
    </div>
  );
};

FinanceCertificate.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('offerFlow', field, value));
  },
});

export default compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(FinanceCertificate);
