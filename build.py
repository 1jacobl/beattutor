"""Builds index.html from src/. Run: python3 build.py

src/head.html        <head>, page styles (light frame, white sheet)
src/fl-windows.css   styles for the drawn FL Studio windows
src/app.css          controller drawings, responsive rules, then the page shell
src/app.js           data, audio engine, drawings, lessons, views
"""
import os, subprocess
here = os.path.dirname(os.path.abspath(__file__))
def r(f): return open(os.path.join(here, 'src', f), encoding='utf-8').read()
html = r('head.html') + r('fl-windows.css') + r('app.css') + r('app.js') + '\n</script>\n</body>\n</html>\n'
open(os.path.join(here, 'index.html'), 'w', encoding='utf-8').write(html)
print('index.html', len(html), 'bytes')
try:
    subprocess.run(['node', '--check', os.path.join(here, 'src', 'app.js')], check=True)
    print('script syntax OK')
except FileNotFoundError:
    print('node not found; skipped syntax check')
