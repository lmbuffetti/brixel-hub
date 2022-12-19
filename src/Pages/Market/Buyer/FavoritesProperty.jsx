import { translateTo } from '@brixel/brixel-components';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import BrixelButtonPrimary from '@brixel/brixel-components/dist/components/BrixelButtonPrimary';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import FavoritesPropertyList from './FavoritesPropertyList';
import FavoritesPropertyMap from './FavoritesPropertyMap';
import emptyFav from '../../../images/empty-fav.svg';

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
    <div className={`container dis-fl-col h-perc-100 ${view === 'map' ? '' : 'pb-10'}`}>
      {
        wishlistProperties.total ? (
          <div className="dis-f a-c jc-b my-3">
            <h4 className="fweight-600">
              <span>{translateTo('Saved properties', lang)}</span>
              <span className="ml-1">({wishlistProperties.total || '-'})</span>
            </h4>

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
        ) : (
          <div className='dis-fl-col a-c py-8'>
            <img width="440" src={emptyFav} alt="" />
            <div className="max-w-fix-320 ta-c mt-3">
              <h3 className="fweight-600 mb-2">No Properties yet here</h3>
              <p className="txtAltGrey400">Add properties by clicking the heart icon of a property card from the listing.</p>

              <BrixelButtonPrimary
                rounded
                label="Go to listing"
                rightIcon="arrow-right-small"
                className="ml-a mr-a mt-3"
                onClick={() => history.push(`/buy/searchProfile/all/1`)}
              />
            </div>
          </div>
        )
      }

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
