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

const campos = {
  html: document.querySelector('#fonte-html'),
  css: document.querySelector('#fonte-css'),
  js: document.querySelector('#fonte-js')
};
const estado = document.querySelector('#estado-oficina');
const resultado = document.querySelector('#resultado-oficina');
const chave = 'hv-academia-web-v1';

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

function executar() {
  const codigo = lerCampos();
  const quadro = document.createElement('iframe');
  quadro.title = 'Pré-visualização do minijogo';
  quadro.setAttribute('sandbox', 'allow-scripts');
  quadro.src = 'academia-web-preview.html';
  quadro.addEventListener('load', () => quadro.contentWindow.postMessage(codigo, '*'), { once: true });
  resultado.replaceChildren(quadro);
}

try {
  preencher(JSON.parse(localStorage.getItem(chave)));
} catch {
  preencher(exemplo);
}

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
