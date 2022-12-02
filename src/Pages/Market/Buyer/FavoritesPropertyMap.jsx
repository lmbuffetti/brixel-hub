import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { BrixelMap } from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const FavoritesPropertyMap = (props) => {
  const {
    lang,
    wishlistProperties,
  } = props;
  // STATE
  return (
    <>
      <BrixelMap
        baseByData={baseByData}
        className="w-perc-100 h-perc-100 min-h-fix-400"
        center={{
          lat: get(wishlistProperties[0], 'location.latitude', 0),
          lng: get(wishlistProperties[0], 'location.longitude', 0),
        }}
        type="roadmap"
        markers={wishlistProperties}
        gestureHandling="cooperative"
        lang={lang}
      />
    </>
  )
}

FavoritesPropertyMap.propTypes = {
  lang: PropTypes.string.isRequired,
  wishlistProperties: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  wishlistProperties: get(state, 'market.wishlistProperties.data', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesPropertyMap);
