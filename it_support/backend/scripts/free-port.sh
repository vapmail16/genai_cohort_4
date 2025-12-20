#!/bin/bash
# Script to free port 5000

PORT=${1:-5000}
echo "Checking for processes using port $PORT..."

PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
  echo "Port $PORT is free!"
  exit 0
fi

echo "Found processes using port $PORT: $PIDS"
echo "Killing processes..."

for PID in $PIDS; do
  echo "Killing process $PID"
  kill -9 $PID 2>/dev/null
done

sleep 1

# Verify port is free
if lsof -ti:$PORT > /dev/null 2>&1; then
  echo "Warning: Port $PORT may still be in use. Try again or use a different port."
  exit 1
else
  echo "Port $PORT is now free!"
  exit 0
fi

