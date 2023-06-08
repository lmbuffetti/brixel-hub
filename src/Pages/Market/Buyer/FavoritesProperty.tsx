import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import get from 'lodash/get';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {compose} from 'redux';
import emptyFav from '../../../images/empty-fav.svg';
import translateTo from '../../../utils/translation';
import FavoritesPropertyList from './FavoritesPropertyList';
import FavoritesPropertyMap from './FavoritesPropertyMap';
import type {FavoritesPropertyType} from '../../../@types/Pages/Market/Buyer/FavoritesProperty';

const FavoritesProperty = (props: FavoritesPropertyType) => {
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
    if (view === 'map') history.push('/buy/favorites/list')
    else history.push('/buy/favorites/map');
  }

  return (
    <div className={`container dis-fl-col h-perc-100 ${view === 'map' ? '' : 'pb-10'}`}>
      {
        wishlistProperties.total === 0 ? (
          <div className='dis-fl-col a-c py-8'>
            <img width="440" src={emptyFav} alt="" />
            <div className="max-w-fix-320 ta-c mt-3">
              <h3 className="fweight-600 mb-2">{translateTo('No Properties yet here', lang)}</h3>
              <p className="txtText400">{translateTo('Add properties by clicking the heart icon of a property card from the listing.', lang)}</p>
              <p className="txtText400"></p>

              <BrixelButtonPrimary
                rounded
                label={translateTo('Go to listing', lang)}
                rightIcon="arrow-right-small"
                className="ml-a mr-a mt-3"
                onClick={() => history.push('/buy/searchProfile/all/1')}
              />
            </div>
          </div>
        ) : (
          <div className="dis-fl-row-sm dis-fl-col a-c jc-b my-2 my-sm-3">
            <h4 className="fweight-600 fsize-400 fsize-sm-600 mb-1 mb-sm-0">
              <span>{translateTo('Saved properties', lang)}</span>
              <span className="ml-1">({wishlistProperties.total || '-'})</span>
            </h4>

            <div>
              <BrixelButtonSecondary
                rounded
                label={view === 'map' ? translateTo('List view', lang) : translateTo('Map view', lang)}
                leftIcon={view === 'map' ? 'lists' : 'roadmap'}
                theme="text"
                themeSat={900}
                onClick={() => onClickMapNav()}
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

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesProperty);
