'use strict';

const exemplo = {
  html: `<main>
  <h1>Caça às estrelas</h1>
  <p>Carrega no botão para apanhar estrelas.</p>
  <p>Pontuação <output id="placar" aria-live="polite">0</output></p>
  <button id="jogar" type="button">Apanhar estrela</button>
</main>`,
  css: `body {
  font: 1rem system-ui, sans-serif;
  background: #10253c;
  color: #fff;
  padding: 1rem;
}
main { max-width: 35rem; margin: auto; }
button {
  background: #ffdc68;
  color: #172334;
  font: inherit;
  padding: .65rem 1rem;
  border: 0;
  border-radius: .4rem;
}
button:focus-visible { outline: 3px solid white; outline-offset: 3px; }`,
  js: `let pontos = 0;
const placar = document.querySelector('#placar');
const jogar = document.querySelector('#jogar');

jogar.addEventListener('click', () => {
  pontos += 1;
  placar.textContent = pontos;
});`
};

const projeto = {
  html: `<main>
  <h1>Caça às estrelas contra o relógio</h1>
  <p>Apanha o maior número de estrelas antes que o tempo acabe.</p>
  <p>Tempo <output id="tempo">15</output> s</p>
  <p>Pontuação <output id="placar" aria-live="polite">0</output></p>
  <button id="jogar" type="button">Apanhar estrela</button>
  <button id="recomecar" type="button">Recomeçar</button>
  <p id="mensagem" role="status"></p>
</main>`,
  css: exemplo.css,
  js: `const duracao = 15;
const valorEstrela = 2;
const tempo = document.querySelector('#tempo');
const placar = document.querySelector('#placar');
const jogar = document.querySelector('#jogar');
const mensagem = document.querySelector('#mensagem');
let pontos = 0;
let fim = 0;
let intervalo;

function atualizarTempo() {
  const restante = Math.max(0, Math.ceil((fim - Date.now()) / 1000));
  tempo.textContent = restante;
  if (restante > 0) return;
  clearInterval(intervalo);
  jogar.disabled = true;
  mensagem.textContent = 'Tempo esgotado!';
}

function recomecar() {
  clearInterval(intervalo);
  pontos = 0;
  placar.textContent = pontos;
  jogar.disabled = false;
  mensagem.textContent = '';
  fim = Date.now() + duracao * 1000;
  atualizarTempo();
  intervalo = setInterval(atualizarTempo, 200);
}

jogar.addEventListener('click', () => {
  if (Date.now() >= fim) return;
  pontos += valorEstrela;
  placar.textContent = pontos;
});
document.querySelector('#recomecar').addEventListener('click', recomecar);
recomecar();`
};

const campos = {
  html: document.querySelector('#fonte-html'),
  css: document.querySelector('#fonte-css'),
  js: document.querySelector('#fonte-js')
};
const estado = document.querySelector('#estado-oficina');
const resultado = document.querySelector('#resultado-oficina');
const chave = 'hv-academia-web-v1';
const chaveProgresso = 'hv-academia-web-progresso-v1';
const progresso = document.querySelector('#progresso-oficina');
const feedback = document.querySelector('#feedback-oficina');
const botoes = [...document.querySelectorAll('[data-verificar]')];
const concluidos = new Set();
const mensagens = {
  html: 'Altera o título e o texto do botão, mantém os dois identificadores e volta a validar.',
  css: 'Muda o fundo da página e o fundo do botão. Depois confirma visualmente a legibilidade.',
  js: 'Confirma que o botão acrescenta 5 pontos por clique, começando em zero.'
};
let verificacao;

function mostrarProgresso() {
  progresso.textContent = `${concluidos.size}/${botoes.length} desafios concluídos`;
  for (const botao of botoes) {
    const concluido = concluidos.has(botao.dataset.verificar);
    botao.toggleAttribute('data-concluido', concluido);
    botao.textContent = `Validar ${{ html: 'HTML', css: 'CSS', js: 'JavaScript' }[botao.dataset.verificar]}${concluido ? ' ✓' : ''}`;
  }
}

function cancelarVerificacao() {
  if (!verificacao) return;
  clearTimeout(verificacao.prazo);
  verificacao = undefined;
}

