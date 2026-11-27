'use strict';

if ('serviceWorker' in navigator) {
  const worker = new URL('../sw.js', document.currentScript.src);
  const register = () => {
    navigator.serviceWorker.register(worker).catch(error => {
      console.warn('Modo offline indisponível.', error.message);
    });
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
