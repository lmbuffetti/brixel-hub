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
        title: 'Description',
        name: 'description',
        path: '/:propID/property/description',
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
    title: 'Home',
    name: 'home',
    icon: 'four-circles',
    path: '/buyer/:propID/home',
  },
  {
    title: 'Property',
    name: 'property',
    icon: 'property-new',
    path: '/buyer/:propID/property/page',
    submenu: [
      /* {
        title: 'Contact',
        name: 'contact',
        path: '/buyer/:propID/property/contact',
      }, */
      {
        title: 'Page',
        name: 'page',
        path: '/buyer/:propID/property/page',
      },
    ],
  },
  {
    title: 'Financing',
    name: 'financing',
    icon: 'calculator',
    path: '/buyer/:propID/financing',
  },
  {
    title: 'Visit',
    name: 'scheduleVisit',
    icon: 'calendar',
    path: '/buyer/:propID/scheduleVisit',
  },
  {
    title: 'Docubox',
    name: 'docubox',
    icon: 'docs',
    path: '/buyer/:propID/docubox',
  },
  {
    title: 'Closing',
    name: 'closing',
    icon: 'flag-wave',
    path: '/buyer/:propID/closing/:dealID',
  },
];
