import 'regenerator-runtime/runtime';
import { TextDecoder, TextEncoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

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
