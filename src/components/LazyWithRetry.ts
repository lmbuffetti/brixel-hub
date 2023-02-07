import {lazy} from 'react';

const lazyWithRetry = (componentImport) => lazy(async () => {

  return await componentImport();
});

export default lazyWithRetry;
