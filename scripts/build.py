#!/usr/bin/env python3
"""Gera o site multilíngue da Humildadever Studio.

Uso:  python3 scripts/build.py
Textos: i18n/<código>.json (uma língua por ficheiro).
Páginas legais: content/legal/*.html (mantêm o mesmo endereço).
Para acrescentar uma língua: criar i18n/<código>.json e uma linha em LANGS.
"""
import html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://humildadeverstudio.com/'
PLAY = 'https://play.google.com/store/apps/details?id=com.humildadever.ocurioso'
EMAIL = 'humildadeverstudio@gmail.com'
YOUTUBE = 'https://www.youtube.com/@humildadeverstudio'
TIKTOK = 'https://www.tiktok.com/@humildadeverstudio'

# código, pasta, hreflang, nome nativo, nome em inglês, og:locale, direção
LANGS = [
    ('pt',    '',       'pt-PT',   'Português (Portugal)', 'Portuguese (Portugal)', 'pt_PT', 'ltr'),
    ('en',    'en/',    'en',      'English',              'English',               'en_US', 'ltr'),
    ('es',    'es/',    'es',      'Español',              'Spanish',               'es_ES', 'ltr'),
    ('pt-br', 'pt-br/', 'pt-BR',   'Português (Brasil)',   'Portuguese (Brazil)',   'pt_BR', 'ltr'),
    ('fr',    'fr/',    'fr',      'Français',             'French',                'fr_FR', 'ltr'),
    ('de',    'de/',    'de',      'Deutsch',              'German',                'de_DE', 'ltr'),
    ('it',    'it/',    'it',      'Italiano',             'Italian',               'it_IT', 'ltr'),
    ('nl',    'nl/',    'nl',      'Nederlands',           'Dutch',                 'nl_NL', 'ltr'),
    ('pl',    'pl/',    'pl',      'Polski',               'Polish',                'pl_PL', 'ltr'),
    ('tr',    'tr/',    'tr',      'Türkçe',               'Turkish',               'tr_TR', 'ltr'),
    ('id',    'id/',    'id',      'Bahasa Indonesia',     'Indonesian',            'id_ID', 'ltr'),
    ('ja',    'ja/',    'ja',      '日本語',                'Japanese',              'ja_JP', 'ltr'),
    ('ko',    'ko/',    'ko',      '한국어',                'Korean',                'ko_KR', 'ltr'),
    ('zh-tw', 'zh-tw/', 'zh-TW',   '繁體中文',              'Chinese (Traditional)', 'zh_TW', 'ltr'),
    ('hi',    'hi/',    'hi',      'हिन्दी',                 'Hindi',                 'hi_IN', 'ltr'),
    ('ar',    'ar/',    'ar',      'العربية',               'Arabic',                'ar_AR', 'rtl'),
]
DEFAULT = 'en'  # x-default

# Páginas antigas que agora encaminham para a nova estrutura.
REDIRECTS = {
    'index-en.html': 'en/',
    'o-curioso.html': './',
    'o-curioso-en.html': 'en/',
    'novidades.html': './#news',
    'novidades-en.html': 'en/#news',
    'apps.html': './#studio',
}

GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/></svg>'
PLAYICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>'
VIDEOICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path fill="currentColor" stroke="none" d="M10 8.5v7l6-3.5z"/></svg>'

e = lambda s: html.escape(str(s), quote=True)


def load(code):
    with open(os.path.join(ROOT, 'i18n', code + '.json'), encoding='utf-8') as f:
        return json.load(f)


def url_of(folder):
    return SITE + folder


def alternates(current_folder_for=None):
    out = []
    for code, folder, hl, *_ in LANGS:
        out.append(f'<link rel="alternate" hreflang="{hl}" href="{url_of(folder)}">')
    d = next(l for l in LANGS if l[0] == DEFAULT)
    out.append(f'<link rel="alternate" hreflang="x-default" href="{url_of(d[1])}">')
    return ''.join(out)


