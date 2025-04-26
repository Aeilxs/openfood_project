#!/bin/bash

set -e

echo "Starting frontend and backend servers..."

rm -rdf logs
mkdir logs
touch logs/front.log
touch logs/server.log

cd front
npx ng serve >../logs/front.log 2>&1 &
FRONT_PID=$!
cd ..

cd server
npm run start:dev >../logs/server.log 2>&1 &
SERVER_PID=$!
cd ..

tail -f logs/front.log -n 20 &
TAIL_FRONT_PID=$!
tail -f logs/server.log -n 20 &
TAIL_SERVER_PID=$!

cleanup() {
    echo
    echo "Stopping servers..."
    kill $FRONT_PID $SERVER_PID $TAIL_FRONT_PID $TAIL_SERVER_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT

wait $FRONT_PID $SERVER_PID
