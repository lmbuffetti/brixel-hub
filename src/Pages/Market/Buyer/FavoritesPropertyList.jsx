import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MarketCardFavorites from '../../../components/Cards/MarketCardFavorites';

const FavoritesPropertyList = (props) => {
  const {
    lang,
    wishlistProperties,
  } = props;
  // STATE
  return (
    <>
      {
        get(wishlistProperties, 'data', []).map((item, index) => (
          <MarketCardFavorites
            key={`cardFavorites-${index.toString()}`}
            activeSingleProperty={item}
            lang={lang}
          />
        ))
      }
    </>
  )
}

FavoritesPropertyList.propTypes = {
  lang: PropTypes.string.isRequired,
  wishlistProperties: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesPropertyList);
