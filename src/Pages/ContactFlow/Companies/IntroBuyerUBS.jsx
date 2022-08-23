import { change} from '@brixel/brixel-components/dist/form';
import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { BrixelButtonSecondary, BrixelButtonText } from '@brixel/brixel-components';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { compose } from 'redux';

// LOGOS
import key4Logo from '../../../images/Companies/ubsKey4/key4Logo.svg';
import ubsLogo from '../../../images/Companies/ubsKey4/ubsLogo.svg';


const IntroBuyerUBS = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    changeFieldValue,
    onClick,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'propID', null);
  
  const onClickForwardContactFlow = (type) => {
    changeFieldValue('type', type);
    onClick()
  }

  return (
    <main className="introScanFlow pt-2 pt-md-4 pb-2 pb-md-4 h-perc-100 txtDark700">
      <div className="mb-5 mb-md-10">
        <h2 className={`fsize-600 fsize-md-700 fweight-600 max-w-fix-600 ta-c m-a  mb-1`}>
          Your financing with UBS.
        </h2>
        <h2 className={`fsize-600 fsize-md-700 fweight-400 max-w-fix-600 ta-c m-a mb-3 mb-md-6}`}>
          How would you like to be advised?
        </h2>

      </div>
      <div className="dis-fl-col dis-fl-row-md">
        <div className="dis-fl-col w-perc-100 w-perc-md-50 mr-0 mr-md-2 shadow-2dp bgWhite brdRadius p-3 p-md-6 mb-3 mb-md-0">
          <div className="dis-f mb-3">
            <div className="w-perc-70 w-perc-md-55">
              <h5 className="fweight-600 fSizePx18">Personal consultation on site or via video call.</h5>
            </div>
            <div className="w-perc-30 w-perc-md-45 ta-r">
              <img className="h-fix-24 mt-small-4" alt='UBS Logo' src={ubsLogo} />
            </div>
          </div>
          <div className="bulletPointsStep mb-4">
            <ul>
              <li className="mb-2 txtDark400 fsize-300"> Financing offer individually tailored to your needs and goals</li>
              <li className="mb-2 txtDark400 fsize-300">Free consultation at a branch office or via video call (including advice on tax implications of buying real estate)</li>
              <li className=" txtDark400 fsize-300">Attractive and flexible solutions, for example for construction financing or renovation projects</li>
            </ul>
          </div>
          <div className="mt-a">
            <BrixelButtonSecondary
              onClick={() => onClickForwardContactFlow('ubs')}
              className="mt-a"
              label="Arrange personal consultation"
              rounded
            />
          </div>
        </div>
        <div className="w-perc-100 w-perc-md-50 ml-0 ml-md-2 shadow-2dp bgWhite brdRadius p-3 p-md-5">
          <div className="dis-f mb-3">
            <div className="w-perc-70 w-perc-md-55">
              <h5 className="fweight-600 fSizePx18">Compare offers and apply for a mortgage online.</h5>
            </div>
            <div className="w-perc-30 w-perc-md-45 ta-r">
              <img className="h-fix-24 mt-small-4" alt='Key4 Logo' src={key4Logo} />
            </div>
          </div>
          <div className="bulletPointsStep">
            <ul>
              <li className="mb-2 txtDark400 fsize-300"> Attractive independent mortgage offers from several providers that you can compare and combine</li>
              <li className="mb-2 txtDark400 fsize-300">Personal consultation by phone or video call</li>
              <li className=" txtDark400 fsize-300">Financing certificate sent to you online within 24 hours</li>
            </ul>
          </div>
          <div className="dis-fl-col dis-fl-row-md mt-3 mt-md-6 a-c a-md-b">
            <div className="w-perc-md-28 px-3 pt-2 pt-md-5 pb-0 ta-c">
              <BrixelButtonText
                onClick={() => onClickForwardContactFlow('key4')}
                label="Arrange a callback"
              />
            </div>
            <div className="w-perc-md-44 px-3 pt-2 pt-md-5 pb-0 ta-c brdSmallRight-md brdSmallLeft-md brdLight300">
              <BrixelButtonText
                onClick={() => history.push(`/buyer/${propID}/financingFlow`)}
                label="Request a financing certificate"
              />
            </div>
            <div className="w-perc-md-28 px-3 pt-2 pt-md-5 pb-0 ta-c">
              <BrixelButtonText
                onClick={() => history.push(`/buyer/${propID}/financingFlow?subtype=standard`)}
                label="Request financing"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

IntroBuyerUBS.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

IntroBuyerUBS.defaultProps = {
  scrollHash: null,
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('contactFlow', field, value));
  },
});

export default compose(
  connect(null, mapDispatchToProps),
)(IntroBuyerUBS);
