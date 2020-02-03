export const factsOptions = [
  {
    label: 'Playground',
    value: 'playground',
    id: 'cl_playground',
  },
  {
    label: 'Swimming Pool',
    value: 'swimmingPool',
    id: 'cl_swimmingPool',
  },
  {
    label: 'Sauna',
    value: 'sauna',
    id: 'cl_sauna',
  },
  {
    label: 'Tennis Court',
    value: 'Tennis Court',
    id: 'cl_tennis',
  },
  {
    label: 'Garden',
    value: 'garden',
    id: 'cl_garden',
  },
  {
    label: 'Exceptional large land surface',
    value: 'Exceptional large land',
    id: 'cl_landSurface',
  },
  {
    label: 'High quality materials',
    value: 'High quality materials',
    id: 'cl_highQuality',
  },
  {
    label: 'Fireplace',
    value: 'fireplace',
    id: 'cl_fireplace',
  },
  {
    label: 'Landscape',
    value: 'landscape',
    id: 'cl_landscape',
  },
  {
    label: 'Water Access',
    value: 'waterAccess',
    id: 'cl_waterAccess',
  },
  {
    label: 'Minergie certified',
    value: 'minergieCertified',
    id: 'cl_minergie',
  },
  {
    label: 'First-time occupancy',
    value: 'firstTimeOccupancy',
    id: 'cl_firstTime',
  },
  {
    label: 'Child friendly',
    value: 'childFriendly',
    id: 'cl_childFriendly',
  },
  {
    label: 'Cellar',
    value: 'cellar',
    id: 'cl_cellar',
  },
  {
    label: 'Storage room',
    value: 'storageRoom',
    id: 'cl_storageRoom',
  },
  {
    label: 'Wheelchair Accessible',
    value: 'wheelchair',
    id: 'cl_wheelchair',
  },
  {
    label: 'Old building',
    value: 'oldBuilding',
    id: 'cl_oldBuilding',
  },
  {
    label: 'Lift',
    value: 'elevator',
    id: 'cl_elevator',
  },
  {
    label: 'Balcony/Patio',
    value: 'balcony',
    id: 'cl_balcony',
  },
  {
    label: 'Own Washing Machine',
    value: 'washingMachine',
    id: 'cl_washingMachine',
  },
  {
    label: 'Steam oven',
    value: 'steamOven',
    id: 'cl_steamOven',
  },
  {
    label: 'Exceptional room sizes',
    value: 'Exceptional room size',
    id: 'cl_roomSize',
  },
  {
    label: 'Loggia',
    value: 'loggia',
    id: 'cl_loggia',
  },
];

export const labelByValue = (value) => {
  const findEl = factsOptions.find((val) => val.value === value);
  return findEl.label;
};
