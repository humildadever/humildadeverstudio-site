'use strict';

const filters = document.getElementById('filtros');
const search = document.getElementById('pesquisa');
const category = document.getElementById('categoria');
const platform = document.getElementById('plataforma');
const statusFilter = document.getElementById('estado');
const favoritesOnly = document.getElementById('so-favoritos');
const results = document.getElementById('resultados');
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
  const query = normalize(search.value);
  let visible = 0;
  for (const { card, id, searchText, button } of projects) {
    const favorite = favorites.has(id);
    button.setAttribute('aria-pressed', String(favorite));
    const matches = searchText.includes(query)
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

search.addEventListener('input', updateResults);
filters.addEventListener('change', updateResults);
document.getElementById('limpar').addEventListener('click', () => {
  search.value = category.value = platform.value = statusFilter.value = '';
  favoritesOnly.checked = false;
  updateResults();
  search.focus();
});
filters.hidden = results.hidden = false;
updateResults();
