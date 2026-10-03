#!/bin/sh
# Upload exactly what's merged on origin/main (never local/unreviewed files) to S3, plus a generated homepage.
set -eu
git fetch -q origin
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git archive origin/main | tar -x -C "$tmp"

# Homepage: one link per folder that has an index.html, rebuilt every deploy.
{
  cat <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Oli's Games</title>
<style>body{margin:0;min-height:100vh;background:#111;color:#fff;font-family:system-ui,sans-serif;text-align:center}
h1{font-size:3rem;margin:2rem 1rem}a{display:block;max-width:20rem;margin:1rem auto;padding:1rem;background:#2a6;color:#fff;
border-radius:12px;font-size:1.5rem;text-decoration:none}a:hover{background:#3b7}</style></head>
<body><h1>Oli's Games</h1>
HTML
  for d in "$tmp"/*/index.html; do
    [ -e "$d" ] || continue
    name=$(basename "$(dirname "$d")")
    echo "<a href=\"$name/\">$name</a>"
  done
  echo "</body></html>"
} > "$tmp/index.html"
# ponytail: no --delete (deploy user can't delete); remove retired games in the S3 console.
aws s3 sync "$tmp" s3://olis-games --region eu-west-2 --exclude "README.md" --exclude "deploy.sh"
echo "Live at http://olis-games.s3-website.eu-west-2.amazonaws.com/"
