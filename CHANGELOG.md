# Changelog

## V31 — em desenvolvimento
- Adicionada camada CSS progressiva, sem substituir os estilos anteriores.
- Adicionados botões de tema claro/escuro e redução de movimento, com preferência local.
- Adicionada ligação de salto para conteúdo e melhoria de foco de teclado.
- Alterações isoladas numa branch; sem publicação.

## 19 de novembro de 2026

- V31 — substituído o destaque baseado no cartaz por um cabeçalho com texto real e arte existente. O cartaz interativo continua disponível na área de Estúdio. O modo claro tem títulos e avisos legíveis. A navegação móvel mantém foco, fecha com Escape e respeita a preferência de redução de movimento do sistema.
- V32 — portal PT/EN com seis mundos expansíveis, material promocional identificado, contactos e kit histórico de imprensa.
- V33 — catálogo de projetos com pesquisa, categoria, estado e favoritos locais.
- V34/V36 — contrato de API da comunidade e registo da integração da compra Android.
- V35 — páginas de novidades, diário e imprensa, com metadados sociais e ligações ao portal.
- V37 — três lições de Python, exercícios, projeto prático e questionário com melhor resultado local.
- V40 — sitemap expandido, testes em Node e Chromium, CI sem deploy e suporte offline parcial por manifesto e service worker.
- CI — corrigidos excesso de largura em ecrãs estreitos, controlo do primeiro separador offline e contraste dos links sociais no modo claro. Chromium e axe passaram na revisão funcional.

## 20 de novembro de 2026
- V31 — aumentada a área mínima de interação dos elementos `summary` dos portais para 44 px e adicionada preferência CSS `prefers-reduced-motion` para animações, transições e deslocação suave. Alteração isolada em `assets/portal.css`, sem deploy.

### Continuação da Operação Evolução Total

- V31 — foco preservado quando a navegação muda de formato, contraste do foco em tema claro e alvos táteis maiores no cartaz e questionários.
- V32 — cinco imagens da ficha oficial, guia e chefes detalhados, notas de lançamento verificáveis e correção de largura da galeria para tablets.
- V33 — filtro por plataforma e página dedicada ao Universe.
- V34/V36 — canais de comunidade com disponibilidade explícita e FAQ PT/EN para a compra de remoção de anúncios no Android.
- V35 — edição em inglês das notícias, com ligação de idioma, metadados sociais e sitemap atualizado.
- V37 — curso prático de SQL com três lições, exercícios, classificação de torneio e questionário com progresso independente de Python.
- V39 — política CSP no HTML e verificação no navegador de que os percursos do site funcionam sob a política.
- V40 — versões WebP mais leves para ecrãs estreitos, registo offline adiado até ao carregamento e CI em Chromium e WebKit.

### Portal, imprensa e Oficina Web

- Galeria PT/EN logo após a apresentação de O Curioso. As miniaturas carregam versões leves e abrem as capturas originais.
- Novo kit de imprensa com ficha bilingue, logótipo e imagens da ficha da Google Play.
- Oficina Web com três desafios, editor, pré-visualização, rascunho local e exportação de HTML.
- Teste em pré-produção HTTPS temporária para o percurso até à Google Play, com perfis móveis dos dois motores de navegador.
- A inicialização da oficina foi corrigida na revisão manual de Chrome. O quadro carrega o script inicial a partir do HTML, com hash CSP verificado no Node.

### Academia Humildadever

- Nova página de entrada para os percursos Web, Python e SQL, com ligações a partir do início e das páginas dos cursos.
- A Oficina Web ganhou feedback para os três desafios, progresso local e um projeto final com pontuação, temporizador, reinício e exportação HTML.
- A verificação móvel em HTTPS passou a incluir a abertura da captura original do tutorial.

- A página da Academia lê os resultados guardados dos percursos Web, Python e SQL. Cada cartão apresenta a validação ou a melhor nota do questionário, com uma ligação para iniciar, retomar ou rever.

- O portal de O Curioso abre as capturas num visualizador em português e inglês. As miniaturas ficam disponíveis offline e o visualizador indica quando usa a imagem reduzida.

- O catálogo aceita pesquisas com várias palavras e conserva os filtros em ligações partilháveis. A Academia passou a estar no catálogo e O Curioso tem acesso direto à Google Play.
- O visualizador de capturas indica a posição na galeria e responde a gestos horizontais em ecrãs táteis.
