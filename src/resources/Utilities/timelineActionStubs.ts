// List of action stubs used by each type of timeline (user, page or deal) sent as payload to the history endpoint

export const TimelineActionStubs = {
  Deal: [
    'update-deal',
    'portal-create-deal',
    'deal-feedback-visit',
    'user-add-favorite',
    'user-message',
    'user-schedule',
    'user-get-document',
    'user-phone-call',
  ],
  DealOwner: [
    'user-portal-create-message',
    'user-schedule',
  ],
  DealLastAction: [
    'user-add-favorite',
    'user-schedule',
    'user-phone-call',
    'user-portal-create-deal',
    'user-portal',
    'user-message',
    'user-portal-create-message',
    'user-send-message',
  ],
  BuyerSidebarPage: [
    'user-send-message',
    'user-schedule',
  ],
  BuyerSidebarUser: [
    'user-register',
  ],
  BuyerSidebarDeal: [
    'page-message',
    'deal-feedback-visit-email',
    'deal-confirm-visit',
    'deal-confirm-visit-email',
    'deal-confirm-offer',
    'deal-make-offer',
    'deal-review-offer',
    'update-deal',
  ],
  SellerSidebar: [
    'page-create',
    'page-published',
    'page-scan-trial',
    'page-start-service-package',
    'page-stop-service-package',
    'page-unpublished',
    'pro-estimation-complete',
    'user-create-estimation',
    'user-register',
    'page-status-success',
  ],
};
