'use strict';

const cursos = [
  { id: 'web', nome: 'a Oficina Web', chave: 'hv-academia-web-progresso-v1', ancora: '#desafios' },
  { id: 'python', nome: 'Python', chave: 'hv-academia-python-basico-v1', ancora: '#quiz' },
  { id: 'sql', nome: 'SQL', chave: 'hv-academia-sql-basico-v1', ancora: '#quiz' }
].map(curso => {
  const cartao = document.querySelector(`[data-curso="${curso.id}"]`);
  const link = cartao.querySelector('a');
  return {
    ...curso,
    caixa: cartao.querySelector('.curso-progresso'),
    descricao: cartao.querySelector('.curso-progresso p'),
    barra: cartao.querySelector('progress'),
    link,
    destino: link.getAttribute('href'),
    textoInicial: link.textContent
  };
});

const resumo = document.querySelector('#progresso-cursos');

function lerJson(dados) {
  try {
    return JSON.parse(dados);
  } catch {
    return null;
  }
}

function lerProgresso(curso, dados) {
  if (curso.id === 'web') {
    const desafios = lerJson(dados);
    return Array.isArray(desafios) ? ['html', 'css', 'js'].filter(item => desafios.includes(item)).length : 0;
  }

  const pontuacao = Number(dados);
  return Number.isInteger(pontuacao) && pontuacao >= 0 && pontuacao <= curso.barra.max ? pontuacao : 0;
}

function atualizarProgresso() {
  let guardados;
  let rascunho;
  try {
    guardados = cursos.map(curso => localStorage.getItem(curso.chave));
    rascunho = lerJson(localStorage.getItem('hv-academia-web-v1'));
  } catch {
    return;
  }

  let concluidos = 0;
  cursos.forEach((curso, indice) => {
    const pontos = lerProgresso(curso, guardados[indice]);
    const completo = pontos === curso.barra.max;
    const temRascunho = curso.id === 'web' &&
      ['html', 'css', 'js'].every(tipo => typeof rascunho?.[tipo] === 'string');

    curso.barra.value = pontos;
    if (curso.id === 'web') {
      curso.descricao.textContent = `${pontos}/${curso.barra.max} desafios concluídos`;
    } else {
      curso.descricao.textContent = `Melhor resultado no questionário ${pontos}/${curso.barra.max}`;
    }

    if (completo) concluidos += 1;
    const podeRetomar = pontos > 0 || temRascunho;
    curso.link.textContent = completo ? `Rever ${curso.nome}`
      : podeRetomar ? `Retomar ${curso.nome}` : curso.textoInicial;
    curso.link.href = podeRetomar ? curso.destino + curso.ancora : curso.destino;
    curso.caixa.hidden = false;
  });

  resumo.textContent = `${concluidos} de ${cursos.length} percursos com validação completa neste navegador.`;
  resumo.hidden = false;
}

window.addEventListener('pageshow', atualizarProgresso);
window.addEventListener('storage', atualizarProgresso);
atualizarProgresso();
