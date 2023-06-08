import {Helpers} from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import get from 'lodash/get';
import {DateTime} from 'luxon';

const offerText = (offerMeta, currency = '', activeSingleProperty, lang) => {
  let answerText = '';
  const defaultCurrency = get(activeSingleProperty, 'price.currency', currency);
  answerText += `<span>${translateTo('You made an offer of', lang)}</span> <span class="fweight-500 ml-small-4">${get(offerMeta, 'offer.currency', defaultCurrency)} ${Helpers.formatNumberValue(get(offerMeta, 'offer.amount', 0), get(offerMeta, 'offer.currency', defaultCurrency))}</br></span>`;
  return answerText || translateTo('Created offer', lang);
}

export const feedMessage = (user, history, packages, activeSingleProperty, lang) => {
  let filtPackages = {};
  if (get(history, 'meta.servicePackage', null)) filtPackages = packages.find((item) => history.meta.servicePackage === item.id);
  let dates = '';
  if (get(history, 'meta.schedule', null)) {
    const scheduleArray = get(history, 'meta.schedule', '');
    scheduleArray.forEach((date) => {
      const dateFormatted = DateTime.fromMillis(date.start).toFormat('dd MMM yyyy', {locale: lang});
      const startHourFormatted = DateTime.fromMillis(date.start).toFormat('HH:mm', {locale: lang});
      const endDateFormatted = DateTime.fromMillis(date.end).toFormat('HH:mm', {locale: lang});
      if (date.isAllDay) {
        dates += `
            <span class="tidy-dates">
                <span>• ${dateFormatted},<span><span class="ml-small-4">${translateTo('All day', lang)}</span>
            </span>`;
      } else {
        dates += `
            <span class="tidy-dates">
                • ${dateFormatted}, ${startHourFormatted} - ${endDateFormatted}
            </span>`;
      }
    });
    if (get(history, 'meta.message', null)) {
      dates += `<span>${translateTo('Message:', lang)}</span><span class="ml-small-4">${history.meta.message.replace(/&lt;br&gt;/g,' ')}</span>`;
    }
  }
  const defaultCurrency = get(activeSingleProperty, 'price.currency', '');
  return ({
    'page-create': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Property created', lang),
      icon: 'tag',
    },
    'page-listed': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Page published to the Portal', lang),
      icon: 'tag',
    },
    'page-published': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Page Published', lang),
      icon: 'tag',
    },
    'page-scan-trial': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Test drive request (Trial)', lang),
      icon: 'tag',
    },
    'page-start-service-package': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${get(filtPackages, 'name', '')}</span> <span>${translateTo('started', lang)}</span>`,
      icon: 'tag',
    },
    'page-stop-service-package': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${get(filtPackages, 'name', '')}</span> <span>${translateTo('stopped', lang)}</span>`,
      icon: 'tag',
    },
    'page-unlisted': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Page unpublished to the Portal', lang),
      icon: 'tag',
    },
    'page-unpublished': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Page Unpublished', lang),
      icon: 'tag',
    },
    'pro-estimation-complete': {
      className: 'brdBlue200',
      colorBgIcon: 'Blue',
      colorIconSat: 100,
      colorBgIconSat: 400,
      colorIcon: 'Blue',
      message: translateTo('Pro Estimation completed', lang),
      icon: 'chart',
    },
    'user-create-estimation': {
      className: 'brdBlue200',
      colorBgIcon: 'Blue',
      colorIconSat: 100,
      colorBgIconSat: 700,
      colorIcon: 'Blue',
      message: translateTo('Bestimate®️ calculated', lang),
      icon: 'chart',
    },
    'user-register': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `${user.email} signed up`,
      icon: 'user-new',
    },
    'page-status-success': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Congratulations, your property has been sold.', lang),
      icon: 'tag',
    },
    'deal-make-offer': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: offerText(history.meta || {}, user.language, activeSingleProperty, lang),
      icon: 'money',
    },
    'deal-review-offer': {
      className: get(history, 'meta.offer.status', '') === 'rejected' ? 'brdRed200' : 'brdGreen200',
      colorIcon: get(history, 'meta.offer.status', '') === 'rejected' ? 'Red' : 'Green',
      colorBgIcon: get(history, 'meta.offer.status', '') === 'rejected' ? 'Red' : 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${translateTo('Your offer of', lang)}</span><span class="ml-small-4">${get(history, 'meta.offer.currency', defaultCurrency)} ${Helpers.formatNumberValue(get(history, 'meta.offer.amount'), get(history, 'meta.offer.currency', defaultCurrency))}</span><span class="ml-small-4">${translateTo('was', lang)}</span><span class="ml-small-4">${translateTo(get(history, 'meta.offer.status', ''), lang)}</span>`,
      icon: get(history, 'meta.offer.status', '') === 'rejected' ? 'close-thin' : 'tick',
    },
    'deal-feedback-visit-email': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('visit feedback email sent', lang),
      icon: 'mail-open',
    },
    'deal-confirm-visit-email': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('Confirm visit email sent', lang),
      icon: 'mail-open',
    },
    'user-send-message': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: translateTo('You sent a message', lang),
      icon: 'mail-open',
    },
    'schedule-visit-confirm': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span><span>${translateTo('Your visit is confirmed', lang)}</span><span class="ml-small-4"></br><span>${DateTime.fromMillis(get(history, 'meta.visit.date', 0), { zone: get(history, 'meta.visit.timezone') }).toFormat('dd LLL yyyy, HH:mm', user.language)}</span>`,
      icon: 'calendar',
    },
    'schedule-visit-request': {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: `<span>${translateTo('You requested a visit', lang)}</span></br><span>${dates}</span>`,
      icon: 'calendar',
    },
    note: {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: history.content,
      icon: 'message',
    },
    default: {
      className: 'brdGreen200',
      colorIcon: 'Green',
      colorBgIcon: 'Green',
      colorIconSat: 100,
      colorBgIconSat: 400,
      message: history.content || history.actionStub,
      icon: 'tag',
    },
  });
};
