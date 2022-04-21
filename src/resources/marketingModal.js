import PublishPageImg from '../images/Marketing/publishPage.svg';
import UnpublishPageImg from '../images/Marketing/unpublishPage.svg';
import SuccessReview from '../images/Marketing/successReview.svg';

export const MarketingModal = {
  publishPage: {
    request: {
      title: 'Please confirm your request.',
      body: 'You can publish your Brixel Page for free to share it wherever you want. We will review your content before publishing to make sure you get the best result.',
      titleImg: PublishPageImg,
    },
    success: {
      title: 'Review in the making',
      body: 'To assure great quality your page is being reviewed for free. Our customer team gets back to you within one business day.',
      titleImg: SuccessReview,
    }
  },
  unpublishPage: {
    request: {
      title: 'Please confirm your request.',
      body: 'You can unpublish your Brixel Page for free. We will review your request before unpublishing to make sure you get the best result.',
      titleImg: UnpublishPageImg,
    },
    success: {
      title: 'Please confirm your request.',
      body: 'You can publish your Brixel Page for free to share it wherever you want. We will review your content before publishing to make sure you get the best result.',
      titleImg: SuccessReview,
    }
  },
  publishPortals: {
    request: {
      title: 'Please confirm your request.',
      body: 'Hereby you give Brixel the right to publish your property on third-party portals and accept the one time fee of CHF 950.<br /><br /> We will review your content before publishing to make sure you get the best result.',
      titleImg: PublishPageImg,
    },
    success: {
      title: 'Successfully submitted',
      body: 'Portals can take up to 8 hours until your property is online. We will let you know as soon as your listings are online.',
      titleImg: SuccessReview,
    }
  },
  unpublishPortals: {
    request: {
      title: 'Please confirm your request.',
      body: 'Hereby you give Brixel the right to unpublish your property on third-party portals.<br /><br />We will review your content before unpublishing to make sure you get the best result.',
      titleImg: UnpublishPageImg,
    },
    success: {
      title: 'Successfully submitted',
      body: 'Portals can take up to 8 hours until your property is offline. We will let you know as soon as your listings are offline.',
      titleImg: SuccessReview,
    }
  }
}
