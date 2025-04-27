#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CSV_GZ="$ROOT_DIR/en.openfoodfacts.org.products.csv.gz"
CSV_FILE="$ROOT_DIR/en.openfoodfacts.org.products.csv"
C_SCRIPT="$ROOT_DIR/scripts/import.c"
BIN_NAME="$ROOT_DIR/scripts/import"
DB_PATH="$ROOT_DIR/server/products.db"

URL="https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz"

echo "[*] Checking for sqlite3..."
if ! command -v sqlite3 &>/dev/null; then
    echo "[ERROR] sqlite3 not found. Aborting."
    exit 1
fi

echo "[*] Checking for curl..."
if ! command -v curl &>/dev/null; then
    echo "[ERROR] curl not found. Aborting."
    exit 1
fi

echo "[*] Checking for gunzip..."
if ! command -v gunzip &>/dev/null; then
    echo "[ERROR] gunzip not found. Aborting."
    exit 1
fi

if [ ! -f "$CSV_GZ" ]; then
    echo "[*] Downloading CSV archive..."
    curl -L --fail -o "$CSV_GZ" "$URL"
fi

if [ ! -f "$CSV_FILE" ]; then
    echo "[*] Extracting CSV..."
    gunzip -kf "$CSV_GZ"
fi

echo "[*] Compiling import script..."
gcc "$C_SCRIPT" -lsqlite3 -o "$BIN_NAME"

echo "[*] Running import..."
"$BIN_NAME" "$CSV_FILE" "$DB_PATH"

echo "[OK] Database import complete."
