# Testes da Operação Evolução Total

## Resultados confirmados em 19 de novembro de 2026

| Verificação | Resultado |
| --- | --- |
| Sintaxe HTML, CSS e JavaScript | Passou em todas as páginas e ficheiros JS/CSS do site |
| Ligações e recursos locais | Passou, incluindo âncoras, imagens, vídeo e kit de imprensa |
| Navegação, foco e preferências | Passou nos testes Node e Chromium |
| Catálogo | Passou pesquisa sem acentos, filtros combinados e favoritos persistidos localmente |
| Academia | Passou questionário, validação de respostas e persistência. Exemplos Python executados, projeto validado com três combinações |
| PWA | Passou teste de exclusão da cache técnica e navegação offline em Chromium |
| Acessibilidade automática | Axe passou nas seis páginas novas/renovadas, incluindo a página inicial em ambos os temas. O primeiro resultado detetou dois links sociais com contraste insuficiente em modo claro. A correção foi confirmada em `75fced5` |
| Responsividade | Passou em Chromium com 320, 390, 768 e 1366 px |
| Regressões de largura | CI detetou problemas no contacto e no cabeçalho de Estúdio. Corrigidos e testados em `41345f0` |
| App-ads e CNAME | Confirmados na raiz e idênticos à base da branch. A cópia pública de app-ads devolveu HTTP 200 e é idêntica byte a byte |
| DNS e HTTPS | Resolução pública dos registos A com estado 0 e pedido HTTPS validado com status 200 |
| Kit de imprensa e recursos preservados | ZIP passou o teste de integridade. ZIP e páginas legais sem alterações |
| Dependências | `npm audit` não reportou vulnerabilidades nas dependências de desenvolvimento verificadas |
| Peso dos recursos | Logótipo de navegação de 1 777 644 para 17 980 bytes. A arte de destaque WebP pesa 105 830 bytes. A medição do carregamento completo está pendente |
| Google Play | A ligação existente devolveu HTTP 200 |

- Suíte Node: 10/10 verificações passaram.
- [Execução Chromium e axe que confirmou as correções de largura, offline e contraste](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44639887589).
- O Chromium do ambiente local não iniciou devido a uma restrição a sockets Unix. A validação foi executada pelo GitHub Actions.

## Por validar

- Instalação como PWA e reprodução do vídeo em dispositivos físicos Android e iPhone.
- Testes manuais com leitores de ecrã e revisão completa de acessibilidade.
- Lighthouse ou medição equivalente de desempenho em pré-produção.
- Ligação direta a todos os serviços externos, o que inclui disponibilidade regional das redes sociais.
- Segurança de contas, pagamentos, MFA, CSRF e administração quando houver backend configurado.

## Resultados de 20 de novembro de 2026

| Verificação | Resultado |
| --- | --- |
| Revisão funcional | `ba1e34a` em [GitHub Actions 44720027652](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44720027652) |
| Node | 10/10 em cada job. HTML, CSS, JS, destinos internos, catálogo, questionários, fichas técnicas e limites da cache |
| Chromium | 8/8 na contagem de testes do Node, incluindo o teste principal |
| WebKit | 7/7 na contagem de testes do Node, incluindo o teste principal |
| Larguras | 320, 390, 768 e 1366 px em nove páginas. A galeria inicialmente alargava a página em WebKit a 768 px. A execução acima confirma a correção |
| Operação por teclado e preferências | Salto para conteúdo, Escape, foco ao mudar de largura, modo claro e redução do movimento |
| Acessibilidade automática | Axe em nove páginas, incluindo o início nos dois temas, sem violações na execução |
| Modo offline | Navegação para Python e SQL, correção do quiz, conservação do resultado, notícias PT/EN e página de fallback |
| SQLite | Cinco verificações executadas com `sqlite3` em memória. Filtro, ordenação com desempate, agrupamento, classificação e exclusão de participante com uma só ronda |
| Peso inicial | 189 481 bytes no início e 147 727 bytes no portal de O Curioso. Ecrã de 390 × 844 com DPR 1, cache desativada por interceção Playwright, sem service worker e servidor de teste sem compressão. Nenhum pedido inicial ao MP4 ou ao kit ZIP |
| CSP | Nenhuma violação observada nos percursos de navegação da suíte de navegador nas nove páginas testadas |
| Dependências | `npm audit --audit-level=moderate` reportou zero vulnerabilidades |
| Produção pública | Página principal e `/app-ads.txt` devolveram HTTP 200 sobre HTTPS. O ficheiro público é idêntico ao da branch. Consulta pública de DNS devolveu quatro registos A com estado 0 |
| Preservação | `app-ads.txt`, `CNAME`, páginas legais e kit ZIP iguais a `3d7ff55`. O kit passou o teste de integridade |
| Fonte de capturas e notas | Ficha oficial consultada a 20 de novembro de 2026 e imagens verificadas visualmente. A ficha regista 5 de novembro de 2026 como data da atualização. [Google Play](https://play.google.com/store/apps/details?id=com.humildadever.ocurioso) |

As medições de peso são de laboratório. Continuam por verificar os tempos em rede móvel, os dispositivos físicos, os leitores de ecrã, a instalação da PWA e os cabeçalhos da futura pré-produção. O Chromium local foi bloqueado por uma restrição de sockets Unix. Os resultados de navegador acima são do GitHub Actions.