def head(t, lang, prefix, canonical, title, desc, extra=''):
    code, folder, hl, native, english, locale, direction = lang
    csp = ("default-src 'self'; img-src 'self' data:; media-src 'self'; script-src 'self'; style-src 'self'; "
           "font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'")
    return f'''<!doctype html>
<html lang="{hl}" dir="{direction}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="{csp}">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canonical}">
{extra}<meta name="theme-color" content="#08142b">
<meta property="og:site_name" content="Humildadever Studio">
<meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}assets/site/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="{locale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="{prefix}assets/site/favicon-32.png">
<link rel="apple-touch-icon" href="{prefix}assets/site/apple-touch-icon.png">
<link rel="manifest" href="{prefix}manifest.webmanifest">
<link rel="preload" href="{prefix}assets/site/fonts/figtree-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{prefix}assets/site/fonts/fredoka-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{prefix}assets/site/site.css">
<script src="{prefix}assets/site/site.js" defer></script>
'''


def topbar(t, lang, prefix, home_href, anchors=True):
    code = lang[0]
    nav = ''
    if anchors:
        nav = (f'<nav class="nav" aria-label="{e(t["nav_game"])}">'
               f'<a href="#game">{e(t["nav_game"])}</a><a href="#media">{e(t["nav_media"])}</a>'
               f'<a href="#worlds">{e(t["nav_worlds"])}</a><a href="#faq">{e(t["nav_faq"])}</a>'
               f'<a href="#contact">{e(t["nav_contact"])}</a></nav>')
    items = ''
    for c, folder, hl, native, english, *_ in LANGS:
        cur = ' aria-current="true"' if c == code else ''
        items += f'<a href="{prefix}{folder or "./"}" hreflang="{hl}" lang="{hl}"{cur}>{e(native)}<small lang="en">{e(english)}</small></a>'
    return f'''<a class="skip" href="#content">{e(t["skip"])}</a>
<header class="top"><div class="wrap">
<a class="brand" href="{home_href}"><img src="{prefix}assets/site/logo-96.webp" alt="" width="40" height="40"><span>HUMILDADEVER <b>STUDIO</b></span></a>
{nav}
<details class="lang"><summary aria-label="{e(t["lang_label"])}: {e(lang[3])}">{GLOBE}<span>{e(lang[3])}</span></summary><div class="lang-panel">{items}</div></details>
<a class="btn btn-play" href="{PLAY}" rel="noopener" target="_blank">{PLAYICON}<span>{e(t["play_short"])}</span></a>
</div></header>
'''


def footer(t, lang, prefix):
    code = lang[0]
    a = t['legal_anchor']
    langs = ''.join(f'<li><a href="{prefix}{folder or "./"}" hreflang="{hl}" lang="{hl}"{" aria-current=\"true\"" if c == code else ""}>{e(native)}</a></li>'
                    for c, folder, hl, native, *_ in LANGS)
    return f'''<footer class="foot"><div class="wrap">
<div class="foot-top"><a class="brand" href="{prefix}{lang[1] or './'}"><img src="{prefix}assets/site/logo-96.webp" alt="" width="40" height="40" loading="lazy"><span>HUMILDADEVER <b>STUDIO</b></span></a><p>{e(t["footer_tagline"])}</p></div>
<nav class="foot-links" aria-label="Legal"><a href="{prefix}jogo-privacidade.html{a}">{e(t["legal_game_privacy"])}</a><a href="{prefix}jogo-termos.html{a}">{e(t["legal_terms"])}</a><a href="{prefix}privacidade.html{a}">{e(t["legal_site_privacy"])}</a><a href="{YOUTUBE}" rel="noopener" target="_blank">YouTube</a><a href="{TIKTOK}" rel="noopener" target="_blank">TikTok</a></nav>
<div><h2>{e(t["footer_langs"])}</h2><ul class="foot-langs">{langs}</ul></div>
<p>© 2026 Humildadever Studio · Portugal</p>
</div></footer>
'''


