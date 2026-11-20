# Arquitetura

O website é estático. A página inicial usa `assets/home.css`, a camada de apresentação `assets/v31-premium.css` e o JavaScript de navegação e preferências `assets/v31-premium.js`. As restantes páginas partilham `assets/portal.css`.

- O Curioso tem páginas canónicas em português e inglês, com ilustrações conceptuais e uma galeria de imagens da ficha oficial. As capturas são WebP com carregamento diferido.
- O catálogo usa `assets/catalogo.js` para pesquisa e filtros, com favoritos guardados no dispositivo. O Universe tem uma página informativa. O código dos projetos Android e Universe fica nos respetivos repositórios.
- A Academia partilha `assets/academia.js` pelos cursos Python e SQL. Cada curso declara as respostas e a sua chave de progresso. A correção e os resultados ficam no navegador.
- A política CSP é declarada por página e restringe os recursos à origem do site. A página inicial permite também imagens do contador existente em `hits.sh`. O alojamento terá de fornecer diretivas que exigem cabeçalhos HTTP, como `frame-ancestors`. A política HTML foi aplicada à página inicial, portais e página offline. As páginas legais conservam a versão em uso.
- O service worker regista-se após o carregamento inicial. A cache versionada inclui páginas públicas e imagens responsivas selecionadas. As capturas da ficha Google Play, o vídeo, o kit, APIs e ficheiros técnicos são pedidos à rede.
- O pipeline testa a branch em Chromium e WebKit com um servidor HTTP efémero para cada execução. A proposta de serviços de identidade, dados e administração encontra-se no [contrato de API](COMUNIDADE-API.md).

A Oficina Web guarda o rascunho no navegador e usa uma página interna num iframe com `sandbox="allow-scripts"` para executar a pré-visualização. A página de execução aceita mensagens do seu documento pai na origem do site e adota uma política de recursos sem ligações externas para os exemplos.
