import { useEffect } from 'react';
import isArray from 'lodash/isArray';

// FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT useOutsideAlerter(REF_ELEMENT, {action: 'function', func: () => ''})
function useOutsideAlerter(ref, action) {
  /**
   * Alert if clicked on outside of element
   */
  function handleClickOutside(event) {
    const getClass = document.getElementsByClassName('brixel-notification');
    const getClassMore = document.getElementsByClassName('block-click');
    if (getClass.length + getClassMore.length === 1 && event.target && ref.current && isArray(ref.current)) {
      setTimeout(() => {
        const curRef = action.id ? ref.current[action.id] : ref.current[0];
        if (curRef && curRef.current) {
          if (!curRef.current.contains(event.target)) {
            if (action.action === 'push') {
              action.history.push(action.loc);
            }
            if (action.action === 'function') {
              action.func();
            }
          }
        }
      }, 1);
    } else if (ref && ref.current) {
      if (typeof ref.current.length === 'undefined' && !ref.current.contains(event.target)) {
        if (action.action === 'push') {
          action.history.push(action.loc);
        }
        if (action.action === 'function') {
          action.func();
        }
      }
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
}

export default useOutsideAlerter;
