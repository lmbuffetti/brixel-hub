import {BrixelButtonPrimary, Helpers} from '@brixel/brixel-components';
import get from 'lodash/get';
import React from 'react';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {compose} from 'redux';
import testDrive from '../images/dashboard/testDrive.png';
import testdriveLarge from '../images/Market/testdrive.jpeg';
import translateTo from '../utils/translation';
import type {BoxTrialTestDirveType} from '../@types/components/BoxTrialTestDrive';

const BoxTrialTestDirve = (props: BoxTrialTestDirveType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleCompany,
    activeSingleProperty,
    className = '',
    isLarge = false,
    lang,
    windowDimensions,
  } = props;

  const bookNow = () => {
    if (activeSingleProperty.id) {
      localStorage.setItem('backUrl', history.location.pathname);
      history.push(`/${activeSingleProperty.id}/trialRequest`);
    }
  };

  return (
    <div
      onClick={() => bookNow()}
      className={`testDrive cur-poi dis-f-sm a-c brdRadius bgWhite ${isLarge ? 'w-perc-100 jc-c' : 'p-2'} ${className}`}
    >
      {
        isLarge ? (
          <div className="max-w-fix-144 min-h-fix-200 min-h-fix-sm-360 max-w-fix-sm-264 w-perc-100 ml-a mr-a mr-md-0 mb-2 mb-md-0">
            <img
              loading="lazy"
              src={testdriveLarge}
              alt=""
            />
          </div>
        ) : (
          <img
            loading="lazy"
            className={windowDimensions.width <= 590 ? 'dis-b mx-a' : ''}
            width={windowDimensions.width <= 590 ? 300 : 300}
            src={testDrive}
            alt=""
          />
        )
      }
      <div className={`${isLarge ? 'pl-0 pl-md-3 mr-a' : ''} ta-c ta-l-md`}>
        <h3 className={`${isLarge ? 'fsize-700 pb-2' : 'fsize-500 pb-1'} txtText900 fweight-600 `}>
          {translateTo('Test drive our service. No strings attached.', lang)}
        </h3>
        <p className={`txtText900 ${isLarge ? 'fSizePx18 fsize-sm-500 fweight-400 mb-3 px-2 px-sm-0' : ''}`}>
          <span>{translateTo('Get the full Brixel experience worth', lang)}</span>
          <span className="ml-small-4">
            <span className="mr-1">{activeSingleCompany && get(activeSingleCompany, 'meta.teaserPackage.currency', '')}</span>
            <span>{Helpers.formatNumberValue(+get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}</span>
          </span>
        </p>
        <div className="dis-f jc-c jc-fs-md">
          <BrixelButtonPrimary
            onClick={() => bookNow()}
            rounded
            theme="red"
            label={translateTo('Book Now', lang)}
            className={`${isLarge ? 'mt-1' : 'mt-3'}`}
          />
        </div>
      </div>

    </div>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BoxTrialTestDirve);
