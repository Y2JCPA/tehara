#!/usr/bin/env python3
"""Bundle the oil/ test scene into one HTML file (for sharing as a single page).

Usage: python3 tools/build-oil-artifact.py OUT.html
three.js loads from jsDelivr, pinned to the same version as vendor/three."""
import pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent / 'oil'
html = (root / 'index.html').read_text()
css = (root / 'style.css').read_text()
js = (root / 'game.js').read_text()
body = re.search(r'<!--APP START-->(.*)<!--APP END-->', html, re.S).group(1)
fonts = re.search(r'<link rel="stylesheet" href="(https://fonts[^"]+)">', html).group(1)
js = js.replace("'../vendor/three/three.module.min.js'", "'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js'")
out = f'''<title>The Last Jug</title>
<link rel="stylesheet" href="{fonts}">
<style>
{css}
</style>
{body.strip()}
<script type="module">
{js}
</script>
'''
pathlib.Path(sys.argv[1]).write_text(out)
print(f'wrote {sys.argv[1]} ({len(out) // 1024} KB)')
