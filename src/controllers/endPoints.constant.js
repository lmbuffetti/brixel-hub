export default {
  common: {
    sendMessage: () => '/message',
    sendGenericMessage: () => '/email/sendTemplateEmail',
    sendScheduleVisit: () => '/email/sendScheduleVisitEmail',
  },
  company: {
    getCompanyByStub: (stub) => `/company/company-by-stub/${stub}`,
  },
  property: {
    addPage: () => `/page/`,
    estimation: (id) => `/page/${id}/estimation`,
    page: (limit, offset) => `/page/${limit}/${offset}`,
  },
  upload: {
    rotate: (id, rotation) => `/image/${id}/rotate/${rotation}`,
    singleImage: (id) => `/image/${id}`,
    addImage: () => '/image/',
    imageType: () => '/imagetype/0/0',
    document: () => '/document/',
    singleDocument: (id) => `/document/${id}`,
  },
  user: {
    getToken: () => '/authentication/getToken',
    tokenValidationWithUser: () => '/authentication/getTokenWithUser',
    getTokenValidation: () => '/authentication/validateToken',
    createUser: () => '/user/register',
    recoverPassword: (email) => `/user/recoverPassword/${email}`,
    updateUser: (userId) => `/user/${userId}`,
    getUser: (userId) => '/user/fromToken',
    validateUser: (email) => `/user/validate/${email}`,
  },
};
