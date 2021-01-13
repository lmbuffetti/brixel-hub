import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'google-maps-react';
import get from 'lodash/get';
import { diff } from 'deep-object-diff';
import markerImg from '../../images/location/icon_location.svg';
import markerSimilarProperties from '../../images/location/icon_similar_properties.svg';

const MarkerComponent = (props) => {
  const {
    item,
    icon,
    onClick,
  } = props;
  console.log(icon);
  return (
    <Marker
      position={{
        lat: get(item, 'location.latitude', 200),
        lng: get(item, 'location.longitude', 200),
      }}
      icon={icon === 'active' ? markerImg : markerSimilarProperties}
      onClick={() => onClick('click', item.id)}
      onMouseover={() => onClick('enter', item.id)}
      onMouseout={() => onClick('leave', item.id)}
    />
  );
};

MarkerComponent.propTypes = {
  item: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const MarkerMapComponent = React.memo(MarkerComponent, (prevProps, nextProps) =>
  // const prevLat = get(prevProps, 'properties', null);
  // const nextLat = get(nextProps, 'properties', null);
  // const propDiff = diff(prevLat, nextLat);
  (
    prevProps.icon === nextProps.icon
  ));

export default MarkerComponent;
