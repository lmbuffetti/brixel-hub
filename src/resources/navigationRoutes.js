export const sidebarNavigationSeller = [
  {
    title: 'Home',
    name: 'rewards',
    path: '/:propID/rewards',
  },
  {
    title: 'Property',
    name: 'property',
    path: '/:propID/property',
    submenu: [
      {
        title: 'Price',
        name: 'price',
        path: '/:propID/property/price',
      },
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
    path: '/buyer/:propID/property',
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
    title: 'Closing',
    name: 'closing',
    path: '/buyer/:propID/closing/:dealID',
  },
];
