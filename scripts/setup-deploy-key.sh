#!/usr/bin/env bash
set -euo pipefail

KEY_DIR="./.keys"
KEY_NAME="vercel_deploy_key"
mkdir -p "$KEY_DIR"

if [ -f "$KEY_DIR/$KEY_NAME" ]; then
  echo "Deploy key already exists at $KEY_DIR/$KEY_NAME"
  exit 0
fi

ssh-keygen -t ed25519 -C "vercel-deploy" -f "$KEY_DIR/$KEY_NAME" -N ""

echo ""
echo "Deploy key generated."
echo "Public key (add to GitHub repo Deploy Keys, read-only is fine):"
echo "--------------------------------------------------------------"
cat "$KEY_DIR/$KEY_NAME.pub"
echo "--------------------------------------------------------------"
echo ""
echo "Next steps:"
echo "1) GitHub: Settings -> Deploy keys -> Add key -> paste the public key above (can be read-only)."
echo "2) Vercel (if needed): Project Settings -> Git -> Add private key, paste contents of $KEY_DIR/$KEY_NAME."
echo "3) Ensure this repo is connected to Vercel and automatic deploys on main are enabled."
echo ""
echo "Private key path: $KEY_DIR/$KEY_NAME (gitignored). Do not commit this file."
