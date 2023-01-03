export function imageBgPreload(onComplete) {
  // preload all background images
  try {
    onComplete(true);
    runBgPreload(onComplete());
  } catch (err) {
    onComplete(false);
  }

  function runBgPreload() {
    const imageHolder = document.createElement('div');
    imageHolder.setAttribute('id', 'preBgHolder');
    imageHolder.style.display = 'none';
    document.getElementsByTagName('body')[0].appendChild(imageHolder);
    const preloads = document.getElementsByClassName('preload');
    const imageBank = document.getElementById('preBgHolder');
    const preloadUrls = [];
    const images = [];
    let pre = [];
    const preStatus = [];
    let allImagesReady;
    let onCompleteFired = false;
    // grab all background images from CSS and preload in a CSS hidden div called preBgHolder.
    function getAllBackgroundImages() {
      for (let i = 0; i < preloads.length; i += 1) {
        if (window.getComputedStyle(preloads[i]).getPropertyValue('background-image') !== 'none') {
          preloadUrls[i] = window.getComputedStyle(preloads[i]).getPropertyValue('background-image');
          preloadUrls[i] = preloadUrls[i].replace(/'/g, ''); // removes url quotes as computed different in safari
          preloadUrls[i] = preloadUrls[i].substring(4, preloadUrls[i].length - 1);
          images[i] = new Image();
          images[i].src = preloadUrls[i];
          images[i].classList.add('preBg');
          imageBank.appendChild(images[i]);
        } else {
          // eslint-disable-next-line no-console
          console.error(`#${preloads[i].id} does not contain a background image`);
        }
      }
    }
    // check each img tag in the hidden div has loaded
    function statusListeners() {
      pre = document.getElementsByClassName('preBg');
      for (let i = 0; i < pre.length; i += 1) {
        pre[i].addEventListener('load', checkEachStatus, false);
        preStatus[i] = pre[i].complete;
      }
    }

    function checkEachStatus() {
      function imageLoadedTrue(loadStatuses) {
        return loadStatuses === true;
      }
      for (let i = 0; i < pre.length; i += 1) {
        preStatus[i] = pre[i].complete;
        allImagesReady = preStatus.every(imageLoadedTrue);
        if (allImagesReady === true && onCompleteFired === false) {
          // mainFired used to stop runMain firing more than once if images load from cache
          onComplete(false);
          onCompleteFired = true;
        }
      }
    }
    getAllBackgroundImages();
    statusListeners();
    // if there are no preloads to work with run the fallack function anyway
    if (preloads.length === 0) {
      onComplete(false);
    }
  }
}
