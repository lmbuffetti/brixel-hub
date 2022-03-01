import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
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
    activeSingleProperty,
    changeFieldValue,
    onClick,
  } = props;
  // STATE
  const [checkedBox, setCheckedBox] = useState(false);

  const continueWithoutCert = () => {
    if (checkedBox) {
      changeFieldValue('financeCertificate', 1);
      changeFieldValue('noDocument', 1);
    } else {
      changeFieldValue('noDocument', 0);
    }
  };

  return (
    <div>
      <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
        Apply for a financing certificate
      </h2>
      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100">

        {
          get(activeSingleProperty, 'location.countryCode', '') === 'CH' ? (
            <div className="p-5">
              <div className="dis-fl-col dis-fl-row-sm jc-b a-t">
                <div className="dis-f-col w-perc-100 flex-1 a-c jc-fs ta-c">
                  <div className="m-a w-fix-80 h-fix-80 brdCircle bgBlue200 dis-f a-c jc-c mb-1">
                    <img src={FinancingQuestionImg} alt="Answer questions about financing" />
                  </div>
                  <p className="txtDark700 fsize-300 fweight-600 ta-c">Answer questions about financing</p>
                </div>
                <div className="dis-f-col w-perc-100 flex-1 a-c jc-fs my-2 my-sm-0">
                  <div className="m-a w-fix-80 h-fix-80 brdCircle bgBlue200 dis-f a-c jc-c mb-1">
                    <img src={RegisterKey4Img} alt="Register on key4" />
                  </div>
                  <p className="txtDark700 fsize-300 fweight-600 ta-c">Register on key4</p>
                </div>
                <div className="dis-f-col w-perc-100 flex-1 a-c jc-fs">
                  <div className="m-a w-fix-80 h-fix-80 brdCircle bgBlue200 dis-f a-c jc-c mb-1">
                    <img src={UploadKey4Img} alt="Upload documents on key4" />
                  </div>
                  <p className="txtDark700 fsize-300 fweight-600 ta-c">Upload documents on key4</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="fsize-300 txtDark700 pb-2">
                  The financing certificate is a quick, non-binding assessment of your financial situation and proof that you can afford the property you want provided by our partner key4 by UBS.
                </p>
                <p className="fsize-300 txtDark700">
                  The non-binding certificate is issued by our partner key4 by UBS, the real estate financing platform of UBS.
                </p>
              </div>

              <BrixelButtonPrimary
                onClick={() => onClick()}
                rounded
                className="mx-a mt-4"
                label="Apply now"
                rightIcon="arrow-right"

              />

              <div className="mt-4 mx-a ta-c w-fix-md-504">
                <p className="fsize-300 txtAltGrey500 fs-i">
                  Please be aware that key4 offers are only valid for persons with residency in Switzerland.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <p className="txtDark700">
                No problem.<br />
                We suggest checking your financing as soon as possible.
              </p>
              <p className="txtDark700 pt-2">
                A pre-approved mortgage gets you ahead of unqualified buyers. That&apos;s how you can get one:
              </p>

              <div className="dis-fl-col dis-fl-row-sm jc-b a-t mt-3">
                <div className="w-perc-100 flex-1 dis-f-col a-c jc-fs ta-c">
                  <div className="m-a w-fix-80 h-fix-80 brdCircle bgBlue200 dis-f a-c jc-c mb-1">
                    <img src={FinancingQuestionImg} alt="Answer questions about financing" />
                  </div>
                  <p className="txtDark700 fsize-300 fweight-600 ta-c">
                    Prepare your documents
                  </p>
                </div>
                <div className="w-perc-100 flex-1 dis-f-col a-c jc-fs my-2 my-sm-0">
                  <div className="m-a w-fix-80 h-fix-80 brdCircle bgBlue200 dis-f a-c jc-c mb-1">
                    <img src={RegisterKey4Img} alt="Register on key4" />
                  </div>
                  <p className="txtDark700 fsize-300 fweight-600 ta-c">
                    Contact a financial provider
                  </p>
                </div>
                <div className="w-perc-100 flex-1 dis-f-col a-c jc-fs">
                  <div className="m-a w-fix-80 h-fix-80 brdCircle bgBlue200 dis-f a-c jc-c mb-1">
                    <img src={UploadKey4Img} alt="Upload documents on key4" />
                  </div>
                  <p className="txtDark700 fsize-300 fweight-600 ta-c">
                    Attach the approval to your offer
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <p className="fsize-300 txtDark700">
                  Be aware Brixel is not in charge of the mortgage process.
                </p>
              </div>
            </div>
          )
        }

        <hr className="brdAltGrey100" />

        <div className="p-5">
          <span className="dis-b pb-2 fsize-500 txtDark700">
            Continue without financing certificate.
          </span>

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
            disabled={!checkedBox}
            className="mt-3 ml-a mr-a"
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
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('offerFlow', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(FinanceCertificate);
