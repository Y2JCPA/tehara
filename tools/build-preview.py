"""Create a single-file playable review artifact from the actual app sources."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="css/rebuild.css">', '<style>' + (root / 'css/rebuild.css').read_text() + '</style>')
for path in ['js/engine/tumah.js', 'js/rebuild/levels.js', 'js/rebuild/art.js', 'js/rebuild/app.js']:
    html = html.replace(f'<script src="{path}"></script>', '<script>' + (root / path).read_text().replace('</script', '<\\/script') + '</script>')
html = re.sub(r'<link rel="(?:icon|manifest)"[^>]*>', '', html)
html = html.replace('<a href="docs/GAME_DESIGN.md">', '<a href="https://github.com/Y2JCPA/tehara/blob/codex/tehara-reimagined/docs/GAME_DESIGN.md">')
(root / 'artifacts').mkdir(exist_ok=True)
(root / 'artifacts/tehara-preview.html').write_text(html)
print('Built artifacts/tehara-preview.html')
