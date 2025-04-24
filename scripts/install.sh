#!/bin/bash

chmod u+x scripts/build_db.sh
chmod u+x scripts/uninstall.sh

# install frontend
cd front || exit 1
echo "[INFO] Installing frontend dependencies..."
npm install
cd ..

# install backend
cd server || exit 1
echo "[INFO] Installing backend dependencies..."
npm install
cd ..

# install database
echo "[INFO] Installing database..."
./scripts/build_db.sh

echo "[INFO] Cleaning up database... (it may take a while)"
sqlite3 server/products.db <scripts/cleanup_data.sql

echo "[INFO] Database installed and cleaned up."
