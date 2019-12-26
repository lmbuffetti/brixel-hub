/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MarkerClusterer from 'node-js-marker-clusterer';
import { clusterStyles } from '../../constants/map';

const evtNames = [
  'click',
  'dblclick',
  'dragend',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'recenter',
];

const markerCluster = (props) => {
  const { map, google, markers } = props;

  const handleEvent = ({ event, marker, entry }) => {
    if (props[event]) {
      props[event]({
        props,
        marker,
        event,
        entry,
      });
    }
  };

  // This hook works like ComponentWillMount
  // The  hook isn't really needed, this whole thing worked without it,
  // I added the hook so that I could implement a cleanup function
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (map && markers) {
      const mapMarkers = markers.map((marker) => {
        if (marker.geometry.location) {
          const entry = new google.maps.Marker({
            position: {
              lat: marker.geometry.location.lat(),
              lng: marker.geometry.location.lng(),
            },
            icon: {
              url: marker.iconSettings.icon.newUrl,
              anchor: marker.iconSettings.icon.anchor,
              scaledSize: marker.iconSettings.icon.scaledSize,
            },
            map,
            name: marker.name,
            zIndex: 100000,
            optimized: true,
          });
          evtNames.forEach((e) => {
            entry.addListener(e, () => handleEvent({
              event: e,
              marker,
              entry,
            }));
          });
          return entry;
        }
        return null;
      });

      const clusterer = new MarkerClusterer(map, mapMarkers, { styles: clusterStyles });

      // Cleanup function. Note, this is only returned if we create the markers
      return () => {
        // console.log('Cleaning up markers')
        clusterer.clearMarkers();
      };
    }
  }, [map, google, markers]);


  // Do we need to render anything??
  return (
    <div />
  );
};

markerCluster.propTypes = {
  map: PropTypes.object,
  google: PropTypes.object,
  markers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

markerCluster.defaultProps = {
  map: null,
  google: null,
};

export default markerCluster;
