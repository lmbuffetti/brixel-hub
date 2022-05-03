export const sidebarNavigationSeller = [
  {
    title: 'Home',
    name: 'home',
    icon: 'four-circles',
    path: '/:propID/home',
  },
  {
    title: 'Property',
    name: 'property',
    icon: 'property-new',
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
        path: '/:propID/property/facts',
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
    icon: 'docs',
    path: '/:propID/docubox',
  },
  {
    title: 'Marketing',
    name: 'marketing',
    icon: 'mike',
    path: '/:propID/marketing',
  },
  {
    title: 'Prospects',
    name: 'prospects',
    icon: 'search-user',
    path: '/:propID/prospects',
  },
  {
    title: 'Closing',
    name: 'closing',
    icon: 'flag-wave',
    path: '/:propID/closing',
  },
];

export const sidebarNavigationBuyer = [
  {
    title: 'Property',
    name: 'property',
    icon: 'property-new',
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
    ],
  },
  {
    title: 'Docubox',
    name: 'docubox',
    icon: 'docs',
    path: '/buyer/:propID/docubox',
  },
  {
    title: 'Visit',
    name: 'visit',
    icon: 'docs',
    path: '/buyer/:propID/scheduleVisit',
  },
  
  {
    title: 'Financing',
    name: 'financing',
    icon: 'financing',
    path: '/buyer/:propID/financing',
  },
  {
    title: 'Closing',
    name: 'closing',
    icon: 'flag-wave',
    path: '/buyer/:propID/closing/:dealID',
  },
];