def jsonld(t, lang):
    code, folder, hl, *_ = lang
    data = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'Organization', '@id': SITE + '#organization', 'name': 'Humildadever Studio', 'url': SITE,
             'logo': SITE + 'assets/logotipo-oficial.png', 'email': EMAIL, 'sameAs': [YOUTUBE, TIKTOK]},
            {'@type': 'WebPage', '@id': url_of(folder) + '#webpage', 'url': url_of(folder), 'name': t['meta_title'],
             'description': t['meta_desc'], 'inLanguage': hl, 'isPartOf': {'@id': SITE + '#website'}},
            {'@type': 'WebSite', '@id': SITE + '#website', 'url': SITE, 'name': 'Humildadever Studio',
             'publisher': {'@id': SITE + '#organization'}},
            {'@type': 'VideoGame', '@id': SITE + '#game', 'name': t['game_title'],
             'alternateName': ['O Curioso e o Reino das Gargalhadas', 'O Curioso and the Kingdom of Laughter'],
             'description': t['meta_desc'], 'url': url_of(folder), 'image': SITE + 'assets/site/og.jpg',
             'gamePlatform': 'Android', 'operatingSystem': 'Android 7.0+', 'applicationCategory': 'GameApplication',
             'genre': 'Platform game', 'inLanguage': ['pt', 'en'], 'isFamilyFriendly': True,
             'publisher': {'@id': SITE + '#organization'},
             'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR', 'url': PLAY}},
        ]}
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>\n'


