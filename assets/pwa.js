'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('../sw.js', document.currentScript.src)).catch(error => {
    console.warn('Modo offline indisponível.', error.message);
  });
}
