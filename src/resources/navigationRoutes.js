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
    ],
  },
  {
    title: 'Docubox',
    name: 'docubox',
    path: '/:propID/docubox',
  },
  {
    title: 'Marketing',
    name: 'marketing',
    path: '/:propID/marketing',
    submenu: [
      {
        title: 'Page',
        name: 'page',
        path: '/:propID/marketing/page',
      },
      {
        title: 'Portals',
        name: 'portals',
        path: '/:propID/marketing/portals',
      },
    ],
  },
  {
    title: 'Prospects',
    name: 'prospects',
    path: '/:propID/prospects',
  },
  {
    title: 'Closing',
    name: 'closing',
    path: '/:propID/closing',
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
        name: 'docubox',
        path: '/buyer/:propID/property/docubox',
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
    name: 'marketing',
    icon: 'upload',
    path: '/:propID/marketing',
  },
  {
    title: 'Deals',
    name: 'deals',
    icon: 'money',
    path: '/:propID/closing',
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