window.addEventListener('message', event => {
  if (!verificacao || event.origin !== 'null' || event.source !== verificacao.quadro.contentWindow ||
      event.data?.tipo !== 'resultado-oficina' || typeof event.data.passou !== 'boolean') return;

  const { desafio } = verificacao;
  cancelarVerificacao();
  if (!event.data.passou) {
    feedback.textContent = mensagens[desafio];
    return;
  }

  concluidos.add(desafio);
  mostrarProgresso();
  feedback.textContent = 'Desafio concluído.';
  try {
    localStorage.setItem(chaveProgresso, JSON.stringify([...concluidos]));
  } catch {
    feedback.textContent += ' O progresso fica disponível enquanto esta página estiver aberta.';
  }
});

function lerCampos() {
  return Object.fromEntries(Object.entries(campos).map(([tipo, campo]) => [tipo, campo.value]));
}

function preencher(codigo) {
  for (const [tipo, campo] of Object.entries(campos)) {
    campo.value = typeof codigo?.[tipo] === 'string' ? codigo[tipo] : exemplo[tipo];
  }
}

function guardar() {
  try {
    localStorage.setItem(chave, JSON.stringify(lerCampos()));
  } catch {
    estado.textContent = 'O navegador não permitiu guardar o rascunho. Podes descarregar o HTML.';
  }
}

function executar(desafio) {
  cancelarVerificacao();
  const codigo = { ...lerCampos(), desafio };
  const quadro = document.createElement('iframe');
  quadro.title = 'Pré-visualização do minijogo';
  quadro.setAttribute('sandbox', 'allow-scripts');
  quadro.src = 'academia-web-preview.html';
  quadro.addEventListener('load', () => quadro.contentWindow.postMessage(codigo, '*'), { once: true });
  if (desafio) {
    feedback.textContent = 'A validar o desafio…';
    verificacao = { quadro, desafio, prazo: setTimeout(() => {
      cancelarVerificacao();
      feedback.textContent = 'A validação não terminou. Confirma que o código corre e volta a tentar.';
    }, 5000) };
  }
  resultado.replaceChildren(quadro);
}

try {
  preencher(JSON.parse(localStorage.getItem(chave)));
} catch {
  preencher(exemplo);
}

try {
  const guardado = JSON.parse(localStorage.getItem(chaveProgresso));
  for (const botao of botoes) {
    if (Array.isArray(guardado) && guardado.includes(botao.dataset.verificar)) concluidos.add(botao.dataset.verificar);
  }
} catch {
  // Um rascunho continua utilizável com armazenamento indisponível.
}
mostrarProgresso();
progresso.hidden = false;
for (const botao of botoes) {
  botao.hidden = false;
  botao.addEventListener('click', () => executar(botao.dataset.verificar));
}
const carregarProjeto = document.querySelector('#carregar-projeto');
carregarProjeto.hidden = false;
carregarProjeto.addEventListener('click', () => {
  if (!window.confirm('Carregar o projeto final e substituir o rascunho atual?')) return;
  preencher(projeto);
  guardar();
  executar();
  document.querySelector('#fonte-html').focus();
  estado.textContent = 'Projeto final carregado.';
});

for (const campo of Object.values(campos)) campo.addEventListener('input', guardar);
document.querySelector('#executar').addEventListener('click', () => {
  executar();
  estado.textContent = 'Pré-visualização atualizada.';
});
document.querySelector('#repor').addEventListener('click', () => {
  if (!window.confirm('Substituir o rascunho atual pelo exemplo?')) return;
  preencher(exemplo);
  executar();
  estado.textContent = 'Exemplo reposto.';
  guardar();
});
document.querySelector('#descarregar').addEventListener('click', () => {
  const { html, css, js } = lerCampos();
  const estilo = css.replace(/<\/style/gi, '<\\/style');
  const programa = js.replace(/<\/script/gi, '<\\/script');
  const fonte = `<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>O meu minijogo</title>
  <style>\n${estilo}\n</style>
</head>
<body>
${html}
<script>\n${programa}\n</script>
</body>
</html>
`;
  const url = URL.createObjectURL(new Blob([fonte], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'o-meu-minijogo.html';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector('#oficina').hidden = false;
executar();
