export default {
  user: {
    getToken: () => '/authentication/getToken',
    tokenValidationWithUser: () => '/authentication/getTokenWithUser',
    getTokenValidation: () => '/authentication/validateToken',
    createUser: () => '/user/register',
    recoverPassword: (email) => `/user/recoverPassword/${email}`,
    updateUser: (userId) => `/user/${userId}`,
    getUser: (userId) => '/user/fromToken',
  },
  common: {
    sendMessage: () => '/message',
    sendScheduleVisit: () => '/email/sendScheduleVisitEmail',
  },
  upload: {
    rotate: (id, rotation) => `/image/${id}/rotate/${rotation}`,
    singleImage: (id) => `/image/${id}`,
    addImage: () => '/image/',
    imageType: () => '/imagetype/0/0',
    document: () => '/document/',
    singleDocument: (id) => `/document/${id}`,
  },
};
