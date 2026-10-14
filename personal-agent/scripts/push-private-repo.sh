#!/usr/bin/env bash
# Push personal-agent/ into a brand-new private GitHub repository.
# Usage:
#   ./scripts/push-private-repo.sh git@github.com:YOU/personal-agent.git
#   ./scripts/push-private-repo.sh https://github.com/YOU/personal-agent.git
set -euo pipefail

REMOTE_URL="${1:-}"
if [[ -z "$REMOTE_URL" ]]; then
  echo "Usage: $0 <private-repo-git-url>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "Copying project to $WORKDIR"
rsync -a --exclude node_modules --exclude .next --exclude .data --exclude .eve \
  --exclude .env --exclude .env.local \
  "$ROOT/" "$WORKDIR/"

cd "$WORKDIR"
git init -b main
git add .
git commit -m "Initial import: Personal Agent (work + play)"
git remote add origin "$REMOTE_URL"
git push -u origin main

echo "Done. Open $REMOTE_URL and grant Cursor GitHub App access if needed."
