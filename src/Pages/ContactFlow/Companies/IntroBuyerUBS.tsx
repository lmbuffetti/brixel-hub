import React from 'react';
import {change} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import {BrixelButtonSecondary, BrixelButtonText} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {compose} from 'redux';

// LOGOS
import ubsLogo from '../../../images/Companies/ubsKey4/ubsLogo.svg';
import type {IntroBuyerUBSType} from '../../../@types/Pages/ContactFlow/Companies/IntroBuyerUBS';

const IntroBuyerUBS = (props: IntroBuyerUBSType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    changeFieldValue,
    onClick,
    lang,
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
        <h2 className={'fsize-600 fsize-md-700 fweight-600 max-w-fix-600 ta-c m-a  mb-1'}>
          {translateTo('Your financing with UBS.', lang)}
        </h2>
        <h2 className={'fsize-600 fsize-md-700 fweight-400 max-w-fix-600 ta-c m-a mb-3 mb-md-6}'}>
          {translateTo('How would you like to be advised?', lang)}
        </h2>

      </div>
      <div className="dis-fl-col">
        <div className="dis-fl-col w-perc-100 w-perc-lg-50 shadow-2dp bgWhite brdRadius p-3 p-md-6 mb-3 mb-md-0 ml-a mr-a">
          <div className="dis-f mb-3">
            <div className="w-perc-70 w-perc-md-55">
              <h5 className="fweight-600 fSizePx18"> {translateTo('Personal consultation on site or via video call.', lang)}</h5>
            </div>
            <div className="w-perc-30 w-perc-md-45 ta-r">
              <img loading="lazy" className="h-fix-24 mt-small-4 ml-a" alt='UBS Logo' src={ubsLogo} />
            </div>
          </div>
          <div className="bulletPointsStep mb-4">
            <ul>
              <li className="mb-2 txtDark400 fsize-300">{translateTo('Financing offer individually tailored to your needs and goals', lang)}</li>
              <li className="mb-2 txtDark400 fsize-300">{translateTo('Free consultation at a branch office or via video call (including advice on tax implications of buying real estate)', lang)}</li>
              <li className=" txtDark400 fsize-300">{translateTo('Attractive and flexible solutions, for example for construction financing or renovation projects', lang)}</li>
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
        <div className="dis-fl-col w-perc-100 w-perc-lg-50 shadow-2dp bgGreen100 brdRadius p-3 px-md-6 py-4 mt-2 ml-a mr-a">
          <span className="ta-c mb-2"> {translateTo('Or would you rather check interest rates digitally in the self-service first?', lang)} </span>
          <BrixelButtonText
            rounded
            bgTransparent
            className="ml-a mr-a"
            onClick={() => history.push(`/buyer/${propID}/financingFlow?subtype=standard`)}
            label={translateTo('Request indicative interest', lang)}
          />
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('contactFlow', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(IntroBuyerUBS);
