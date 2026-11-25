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

## Autopiloto V5.0 — primeira execução solicitada, 23-11-2026
- Prioridade P0: reforço da verificação de responsividade do hero O Curioso.
- Alteração: `tests/browser.test.cjs` agora confirma também que os botões móveis estão empilhados, sem sobreposição vertical, a 320/390/480px.
- Commit: `d8ce90a19ddd2ebbdab9dea3ed532b5b0ce12ce5`.
- Estado: teste acrescentado, execução Node/Chromium/WebKit **não confirmada** nesta execução.
- Próximo passo: executar a suite no ambiente de CI, corrigir falhas e validar o layout em Android/iPhone.
- Preservados: `main`, `app-ads.txt`, `CNAME` e produção.

## Autopiloto V5.0 — continuação, 23-11-2026
- P0: reforçada a asserção do layout móvel de O Curioso em `tests/browser.test.cjs`.
- Agora verifica `display:grid`, exatamente uma coluna calculada e largura dos botões limitada ao contentor, além das verificações de altura, viewport e sobreposição.
- Commit funcional confirmado: `c6d3a9f65229576ffd6c8477fbdfcc91cbeb55ad`.
- Testes Node/Chromium/WebKit: **não executados nesta intervenção**; não há aprovação nova a reportar.
- Próxima prioridade: confirmar CI da revisão e corrigir falhas antes de avançar para P1.
- Produção, `main`, `app-ads.txt` e `CNAME` não alterados.


## V7.0 — auditoria SEO internacional, 25-11-2026
- Corrigido `scripts/seo-audit.cjs` para ler atributos de metadados independentemente da sua ordem, identificar descrições e verificar a origem das URLs canónicas e `hreflang`.
- Commit funcional: `6c7fa5bcb8d9e70eaca8d77214c007c3932c561e`.
- Testes: não executados nesta intervenção; não afirmar CI aprovado.
- Produção, `main`, `app-ads.txt` e `CNAME` não alterados.
- Próximo passo: executar auditoria e testes Node/Chromium/WebKit; corrigir problemas identificados e confirmar CI antes de avançar para tradução internacional.

## V7.0 — testes SEO integrados, 25-11-2026
- Criado `tests/seo-audit.test.cjs` para validar JSON, contagens e cobertura de páginas do auditor SEO. Commit `52669e44c851bf2ee465ee9f81c9606145140f57`.
- Adicionados `npm run audit:seo` e inclusão do novo teste em `npm test`. Commit `e3b8364b58f7c5bbab3879a3f21843b1bd07e2b5`.
- Tentativa de execução local bloqueada: ambiente sem resolução DNS para github.com, impossível clonar o repositório; testes NÃO executados nem aprovados nesta intervenção.
- Próxima prioridade: verificar GitHub Actions no HEAD atual, executar `npm ci`, `npm test`, `npm run test:browser` e `npm run audit:seo` em ambiente com acesso ao código; corrigir falhas e inspecionar problemas SEO reportados.
- `main`, produção, `app-ads.txt` e `CNAME` preservados.

## V7.0 — internacionalização SEO, 25-11-2026
- GitHub Actions `45691056847` para `4ea7807921767f1675bdf0dd8ba39be5fd7f3369`: **sucesso confirmado** em Chromium e WebKit, incluindo `npm ci`, `npm test` e `npm run test:browser` em ambos.
- Adicionado `hreflang="x-default"` nas páginas PT/EN de O Curioso e Notícias, com fallback PT: commits `3d0ea128`, `2d99db1a`, `0670beac`, `65da3738`.
- Os commits novos requerem CI próprio; não afirmar que já passaram. `npm run audit:seo` ainda não foi executado como passo independente.
- Próximo passo: confirmar CI do HEAD atual, melhorar o sitemap com alternates consistentes e validar em dispositivos físicos. Sem publicação em produção; `main`, `CNAME`, `app-ads.txt` preservados.

## V7.0 — sitemap multilíngue, 25-11-2026
- `sitemap.xml` atualizado com namespace XHTML e alternates recíprocos `pt-PT`, `en` e `x-default` para as quatro páginas de O Curioso e Notícias. Commit `99855c4c0d21d034fae91fc956a9491ad4c97c97`.
- Aguardar CI específico do novo HEAD; resultados de sucesso anteriores não validam este commit.
- Próxima prioridade: verificar Actions do HEAD e corrigir quaisquer falhas; depois auditar alternates e SEO da homepage.

## V7.0 — testes de internacionalização, 25-11-2026
- CI de `40c5e1a362e0679a0b5fa14480fbb263aacfce46` concluído com sucesso no GitHub Actions (`45692027560`).
- Acrescentados testes para alternates recíprocos PT/EN/x-default nas páginas O Curioso e Notícias e respetivo sitemap. Commits `43156959cc01248ff1d92fbfeb6f8ddee6ea9e60` e correção `1131680e6f2e08e8c25b33ec614ec965d8bc402b`.
- CI dos novos testes ainda pendente no momento deste registo. Não afirmar aprovação até verificar.
- Próxima prioridade: verificar o CI do HEAD e corrigir eventuais falhas; executar `npm run audit:seo` para identificar páginas com metadados incompletos. Não publicar em produção.

## V7.0 — CI com auditoria SEO, 25-11-2026
- GitHub Actions `45694011874` do commit `e757c50aabc61774b652e57852233d58031b5011`: sucesso confirmado; revisão intermédia `43156959` falhou e correção posterior `1131680` passou.
- `.github/workflows/site-checks.yml`: adicionado passo `npm run audit:seo` nos jobs Chromium e WebKit, guardando relatório JSON temporário e validando a estrutura. Commit `a36e77e29789718b2e8351138fd2601ea5da1af7`.
- Próximo passo: verificar resultado CI deste commit; avaliar contagem de problemas SEO e corrigir páginas por prioridade. Sem alterar produção, main, CNAME ou app-ads.txt.

## V7.0 — correção CI auditoria SEO, 25-11-2026
- Inspecionados logs do GitHub Actions `45699010764`: `npm test` passou 17/17, mas o passo SEO falhou porque o comando `npm run audit:seo` redirecionava também o cabeçalho npm para o JSON, causando `SyntaxError: Unexpected token '>'`.
- Corrigido workflow para `node scripts/seo-audit.cjs > /tmp/humildadever-seo-audit.json`, evitando o cabeçalho npm. Commit `39f0757dc82215afadbe290dd757d8b6323ef7b8`.
- Pendente confirmar novo CI e execução de testes de navegador; não afirmar sucesso até conclusão. Manter produção/main/CNAME/app-ads.txt intactos.
