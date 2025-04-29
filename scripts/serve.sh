#!/bin/bash

set -e

PORT=3000
IMAGE_NAME="openfoodfacts-backend"

echo "[INFO] Building Docker image '$IMAGE_NAME'..."
docker build -t "$IMAGE_NAME" .
echo "[INFO] Running backend container on port $PORT..."
docker run -d -p "$PORT":3000 "$IMAGE_NAME"

cd front || exit 1
echo "[INFO] Building frontend..."
npm install
ng serve
