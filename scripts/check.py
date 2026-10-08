#!/usr/bin/env python3
"""Validate local links, tab identifiers, and generated preview data."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]
errors = []


class PageCheck(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.keys = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "data-tab-key" in attrs:
            self.keys.append(attrs["data-tab-key"])
        for name in ("href", "src"):
            url = urlsplit(attrs.get(name, ""))
            if not url.scheme and url.path and not (ROOT / url.path).exists():
                errors.append(f"{self.page.name}: missing {url.path}")


bundle = (ROOT / "assets/js/page-data.js").read_text()
data = json.loads(bundle.split("window.NODAVEX_PAGES = ", 1)[1].rstrip(";\n"))
for page in ROOT.glob("*.html"):
    text = page.read_text()
    checker = PageCheck(page)
    checker.feed(text)
    if len(checker.keys) != len(set(checker.keys)):
        errors.append(f"{page.name}: duplicate tab IDs")
    if data.get(page.name) != text:
        errors.append(f"{page.name}: outdated preview data")
if errors:
    raise SystemExit("\n".join(errors))
print("Links, assets, tab IDs, and local-preview data are valid.")
