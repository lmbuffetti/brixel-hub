export const feedMessage = (user) => ({
  'page-create': {
    className: 'brdAltColor300',
    colorIcon: 'altColor',
    colorIconSat: 300,
    colorBgIconSat: 200,
    message: 'Property created',
    icon: 'tag',
  },
  'pro-estimation-complete': {
    className: 'brdAltColor1000',
    colorIcon: 'AltColor',
    colorIconSat: 1000,
    colorBgIconSat: 700,
    message: 'Pro Estimation completed',
    icon: 'chart',
  },
  'user-create-estimation': {
    className: 'brdAltColor1000',
    colorIcon: 'AltColor',
    colorIconSat: 1000,
    colorBgIconSat: 700,
    message: 'Bestimate®️ calculated',
    icon: 'chart',
  },
  'user-register': {
    className: 'brdAltColor300',
    colorIcon: 'alltColor',
    colorIconSat: 300,
    colorBgIconSat: 200,
    message: `${user.email} just signed up`,
    icon: 'userNew',
  },
});
