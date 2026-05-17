#!/usr/bin/env bash
#
# Adds two pieces of cross-site wayfinding to the codepet-academy
# static site so visitors can reach the Codepet landing page:
#
#   1. The Codepet wordmark in the top nav becomes a link to
#      https://code-pet.com/ (was href="#" before — scroll-to-top).
#   2. A thin "beta — join the waitlist" strip is added above the
#      nav, fixed to the top of the viewport on every page.
#
# Run from inside the codepet-academy repo:
#   cd "/Users/monatruong/Downloads/codepet academy"
#   bash /path/to/add-codepet-banner.sh
#
# The script is idempotent — if the banner is already present it
# skips the insert. Backups are written next to each file as
# *.bak.<timestamp> so a manual rollback is one `mv` command.

set -euo pipefail

if [[ ! -f index.html ]]; then
  echo "Run this from the academy repo root (where index.html lives)."
  exit 1
fi

STAMP=$(date +%Y%m%d-%H%M%S)

BANNER_HTML='<!-- Beta banner — links to the Codepet landing/waitlist
       at code-pet.com. Fixed-position strip above the nav. -->
  <a class="beta-banner" href="https://code-pet.com/" target="_blank" rel="noopener noreferrer">
    <span class="beta-banner__lead">Codepet is in beta</span>
    <span class="beta-banner__sep">—</span>
    <span class="beta-banner__cta">join the waitlist <span class="beta-banner__arrow">→</span></span>
  </a>
  '

BANNER_HTML_VI='<!-- Beta banner — links to the Codepet landing/waitlist
       at code-pet.com. Fixed-position strip above the nav. -->
  <a class="beta-banner" href="https://code-pet.com/" target="_blank" rel="noopener noreferrer">
    <span class="beta-banner__lead">Codepet đang trong giai đoạn beta</span>
    <span class="beta-banner__sep">—</span>
    <span class="beta-banner__cta">tham gia danh sách chờ <span class="beta-banner__arrow">→</span></span>
  </a>
  '

BANNER_CSS='
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
  font-family: '"'"'Upheaval TT'"'"', '"'"'Press Start 2P'"'"', monospace;
  font-size: 14px;
  letter-spacing: 0.04em;
  transition: background 0.18s ease;
}
.beta-banner:hover {
  background: #2d2466;
}
.beta-banner__sep {
  opacity: 0.45;
}
.beta-banner__arrow {
  display: inline-block;
  transition: transform 0.18s ease;
}
.beta-banner:hover .beta-banner__arrow {
  transform: translateX(4px);
}
@media (max-width: 880px) {
  .beta-banner {
    height: 36px;
    font-size: 12px;
    gap: 6px;
  }
}
@media (max-width: 480px) {
  /* On the narrowest phones, drop the "Codepet is in beta" lead
     and the separator so the actionable CTA always fits on one
     line without truncating. */
  .beta-banner__lead,
  .beta-banner__sep {
    display: none;
  }
}
'

patch_file() {
  local file="$1"
  local banner_html="$2"

  if [[ ! -f "$file" ]]; then
    echo "[skip] $file not found"
    return
  fi

  # Idempotency: if beta-banner is already in the file, skip.
  if grep -q "beta-banner" "$file"; then
    echo "[skip] $file already patched"
    return
  fi

  cp "$file" "${file}.bak.${STAMP}"

  # 1. Logo: href="#" → href="https://code-pet.com/" inside .nav__brand
  #    The brand anchor is the only one with href="#" on this site so
  #    a targeted sed on the nav__brand line is safe.
  sed -i.tmp -E 's|(<a href=)"#"( [^>]*class="[^"]*nav__brand)|\1"https://code-pet.com/"\2|' "$file"
  rm -f "${file}.tmp"

  # 2. Banner HTML: insert right after the opening <body> tag.
  #    Use awk so the multi-line replacement is reliable across
  #    macOS sed quirks.
  awk -v ins="$banner_html" '
    /<body[^>]*>/ && !done {
      print
      print ins
      done = 1
      next
    }
    { print }
  ' "$file" > "${file}.new"
  mv "${file}.new" "$file"

  # 3. Banner CSS: append to the existing inline <style> block so we
  #    don'"'"'t fight with the file'"'"'s single-file architecture.
  #    Find the LAST </style> and inject before it.
  awk -v css="$BANNER_CSS" '
    { lines[NR] = $0 }
    /<\/style>/ { last_style = NR }
    END {
      for (i = 1; i <= NR; i++) {
        if (i == last_style) {
          print css
        }
        print lines[i]
      }
    }
  ' "$file" > "${file}.new"
  mv "${file}.new" "$file"

  # 4. Nav offset: nav was top:0; bump to top:40px (desktop) and
  #    top:36px (mobile) so the banner sits above it.
  sed -i.tmp -E '
    s|(\.nav\{[^}]*)top:0|\1top:40px|
  ' "$file"
  rm -f "${file}.tmp"

  # 5. Body padding: bump 134→174 (desktop) and 96→132 (mobile)
  #    to compensate for the 40px / 36px banner height.
  sed -i.tmp -E '
    s|(body\{[^}]*padding-top:)134px|\1174px|
    s|(body\{padding-top:)96px|\1132px|
  ' "$file"
  rm -f "${file}.tmp"

  # 6. Mobile nav offset (inside @media(max-width:880px) — the nav
  #    needs top:36px so banner+nav still fit). Adds an extra rule
  #    inside that media query rather than trying to surgically
  #    edit the existing one.
  awk '
    /@media\s*\(max-width:\s*880px\)\s*\{/ && !done {
      # find the next ".nav{" or just inject a rule at end of media block
      # Simpler: append our rule right before the closing brace of file.
    }
    { print }
  ' "$file" > "${file}.new"
  mv "${file}.new" "$file"
  # Append the mobile nav offset rule inside the existing style block:
  awk -v rule="@media(max-width:880px){.nav{top:36px}}" '
    { lines[NR] = $0 }
    /<\/style>/ { last_style = NR }
    END {
      for (i = 1; i <= NR; i++) {
        if (i == last_style) {
          print rule
        }
        print lines[i]
      }
    }
  ' "$file" > "${file}.new"
  mv "${file}.new" "$file"

  echo "[ok]   $file patched (backup: ${file}.bak.${STAMP})"
}

patch_file "index.html"    "$BANNER_HTML"
patch_file "index-vi.html" "$BANNER_HTML_VI"

echo ""
echo "Done. To preview locally:"
echo "  open index.html"
echo "  open index-vi.html"
echo ""
echo "To roll back:"
echo "  mv index.html.bak.${STAMP} index.html"
echo "  mv index-vi.html.bak.${STAMP} index-vi.html"
echo ""
echo "To deploy, commit + push as usual:"
echo "  git add index.html index-vi.html"
echo "  git commit -m 'Add beta banner + logo link to code-pet.com'"
echo "  git push"
