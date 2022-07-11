import { translateTo } from '@brixel/brixel-components';

export const WizardText = (lang) => ({
  preMarketOverlay: {
    step1: {
      className: 'mt-1 ml-1 mt-md-2 ml-md-2 max-w-fix-280 max-w-fix-md-320',
      title: translateTo('This is a Pre-Market property', lang),
      description: translateTo('This property is not yet on sale and is exclusively visible for registered buyers on Brixel. You can like these properties to be ahead of the market and be informed about any important updates.', lang),
    },
    step2: {
      position: 'bottomMobile',
      className: 'mt-1 ml-1 mt-md-2 ml-md-2 max-w-fix-280 max-w-fix-md-320',
      title: translateTo('Property card', lang),
      description: translateTo('Here you find the most important information about properties matching your filters. All personal data are hidden until the property gets on the market.', lang),
    },
    step3: {
      position: 'bottom center',
      className: 'mt-md-2 ml-md-2 max-w-fix-320 w-perc-100',
      title: translateTo('Manage your Pre-Market', lang),
      description: translateTo('Keep your properties clean and neat to get the best results. You can either like or dislike properties to improve your recommendations.', lang),
    },
  },
});