def home(t, lang):
    code, folder, hl, native, english, locale, direction = lang
    prefix = '../' * folder.count('/')
    A = prefix + 'assets/'
    canonical = url_of(folder)
    pt_only = f' <span class="tag">{e(t["pt_only"])}</span>' if t['pt_only'] else ''

    out = head(t, lang, prefix, canonical, t['meta_title'], t['meta_desc'], alternates() + '\n')
    out += jsonld(t, lang) + '</head>\n<body>\n'
    out += topbar(t, lang, prefix, '#content')
    out += f'''<main id="content" tabindex="-1">
<section class="hero" aria-labelledby="title">
<picture class="hero-art"><source media="(max-width: 720px)" srcset="{A}site/hero-mobile-640.webp 640w, {A}site/hero-mobile-1080.webp 1080w" sizes="100vw"><img src="{A}site/hero-1920.webp" srcset="{A}site/hero-1280.webp 1280w, {A}site/hero-1920.webp 1920w" sizes="100vw" width="1920" height="1080" alt="" fetchpriority="high"></picture>
<div class="wrap"><div class="hero-copy">
<p class="eyebrow">{e(t["hero_eyebrow"])}</p>
<h1 id="title">{e(t["game_title"])}</h1>
<p class="hero-lead">{e(t["hero_lead"])}</p>
<div class="actions"><a class="btn btn-play" href="{PLAY}" rel="noopener" target="_blank">{PLAYICON}{e(t["btn_play"])}</a><a class="btn btn-ghost" href="#media">{VIDEOICON}{e(t["btn_trailer"])}</a></div>
<p class="hero-note">{e(t["hero_note"])}</p>
</div></div>
</section>
<div class="facts"><ul class="wrap"><li><b>200</b><span>{e(t["f_levels"])}</span></li><li><b>6</b><span>{e(t["f_worlds"])}</span></li><li><b>8</b><span>{e(t["f_minigames"])}</span></li><li><b>18</b><span>{e(t["f_achievements"])}</span></li></ul></div>

<section class="section" id="game"><div class="wrap">
<div class="story"><div class="story-text"><h2>{e(t["story_h"])}</h2><p>{e(t["story_p1"])}</p><p>{e(t["story_p2"])}</p></div>
<div><h3 class="fam-title" style="margin-top:0">{e(t["fam_h"])}</h3><ul class="fam">'''
    out = out.replace(' style="margin-top:0"', '')
    for title, text in t['fam']:
        out += f'<li><h3>{e(title)}</h3><p>{e(text)}</p></li>'
    out += f'''</ul></div></div>
</div></section>

<section class="section" id="media"><div class="wrap">
<div class="head"><h2>{e(t["media_h"])}</h2><p>{e(t["media_p"])}</p></div>
<div class="trailer"><video controls playsinline preload="none" poster="{A}site/trailer-poster.webp" aria-label="{e(t["video_label"])}" width="1280" height="720"><source src="{A}site/trailer.mp4" type="video/mp4"><a href="{A}site/trailer.mp4">{e(t["video_fallback"])}</a></video></div>
<ul class="shots">'''
    for i, n in enumerate([2, 1, 4, 3]):
        out += (f'<li><figure><a href="{A}captura-curioso-{n}.webp"><img src="{A}captura-curioso-{n}.webp" '
                f'srcset="{A}captura-curioso-{n}-320.webp 320w, {A}captura-curioso-{n}.webp 1280w" '
                f'sizes="(max-width: 980px) 50vw, 280px" width="1280" height="720" loading="lazy" decoding="async" '
                f'alt="{e(t["shots_alt"][i])}"></a><figcaption>{e(t["shots"][i])}</figcaption></figure></li>')
    out += f'''</ul>
</div></section>

<section class="section" id="worlds"><div class="wrap">
<div class="head"><h2>{e(t["worlds_h"])}</h2><p>{e(t["worlds_p"])}</p></div>
<ul class="worlds">'''
    for i, name in enumerate(t['worlds'], 1):
        out += (f'<li><img src="{A}site/mundo-0{i}-480.webp" srcset="{A}site/mundo-0{i}-480.webp 480w, {A}site/mundo-0{i}-960.webp 960w" '
                f'sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, 380px" width="960" height="640" loading="lazy" decoding="async" alt=""><span>{e(name)}</span></li>')
    out += f'''</ul>
</div></section>

<section class="section" id="faq"><div class="wrap">
<div class="head"><h2>{e(t["faq_h"])}</h2></div>
<div class="faq">'''
    for q, a in t['faq']:
        out += f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>'
    p = t['projects']
    out += f'''</div>
</div></section>

<section class="section" id="studio"><div class="wrap">
<div class="studio"><div class="studio-intro"><img src="{prefix}assets/logotipo-192.webp" alt="" width="96" height="96" loading="lazy"><h2>{e(t["studio_h"])}</h2><p>{e(t["studio_p"])}</p></div>
<div><h3 class="fam-title">{e(t["projects_h"])}</h3><ul class="cards">
<li><span class="meta">{e(p[0][1])}</span><h3>{e(p[0][0])}</h3><p>{e(p[0][2])}</p><a href="{PLAY}" rel="noopener" target="_blank">{e(p[0][3])}</a></li>
<li><span class="meta">{e(p[1][1])}</span><h3>{e(p[1][0])}{pt_only}</h3><p>{e(p[1][2])}</p><a href="{prefix}academia-cursos.html" hreflang="pt-PT">{e(p[1][3])}</a></li>
<li><span class="meta">{e(p[2][1])}</span><h3>{e(p[2][0])}{pt_only}</h3><p>{e(p[2][2])}</p><a href="{prefix}universe.html" hreflang="pt-PT">{e(p[2][3])}</a></li>
</ul>
<h3 class="fam-title" id="news">{e(t["news_h"])}</h3><ul class="news">'''
    for title, text in t['news']:
        out += f'<li><h3>{e(title)}</h3><p>{e(text)}</p></li>'
    out += f'''</ul></div></div>
</div></section>

<section class="section" id="contact"><div class="wrap duo">
<div class="panel"><h2>{e(t["press_h"])}</h2><p>{e(t["press_p"])}</p><p><a class="btn btn-line" href="{prefix}press-kit-curioso.zip">{e(t["press_btn"])}</a></p></div>
<div class="panel"><h2>{e(t["contact_h"])}</h2><p>{e(t["contact_p"])}</p>
<div class="mail"><code>{EMAIL}</code><button class="btn btn-line" type="button" data-copy="{EMAIL}" data-done="{e(t["copied"])}" aria-controls="copy-status-{code}">{e(t["copy_btn"])}</button></div>
<p class="status" id="copy-status-{code}" role="status"></p>
<div class="social"><a class="btn btn-line" href="{YOUTUBE}" rel="noopener" target="_blank">YouTube</a><a class="btn btn-line" href="{TIKTOK}" rel="noopener" target="_blank">TikTok</a></div></div>
</div></section>
</main>
'''
    out += footer(t, lang, prefix) + '</body>\n</html>\n'
    return out


