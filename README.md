# Humildadever Studio

Código-fonte do website oficial da Humildadever Studio. O projeto reúne o portal de O Curioso, o catálogo de aplicações, as novidades e a Academia. A aplicação Android e o Humildadever Universe têm repositórios próprios.

## Testar localmente

Com Python 3, serve a raiz do checkout em HTTP.

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Abre [http://127.0.0.1:8080/](http://127.0.0.1:8080/). Os recursos públicos são estáticos. Para executar o conjunto de testes, usa Node.js 22 ou posterior.

```sh
npm ci
npm test
npx playwright install chromium webkit
npm run test:browser
SITE_TEST_BROWSER=webkit npm run test:browser
```

Na Academia, [Python](academia.html) e [SQL](academia-sql.html) têm lições e questionários independentes.

O GitHub Actions executa os testes da branch de desenvolvimento. Consulta [TESTES.md](TESTES.md) para resultados, [RETOMAR.md](RETOMAR.md) para continuidade e [DEPLOY.md](DEPLOY.md) para a revisão de publicação.
