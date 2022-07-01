import PublishPageImg from '../../images/Marketing/publishPage.svg';
import UnpublishPageImg from '../../images/Marketing/unpublishPage.svg';
import SuccessReview from '../../images/Marketing/successReview.svg';

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
      body: 'Hereby we will take your Page offline. All your connected listings on third-party portals will also be removed. You can republish your Page at any time.',
      titleImg: UnpublishPageImg,
    },
    success: {
      title: 'Please confirm your request.',
      body: 'It may take a few hours until everything is offline. We will confirm as soon as all listings are removed.',
      titleImg: SuccessReview,
    }
  },
  publishPortals: {
    request: {
      title: 'Please confirm your request.',
      body: '<p><span>Hereby you give Brixel the right to publish your property on third-party portals and accept the one time fee of</span><span class="ml-1">:companyPrice</span><span>.</span></p><p><span>We will review your content before publishing to make sure you get the best result.</span></p>',
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
      body: 'Hereby we will take all your listings on third-party portals offline. You can request to publish the listings again at any time.',
      titleImg: UnpublishPageImg,
    },
    success: {
      title: 'Successfully submitted',
      body: 'It may take a few hours until everything is offline. We will confirm as soon as all listings are removed.',
      titleImg: SuccessReview,
    }
  }
}
