import 'regenerator-runtime/runtime';

if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
}

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

Object.defineProperty(window, 'location.assign', { value: noop, writable: true });
