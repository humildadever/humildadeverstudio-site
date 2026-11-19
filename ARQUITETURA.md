# Arquitetura

Site estático existente com HTML, CSS, JavaScript e assets. V31 adiciona assets/v31-premium.css e assets/v31-premium.js ligados em index.html. Preferências de apresentação guardadas localmente sem simular autenticação. Aplicações Android e Universe mantêm repositórios independentes.

## Páginas públicas

`index.html` mantém os conteúdos e as âncoras históricas. `o-curioso.html` e `o-curioso-en.html` são as páginas canónicas do jogo em português e inglês. `apps.html`, `novidades.html` e `academia.html` usam `assets/portal.css`. Pesquisa, favoritos e progresso de Python decorrem no navegador com dados locais. O contrato do futuro backend está em [COMUNIDADE-API.md](COMUNIDADE-API.md).

`manifest.webmanifest` e `sw.js` disponibilizam navegação offline parcial. O service worker tenta primeiro a rede e usa uma lista fixa de páginas e recursos públicos como reserva. Vídeo, ZIP de imprensa, contador externo, API, CNAME e app-ads.txt ficam fora da cache. Os dados pessoais e comerciais exigem serviços autorizados.