def legal(t, lang, name):
    path = os.path.join(ROOT, 'content', 'legal', name + '.html')
    src = open(path, encoding='utf-8').read()
    title = re.search(r'<!-- title: (.*?) -->', src).group(1)
    desc = re.search(r'<!-- desc: (.*?) -->', src).group(1)
    body = re.sub(r'<!--.*?-->\n?', '', src, count=2)
    canonical = SITE + name + '.html'
    out = head(t, lang, '', canonical, html.unescape(title), html.unescape(desc))
    out += '</head>\n<body>\n' + topbar(t, lang, '', './', anchors=False)
    out += f'<main id="content" tabindex="-1" class="wrap doc">\n{body}</main>\n'
    out += footer(t, lang, '') + '</body>\n</html>\n'
    return out


def redirect(target):
    full = SITE + (target if target != './' else '')
    full = full.replace('/./', '/')
    return f'''<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0; url={target}"><meta name="robots" content="noindex">
<link rel="canonical" href="{full.split('#')[0]}"><title>Humildadever Studio</title></head>
<body><p><a href="{target}">Humildadever Studio</a></p></body></html>
'''


def sitemap():
    rows = []
    alt = ''.join(f'\n    <xhtml:link rel="alternate" hreflang="{hl}" href="{url_of(folder)}"/>' for _, folder, hl, *_ in LANGS)
    alt += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url_of(next(l[1] for l in LANGS if l[0] == DEFAULT))}"/>'
    for _, folder, *_ in LANGS:
        rows.append(f'  <url>\n    <loc>{url_of(folder)}</loc>{alt}\n  </url>')
    for page in ['jogo-privacidade.html', 'jogo-termos.html', 'privacidade.html', 'academia-cursos.html',
                 'academia.html', 'academia-sql.html', 'academia-web.html', 'universe.html']:
        rows.append(f'  <url><loc>{SITE}{page}</loc></url>')
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + '\n'.join(rows) + '\n</urlset>\n')


REQUIRED = None


def main():
    global REQUIRED
    REQUIRED = set(load('pt').keys())
    written = []
    for lang in LANGS:
        t = load(lang[0])
        missing = REQUIRED - set(t)
        if missing:
            sys.exit(f'{lang[0]}: faltam textos {sorted(missing)}')
        for key in ('fam', 'shots', 'shots_alt', 'worlds', 'faq', 'projects', 'news'):
            if len(t[key]) != len(load('pt')[key]):
                sys.exit(f'{lang[0]}: "{key}" tem {len(t[key])} itens')
        folder = lang[1]
        os.makedirs(os.path.join(ROOT, folder), exist_ok=True)
        path = os.path.join(ROOT, folder, 'index.html')
        open(path, 'w', encoding='utf-8').write(home(t, lang))
        written.append(folder + 'index.html')
    pt = load('pt')
    for name in ('jogo-privacidade', 'jogo-termos', 'privacidade'):
        open(os.path.join(ROOT, name + '.html'), 'w', encoding='utf-8').write(legal(pt, LANGS[0], name))
        written.append(name + '.html')
    for old, target in REDIRECTS.items():
        open(os.path.join(ROOT, old), 'w', encoding='utf-8').write(redirect(target))
        written.append(old)
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write(sitemap())
    print(f'{len(written)} páginas geradas em {len(LANGS)} línguas.')


if __name__ == '__main__':
    main()
