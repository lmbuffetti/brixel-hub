import { BrixelButtonPrimary, translateTo } from '@brixel/brixel-components';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import MarketCardEstimation from '../../../components/Cards/MarketCardEstimation';
import emptyEst from '../../../images/empty-est.svg';
import ModalPropertyEstimation from './ModalPropertyEstimation';

const FavoritesPropertyList = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleCompany,
    lang,
    ownerEstimations,
    skeleton,
  } = props;
  // STATE
  return (
    <>
      <Routes>
        <Route path="/:propID" element={<ModalPropertyEstimation />} />
      </Routes>
      <div className="container">
        {
          ownerEstimations.total === 0 ? (
            <div className='dis-fl-col a-c py-8'>
              <img width="200" src={emptyEst} alt="" />
              <div className=" ta-c mt-3">
                <h3 className="fweight-600 mb-2">You haven’t created any Estimation</h3>
                <p className="txtAltGrey400 max-w-fix-320 ml-a mr-a">Short description about how estimation works (wait for confirmation etc.) </p>
        
                <BrixelButtonPrimary
                  rounded
                  label="Create Estimation"
                  leftIcon="plus"
                  className="ml-a mr-a mt-3"
                  onClick={() => {
                    localStorage.setItem('backUrlBuyerEstimations', `/buy/estimations`);
                    history.push(`/packageFlow/getStartedEstimation/${activeSingleCompany.stub}/estimationType`);
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="dis-f a-c jc-b my-3">
                <h4 className="fweight-600">
                  <span>{translateTo('Your Estimations', lang)}</span>
                  <span className="ml-1">({ownerEstimations.total || '-'})</span>
                </h4>
      
                <BrixelButtonPrimary
                  rounded
                  leftIcon="plus"
                  label="New estimation"
                  onClick={() => {
                    localStorage.setItem('backUrlBuyerEstimations', `/buy/estimations`);
                    history.push(`/packageFlow/getStartedEstimation/${activeSingleCompany.stub}/estimationType`);
                  }}
                />
    
              </div>
            </div>
          )
        }

        {
          skeleton.estimation ? (
            <>
              {
                [...Array(3)].map((x, i) => (
                  <div
                    key={`skeleton${i.toString()}`}
                    className="w-perc-100 pb-2"
                  >
                    <div className="dis-f a-t brdRadius ov-h">
                      <div className="h-fix-208 w-fix-flex-320 pos-r skeletonBgInner w-perc-100" />
                      <div className="w-perc-100 pl-2">
                        <div className="h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" />
                        <div className="h-fix-40 mt-2 skeletonBgInner w-perc-100" />
                        <div className="h-fix-16 mt-1 skeletonBgInner w-perc-100" />
                        <div className="h-fix-40 mt-2 skeletonBgInner w-perc-100" />
                      </div>
                    </div>
                  </div>
                ))
              }
            </>
          ): (
            <>
              {
                get(ownerEstimations, 'data', []).map((item, index) => (
                  <MarketCardEstimation
                    key={`cardFavorites-${index.toString()}`}
                    activeSingleProperty={item}
                    lang={lang}
                  />
                ))
              }
            </>
          )
        }
      </div>
    </>
  )
}

FavoritesPropertyList.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  ownerEstimations: PropTypes.object.isRequired,
  skeleton: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  lang: get(state, 'common.language', 'en'),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
  skeleton: get(state, 'common.skeleton', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesPropertyList);
