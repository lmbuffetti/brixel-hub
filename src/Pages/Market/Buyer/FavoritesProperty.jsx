import { translateTo } from '@brixel/brixel-components';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import FavoritesPropertyList from './FavoritesPropertyList';
import FavoritesPropertyMap from './FavoritesPropertyMap';

const FavoritesProperty = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    lang,
    wishlistProperties,
  } = props;
  // STATE
  const [view, setView] = useState('list');
  
  useEffect(() => {
    if (get(history, 'location.pathname', '').includes('map')) setView('map');
    else setView('list');
  }, [get(history, 'location.pathname', null)]);
  
  const onClickMapNav = () => {
    if (view === 'map') history.push(`/buy/favorites/list`)
    else history.push(`/buy/favorites/map`);
  }
  
  return (
    <div className="container dis-fl-col h-perc-100">
      <div className="dis-f a-c jc-b my-3">
        <h1>
          <span>{translateTo('Saved properties', lang)}</span>
          <span className="ml-1">({wishlistProperties.total || '-'})</span>
        </h1>
        
        <div>
          <BrixelButtonSecondary
            rounded
            label={view === 'map' ? 'List view' : 'Map view'}
            leftIcon={view === 'map' ? 'lists' : 'roadmap'}
            theme="dark"
            themeSat={700}
            onClick={() => onClickMapNav()}
          />
        </div>
      </div>
      
      <Routes>
        <Route path="/list" element={<FavoritesPropertyList />} />
        <Route path="/map" element={<FavoritesPropertyMap />} />
        <Route path="*" element={<Navigate to="/buy/favorites/list" />} />
      </Routes>
      
    </div>
  )
}

FavoritesProperty.propTypes = {
  lang: PropTypes.string.isRequired,
  wishlistProperties: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesProperty);
