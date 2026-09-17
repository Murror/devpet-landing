#!/usr/bin/env python3
"""
Add the Codepet beta banner + logo-link to the codepet-academy
static site. Replaces add-codepet-banner.sh, which used awk -v
with multi-line strings and choked on macOS's BSD awk.

Run from inside the codepet-academy repo:
    cd "/Users/monatruong/Downloads/codepet academy"
    python3 /path/to/add-codepet-banner.py

Idempotent — safe to re-run. Writes one .bak.<timestamp> per file
the first time it makes a change. Cleans up the stale .new file
the old shell script left behind, plus any junk .bak files
from failed prior attempts.
"""

from __future__ import annotations

import os
import re
import sys
from datetime import datetime
from pathlib import Path

STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")

# ── Banner HTML (EN / VI) ─────────────────────────────────────
BANNER_EN = """\
  <!-- Beta banner — links to the Codepet landing/waitlist at
       code-pet.com. Fixed-position strip above the nav. -->
  <a class="beta-banner" href="https://code-pet.com/" target="_blank" rel="noopener noreferrer">
    <span class="beta-banner__lead">Codepet is in beta</span>
    <span class="beta-banner__sep">—</span>
    <span class="beta-banner__cta">join the waitlist <span class="beta-banner__arrow">→</span></span>
  </a>
"""

BANNER_VI = """\
  <!-- Beta banner — links to the Codepet landing/waitlist at
       code-pet.com. Fixed-position strip above the nav. -->
  <a class="beta-banner" href="https://code-pet.com/" target="_blank" rel="noopener noreferrer">
    <span class="beta-banner__lead">Codepet đang trong giai đoạn beta</span>
    <span class="beta-banner__sep">—</span>
    <span class="beta-banner__cta">tham gia danh sách chờ <span class="beta-banner__arrow">→</span></span>
  </a>
"""

# ── Banner CSS (shared) ───────────────────────────────────────
BANNER_CSS = """
/* ── Beta banner — wayfinding to code-pet.com landing ────────── */
.beta-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
  font-family: 'Upheaval TT', 'Press Start 2P', monospace;
  font-size: 14px;
  letter-spacing: 0.04em;
  transition: background 0.18s ease;
}
.beta-banner:hover { background: #2d2466; }
.beta-banner__sep { opacity: 0.45; }
.beta-banner__arrow {
  display: inline-block;
  transition: transform 0.18s ease;
}
.beta-banner:hover .beta-banner__arrow { transform: translateX(4px); }
@media (max-width: 880px) {
  .beta-banner { height: 36px; font-size: 12px; gap: 6px; }
  .nav { top: 36px !important; }
}
@media (max-width: 480px) {
  /* On the narrowest phones, drop the lead + separator so the
     actionable CTA always fits on one line without truncating. */
  .beta-banner__lead,
  .beta-banner__sep { display: none; }
}
"""


def patch_file(path: Path, banner_html: str) -> str:
    if not path.exists():
        return f"[skip] {path.name} not found"

    text = path.read_text(encoding="utf-8")

    if "beta-banner" in text:
        # Idempotent: nothing to do. But ensure the logo link
        # is correct in case only the banner was applied previously.
        new_text, changed = _ensure_logo_link(text)
        if changed:
            path.write_text(new_text, encoding="utf-8")
            return f"[ok]   {path.name} already had banner; logo link fixed"
        return f"[skip] {path.name} already patched"

    backup = path.with_suffix(path.suffix + f".bak.{STAMP}")
    backup.write_text(text, encoding="utf-8")

    # 1. Logo link: href="#" on .nav__brand → code-pet.com
    text, _ = _ensure_logo_link(text)

    # 2. Banner HTML — insert immediately after opening <body>
    body_re = re.compile(r"(<body[^>]*>)", re.IGNORECASE)
    if not body_re.search(text):
        return f"[err]  {path.name}: <body> tag not found"
    text = body_re.sub(r"\1\n" + banner_html, text, count=1)

    # 3. Banner CSS — insert before the last </style>
    last_style_idx = text.rfind("</style>")
    if last_style_idx == -1:
        return f"[err]  {path.name}: </style> not found"
    text = text[:last_style_idx] + BANNER_CSS + text[last_style_idx:]

    # 4. Nav offset: top:0 → top:40px inside the .nav block
    #    Only the .nav rule has this — match conservatively to avoid
    #    rewriting some other unrelated `top:0`.
    text = re.sub(
        r"(\.nav\s*\{[^}]*?)top:\s*0(\s*[;}])",
        r"\1top:40px\2",
        text,
        flags=re.DOTALL,
    )

    # 5. Body padding-top: 134→174 (desktop), 96→132 (mobile)
    text = re.sub(
        r"(body\s*\{[^}]*?padding-top:\s*)134px",
        r"\g<1>174px",
        text,
        flags=re.DOTALL,
    )
    text = re.sub(
        r"(body\s*\{[^}]*?padding-top:\s*)96px",
        r"\g<1>132px",
        text,
        flags=re.DOTALL,
    )

    path.write_text(text, encoding="utf-8")
    return f"[ok]   {path.name} patched (backup: {backup.name})"


def _ensure_logo_link(text: str) -> tuple[str, bool]:
    """Make the .nav__brand anchor point to code-pet.com if it isn't already."""
    # Match an opening <a ...> with href="#" AND class containing nav__brand
    # in either order of attributes.
    pattern = re.compile(
        r'<a\s+([^>]*?)href="#"([^>]*?class="[^"]*?nav__brand[^"]*?"[^>]*)>',
        re.IGNORECASE,
    )
    pattern_alt = re.compile(
        r'<a\s+([^>]*?class="[^"]*?nav__brand[^"]*?"[^>]*?)href="#"([^>]*)>',
        re.IGNORECASE,
    )
    new_text = pattern.sub(
        r'<a \1href="https://code-pet.com/"\2>', text
    )
    new_text = pattern_alt.sub(
        r'<a \1href="https://code-pet.com/"\2>', new_text
    )
    return new_text, new_text != text


def cleanup_junk() -> list[str]:
    """Remove stale .new files and trim old .bak files (keep most recent 2)."""
    msgs: list[str] = []
    for stale in Path(".").glob("*.html.new"):
        stale.unlink()
        msgs.append(f"[clean] removed {stale.name}")
    # Per-file: keep two most-recent backups
    for base in ("index.html", "index-vi.html"):
        backups = sorted(
            Path(".").glob(f"{base}.bak.*"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )
        for old in backups[2:]:
            old.unlink()
            msgs.append(f"[clean] removed old backup {old.name}")
    return msgs


def main() -> int:
    if not Path("index.html").exists():
        print("Run this from the academy repo root (where index.html lives).")
        return 1

    for line in cleanup_junk():
        print(line)

    print(patch_file(Path("index.html"), BANNER_EN))
    print(patch_file(Path("index-vi.html"), BANNER_VI))

    print()
    print("Done. To preview locally:")
    print("  open index.html")
    print("  open index-vi.html")
    print()
    print("To commit + deploy:")
    print("  git add index.html index-vi.html")
    print('  git commit -m "Add beta banner + Vietnamese logo link to code-pet.com"')
    print("  git push")
    return 0


if __name__ == "__main__":
    sys.exit(main())
