export const sidebarNavigationSeller = [
  {
    title: 'Home',
    name: 'rewards',
    path: '/:propID/rewards',
  },
  {
    title: 'Property',
    name: 'property',
    path: '/:propID/property/facts/propertyType',
    submenu: [
      {
        title: 'Facts',
        name: 'facts',
        path: '/:propID/property/facts/propertyType',
      },
      {
        title: 'Photos',
        name: 'photos',
        path: '/:propID/property/photos',
      },
      {
        title: 'Plans',
        name: 'floorPlans',
        path: '/:propID/property/floorPlans',
      },
      {
        title: '3D tour',
        name: 'tour',
        path: '/:propID/property/tour',
      },
      {
        title: 'Docubox',
        name: 'documents',
        path: '/:propID/property/documents',
      },
    ],
  },
  {
    title: 'Listings',
    name: 'listings',
    path: '/:propID/listings',
    submenu: [
      {
        title: 'Page',
        name: 'page',
        path: '/:propID/listings/page',
      },
      {
        title: 'Portals',
        name: 'portals',
        path: '/:propID/listings/portals',
      },
    ],
  },
  {
    title: 'Deals',
    name: 'deals',
    path: '/:propID/deals',
  },
];

export const sidebarNavigationBuyer = [
  {
    title: 'Property',
    name: 'property',
    path: '/buyer/property/:propID',
    submenu: [
      {
        title: 'Page',
        name: 'page',
        path: '/buyer/property/:propID/page',
      },
      {
        title: 'Showings',
        name: 'showings',
        path: '/buyer/property/:propID/showings',
      },
      {
        title: 'Docubox',
        name: 'documents',
        path: '/buyer/property/:propID/documents',
      },
    ],
  },
];

export const firstRoutes = [
  {
    title: 'Home',
    name: 'rewards',
    icon: 'first-time-occupancy',
    path: '/:propID/rewards',
  },
  {
    title: 'Property',
    name: 'property',
    icon: 'property-house',
    path: '/:propID/property',
  },
  {
    title: 'Listings',
    name: 'listings',
    icon: 'upload',
    path: '/:propID/listings',
  },
  {
    title: 'Deals',
    name: 'deals',
    icon: 'upload',
    path: '/:propID/deals',
  },
];

export const secondRoutes = [
  {
    title: 'Property List',
    name: 'seller',
    icon: 'property-house',
    path: '/seller/pageLists',
  },
];

export const firstRoutesBuyer = [
  {
    title: 'Property',
    name: 'property',
    icon: 'property-house',
    path: '/buyer/property/:propID',
  },
];

export const secondRoutesBuyer = [
  {
    title: 'Property List',
    name: 'buyer',
    icon: 'property-house',
    path: '/seller/pageLists',
  },
];
