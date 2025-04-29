#!/bin/bash

# used by the container to install the database and backend dependencies

cd server || exit 1
echo "[INFO] Installing backend dependencies..."
npm install
cd .. || exit 1

echo "[INFO] Installing database..."
./scripts/build_db.sh

echo "[INFO] Cleaning up database... (it may take a while)"
sqlite3 server/products.db <scripts/cleanup_data.sql

echo "[INFO] Database installed and cleaned up."
