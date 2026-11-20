# Retomar execução

- Repositório `humildadever/humildadeverstudio-site`
- Branch `dev/v31-evolucao-total`
- Base da sessão `3d7ff55`
- Revisão funcional testada `4067139`

1. Obter o HEAD remoto e ler [ROADMAP.md](ROADMAP.md), [PROGRESSO.md](PROGRESSO.md), [CHANGELOG.md](CHANGELOG.md), [TESTES.md](TESTES.md), [PENDENCIAS.md](PENDENCIAS.md), [ARQUITETURA.md](ARQUITETURA.md) e [DEPLOY.md](DEPLOY.md).
2. Consultar a [execução 44738559962](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44738559962) para a galeria offline PT/EN, o percurso HTTPS móvel e a Oficina Web. Distinguir a revisão funcional validada dos commits posteriores de documentação.
3. Validar Android e iPhone físicos numa origem de pré-produção. Procurar um clipe aprovado de jogabilidade. A galeria e o novo kit estão no portal PT/EN e a Academia já tem a Oficina Web.
4. Resolver os blocos de comunidade, loja e administração quando os serviços estiverem configurados. Os contratos e as regras de autorização descritos no projeto orientam a integração.
5. Preservar `app-ads.txt`, `CNAME`, os ficheiros legais e a separação entre projetos. A revisão de produção exige autorização.
6. Guardar os próximos commits na branch, verificar o CI e atualizar este ponto de retoma antes de fechar a sessão.

## Verificação de continuidade — 20 de novembro de 2026

- Foram relidos os oito documentos de controlo diretamente na branch remota.
- A execução [44732462985](https://github.com/humildadever/humildadeverstudio-site/actions/runs/44732462985) foi consultada através dos jobs GitHub Actions: `verify (chromium)` e `verify (webkit)` concluíram ambos com `success`; `npm ci`, `npm test` e `npm run test:browser` concluíram com sucesso em ambos os jobs.
- Estes resultados correspondem à revisão funcional anteriormente documentada, **não** a uma nova execução do CI para este checkpoint.
- O roadmap continua a indicar 0/10 versões V31–V40 integralmente encerradas. Não avançar para V41–V50 antes das validações em falta.
- Não foi possível executar ensaios em dispositivos físicos ou numa origem de pré-produção externa nesta sessão. Permanecem pendentes acessibilidade manual, desempenho real, vídeo de jogabilidade aprovado e decisões sobre serviços de identidade e pagamentos.
- Este checkpoint é exclusivamente documental: não altera código de produção, ficheiros técnicos, DNS, domínio, pagamentos ou os repositórios Android/Universe.

A entrada da Academia fica em `academia-cursos.html`. O percurso Web inclui feedback, progresso local e um projeto exportável com temporizador e reinício.

A entrada da Academia resume a validação dos três percursos com os dados locais existentes. O card Web também permite retomar um rascunho antes de concluir o primeiro desafio.
