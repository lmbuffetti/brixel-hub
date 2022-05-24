import { has, tail } from 'lodash';
import get from 'lodash/get';
import { DateTime } from 'luxon';

const offerText = (offerMeta, userLang) => {
  let answerText = '';
  if (get(offerMeta, 'offer.buyer') && Object.keys(offerMeta.offer.buyer).length > 0) {
    answerText += `<span>Buyer details: </br></span>
      <span class="dis-b"><span>Date of birth<span class="lh-in">:</span> </span><span class="fweight-500">
      ${(typeof get(offerMeta, 'offer.buyer.dateBirth', '') === 'string' && get(offerMeta, 'offer.buyer.dateBirth', '').includes('-')) ? get(offerMeta, 'offer.buyer.dateBirth', '') : DateTime.fromMillis(
    get(offerMeta, 'offer.buyer.dateBirth', ''),
    {
      locale: userLang,
    },
  ).toFormat('yyyy-MM-dd')}
    </span></span>      </br><span>Marital status: </span><span>${get(offerMeta, 'offer.buyer.maritialStatus', '')} </span>
      </br><span>Place of origin: </span><span>${get(offerMeta, 'offer.buyer.placeOfOrigin', '')} </span>
      </br><span>Type of purchase: </span><span>${get(offerMeta, 'offer.buyer.typeOfPurchase', '')} </span>`;
  }
  if (get(offerMeta, 'offer.location') && Object.keys(offerMeta.offer.location).length > 0) {
    answerText += `</br></br><span>Buyer location: </br></span>
      <span>${get(offerMeta, 'offer.location.street', '')} </span>
      <span>${get(offerMeta, 'offer.location.streetNumber', '')} </span>
      <span>, ${get(offerMeta, 'offer.location.zipCode', '')} </span>
      <span>${get(offerMeta, 'offer.location.City', '')} </span>`;
  }
  
  if (get(offerMeta, 'offer.financeCertificate') === 0 || get(offerMeta, 'offer.financeCertificate') === 1) {
    answerText += `</br></br><span>Financial certificate: </span><span>${offerMeta.offer.financeCertificate === 1 ? 'Yes' : 'No'} </span>`;
  }
  return answerText || 'Created offer';
}

export const feedMessage = (user, history, packages) => {
  let filtPackages = {};
  if (get(history, 'meta.servicePackage', null)) filtPackages = packages.find((item) => history.meta.servicePackage === item.id);
  let dates = '';
  if (get(history, 'meta.schedule', null)) {
    const scheduleArray = tail(get(history, 'meta.schedule', '').split('•'));
    scheduleArray.forEach((date, key) => {
      dates += `<span>•${date}</span>${key !== (history.meta.schedule.split('•').length - 1) ? '</br>' : ''}`;
    });
    if (has(history, 'meta.message')) {
      dates += `</br><span>Message: </span><span>${history.meta.message}</span>`;
    }
  }
  return ({
    'page-create': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Property created',
      icon: 'tag',
    },
    'page-listed': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page published to the Portal',
      icon: 'tag',
    },
    'page-published': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page Published',
      icon: 'tag',
    },
    'page-scan-trial': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Test drive request (Trial)',
      icon: 'tag',
    },
    'page-start-service-package': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${get(filtPackages, 'name', '')}</span> <span>started</span>`,
      icon: 'tag',
    },
    'page-stop-service-package': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${get(filtPackages, 'name', '')}</span> <span>stopped</span>`,
      icon: 'tag',
    },
    'page-unlisted': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page unpublished to the Portal',
      icon: 'tag',
    },
    'page-unpublished': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Page Unpublished',
      icon: 'tag',
    },
    'pro-estimation-complete': {
      className: 'brdBlue100',
      colorBgIcon: 'Blue',
      colorIconSat: 100,
      colorBgIconSat: 400,
      colorIcon: 'AltBlue',
      message: 'Pro Estimation completed',
      icon: 'chart',
    },
    'user-create-estimation': {
      className: 'brdBlue100',
      colorBgIcon: 'Blue',
      colorIconSat: 100,
      colorBgIconSat: 700,
      colorIcon: 'Blue',
      message: 'Bestimate®️ calculated',
      icon: 'chart',
    },
    'user-register': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `${user.email} just signed up`,
      icon: 'user-new',
    },
    'page-status-success': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Congratulations, your property has been sold.',
      icon: 'tag',
    },
    'deal-make-offer': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: offerText(history.meta || {}, user.language),
      icon: 'money',
    },
    'deal-review-offer': {
      className: 'brdGreen100',
      colorIcon: get(history, 'meta.offer.status', '') === 'rejected' ? 'Red' : 'Green',
      colorBgIcon: get(history, 'meta.offer.status', '') === 'rejected' ? 'Red' : 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `Your offer was ${get(history, 'meta.offer.status', '')}`,
      icon: 'money',
    },
    'deal-feedback-visit-email': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Visit feedback email sent',
      icon: 'mail-open',
    },
    'deal-confirm-visit-email': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'Confirm visit email sent',
      icon: 'mail-open',
    },
    'user-send-message': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: 'User sent a message',
      icon: 'mail-open',
    },
    'update-deal': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `Visit confirmed: ${get(history, 'meta.state', null) ? DateTime.fromMillis(get(history, 'meta.state', 0)).toFormat('dd LLL yyyy, hh:mm', user.language) : 0}`,
      icon: 'calendar',
    },
    'user-schedule': {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>Requested showing</span></br></br><span>${dates}</span>`,
      icon: 'calendar',
    },
    note: {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: history.content,
      icon: 'message',
    },
    default: {
      className: 'brdGreen100',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: history.content || history.actionStub,
      icon: 'tag',
    },
  });
};
