'use strict';

window.addEventListener('message', event => {
  if (window.origin !== 'null' || event.source !== window.parent ||
      event.origin !== window.location.origin) return;
  const { html, css, js } = event.data ?? {};
  if (![html, css, js].every(value => typeof value === 'string')) return;

  const estilo = document.createElement('style');
  estilo.textContent = css;
  document.head.append(estilo);
  const layout = document.createElement('template');
  layout.innerHTML = html;
  document.body.replaceChildren(layout.content);

  const programa = document.createElement('script');
  const url = URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
  programa.src = url;
  programa.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
  programa.addEventListener('error', () => URL.revokeObjectURL(url), { once: true });
  document.body.append(programa);
});
