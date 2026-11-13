"""Source checks only. No rendering, networking or browser automation."""
from html.parser import HTMLParser
from pathlib import Path
from collections import Counter
import re

base = Path(__file__).resolve().parent
class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.links = [], [], []
    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if 'id' in attributes:
            self.ids.append(attributes['id'])
        for key in ('aria-labelledby', 'aria-describedby'):
            if key in attributes:
                self.refs.extend(attributes[key].split())
        if 'for' in attributes:
            self.refs.append(attributes['for'])
        for key in ('src', 'href'):
            if key in attributes:
                self.links.append(attributes[key])

parser = Check()
parser.feed((base / 'index.html').read_text())
assert not [identifier for identifier, count in Counter(parser.ids).items() if count > 1]
assert not set(parser.refs) - set(parser.ids)
for link in parser.links:
    if link.startswith('#'):
        assert link[1:] in parser.ids
    else:
        assert '://' not in link and (base / link).exists(), link
app = (base / 'app.js').read_text()
refs = re.findall(r"\$\('([^']+)'\)", app)
assert not set(refs) - set(parser.ids)
css = (base / 'styles.css').read_text()
assert css.count('{') == css.count('}')
assert 'prefers-reduced-motion' in css and 'max-width:380px' in css
print('HTML: IDs únicos, referências ARIA e labels resolvidos, recursos locais e seletores JS presentes.')
print('CSS: delimitadores equilibrados, regras para telefone e movimento reduzido presentes.')

def luminance(value):
    channels = [int(value[i:i+2], 16) / 255 for i in (1, 3, 5)]
    channels = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in channels]
    return sum(x * weight for x, weight in zip(channels, (.2126, .7152, .0722)))

for name, foreground, background in [
    ('texto/papel', '#283e35', '#f7f4ec'),
    ('secundário/papel', '#5d6a5d', '#f7f4ec'),
    ('secundário/sálvia', '#5d6a5d', '#e8eddf'),
    ('botão', '#fffef9', '#294d3c'),
    ('erro', '#833e2f', '#f5e6dd'),
    ('número padrão', '#5d6d55', '#e8eddf'),
    ('foco/papel', '#955824', '#f7f4ec')
]:
    low, high = sorted([luminance(foreground), luminance(background)])
    ratio = (high + .05) / (low + .05)
    assert ratio >= 4.5, (name, ratio)
    print(f'{name}: {ratio:.2f}:1')
print('As verificações de código não comprovam qualidade visual ou conformidade integral de acessibilidade.')
