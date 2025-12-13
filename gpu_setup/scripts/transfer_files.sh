#!/bin/bash

# File Transfer Script for Vast.ai Instances
# Transfers files to/from your GPU instance

set -e

PORT=${1:-"YOUR_PORT_HERE"}
HOST=${2:-"ssh.vast.ai"}
REMOTE_USER=${3:-"root"}

if [ "$PORT" == "YOUR_PORT_HERE" ]; then
    echo "⚠️  Usage: ./transfer_files.sh [PORT] [HOST] [USER]"
    echo ""
    echo "Example:"
    echo "  ./transfer_files.sh 12345 ssh.vast.ai root"
    echo ""
    echo "Or set environment variables:"
    echo "  export VAST_PORT=12345"
    echo "  export VAST_HOST=ssh.vast.ai"
    echo ""
    exit 1
fi

# Use environment variables if set
PORT=${VAST_PORT:-$PORT}
HOST=${VAST_HOST:-$HOST}
REMOTE_USER=${VAST_USER:-$REMOTE_USER}

echo "📁 File Transfer Helper for Vast.ai"
echo "Host: $HOST"
echo "Port: $PORT"
echo "User: $REMOTE_USER"
echo ""

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
    echo "⚠️  rsync not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install rsync
        else
            echo "Please install rsync: brew install rsync"
            exit 1
        fi
    else
        # Linux
        sudo apt-get update && sudo apt-get install -y rsync
    fi
fi

echo "Select operation:"
echo "1. Upload files TO instance"
echo "2. Download files FROM instance"
echo "3. Sync directory (bidirectional)"
read -p "Choice (1-3): " choice

case $choice in
    1)
        read -p "Local file/directory to upload: " local_path
        read -p "Remote destination path: " remote_path
        echo "📤 Uploading $local_path to $remote_path..."
        rsync -avz -e "ssh -p $PORT" "$local_path" "$REMOTE_USER@$HOST:$remote_path"
        ;;
    2)
        read -p "Remote file/directory to download: " remote_path
        read -p "Local destination path: " local_path
        echo "📥 Downloading $remote_path to $local_path..."
        rsync -avz -e "ssh -p $PORT" "$REMOTE_USER@$HOST:$remote_path" "$local_path"
        ;;
    3)
        read -p "Local directory: " local_dir
        read -p "Remote directory: " remote_dir
        echo "🔄 Syncing $local_dir with $remote_dir..."
        rsync -avz -e "ssh -p $PORT" "$local_dir" "$REMOTE_USER@$HOST:$remote_dir"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo "✅ Transfer complete!"

