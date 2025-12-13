#!/bin/bash

# Connection script for Vast.ai GPU instances
# Usage: ./connect_to_instance.sh [PORT] [HOST]

PORT=${1:-"YOUR_PORT_HERE"}
HOST=${2:-"ssh.vast.ai"}

echo "🔌 Connecting to Vast.ai GPU instance..."
echo "Host: $HOST"
echo "Port: $PORT"
echo ""

# Check if port is set
if [ "$PORT" == "YOUR_PORT_HERE" ]; then
    echo "⚠️  Please update the PORT in this script or pass it as argument:"
    echo "   ./connect_to_instance.sh 12345"
    echo ""
    echo "You can find the SSH command in your Vast.ai dashboard:"
    echo "1. Go to https://cloud.vast.ai"
    echo "2. Navigate to 'Instances' tab"
    echo "3. Click on your instance"
    echo "4. Copy the SSH command"
    exit 1
fi

# Connect via SSH
ssh -p $PORT root@$HOST

