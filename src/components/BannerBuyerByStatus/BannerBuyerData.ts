import scheduleAcceptedSvg from '../../images/dashboard/PropertyConfimedVisit.svg';
import PropertyCalendarSvg from '../../images/dashboard/PropertyCalendar.svg';
import PropertyVisitedSvg from '../../images/dashboard/propertyVisited.svg';
import PropertyCanceledSvg from '../../images/dashboard/scheduleCanceled.svg';
import scheduleSvg from '../../images/dashboard/PropertyVisit.svg';
import BannerOfferDefault from '../../images/dashboard/bannerOffer-default.svg';
import BannerOfferAccepted from '../../images/dashboard/bannerOffer-accepted.svg';
import BannerOfferDeclined from '../../images/dashboard/bannerOffer-declined.svg';


const BuyerBannerData = (propID, customDescription) => ({
  visit: {
    default: {
      bg: 'bgWhite',
      title: 'Request a visit',
      description: ['Share your availability to visit your favourite property.'],
      backgroundImg: PropertyCalendarSvg,
      buttonLink: `/buyer/${propID}/scheduleVisit/addDate`,
      buttonLabel: 'Add dates',
      buttonIcon: 'plus',
      buttonType: 'primary',
    },
    pending: {
      bg: 'bgWhite',
      title: 'Thank you for your request',
      description: ['We will contact you shortly to confirm your visit.'],
      backgroundImg: scheduleSvg,
      buttonLink: `/buyer/${propID}/scheduleVisit`,
      buttonLabel: 'View details',
      buttonIcon: '',
      buttonType: 'secondary',
    },
    accepted: {
      bg: 'bgGreen50',
      title: 'Your visit is confirmed',
      description: [customDescription],
      backgroundImg: scheduleAcceptedSvg,
      buttonLink: `/buyer/${propID}/scheduleVisit`,
      buttonLabel: 'View details',
      buttonIcon: '',
      buttonType: 'secondary',
    },
    cancelled: {
      bg: 'bgRed50',
      title: 'Your visit has been cancelled',
      description: ['Please contact our team for more details.'],
      backgroundImg: PropertyCanceledSvg,
      buttonLink: `/buyer/${propID}/scheduleVisit/addDate`,
      buttonLabel: 'Request new visit',
      buttonIcon: 'plus',
      buttonType: 'primary',
    },
    visited: {
      bg: 'bgBlue100',
      title: 'You visited the property',
      description: ['We hope you had a great experience.'],
      backgroundImg: PropertyVisitedSvg,
      buttonLink: `/buyer/${propID}/scheduleVisit/addDate`,
      buttonLabel: 'Add new dates',
      buttonIcon: 'plus',
      buttonType: 'secondary',
    },
  },
  offer: {
    default: {
      bg: 'bgWhite',
      title: 'Ready to make an offer?',
      description: ['Send your proposal and take the first steps to buy your dream home.'],
      backgroundImg: BannerOfferDefault,
      buttonLink: `/buyer/${propID}/scheduleVisit/addDate`,
      buttonLabel: 'Add offer',
      buttonIcon: 'plus',
      buttonType: 'primary',
    },
    pending: {
      bg: 'bgWhite',
      title: 'Thank you for your offer!',
      description: ['Your offer is being reviewed.', 'We will contact you with any updates.'],
      backgroundImg: BannerOfferDefault,
      buttonLink: `/buyer/${propID}/scheduleVisit`,
      buttonLabel: 'View details',
      buttonIcon: '',
      buttonType: 'secondary',
    },
    accepted: {
      bg: 'bgGreen50',
      title: 'Your offer was accepted!',
      description: ['Congratulations! You will be contacted shortly to proceed with the next steps.'],
      backgroundImg: BannerOfferAccepted,
      buttonLink: `/buyer/${propID}/scheduleVisit`,
      buttonLabel: 'View details',
      buttonIcon: '',
      buttonType: 'secondary',
    },
    rejected: {
      bg: 'bgRed50',
      title: 'Your offer was declined!',
      description: ['Feel free to propose a new price if you\'re still interested!'],
      backgroundImg: BannerOfferDeclined,
      buttonLink: `/buyer/${propID}/scheduleVisit/addDate`,
      buttonLabel: 'Add new offer',
      buttonIcon: 'plus',
      buttonType: 'primary',
    },
  },
})

export default BuyerBannerData;
