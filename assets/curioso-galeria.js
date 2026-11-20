'use strict';

const galeria = document.querySelector('#capturas');
const quadro = galeria.querySelector('dialog');

if (typeof quadro.showModal === 'function') {
  const ligacoes = [...galeria.querySelectorAll('.game-gallery figure a')];
  const titulo = quadro.querySelector('#galeria-titulo');
  const imagem = quadro.querySelector('.galeria-imagem');
  const estado = quadro.querySelector('.galeria-estado');
  const original = quadro.querySelector('[data-galeria-original]');
  let posicao = 0;
  let origem;

  function mostrar(indice) {
    posicao = (indice + ligacoes.length) % ligacoes.length;
    const link = ligacoes[posicao];
    const miniatura = link.querySelector('img');
    const ampliada = document.createElement('img');
    let reduzida = false;

    titulo.textContent = link.closest('figure').querySelector('figcaption').textContent;
    ampliada.alt = miniatura.alt;
    estado.textContent = quadro.dataset.loading;
    original.href = link.href;
    original.hidden = true;
    imagem.replaceChildren(ampliada);

    ampliada.onload = () => {
      if (imagem.firstElementChild !== ampliada) return;
      estado.textContent = reduzida ? quadro.dataset.fallback : '';
      original.hidden = reduzida;
    };
    ampliada.onerror = () => {
      if (imagem.firstElementChild !== ampliada) return;
      if (reduzida) {
        imagem.replaceChildren();
        estado.textContent = quadro.dataset.error;
        return;
      }
      reduzida = true;
      ampliada.src = miniatura.src;
    };
    ampliada.src = link.href;
  }

  for (const [indice, link] of ligacoes.entries()) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', evento => {
      if (evento.defaultPrevented || evento.button !== 0 || evento.ctrlKey ||
          evento.metaKey || evento.shiftKey || evento.altKey) return;
      evento.preventDefault();
      origem = link;
      mostrar(indice);
      quadro.showModal();
    });
  }

  quadro.querySelector('[data-galeria-fechar]').addEventListener('click', () => quadro.close());
  quadro.querySelector('[data-galeria-anterior]').addEventListener('click', () => mostrar(posicao - 1));
  quadro.querySelector('[data-galeria-seguinte]').addEventListener('click', () => mostrar(posicao + 1));
  quadro.addEventListener('keydown', evento => {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    evento.preventDefault();
    mostrar(posicao + (evento.key === 'ArrowLeft' ? -1 : 1));
  });
  quadro.addEventListener('close', () => {
    imagem.replaceChildren();
    origem?.focus();
  });
}
