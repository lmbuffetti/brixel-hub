import { useEffect } from 'react';

function useOutsideAlerter(ref, action) {
  /**
   * Alert if clicked on outside of element
   */
  function handleClickOutside(event) {
    const getClass = document.getElementsByClassName('brixel-notification');
    const getClassMore = document.getElementsByClassName('block-click');
    if (getClass.length + getClassMore.length === 0) {
      console.log(ref);
      if (ref.current && !ref.current.contains(event.target)) {
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
