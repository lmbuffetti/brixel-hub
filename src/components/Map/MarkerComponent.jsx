import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import MarkerWithLabel from '@googlemaps/markerwithlabel';
import markerImg from '../../images/location/icon_location.svg';
import markerSimilarProperties from '../../images/location/icon_similar_properties.svg';
import { cutValue } from '../../utils/helpers';
import MarketCard from '../MarketCard';

const MarkerComponent = (props) => {
  const {
    activeProperty,
    data,
    google,
    onClick,
    optMap,
  } = props;
  // STATE
  const [markerList, setMarkerList] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [infowindow, setInfowindow] = useState({});

  const MarkerInfoWindow = (page) => React.createElement(MarketCard, { item: page });

  useEffect(() => {
    if (optMap.zoom && data.length > 0) {
      const markers = [];
      data.forEach((item) => {
        let price = get(item, 'price.total', 0);
        if (price > 0) price = cutValue(get(item, 'price.total', 0));
        else price = 'On request';
        const marker = new MarkerWithLabel({
          page: item,
          id: item.id,
          map: optMap,
          icon: {
            url: '',
          },
          labelContent: `<p>${price.toString()}</p>`,
          // the CSS class for the label
          labelClass: activeProperty === item.id ? 'labelMarker active' : 'labelMarker',
          labelInBackground: true,
          labelAnchor: new google.maps.Point(-75, -45),
          position: {
            lat: get(item, 'location.latitude', 200),
            lng: get(item, 'location.longitude', 200),
          },
        });
        const window = infowindow;
        marker.addListener('click', () => {
          Object.keys(window).forEach((key) => {
            window[key].close();
          });
          window[item.id] = new google.maps.InfoWindow({
            content: MarkerInfoWindow(item),
            class: 'test',
            pixelOffset: new google.maps.Size(0, -45),
          });
          window[item.id].open(optMap, marker);
          setInfowindow(window);
        });
        markers.push(marker);
      });
      setMarkerList(markers);
    }
  }, [optMap, data, activeProperty]);

  return (
    <></>
  );
};

MarkerComponent.propTypes = {
  activeProperty: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  google: PropTypes.object.isRequired,
  optMap: PropTypes.object.isRequired,
  // item: PropTypes.object.isRequired,
  // icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

MarkerComponent.defaultProps = {
  activeProperty: null,
};

/* export const MarkerMapComponent = React.memo(MarkerComponent, (prevProps, nextProps) =>
  // const prevLat = get(prevProps, 'properties', null);
  // const nextLat = get(nextProps, 'properties', null);
  // const propDiff = diff(prevLat, nextLat);
  (
    prevProps.icon === nextProps.icon
  )); */

export default MarkerComponent;
