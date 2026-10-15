import translateTo from '../../utils/translation';
import PublishPageImg from '../../images/Marketing/publishPage.svg';
import UnpublishPageImg from '../../images/Marketing/unpublishPage.svg';
import SuccessReviewImg from '../../images/Marketing/successCheck.svg';
export const MarketingModalData = (lang) => ({
    publishPage: {
        request: {
            title: translateTo('Please confirm your request.', lang),
            body: translateTo('You can publish your Brixel Page for free to share it wherever you want. We will review your content before publishing to make sure you get the best result.', lang),
            titleImg: PublishPageImg,
        },
        success: {
            title: translateTo('Review in the making', lang),
            body: translateTo('To assure great quality your page is being reviewed for free. Our customer team gets back to you within one business day.', lang),
            titleImg: SuccessReviewImg,
        },
    },
    unpublishPage: {
        request: {
            title: translateTo('Please confirm your request.', lang),
            body: translateTo('Hereby we will take your Page offline. All your connected listings on third-party portals will also be removed. You can republish your Page at any time.', lang),
            titleImg: UnpublishPageImg,
        },
        success: {
            title: translateTo('Please confirm your request.', lang),
            body: translateTo('It may take a few hours until everything is offline. We will confirm as soon as all listings are removed.', lang),
            titleImg: SuccessReviewImg,
        },
    },
    publishPortals: {
        request: {
            title: translateTo('Please confirm your request.', lang),
            body: `<p><span>${translateTo('Hereby you give Brixel the right to publish your property on third-party portals and accept the one time fee of', lang)}</span><span class="ml-1">:companyPrice</span><span>.</span></p><p><span>${translateTo('We will review your content before publishing to make sure you get the best result.', lang)}</span></p>`,
            titleImg: PublishPageImg,
        },
        success: {
            title: translateTo('Successfully submitted', lang),
            body: translateTo('Portals can take up to 8 hours until your property is online. We will let you know as soon as your listings are online.', lang),
            titleImg: SuccessReviewImg,
        },
    },
    unpublishPortals: {
        request: {
            title: translateTo('Please confirm your request.', lang),
            body: translateTo('Hereby we will take all your listings on third-party portals offline. You can request to publish the listings again at any time.', lang),
            titleImg: UnpublishPageImg,
        },
        success: {
            title: translateTo('Successfully submitted', lang),
            body: translateTo('It may take a few hours until everything is offline. We will confirm as soon as all listings are removed.', lang),
            titleImg: SuccessReviewImg,
        },
    },
});
