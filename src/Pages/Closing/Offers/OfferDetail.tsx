import React, {useEffect} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {BrixelButtonIcon, Helpers} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {setSplashType} from '../../../actions/CommonActions';
import BrixelClosingTree from '../../../components/BrixelClosingTree';
import {getActiveSingleDeal} from '../../../actions/DealActions';
import type {OfferDetailType} from '../../../@types/Pages/Closing/Offers/OfferDetail';

const OfferDetail = (props: OfferDetailType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const {
    activeSingleDeal,
    activeSingleProperty,
    handleGetActiveSingleDeal,
    isBuyer = false,
    lang,
    windowDimensions,
  } = props;
  // PARAMS
  const dealID = get(match, 'dealID', '');
  const propID = get(match, 'propID', '');

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id !== dealID && !isBuyer) {
      const data = {
        id: dealID,
        smallLoader: 'getDeal',
      };
      handleGetActiveSingleDeal(data);
    }
  }, [dealID, activeSingleProperty]);

  return (
    <>
      <div className={`single-offer-container ${isBuyer && windowDimensions.width <= 1024 ? 'secondLevel p-2' : ''} dis-fl-col pb-4 pl-sm-1 pr-sm-2 dealsListings`}>
        <div className="hideStyle">
          {
            !isBuyer ? (
              <>
                <BrixelButtonIcon
                  className="hide dis-b-md mb-2"
                  icon="arrow-left-small"
                  theme="text"
                  bgTransparent
                  onClick={() => history.push(`/${propID}/closing`)}
                />
                <div className="offer-info dis-f a-c mb-1">
                  <h5>{get(activeSingleDeal, 'user.name', 'No Name')}</h5>
                  {
                    activeSingleDeal.id === 'sample' && (
                      <div className="ml-2 brdRadiusSmall brdSmall bgPrimary100 txtPrimary400 p-small-4 fsize-200 ex-tag">
                        {translateTo('Example only', lang)}
                      </div>
                    )
                  }
                </div>
                <div className="offer-info dis-fl-row a-c mb-2 mb-md-5">
                  {
                    get(activeSingleDeal, 'user.email', null) && (
                      <a className="mr-3 txtText900" href={`mailto:${get(activeSingleDeal, 'user.email', '')}`}>
                        {get(activeSingleDeal, 'user.email', '')}
                      </a>
                    )
                  }
                  {
                    get(activeSingleDeal, 'user.email', null) && (
                      <a className="mr-3 txtText900" href={`${Helpers.telephoneFormat(get(activeSingleDeal, 'user.phone', ''), false, false, true)}`}>
                        {Helpers.telephoneFormat(get(activeSingleDeal, 'user.phone', ''))}
                      </a>
                    )
                  }
                </div>
              </>
            ) : (
              <div>
                <h3 className="mb-3 hide dis-b-lg">{translateTo('Closing', lang)}</h3>
                <div className="dis-fl-col backPanel hide-lg">
                  <h5 className="sectionTitle">{translateTo('Closing', lang)}</h5>
                </div>
              </div>
            )
          }
          <BrixelClosingTree
            propID={propID}
            dealID={dealID}
            isBuyer={isBuyer}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  lang: get(state, 'common.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleDeal: bindActionCreators(getActiveSingleDeal, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(OfferDetail);
