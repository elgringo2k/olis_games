#!/bin/sh
# Upload exactly what's merged on origin/main (never local/unreviewed files) to S3, plus a generated homepage.
set -eu
git fetch -q origin
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git archive origin/main | tar -x -C "$tmp"

# Homepage: one card per folder that has an index.html, rebuilt every deploy.
# Card name = the game's <title> (falls back to folder name); picture = screenshot.png if the folder has one.
{
  cat <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Oli's Games</title>
<style>body{margin:0;min-height:100vh;background:#111;color:#fff;font-family:system-ui,sans-serif}
h1{font-size:3rem;margin:2rem 1rem;text-align:center}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;padding:0 16px 3rem}
a{display:block;background:#1d1d1d;color:#fff;border-radius:14px;overflow:hidden;text-decoration:none;box-shadow:0 4px 14px #0008;transition:transform .15s}
a:hover,a:focus-visible{transform:translateY(-4px) scale(1.02);outline:3px solid #2a6}
.pic{aspect-ratio:16/10;background:#2a6 center/cover no-repeat;display:grid;place-items:center;font-size:3rem}
span{display:block;padding:.9rem 1rem;font-size:1.3rem;font-weight:700}</style></head>
<body><h1>Oli's Games</h1><main>
HTML
  for d in "$tmp"/*/index.html; do
    [ -e "$d" ] || continue
    dir=$(dirname "$d"); name=$(basename "$dir")
    title=$(sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' "$d" | head -1)
    [ -n "$title" ] || title=$name
    if [ -e "$dir/screenshot.png" ]; then pic="<div class=\"pic\" style=\"background-image:url('$name/screenshot.png')\"></div>"
    else pic='<div class="pic">🎮</div>'; fi
    echo "<a href=\"$name/\">$pic<span>$title</span></a>"
  done
  echo "</main></body></html>"
} > "$tmp/index.html"
# ponytail: no --delete (deploy user can't delete); remove retired games in the S3 console.
aws s3 sync "$tmp" s3://olis-games --region eu-west-2 --exclude "README.md" --exclude "deploy.sh"
echo "Live at http://olis-games.s3-website.eu-west-2.amazonaws.com/"
