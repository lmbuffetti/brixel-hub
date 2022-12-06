import { BrixelButtonPrimary, translateTo } from '@brixel/brixel-components';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import MarketCardEstimation from '../../../components/Cards/MarketCardEstimation';
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
  } = props;
  // STATE
  return (
    <>
      <Routes>
        <Route path="/:propID" element={<ModalPropertyEstimation />} />
      </Routes>
      <div className="container">
        <div className="dis-f a-c jc-b my-3">
          <h1>
            <span>{translateTo('Your Estimations', lang)}</span>
            <span className="ml-1">({ownerEstimations.total || '-'})</span>
          </h1>
          
          <BrixelButtonPrimary
            rounded
            leftIcon="plus"
            label="New estimations"
            onClick={() => history.push(`/packageFlow/getStartedEstimation/${activeSingleCompany.stub}/estimationType`)}
          />
          
        </div>
        {
          get(ownerEstimations, 'data', []).map((item, index) => (
            <MarketCardEstimation
              key={`cardFavorites-${index.toString()}`}
              activeSingleProperty={item}
              lang={lang}
            />
          ))
        }
      </div>
    </>
  )
}

FavoritesPropertyList.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  ownerEstimations: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  lang: get(state, 'common.language', 'en'),
  ownerEstimations: get(state, 'market.ownerEstimations', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesPropertyList);
