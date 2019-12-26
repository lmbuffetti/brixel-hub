import clusterImg from '../images/location/cluster_icon.png';

export const mapCaptionData = {
  medicalCenter: {
    category: 'medicalCenter',
    keywordsInclude: ['hospital'],
    keywordsExclude: ['gym', 'spa', 'hair_care', 'store', 'finance', 'clothing_store'],
    active: true,
    label: 'Medical Center',
    iconSettings: {
      icon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/hospital.png',
      },
      activeIcon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/hospital_active.png',
      },
      markerType: 'medicalCenter',
    },
  },
  school: {
    category: 'school',
    keywordsInclude: ['school'],
    keywordsExclude: ['store', 'local_government_office', 'real_estate_agency', 'travel_agency', 'bar', 'airport', 'gym'],
    active: true,
    label: 'School',
    iconSettings: {
      icon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/school.png',
      },
      activeIcon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/school_active.png',
      },
      markerType: 'school',
    },
  },
  publicTransport: {
    category: 'publicTransport',
    keywordsInclude: ['subway_station', 'bus_station', 'train_station'],
    keywordsExclude: [],
    active: true,
    label: 'Public Transport',
    iconSettings: {
      icon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/public_transport.png',
      },
      activeIcon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/public_transport_active.png',
      },
      markerType: 'publicTransport',
    },
  },
  grocery: {
    category: 'grocery',
    keywordsInclude: ['grocery_or_supermarket'],
    keywordsExclude: ['florist', 'restaurant', 'cafe', 'liquor_store', 'convenience_store'],
    active: false,
    label: 'Grocery',
    iconSettings: {
      icon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/grocery.png',
      },
      activeIcon: {
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          width: 30,
          height: 30,
        },
        url: 'location/grocery_active.png',
      },
      markerType: 'grocery',
    },
  },
};

export const mapStyles = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'landscape.natural.landcover',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#bad294',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#bad294',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#efebe2',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#fef8a0',
      },
      {
        saturation: -35,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e8e693',
      },
      {
        saturation: -20,
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e3e1e4',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit.line',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.bus',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.bus',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.rail',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a5d7e0',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export const markerOptions = {
  active: {
    url: 'mapIcon',
    scaledSize: {
      width: 86,
      height: 86,
    },
    anchor: {
      x: 43,
      y: 46,
    },
  },
};

export const clusterStyles = [
  {
    url: clusterImg,
    height: 36,
    width: 36,
    textColor: '#ffffff',
    textSize: 10,
  },
  {
    url: clusterImg,
    height: 36,
    width: 36,
    textColor: '#ffffff',
    textSize: 10,
  }, {
    url: clusterImg,
    height: 36,
    width: 36,
    textColor: '#ffffff',
    textSize: 10,
  },
];

const rad = (x) => (x * Math.PI) / 180;

export const getDistance = (p1, p2) => {
  const R = 6378137; // Earth’s mean radius in meter
  const dLat = rad(p2.lat - p1.lat);
  const dLong = rad(p2.lng - p1.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d); // returns the distance in meter
};
