# HUMILDADEVER STUDIO — Operação Noturna V3.0 (website)

- Data de ativação: 23-11-2026 (Portugal)
- Projeto exclusivo: website oficial https://humildadeverstudio.com
- Repositório: humildadever/humildadeverstudio-site
- Branch: dev/v31-evolucao-total
- Prioridade: terminar validações V31, corrigir regressões, avançar V32–V40.
- Estado confirmado: portal O Curioso PT/EN, galeria, seis mundos, catálogo e Academia Web/Python/SQL na branch.
- Testes: resultados anteriores registados em TESTES.md; **nenhum teste novo executado neste checkpoint**.
- Publicação: não autorizada nesta operação; manter main inalterada.
- Ficheiros invioláveis: app-ads.txt e CNAME.
- Pendências: validação física Android/iPhone, auditoria manual WCAG, clipe oficial aprovado, pré-produção HTTPS.
- Próxima tarefa: obter HEAD remoto, executar npm ci, npm test e npm run test:browser; verificar CI da revisão corrente e corrigir falhas. Continuar pela prioridade V31–V40.
- Evitar trabalho concorrente: antes de cada escrita reler a versão remota do ficheiro.
- Relatório das 08h00: informar apenas commits, testes e alterações confirmadas; não prometer execução contínua fora de automações ativas.

## Checkpoint V4.0 — 23-11-2026
- Âmbito: exclusivamente website oficial.
- Implementação confirmada: `assets/v31-premium.css`, botões do hero O Curioso com altura mínima de 44px e disposição em coluna até 480px.
- Commit funcional: `f4d70fb469bb6db29ce126e0ae96f2bef0242e76`.
- Testes: não executados nesta sessão; executar `npm ci`, `npm test` e `npm run test:browser` e rever o CI.
- Publicação: não realizada; `main`, `app-ads.txt` e `CNAME` preservados.
- Próxima prioridade: validar regressões do hero em 320/390/480px, verificar acessibilidade, continuar melhorias de O Curioso.

## Checkpoint V4.0 — continuação, 23-11-2026
- Novo teste em `tests/site.test.cjs`: confirma hero O Curioso, ligação Google Play, página do jogo e regras de largura/altura dos botões em ecrãs estreitos.
- Commit confirmado: `44cfe5683fe6fb38e4005aa25b9df1db23298341`.
- Resultado: teste **adicionado, ainda não executado** nesta sessão. Não afirmar CI aprovado sem confirmação.
- Próxima prioridade: executar `npm test` e `npm run test:browser` na branch, inspecionar falhas e corrigir.

## Checkpoint — correção de testes, 23-11-2026
- O teste acrescentado ao final de `tests/site.test.cjs` foi revisto: inspeção das regras CSS por `css-tree`, fecho do DOM de teste e correção de escapes das expressões regulares.
- Commits confirmados: `8f446a53721bfcf56d5a769075e2827b3f1048c7`, `41b205924b2346bdbdb1349ad94d889606caa1c0`.
- Testes automatizados ainda não executados nesta sessão; **não considerar o teste aprovado**.
- Próxima ação obrigatória: executar `npm ci && npm test && npm run test:browser`, corrigir eventuais falhas e verificar o CI antes de novas alterações de produção.

## Checkpoint — validação móvel ampliada, 23-11-2026
- `tests/browser.test.cjs`: matriz de larguras inclui agora 320, 390, 480, 768 e 1366px.
- Para 320/390/480px, o teste verifica disposição em grelha e botões de O Curioso com altura >=44px e sem ultrapassar os limites horizontais do viewport.
- Commit: `1f20e8b65ef4d1394ee6c424ba941648154b03f2`.
- Limitação: este ambiente não conseguiu aceder ao GitHub por rede no terminal, pelo que não foi possível clonar o repositório e executar a suite npm localmente. Não há resultados novos de testes para reportar.
- Próxima ação: verificar CI do commit, executar testes Node/Chromium/WebKit, corrigir falhas, validar visualmente em dispositivos físicos.
