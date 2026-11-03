"""Guard the notation interactions against omitted indices and grouped definitions."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest


class Element:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children = []

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.walk()

    def text(self):
        return ''.join(c.text() if isinstance(c, Element) else c for c in self.children)

    def ancestors(self):
        node = self
        while node:
            yield node
            node = node.parent


class Markup(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.root = self.current = Element()
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in {'meta', 'link', 'input', 'br', 'hr', 'img'}:
            self.current = node

    def handle_endtag(self, tag):
        for node in self.current.ancestors():
            if node.tag == tag:
                self.current = node.parent
                break

    def handle_data(self, data):
        self.current.children.append(data)


class DcfNotationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        page = Path(__file__).resolve().parents[1] / 'src/dcf/page.html'
        cls.tree = Markup(page.read_text()).root

    def test_every_formula_time_index_has_its_own_highlight_target(self):
        checked = {'t': 0, 'N': 0}
        for index in self.tree.walk():
            if index.tag not in {'sub', 'sup'}:
                continue
            if not any('formula' in n.attrs.get('class', '').split() for n in index.ancestors()):
                continue
            for node in index.walk():
                for child in node.children:
                    if not isinstance(child, str):
                        continue
                    for key in re.findall(r'\b[tN]\b', child):
                        checked[key] += 1
                        self.assertTrue(any(key in n.attrs.get('data-symbols', '').split() for n in node.ancestors()), f'Missing {key} in {index.text()}')
        self.assertGreater(checked['N'], 5)
        self.assertGreater(checked['t'], 5)

    def test_each_key_row_defines_one_symbol(self):
        rows = [n for n in self.tree.walk() if n.tag == 'dt']
        self.assertEqual(len(rows), 29)
        for row in rows:
            buttons = [n for n in row.walk() if n.tag == 'button']
            self.assertEqual(len(buttons), 1, row.text())

    def test_ratio_symbols_target_ratios_not_cash_amounts(self):
        for key in ['d', 'c', 'w']:
            targets = [n for n in self.tree.walk() if key in n.attrs.get('data-symbols', '').split()]
            self.assertTrue(targets, key)
            for target in targets:
                self.assertEqual(target.text().strip(), key)


if __name__ == '__main__':
    unittest.main()
