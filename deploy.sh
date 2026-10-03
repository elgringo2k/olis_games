#!/bin/sh
# Upload exactly what's merged on origin/main (never local/unreviewed files) to S3.
set -eu
git fetch -q origin
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git archive origin/main | tar -x -C "$tmp"
# ponytail: no --delete (deploy user can't delete); remove retired games in the S3 console.
aws s3 sync "$tmp" s3://olis-games --region eu-west-2 --exclude "README.md" --exclude "deploy.sh"
echo "Live at http://olis-games.s3-website.eu-west-2.amazonaws.com/"
