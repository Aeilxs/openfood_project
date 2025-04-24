#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CSV_GZ="$ROOT_DIR/en.openfoodfacts.org.products.csv.gz"
CSV_FILE="$ROOT_DIR/en.openfoodfacts.org.products.csv"
C_SCRIPT="$ROOT_DIR/scripts/import.c"
BIN_NAME="$ROOT_DIR/scripts/import"
DB_PATH="$ROOT_DIR/server/products.db"

echo "[*] Checking for sqlite3..."
if ! command -v sqlite3 &>/dev/null; then
    echo "[ERROR] sqlite3 not found. Bye!"
    exit 1
fi

if [ ! -f "$CSV_GZ" ]; then
    echo "[*] Downloading CSV archive..."
    curl -L -o "$CSV_GZ" https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz
fi

if [ ! -f "$CSV_FILE" ]; then
    echo "[*] Extracting CSV..."
    gunzip -k "$CSV_GZ"
fi

echo "[*] Compiling import script..."
gcc "$C_SCRIPT" -lsqlite3 -o "$BIN_NAME"

echo "[*] Running import..."
"$BIN_NAME" "$CSV_FILE" "$DB_PATH"

echo "[OK] Done."
