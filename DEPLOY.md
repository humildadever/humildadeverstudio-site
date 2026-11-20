# Publicação segura

1. Rever diff da branch de desenvolvimento.
2. Confirmar que app-ads.txt contém a linha AdMob legítima e não foi alterado.
3. Confirmar CNAME=humildadeverstudio.com.
4. Validar HTML, CSS, JavaScript, acessibilidade, desempenho e links.
5. Testar em pré-produção.
6. Publicar apenas após revisão e autorização aplicável.
7. Verificar https://humildadeverstudio.com/app-ads.txt após publicação.

## Preparação da branch de desenvolvimento

- O workflow Site checks testa código e comportamento num servidor local temporário. A configuração não faz deploy.
- Gerar o ZIP a partir de um commit testado com `git archive --format=zip --prefix=humildadeverstudio-site/ -o HumildadeverStudio.zip COMMIT`.
- Confirmar que o artefacto inclui a raiz estática, `CNAME`, `app-ads.txt`, os recursos, as páginas legais, o README, o changelog e os resultados.
- Na pré-produção, servir a raiz do site em HTTPS, confirmar o âmbito do service worker, descarregar o kit de imprensa, tocar o vídeo e executar um percurso completo em Android e iPhone.
- Antes da publicação autorizada, comparar `app-ads.txt` e `CNAME` com a revisão em produção. Depois, verificar por HTTPS que `/app-ads.txt` tem estado 200 e corresponde exatamente ao ficheiro validado.
- Ao alterar a lista de recursos offline ou preparar uma nova revisão para publicação, atualizar a versão da cache em `sw.js` e repetir o teste offline.

## Validação da candidata

- Usar o commit funcional aprovado em Chromium e WebKit. Abrir a revisão em localhost ou numa origem HTTPS isolada de produção. Confirmar os percursos PT/EN, a galeria, o modo offline e o acesso aos ficheiros técnicos.
- As medições CI usam um servidor sem compressão e um ecrã de 390 × 844. Medir carregamento real e instalação numa origem de pré-produção com os cabeçalhos e a compressão do alojamento selecionado.
- Confirmar os cabeçalhos HTTP apropriados nessa origem, incluindo uma decisão sobre `frame-ancestors`, que a política CSP declarada em HTML não consegue aplicar.
- Verificar a integridade do ZIP e comparar `app-ads.txt`, `CNAME`, páginas legais e o kit histórico com o ponto de partida antes de aprovar a publicação.
