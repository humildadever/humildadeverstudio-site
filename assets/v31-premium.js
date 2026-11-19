/* V31 — preferências locais de apresentação, sem contas ou rastreio */
(()=>{'use strict';const ready=()=>{if(document.querySelector('.v31-tools'))return;
const skip=document.createElement('a');skip.href='#jogo';skip.className='v31-skip';skip.textContent='Saltar para o conteúdo';document.body.prepend(skip);
const bar=document.createElement('div');bar.className='v31-tools';bar.setAttribute('aria-label','Preferências de apresentação');
bar.innerHTML='<span>Apresentação:</span><button type="button" data-v31="theme" aria-pressed="false">Modo claro</button><button type="button" data-v31="motion" aria-pressed="false">Reduzir movimento</button>';
const nav=document.querySelector('nav');if(nav)nav.insertAdjacentElement('afterend',bar);else document.body.prepend(bar);
let theme='dark',motion=false;try{theme=localStorage.getItem('hv-theme')||'dark';motion=localStorage.getItem('hv-motion')==='reduce'}catch(_){}
const sync=()=>{document.body.classList.toggle('v31-light',theme==='light');document.body.classList.toggle('v31-reduced',motion);const t=bar.querySelector('[data-v31="theme"]'),m=bar.querySelector('[data-v31="motion"]');t.setAttribute('aria-pressed',String(theme==='light'));t.textContent=theme==='light'?'Modo escuro':'Modo claro';m.setAttribute('aria-pressed',String(motion));m.textContent=motion?'Permitir movimento':'Reduzir movimento'};
bar.addEventListener('click',e=>{const b=e.target.closest('button[data-v31]');if(!b)return;if(b.dataset.v31==='theme'){theme=theme==='dark'?'light':'dark';try{localStorage.setItem('hv-theme',theme)}catch(_){}}else{motion=!motion;try{localStorage.setItem('hv-motion',motion?'reduce':'normal')}catch(_){}}sync()});sync();
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready()})();
