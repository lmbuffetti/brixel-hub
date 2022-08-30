import { lazy } from 'react';

const lazyWithRetry = (componentImport) => lazy(async () => {
  const pageHasAlreadyBeenForceRefreshed = JSON.parse(
    localStorage.getItem(
      'page-has-been-force-refreshed',
    ) || 'false',
  );
  const isBrowser = new Function("try { return this===window; }catch(e){ return false; }");
  const isiOS = isBrowser() ? new Function("if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){ return true; }else{ return false; }") : new Function("return false;");
  try {
    const component = await componentImport();

    localStorage.setItem(
      'page-has-been-force-refreshed',
      'false',
    );

    return component;
  } catch (error) {
    if ((!pageHasAlreadyBeenForceRefreshed || pageHasAlreadyBeenForceRefreshed === 'false') && !isiOS) {
      // Assuming that the user is not on the latest version of the application.
      // Let's refresh the page immediately.
      localStorage.setItem(
        'page-has-been-force-refreshed',
        'true',
      );
      setTimeout(() => window.location.reload(), 2000);
    }

    // The page has already been reloaded
    // Assuming that user is already using the latest version of the application.
    // Let's let the application crash and raise the error.
    throw error;
  }
});

export default lazyWithRetry;
