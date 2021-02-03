import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import markerImg from '../../images/location/icon_location.svg';
import markerSimilarProperties from '../../images/location/icon_similar_properties.svg';

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

  const toggleBounce = (e) => {
    onClick(e);
  };

  useEffect(() => {
    if (optMap.zoom && data.length > 0) {
      const markers = [];
      data.forEach((item) => {
        const marker = new google.maps.Marker({
          id: item.id,
          icon: markerSimilarProperties,
          title: item.id,
          position: {
            lat: get(item, 'location.latitude', 200),
            lng: get(item, 'location.longitude', 200),
          },
        });
        marker.setAnimation(google.maps.Animation.DROP);
        marker.addListener('click', () => toggleBounce(item.id));
        markers.push(marker);
      });
      setMarkerList(markers);
    }
  }, [optMap, data]);

  useEffect(() => {
    if (props.optMap.zoom && data.length > 0 && markerList.length > 0) {
      const curMarkerList = markerList;
      const loadedMarkers = cloneDeep(markerList);

      curMarkerList.forEach((marker, i) => {
        loadedMarkers[i].icon = activeProperty === marker.id ? markerImg : markerSimilarProperties;

        if (loadedMarkers[i].icon !== curMarkerList[i].icon || firstLoad) {
          curMarkerList[i].icon = activeProperty === marker.id ? markerImg : markerSimilarProperties;
          curMarkerList[i].setAnimation(google.maps.Animation.DROP);
          curMarkerList[i].setMap(null);
          curMarkerList[i].setMap(optMap);
        }
      });

      if (curMarkerList.length > 0) setFirstLoad(false);
      setMarkerList(curMarkerList);
    }
  }, [optMap, activeProperty, markerList.length]);

  return (
    <></>
  );
};

MarkerComponent.propTypes = {
  activeProperty: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  google: PropTypes.object.isRequired,
  optMap: PropTypes.object.isRequired,
  // item: PropTypes.object.isRequired,
  // icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

/* export const MarkerMapComponent = React.memo(MarkerComponent, (prevProps, nextProps) =>
  // const prevLat = get(prevProps, 'properties', null);
  // const nextLat = get(nextProps, 'properties', null);
  // const propDiff = diff(prevLat, nextLat);
  (
    prevProps.icon === nextProps.icon
  )); */

export default MarkerComponent;
