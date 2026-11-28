'use strict';
// Copiar o email do estúdio e fechar o seletor de línguas ao clicar fora ou com Escape.
document.querySelectorAll('[data-copy]').forEach(button => {
  const status = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', async () => {
    const text = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = button.dataset.done;
    } catch {
      const code = button.parentElement.querySelector('code');
      if (code) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
});

const lang = document.querySelector('.lang');
if (lang) {
  document.addEventListener('click', event => {
    if (lang.open && !lang.contains(event.target)) lang.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lang.open) {
      lang.open = false;
      lang.querySelector('summary').focus();
    }
  });
}
