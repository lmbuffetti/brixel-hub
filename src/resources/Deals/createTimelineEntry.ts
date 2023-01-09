import translateTo from '../../utils/translation';
import getConfigEnv from '@brixel/brixel-components/dist/configuration/Settings';

import {DateTime} from 'luxon';
import has from 'lodash/has';
import get from 'lodash/get';
import tail from 'lodash/tail';
import isNaN from 'lodash/isNaN';

import {formatPrice} from '../../utils/helpers';

export const createTimelineEntry = (item, userLang) => {
  const getHTMLDescription = () => {
    // ITEM IS HISTORY ENTRY
    if (has(item, 'actionStub')) {
      // PROPERTY HISTORY ENTRY
      if (item.actionStub === 'page-create') return `<span>${translateTo('Created this page:', userLang)}</span> <a class='property txtDark700' href='#'>${item.parent.title}</a>`;
      if (item.actionStub === 'page-published') return `<span>${translateTo('Page published:', userLang)}</span> <a class='txtDark700' rel='noreferrer noopener' target='_blank' href='${getConfigEnv.pageUrl}${item.parent.stub}'>${getConfigEnv.pageUrl}${item.parent.stub}</a>`;
      if (item.actionStub === 'page-unpublished') return translateTo('Page unpublished', userLang);
      if (item.actionStub === 'page-message') return translateTo('Message sent', userLang);
      // if (item.actionStub === 'page-schedule') return `<span>${item.child.email} </span><span>scheduled a visit</span>`;
      // if (item.actionStub === 'page-get-document') return 'Requested documents';
      if (item.actionStub === 'page-upgrade') return translateTo('Upgraded package', userLang);
      if (item.actionStub === 'page-listed') return translateTo('Listed on portals', userLang);
      if (item.actionStub === 'page-unlisted') return translateTo('Removed from portals', userLang);
      if (item.actionStub === 'page-update-price') return `<span>Price update: </span><span>${get(item, 'parent.price.currency', '')}</span> <span>${formatPrice(item.meta.before, 'ch')}</span> <span>${translateTo('to', userLang)}</span> <span>${get(item, 'parent.price.currency', '')}</span> <span>${formatPrice(item.meta.after, 'ch')}</span>`;
      if (item.actionStub === 'page-upgrade-plan-request') return `<span>${item.meta.package.name} </span><span>ordered</span>`;
      if (item.actionStub === 'page-publish-review') return translateTo('Request: Publish page', userLang);
      if (item.actionStub === 'page-unpublish-review') return translateTo('Request: Unpublish page', userLang);
      if (item.actionStub === 'page-portals-review') return translateTo('Request: Publish portals', userLang);
      if (item.actionStub === 'page-portals-unpublish-review') return translateTo('Request: Unpublish portals', userLang);
      if (item.actionStub === 'page-scan-trial') {
        if (item.meta.interested === false) {
          if (has(item.meta, 'meta.answers') && item.meta.meta.answers.length === 0) {
            return `<span>${translateTo('Not interested in on-site appointment', userLang)}</span>`;
          }
          if (has(item.meta, 'meta.answers') && item.meta.meta.answers.length > 0) {
            let answerText = '';
            item.meta.meta.answers.forEach((answer, key) => {
              answerText += `<span>${translateTo(`${answer}${key !== (item.meta.meta.answers.length - 1) ? ', ' : ''}`, userLang)}</span>`;
            });
            return `<span>${translateTo('Not interested in on-site appointment', userLang)}</span><span>:</span> ${answerText}`;
          } return `<span>${translateTo('Not interested in on-site appointment', userLang)}</span>`;
        }
        if (item.meta.interested === true) {
          if (has(item.meta, 'meta.answers') && item.meta.meta.answers.length > 0) {
            let answerText = '';
            item.meta.meta.answers.forEach((answer, key) => {
              answerText += `<span>${translateTo(`${answer}${key !== (item.meta.meta.answers.length - 1) ? ', ' : ''}`, userLang)}</span>`;
            });
            return `<span>${translateTo('Request: On-site appointment', userLang)}</span><span> - </span>${translateTo(answerText, userLang)}`;
          } return `<span>${translateTo('Request: On-site appointment', userLang)}</span>`;
        }
      }
      if (item.actionStub === 'user-recover-password') return translateTo('Password recovery sent', userLang);
      if (item.actionStub === 'user-register') return translateTo('Welcome e-mail sent', userLang);
      if (item.actionStub === 'user-add-favorite') return translateTo('Marked page as favorite', userLang);
      if (item.actionStub === 'user-schedule') {
        let dates = '';
        const scheduleArray = tail(get(item, 'meta.schedule', '').split('•'));
        scheduleArray.forEach((date, key) => {
          dates += `<span>•${date}</span>${key !== (item.meta.schedule.split('•').length - 1) ? '</br>' : ''}`;
        });
        if (has(item, 'meta.message')) {
          dates += `</br><span>${translateTo('Message:', userLang)}</span><span class="ml-small-4">${item.meta.message}</span>`;
        }
        return `<span>${translateTo('Requested showing', userLang)}</span></br></br><span>${dates}</span>`;
      }
      if (item.actionStub === 'user-get-document') return translateTo('Requested documents', userLang);
      if (item.actionStub === 'user-phone-call') return translateTo('Made a phone call', userLang);
      if (item.actionStub === 'user-send-message') return translateTo(`"${item.meta.message}"`, userLang);
      if (item.actionStub === 'user-portal-create-message') return `<span>${translateTo('Sent new message on', userLang)}</span><span class="ml-small-4">${item.meta.portal}</span></br></br><span>${translateTo(item.meta.message, userLang)}</span>`;
      if (item.actionStub === 'deal-confirm-visit-email') return translateTo('Visit confirmation email sent', userLang);
      if (item.actionStub === 'deal-feedback-visit-email') return `<span>${translateTo(`${item.meta.action.charAt(0).toUpperCase() + item.meta.action.slice(1)}`, userLang)}</span> <span>${translateTo('visit feedback email sent', userLang)}</span>`;

      if (item.actionStub === 'deal-make-offer') return `<span>${translateTo('Prospect made an offer:', userLang)}</span><span class="ml-small-4">${get(item, 'meta.offer.currency', '')}</span> <span>${formatPrice(item.meta.offer.amount, userLang)}</span></br></br><span>${item.meta.offer.noteByBuyer}</span>`;
      if (item.actionStub === 'deal-review-offer') return `<span>${translateTo('Offer', userLang)}</span> <span>${get(item, 'meta.offer.status', '')}</span>: </span><span>${get(item, 'meta.offer.currency', '')}</span> <span>${formatPrice(item.meta.offer.amount, userLang)}</span>`;

      // DEAL HISTORY ENTRY
      if (item.actionStub === 'update-deal') {
        if (has(item, 'meta.stageBefore')) {
          return `<span>${translateTo('Prospect updated:', userLang)}</span><span class="ml-small-4">${translateTo('from', userLang)}</span> <span>${translateTo(item.meta.stageBefore, userLang)}</span> <span>${translateTo('to', userLang)}</span> <span>${translateTo(item.meta.stageAfter, userLang)}</span>`;
        }
        if (has(item, 'meta.state')) {
          if (item.meta.name === 'active') {
            if (item.meta.state === true) {
              return `<span>${translateTo('Prospect unarchived', userLang)}</span>`;
            }
            if (item.meta.state === false) {
              return `<span>${translateTo('Prospect archived', userLang)}</span>`;
            }
          }
          if (item.meta.name === 'winner') {
            if (item.meta.state === true) {
              return `<span>${translateTo('Prospect marked as winner', userLang)}</span>`;
            }
            if (item.meta.state === false) {
              return `<span>${translateTo('Prospect removed as winner', userLang)}</span>`;
            }
          }
          if (item.meta.name === 'new') {
            if (item.meta.state === true) {
              return `<span>${translateTo('Prospect marked as new', userLang)}</span>`;
            }
            if (item.meta.state === false) {
              return `<span>${translateTo('Prospect marked as seen', userLang)}</span>`;
            }
          }
          if (item.meta.name === 'visit') {
            if (item.meta.state === null) return `<span>${translateTo('Visit deleted', userLang)}</span>`;
            if (!isNaN(item.meta.state)) {
              return `<span>${translateTo('Visit scheduled:', userLang)}</span><span class="ml-small-4">${DateTime.fromMillis(item.meta.state, {
                locale: userLang,
              }).toFormat('d LLL yyyy, H:mm')}</span>`;
            }
          }
        }
      }
    }
    return '';
  };

  const getIcon = () => {
    // ITEM IS FAVORITE
    if (has(item, 'favorite')) return 'favorite-fill';
    // ITEM IS HISTORY ENTRY
    if (has(item, 'actionStub')) {
      if (item.actionStub === 'user-portal-create-message') return 'message';
      if (item.actionStub.includes('create') ||
          item.actionStub.includes('published') ||
          item.actionStub.includes('unpublished') ||
          item.actionStub.includes('listed') ||
          item.actionStub.includes('unlisted') ||
          item.actionStub.includes('update')) {
        return 'info';
      }
      if (item.actionStub === 'page-schedule') return 'calendar';
      if (item.actionStub === 'page-upgrade-plan-request') return 'shopping-cart';
      if (item.actionStub === 'user-register' || item.actionStub === 'user-recover-password') return 'mail';
      if (item.actionStub === 'user-schedule') return 'calendar';
      if (item.actionStub === 'user-send-message') return 'message';
      if (item.actionStub === 'deal-feedback-visit') return 'message';
      if (item.actionStub === 'user-add-favorite') return 'favorite-fill';
      if (item.actionStub === 'deal-review-offer') return 'info';
      if (item.actionStub.includes('document')) return 'document';
      if (item.actionStub.includes('review') ||
          item.actionStub.includes('request')) return 'question';
      if (item.actionStub === 'page-scan-trial') {
        if (item.meta.interested === false) {
          return 'info';
        }
        if (item.meta.interested === true) {
          return 'question';
        }
      }
      if (item.actionStub === 'deal-make-offer') return 'money';
    }
    return 'info';
  };

  // Return User Signup entry
  if (has(item, 'actionStub') && item.actionStub === 'user-register') {
    return [
      {
        description: `<div><div><a class='txtDark700' rel='noreferrer noopener' target='_blank' href='/${item.parent.id}/user'>${item.parent.email}</a> <span> ${translateTo('signed up', userLang)}</span></div><div><span class="fweight-500">${translateTo('Signup Channel:', userLang)}</span><span class="ml-small-4">${item.parent.signupChannel}</span></div></div>`,
        icon: 'account',
        formattedDate: !isNaN(+item.parent.createdAt) ? DateTime.fromMillis(item.parent.createdAt, { locale: userLang }).toFormat('d LLL yyyy, H:mm') : '',
        timestamp: item.parent.createdAt,
        pinned: false,
      },
      {
        description: getHTMLDescription(),
        icon: getIcon(),
        formattedDate: !isNaN(+item.createdAt) ? DateTime.fromMillis(item.createdAt, { locale: userLang }).toFormat('d LLL yyyy, H:mm') : '',
        timestamp: item.createdAt,
        pinned: false,
      },
    ];
  }

  // Return Update Deal entry
  if (has(item, 'actionStub') && item.actionStub === 'deal-confirm-visit-email') {
    return {
      description: getHTMLDescription(), // Content of the event
      icon: 'mail', // Defines the type of icon on the event
      formattedDate: !isNaN(+item.createdAt) ? DateTime.fromMillis(item.createdAt, {
        locale: userLang,
      }).toFormat('d LLL yyyy, H:mm') : '', // Formatted date to be shown on the event
      timestamp: item.createdAt, // Unix timestamp for sorting purposes
      pinned: false, // Flag for sorting purposes
      style: 'default',
    };
  }

  // Return Update Deal entry
  if (has(item, 'actionStub') && item.actionStub.includes('deal')) {
    return {
      description: getHTMLDescription(), // Content of the event
      icon: getIcon(), // Defines the type of icon on the event
      user: get(item, 'child.name', 'No Name'),
      formattedDate: !isNaN(+item.createdAt) ? DateTime.fromMillis(item.createdAt, { locale: userLang }).toFormat('d LLL yyyy, H:mm') : '', // Formatted date to be shown on the event
      timestamp: item.createdAt, // Unix timestamp for sorting purposes
      pinned: false, // Flag for sorting purposes
    };
  }

  if (has(item, 'createdAt')) {
    return {
      description: getHTMLDescription(),
      icon: getIcon(),
      formattedDate: DateTime.fromMillis(get(item, 'createdAt'), {
        locale: userLang,
      }).toFormat('d LLL yyyy, H:mm'),
      timestamp: get(item, 'createdAt'),
      pinned: false,
    };
  }

  return {
    description: getHTMLDescription(), // Content of the event
    icon: getIcon(), // Defines the type of icon on the event
    formattedDate: item.createdAt ? DateTime.fromMillis(item.createdAt, { locale: userLang }).toFormat('d LLL yyyy, H:mm') : '', // Formatted date to be shown on the event
    timestamp: item.createdAt, // Unix timestamp for sorting purposes
    pinned: false, // Flag for sorting purposes
  };
};
