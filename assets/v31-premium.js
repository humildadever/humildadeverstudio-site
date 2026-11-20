/* Preferências locais de apresentação e navegação móvel. */
'use strict';

const nav = document.querySelector('.v17-nav');
const menu = nav.querySelector('.v31-menu');
const links = document.getElementById(menu.getAttribute('aria-controls'));
const compact = matchMedia('(max-width: 760px)');

function setMenu(open) {
  const focused = document.activeElement;
  const expanded = compact.matches && open;
  menu.hidden = !compact.matches;
  menu.setAttribute('aria-expanded', String(expanded));
  links.hidden = compact.matches && !expanded;
  if (links.hidden && links.contains(focused)) menu.focus();
  if (menu.hidden && focused === menu) links.querySelector('a').focus();
}

menu.addEventListener('click', () => setMenu(links.hidden));
nav.addEventListener('keydown', event => {
  if (event.key === 'Escape' && compact.matches && !links.hidden) {
    setMenu(false);
    menu.focus();
  }
});
links.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!compact.matches || !link || event.defaultPrevented ||
      event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  setMenu(false);
  if (!link.getAttribute('href').startsWith('#')) return;
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
});
document.addEventListener('click', event => {
  if (compact.matches && !links.hidden && !nav.contains(event.target)) setMenu(false);
});
compact.addEventListener('change', () => setMenu(false));
setMenu(false);

const bar = document.createElement('div');
bar.className = 'v31-tools';
bar.setAttribute('role', 'group');
bar.setAttribute('aria-label', 'Preferências de apresentação');
nav.after(bar);

function addPreference(label, key, active, inactive, className, systemPreference) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  let enabled = false;
  try {
    enabled = localStorage.getItem(key) === active;
  } catch {
    // A preferência continua disponível quando o armazenamento é bloqueado.
  }

  const sync = () => {
    const forced = systemPreference?.matches === true;
    document.body.classList.toggle(className, enabled || forced);
    button.setAttribute('aria-pressed', String(enabled || forced));
    if (forced) button.setAttribute('aria-disabled', 'true');
    else button.removeAttribute('aria-disabled');
  };
  button.addEventListener('click', () => {
    if (systemPreference?.matches) return;
    enabled = !enabled;
    try {
      localStorage.setItem(key, enabled ? active : inactive);
    } catch {
      // Mantém a opção durante a visita atual.
    }
    sync();
  });
  systemPreference?.addEventListener('change', sync);
  bar.append(button);
  sync();
}

addPreference('Modo claro', 'hv-theme', 'light', 'dark', 'v31-light');
addPreference('Reduzir movimento', 'hv-motion', 'reduce', 'normal', 'v31-reduced',
  matchMedia('(prefers-reduced-motion: reduce)'));

const counter = document.querySelector('.contador-visitas img');
function showCounterFailure() {
  counter.hidden = true;
  counter.nextElementSibling.style.display = 'inline';
}
counter.addEventListener('error', showCounterFailure);
if (counter.complete && counter.naturalWidth === 0) showCounterFailure();
