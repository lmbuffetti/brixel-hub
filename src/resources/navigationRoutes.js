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
    name: 'delas',
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
