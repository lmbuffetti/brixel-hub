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
    submenu: [
      {
        title: 'Buyers',
        name: 'lists',
        path: '/:propID/deals/lists',
      },
      {
        title: 'Offers',
        name: 'offers',
        path: '/:propID/deals/offers',
      },
    ],
  },
];

export const sidebarNavigationBuyer = [
  {
    title: 'Property',
    name: 'property',
    path: '/buyer/:propID/property/page',
    submenu: [
      {
        title: 'Contact',
        name: 'contact',
        path: '/buyer/:propID/property/contact',
      },
      {
        title: 'Page',
        name: 'page',
        path: '/buyer/:propID/property/page',
      },
      {
        title: 'Showings',
        name: 'showings',
        path: '/buyer/:propID/property/showings',
      },
      {
        title: 'Docubox',
        name: 'documents',
        path: '/buyer/:propID/property/documents',
      },
    ],
  },
  {
    title: 'Deal',
    name: 'deal',
    path: '/buyer/:propID/deal/:dealID',
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
    icon: 'money',
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
    path: '/buyer/:propID/property',
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
