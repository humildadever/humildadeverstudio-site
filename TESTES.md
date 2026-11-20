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

## Galeria, kit de imprensa e Oficina Web

Revisão funcional `3aabb06`. [GitHub Actions 44723170777](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44723170777).

- Node passou 10/10 verificações. O ZIP passou no teste de integridade e a cópia servida pelo GitHub correspondeu byte a byte ao ficheiro verificado.
- O Chromium passou 10/10 e o WebKit passou 9/9, incluindo o percurso HTTPS móvel e a oficina.
- A ficha oficial da Google Play respondeu com HTTP 200. O MP4 promocional passou a descodificação integral com FFmpeg.
- O conjunto de testes Playwright usa uma origem HTTPS efémera para abrir a página inicial, tocar na ligação do jogo, carregar a galeria, ler o kit ZIP e confirmar o URL de destino da Google Play. A resposta da loja é simulada neste percurso para manter o teste independente da rede.
- A Oficina Web foi testada com o exemplo, alteração da pontuação, persistência após recarregar e exportação do HTML.
- Continuam pendentes a reprodução do vídeo, a instalação nativa da PWA e a revisão com leitores de ecrã em Android e iPhone físicos.

Na revisão `07e13f5`, o Node passou 11/11 verificações, incluindo a verificação do hash CSP. A revisão manual em Chrome encontrou o quadro vazio na pré-visualização e confirmou que a correção apresenta o minijogo e incrementa o contador.

A [execução 44724379855](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44724379855) confirmou Node 11/11, Chromium 10/10 e WebKit 9/9 para essa revisão. Num ecrã de 390 × 844, a página inicial transferiu 189 481 bytes e o portal 166 479 bytes em recursos locais.

## Academia e Oficina Web guiada

A revisão `d088226` passou em Node, Chromium e WebKit na [execução 44731629574](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44731629574). Os testes abrangem a entrada da Academia offline, feedback e validação dos três desafios, conservação do progresso, exportação, fim do tempo e reinício do projeto final. A verificação móvel em HTTPS inclui abrir a imagem original na galeria e seguir o destino da Google Play em perfis emulados.

A confirmação manual em Chrome validou a navegação até à Oficina e a recuperação do progresso dos três desafios. Os ensaios com dispositivos físicos e a gravação aprovada de jogabilidade continuam pendentes.

## Retoma dos percursos da Academia

A revisão `e3879f3` passou em [Node, Chromium e WebKit](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44732462985). O teste local cobre pontuações inválidas, desafios repetidos e rascunhos existentes. No teste offline, o aluno termina o questionário de SQL, regressa à página dos cursos, vê o progresso atualizado e usa «Rever SQL» para abrir o questionário.

## Galeria offline de O Curioso

Na revisão `4067139`, [Chromium e WebKit](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44738559962) abriram a galeria offline em português e inglês. O teste confirmou a imagem reduzida de 320 px, a mensagem no respetivo idioma, a navegação com as setas e o regresso do foco à miniatura com Escape. Em pré-produção HTTPS, o teste em ecrã móvel confirmou a abertura da imagem original e a continuação para a Google Play. Os testes locais passaram 12/12.

## Catálogo partilhável e galeria tátil

A revisão `9dedbc0` passou 13/13 nos testes locais. Estes verificam a pesquisa por vários termos, o restauro de filtros, a rejeição de valores desconhecidos e a limpeza da pesquisa. O teste de navegação abre offline uma ligação filtrada para a Academia, confirma o endereço no campo de partilha e segue para os percursos. Em pré-produção HTTPS, o teste simula gestos horizontais, verifica a posição da captura e abre o original. Consulta os resultados de Chromium e WebKit no [GitHub Actions](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44783849610).
