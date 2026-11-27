'use strict';

const form = document.getElementById('avaliacao');
const feedback = document.getElementById('nota');
const progress = document.getElementById('progresso');
const key = form.dataset.storageKey;
const answers = [...form.querySelectorAll('input[data-correct]')];
let best = 0;
try {
  const saved = Number(localStorage.getItem(key));
  if (Number.isInteger(saved) && saved >= 0 && saved <= answers.length) best = saved;
} catch {
  // O questionário também funciona com o armazenamento bloqueado.
}

function showProgress() {
  progress.textContent = `Melhor resultado ${best}/${answers.length}. ${best === answers.length
    ? 'Questionário concluído.' : 'Responde corretamente a todas as perguntas para concluir.'}`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const corrections = [];
  for (const answer of answers) {
    if (data.get(answer.name) !== answer.value) corrections.push(answer.dataset.correct);
  }
  const score = answers.length - corrections.length;
  feedback.textContent = `${score}/${answers.length} respostas certas. ${corrections.join(' ')}`.trim();
  if (score > best) {
    best = score;
    try {
      localStorage.setItem(key, String(best));
    } catch {
      // Mantém o progresso durante a visita atual.
    }
    showProgress();
  }
});
form.hidden = progress.hidden = false;
showProgress();
