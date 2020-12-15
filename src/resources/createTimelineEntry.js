import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';

import moment from 'moment';
import {
  has, get, tail,
} from 'lodash';

import {
  formatPrice,
} from '../utils/helpers';

export const createTimelineEntry = (item) => {
  const getHTMLDescription = () => {
    // ITEM IS REWARD
    if (has(item, 'title')) {
      if (item.title === 'Market Checker') return 'Market check completed';
      if (item.title === 'Bestimate®️') return '<a class="txtDark700" href=rewardDetail?bestimate>Estimation completed</a>';
      if (item.title === 'Assessor') return '<a class="txtDark700" href=rewardDetail?condition>Condition check</a> <span>completed</span>';
      if (item.title === 'Checklist for documentation') return '<span>Filled out</span> <a class="txtDark700" href=rewardDetail?facts>25% facts</a>';
      if (item.title === 'Brixel Page Preview') return 'Previewed Page';
      if (item.title === 'Multimedia manager') return 'Uploaded media';
      if (item.title === 'Listings') return 'Listed on the market';
    }
    // ITEM IS HISTORY ENTRY
    if (has(item, 'actionStub')) {
      // PROPERTY HISTORY ENTRY
      if (item.actionStub === 'page-create') return `<span>Created this page:</span> <a class='property txtDark700' href='#'>${item.parent.title}</a>`;
      if (item.actionStub === 'page-published') return `<span>Page published:</span> <a class='txtDark700' rel='noreferrer noopener' target='_blank' href='${getConfigEnv.pageUrl}${item.parent.stub}'>${getConfigEnv.pageUrl}${item.parent.stub}</a>`;
      if (item.actionStub === 'page-unpublished') return 'Page unpublished';
      if (item.actionStub === 'page-message') return 'Message sent';
      if (item.actionStub === 'page-schedule') return `<span>${item.child.email} </span><span>scheduled a visit</span>`;
      if (item.actionStub === 'page-get-document') return 'Requested documents';
      if (item.actionStub === 'page-upgrade') return 'Upgraded package';
      if (item.actionStub === 'page-add-favorite') return `<span>${item.child.email} </span><span>added the property as favorite</span>`;
      if (item.actionStub === 'page-listed') return 'Listed on portals';
      if (item.actionStub === 'page-unlisted') return 'Removed from portals';
      if (item.actionStub === 'page-update-price') return `<span>Price update: </span><span>${get(item, 'parent.price.currency', '')}</span> <span>${formatPrice(item.meta.before, 'ch')}</span> <span>to</span> <span>${get(item, 'parent.price.currency', '')}</span> <span>${formatPrice(item.meta.after, 'ch')}</span>`;
      if (item.actionStub === 'page-upgrade-plan-request') return `<span>${item.meta.package.name} </span><span>ordered</span>`;
      if (item.actionStub === 'page-publish-review') return 'Request: Publish page';
      if (item.actionStub === 'page-unpublish-review') return 'Request: Unpublish page';
      if (item.actionStub === 'page-portals-review') return 'Request: Publish portals';
      if (item.actionStub === 'page-portals-unpublish-review') return 'Request: Unpublish portals';
      if (item.actionStub === 'page-scan-trial') {
        if (item.meta.interested === false) {
          if (has(item.meta, 'meta.answers') && item.meta.meta.answers.length === 0) {
            return '<span>Not interested in on-site appointment</span>';
          }
          if (has(item.meta, 'meta.answers') && item.meta.meta.answers.length > 0) {
            let answerText = '';
            item.meta.meta.answers.forEach((answer, key) => {
              answerText += `<span>${answer}${key !== (item.meta.meta.answers.length - 1) ? ', ' : ''} </span>`;
            });
            return `<span>Not interested in on-site appointment</span><span>:</span> ${answerText}`;
          } return '<span>Not interested in on-site appointment</span>';
        }
        if (item.meta.interested === true) {
          if (has(item.meta, 'meta.answers') && item.meta.meta.answers.length > 0) {
            let answerText = '';
            item.meta.meta.answers.forEach((answer, key) => {
              answerText += `<span>${answer}${key !== (item.meta.meta.answers.length - 1) ? ', ' : ''} </span>`;
            });
            return `<span>Request: On-site appointment</span><span> - </span>${answerText}`;
          } return '<span>Request: On-site appointment</span>';
        }
      }
      if (item.actionStub === 'user-recover-password') return 'Password recovery sent';
      if (item.actionStub === 'user-register') return 'Welcome e-mail sent';
      if (item.actionStub === 'user-add-favorite') return 'Marked page as favorite';
      if (item.actionStub === 'user-schedule') {
        let dates = '';
        const scheduleArray = tail(item.meta.schedule.split('•'));
        scheduleArray.forEach((date, key) => {
          dates += `<span>•${date}</span>${key !== (item.meta.schedule.split('•').length - 1) ? '</br>' : ''}`;
        });
        return `<span>Requested showing</span></br></br><span>${dates}</span>`;
      }
      if (item.actionStub === 'user-get-document') return 'Requested documents';
      if (item.actionStub === 'user-phone-call') return 'Made a phone call';
      if (item.actionStub === 'user-send-message') return `"${item.meta.message}"`;
      if (item.actionStub === 'user-portal-create-message') return `<span>Sent new message on </span><span>${item.meta.portal}</span></br></br><span>${item.meta.message}</span>`;

      // DEAL HISTORY ENTRY
      if (item.actionStub === 'update-deal') {
        if (has(item, 'meta.stageBefore')) {
          return `<span>Deal updated: </span><span>from</span> <span>${item.meta.stageBefore}</span> <span>to</span> <span>${item.meta.stageAfter}</span>`;
        }
        if (has(item, 'meta.state')) {
          if (item.meta.name === 'active') {
            if (item.meta.state === true) {
              return '<span>Deal unarchived</span>';
            }
            if (item.meta.state === false) {
              return '<span>Deal archived</span>';
            }
          }
          if (item.meta.name === 'winner') {
            if (item.meta.state === true) {
              return '<span>Deal marked as winner</span>';
            }
            if (item.meta.state === false) {
              return '<span>Deal removed as winner</span>';
            }
          }
        }
      }
    }
    return '';
  };

  const getIcon = () => {
    // ITEM IS REWARD
    if (has(item, 'title')) return 'check';
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
      if (item.actionStub === 'user-add-favorite') return 'favorite-fill';
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
    }
    return 'info';
  };

  // Return User Signup entry
  if (has(item, 'actionStub') && item.actionStub === 'user-register') {
    return [
      {
        description: `<div><div><a class='txtDark700' rel='noreferrer noopener' target='_blank' href='/${item.parent.id}/user'>${item.parent.email}</a> <span>just signed up</span></div><div><span class="fweight-500">Signup Channel: </span><span>${item.parent.signupChannel}</span></div></div>`,
        icon: 'account',
        formattedDate: moment(item.parent.createdAt).format('D MMM YYYY, H:mm'),
        timestamp: moment(item.parent.createdAt).valueOf(),
        pinned: false,
      },
      {
        description: getHTMLDescription(),
        icon: getIcon(),
        formattedDate: moment(item.createdAt).format('D MMM YYYY, H:mm'),
        timestamp: moment(item.createdAt).valueOf(),
        pinned: false,
      },
    ];
  }

  return {
    description: getHTMLDescription(), // Content of the event
    icon: getIcon(), // Defines the type of icon on the event
    formattedDate: moment(item.createdAt).format('D MMM YYYY, H:mm'), // Formatted date to be shown on the event
    timestamp: moment(item.createdAt).valueOf(), // Unix timestamp for sorting purposes
    pinned: false, // Flag for sorting purposes
  };
};
