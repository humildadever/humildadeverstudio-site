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
