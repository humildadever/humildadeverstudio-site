# Humildadever Studio — site oficial

Site estático de https://humildadeverstudio.com em 16 línguas: português (Portugal e Brasil), inglês, espanhol, francês, alemão, italiano, neerlandês, polaco, turco, indonésio, japonês, coreano, chinês tradicional, hindi e árabe.

## Estrutura

| Pasta ou ficheiro | Para que serve |
|---|---|
| `index.html` | Página em português de Portugal (raiz do site) |
| `en/`, `es/`, `pt-br/`, `fr/`… | Uma pasta por língua, cada uma com o seu `index.html` |
| `i18n/<língua>.json` | Todos os textos de cada língua |
| `content/legal/` | Textos da privacidade e dos termos (PT + EN) |
| `jogo-privacidade.html`, `jogo-termos.html`, `privacidade.html` | Páginas legais. **O endereço não pode mudar: está na Play Store.** |
| `app-ads.txt`, `robots.txt`, `CNAME` | Ficheiros técnicos. **Não alterar.** |
| `assets/site/` | Estilo, script, fontes, imagens e vídeo do site novo |
| `academia*.html`, `universe.html` | Academia e Universe (em português, sem alterações) |
| `scripts/build.py` | Gera todas as páginas a partir dos textos |

## Mudar um texto

1. Edita o ficheiro da língua em `i18n/` (por exemplo `i18n/en.json`).
2. Corre `python3 scripts/build.py`.
3. Corre `npm test` para confirmar ligações, línguas e ficheiros técnicos.

## Acrescentar uma língua

1. Copia `i18n/en.json` para `i18n/<código>.json` e traduz.
2. Acrescenta uma linha à lista `LANGS` em `scripts/build.py`.
3. Corre `python3 scripts/build.py` e `npm test`.

## Ver no computador

```sh
python3 -m http.server 8080
```

Abre http://localhost:8080/.

As páginas antigas (`index-en.html`, `o-curioso.html`, `novidades.html`, `apps.html` e as versões `-en`) encaminham para as novas, para não haver ligações partidas.
