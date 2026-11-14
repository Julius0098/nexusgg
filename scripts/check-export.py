"""Check internal anchors, assets, and optionally SEO in a static export."""
import argparse
import json
import os
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = set()
        self.canonicals = []
        self.metadata = {}
        self.headings = []
        self.titles = []
        self.structured_data = []
        self.capture = None
        self.chunks = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {'h1', 'h2', 'h3'}:
            self.headings.append(int(tag[1]))
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        if tag == 'meta':
            key = attrs.get('name') or attrs.get('property')
            if key:
                self.metadata.setdefault(key, []).append(attrs.get('content'))
        if tag == 'title' or (tag == 'script' and attrs.get('type') == 'application/ld+json'):
            self.capture = tag
            self.chunks = []
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag in {'a', 'link', 'img', 'script'}:
            link = attrs.get('href') or attrs.get('src')
            if link:
                self.links.add(link)

    def handle_data(self, data):
        if self.capture:
            self.chunks.append(data)

    def handle_endtag(self, tag):
        if tag == self.capture:
            content = ''.join(self.chunks)
            if tag == 'title':
                self.titles.append(content)
            else:
                self.structured_data.append(json.loads(content))
            self.capture = None


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--seo', action='store_true')
args = parser.parse_args()

root = Path('out')
pages = {}
for path in root.rglob('*.html'):
    page = Page()
    page.feed(path.read_text(encoding='utf-8'))
    pages[path] = page
game_paths = {path.parent.name for path in (root / 'games').glob('*/index.html')}
earning_paths = {path.parent.name for path in (root / 'make-money').glob('*/index.html')} - {'resources', 'tracker', 'tournaments'}
assert len(game_paths) == 50, f'Expected 50 game hubs, found {len(game_paths)}.'
assert earning_paths == game_paths, f'Game and earning routes differ by {earning_paths ^ game_paths}.'
assert (root / 'make-money/tournaments/index.html').is_file(), 'Tournament route is missing.'
issues = set()
for path, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        if url.path.startswith('/'):
            target = root / unquote(url.path.lstrip('/'))
        elif url.path:
            target = path.parent / unquote(url.path)
        else:
            target = path
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file():
            issues.add(f'{path}: missing {link}')
        elif url.fragment and target in pages and url.fragment not in pages[target].ids:
            issues.add(f'{path}: missing anchor {link}')
if issues:
    raise SystemExit('\n'.join(sorted(issues)))
print(f'Checked internal links and assets in {len(pages)} HTML files.')

if args.seo:
    origin = (os.getenv('NEXT_PUBLIC_SITE_URL') or '').strip().rstrip('/')
    indexable = bool(origin) and os.getenv('NEXT_PUBLIC_NO_INDEX') != '1'
    token = (os.getenv('NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION') or '').strip()
    canonical_urls = set()
    titles = set()
    descriptions = set()
    error_dirs = {root / '_not-found', root / '404'}
    not_found = [page for path, page in pages.items() if path.name == '404.html' or path.parent in error_dirs]
    assert not_found and all(
        any('noindex' in value for value in page.metadata.get('robots', []))
        for page in not_found
    ), 'The 404 page must carry a noindex directive.'
    for path, page in pages.items():
        if path.name != 'index.html' or path.parent in error_dirs:
            continue
        relative = '/' + path.parent.relative_to(root).as_posix().removeprefix('.')
        if relative != '/':
            relative += '/'
        canonical = origin + relative
        assert page.canonicals == ([canonical] if origin else []), f'{relative}: invalid canonical'
        assert canonical not in canonical_urls, f'{relative}: duplicate URL'
        canonical_urls.add(canonical)
        assert len(page.titles) == 1 and page.titles[0].endswith(' | NEXUSGG'), f'{relative}: invalid title'
        assert page.titles[0] not in titles, f'{relative}: duplicate title'
        titles.add(page.titles[0])
        desc = page.metadata.get('description', [])
        assert len(desc) == 1 and desc[0] and desc[0] not in descriptions, f'{relative}: invalid or duplicate description'
        descriptions.add(desc[0])
        assert page.metadata.get('robots') == (['index, follow'] if indexable else ['noindex, nofollow']), f'{relative}: wrong index setting'
        assert page.metadata.get('og:title') == page.titles and page.metadata.get('og:description') == desc, f'{relative}: mismatched Open Graph text'
        if origin:
            assert page.metadata.get('og:url') == [canonical], f'{relative}: wrong share URL'
            assert page.metadata.get('og:image') == [origin + '/nexusgg-social.jpg'], f'{relative}: share image missing'
            assert page.metadata.get('twitter:card') == ['summary_large_image'], f'{relative}: share card missing'
            schema = {entry['@type']: entry for entry in page.structured_data}
            if relative == '/':
                assert schema['WebSite']['url'] == canonical
            else:
                trail = schema['BreadcrumbList']['itemListElement']
                assert trail[0]['item'] == origin + '/' and trail[-1]['item'] == canonical, f'{relative}: wrong breadcrumbs'
            if relative.startswith('/tools/') and relative != '/tools/':
                assert schema['WebApplication']['url'] == canonical
            if path.parent.parent == root / 'make-money' and path.parent.name in game_paths:
                assert schema['Article']['mainEntityOfPage'] == canonical
        assert page.headings and page.headings[0] == 1 and page.headings.count(1) == 1, f'{relative}: expected one leading h1'
        assert all(after <= before + 1 for before, after in zip(page.headings, page.headings[1:])), f'{relative}: skipped heading level'
        expected_token = [token] if token and relative == '/' else None
        assert page.metadata.get('google-site-verification') == expected_token, f'{relative}: wrong verification tag'
    robots = (root / 'robots.txt').read_text()
    sitemap = ElementTree.parse(root / 'sitemap.xml').getroot()
    sitemap_urls = [entry.text for entry in sitemap.findall('{*}url/{*}loc')]
    if indexable:
        assert len(sitemap_urls) == len(set(sitemap_urls)) and set(sitemap_urls) == canonical_urls, 'Sitemap does not match indexable pages.'
        assert 'Allow: /\n' in robots and f'Sitemap: {origin}/sitemap.xml' in robots
    else:
        assert not sitemap_urls and 'Disallow: /' in robots and 'Sitemap:' not in robots
    assert (root / 'nexusgg-social.jpg').is_file(), 'Social card file is missing.'
    print(f'Checked SEO for {len(titles)} pages and {len(sitemap_urls)} sitemap URLs.')
