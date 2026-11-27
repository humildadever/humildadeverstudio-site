'use strict';

const filters = document.getElementById('filtros');
const search = document.getElementById('pesquisa');
const category = document.getElementById('categoria');
const platform = document.getElementById('plataforma');
const statusFilter = document.getElementById('estado');
const favoritesOnly = document.getElementById('so-favoritos');
const results = document.getElementById('resultados');
const share = document.getElementById('partilhar-filtros');
const shareUrl = document.getElementById('ligacao-filtros');
const shareStatus = document.getElementById('estado-partilha');
const urlFilters = { q: search, categoria: category, plataforma: platform, estado: statusFilter };
const storageKey = 'hv-catalog-favorites';

function normalize(text) {
  return text.toLocaleLowerCase('pt-PT').normalize('NFD').replace(/\p{M}/gu, '').trim();
}

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return new Set(Array.isArray(saved) ? saved.filter(value => typeof value === 'string') : []);
  } catch {
    return new Set();
  }
}

const favorites = loadFavorites();
const projects = Array.from(document.querySelectorAll('[data-project]'), card => ({
  card,
  id: card.dataset.project,
  searchText: normalize(Array.from(card.querySelectorAll('h2, p'), part => part.textContent).join(' ')),
  button: card.querySelector('.favorite')
}));

function updateResults() {
  const terms = normalize(search.value).split(/\s+/);
  let visible = 0;
  for (const { card, id, searchText, button } of projects) {
    const favorite = favorites.has(id);
    button.setAttribute('aria-pressed', String(favorite));
    const matches = terms.every(term => searchText.includes(term))
      && (!category.value || category.value === card.dataset.category)
      && (!platform.value || platform.value === card.dataset.platform)
      && (!statusFilter.value || statusFilter.value === card.dataset.status)
      && (!favoritesOnly.checked || favorite);
    if (!matches && card.contains(document.activeElement)) favoritesOnly.focus();
    card.hidden = !matches;
    if (matches) visible += 1;
  }
  results.textContent = visible === 0 ? 'Sem resultados. Experimenta ajustar os filtros.'
    : visible === 1 ? '1 projeto encontrado' : `${visible} projetos encontrados`;
}

for (const { id, button, card } of projects) {
  button.hidden = false;
  button.setAttribute('aria-label', `Favorito — ${card.querySelector('h2').textContent}`);
  button.addEventListener('click', () => {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);

    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
    } catch {
      // Os favoritos continuam disponíveis durante a visita atual.
    }
    updateResults();
  });
}

function urlWithFilters(url) {
  for (const [key, field] of Object.entries(urlFilters)) {
    const value = field.value.trim();
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  return url;
}

function renderFilters() {
  updateResults();
  const address = urlWithFilters(new URL(location.href));
  if (address.href !== location.href) history.replaceState(history.state, '', address);
  shareUrl.value = urlWithFilters(new URL(location.pathname, location.origin)).href;
  shareStatus.textContent = '';
}

function restoreFilters() {
  const params = new URLSearchParams(location.search);
  for (const [key, field] of Object.entries(urlFilters)) {
    const value = params.get(key) ?? '';
    field.value = !field.options || [...field.options].some(option => option.value === value) ? value : '';
  }
  renderFilters();
}

search.addEventListener('input', renderFilters);
filters.addEventListener('change', renderFilters);
document.getElementById('limpar').addEventListener('click', () => {
  search.value = category.value = platform.value = statusFilter.value = '';
  favoritesOnly.checked = false;
  renderFilters();
  search.focus();
});
document.getElementById('copiar-filtros').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    shareStatus.textContent = 'Ligação copiada.';
  } catch {
    shareUrl.focus();
    shareUrl.select();
    shareStatus.textContent = 'A ligação está selecionada. Usa a opção Copiar do teu dispositivo.';
  }
});
window.addEventListener('popstate', restoreFilters);
window.addEventListener('pageshow', restoreFilters);
filters.hidden = results.hidden = share.hidden = false;
restoreFilters();
