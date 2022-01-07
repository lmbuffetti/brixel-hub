import get from 'lodash/get';

export const feedMessage = (user, history, packages) => {
  let filtPackages = {};
  if (get(history, 'meta.servicePackage', null)) filtPackages = packages.find((item) => history.meta.servicePackage === item.id);
  return ({
    'page-create': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Property created',
      icon: 'tag'
    },
    'page-listed': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page published to the Portal',
      icon: 'tag'
    },
    'page-published': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page Published',
      icon: 'tag'
    },
    'page-scan-trial': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Test drive request (Trial)',
      icon: 'tag'
    },
    'page-start-service-package': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${get(filtPackages, 'name', '')}</span> <span>started</span>`,
      icon: 'tag'
    },
    'page-stop-service-package': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${get(filtPackages, 'name', '')}</span> <span>stopped</span>`,
      icon: 'tag'
    },
    'page-unlisted': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page unpublished to the Portal',
      icon: 'tag'
    },
    'page-unpublished': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page Unpublished',
      icon: 'tag'
    },
    'pro-estimation-complete': {
      className: 'brdAltMist100',
      colorBgIcon: 'AltMist',
      colorIconSat: 100,
      colorBgIconSat: 400,
      colorIcon: 'AltBlue',
      message: 'Pro Estimation completed',
      icon: 'chart'
    },
    'user-create-estimation': {
      className: 'brdAltMist100',
      colorBgIcon: 'AltMist',
      colorIconSat: 100,
      colorBgIconSat: 400,
      colorIcon: 'AltBlue',
      message: 'Bestimate®️ calculated',
      icon: 'chart'
    },
    'user-register': {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `${user.email} just signed up`,
      icon: 'userNew'
    },
    note: {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: history.content,
      icon: 'message'
    },
    default: {
      className: 'brdAltGreen100',
      colorIcon: 'altGreen',
      colorBgIcon: 'altGreen',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `${user.email} just signed up`,
      icon: 'userNew'
    }
  });
};
