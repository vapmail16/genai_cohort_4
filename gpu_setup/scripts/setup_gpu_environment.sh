#!/bin/bash

# GPU Environment Setup Script for Vast.ai
# Run this script after connecting to your rented GPU instance

set -e

echo "🚀 Setting up GPU environment..."

# Update system
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install basic tools
echo "🔧 Installing basic tools..."
apt-get install -y \
    wget \
    curl \
    git \
    vim \
    htop \
    tmux \
    screen \
    build-essential \
    python3-pip \
    python3-dev

# Check CUDA availability
echo "🔍 Checking CUDA..."
if command -v nvidia-smi &> /dev/null; then
    echo "✅ NVIDIA drivers found"
    nvidia-smi
else
    echo "⚠️  NVIDIA drivers not found. Installing..."
    # Note: Vast.ai instances usually come with CUDA pre-installed
    # If not, you may need to install manually
fi

# Install Python packages
echo "🐍 Installing Python packages..."
pip3 install --upgrade pip

# Install PyTorch with CUDA support
echo "🔥 Installing PyTorch with CUDA..."
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install common ML libraries
echo "📚 Installing ML libraries..."
pip3 install \
    transformers \
    accelerate \
    datasets \
    huggingface-hub \
    jupyter \
    jupyterlab \
    notebook \
    matplotlib \
    numpy \
    pandas \
    scikit-learn \
    tensorboard \
    wandb

# Install additional utilities
echo "🛠️  Installing utilities..."
pip3 install \
    psutil \
    gpustat \
    nvitop

# Create directories
echo "📁 Creating directories..."
mkdir -p ~/models
mkdir -p ~/data
mkdir -p ~/checkpoints
mkdir -p ~/logs
mkdir -p ~/notebooks

# Setup Jupyter
echo "📓 Setting up Jupyter..."
jupyter lab --generate-config
# Note: Configure Jupyter password manually if needed

# Test GPU
echo "🧪 Testing GPU..."
python3 << EOF
import torch
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA version: {torch.version.cuda}")
    print(f"GPU device: {torch.cuda.get_device_name(0)}")
    print(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
else:
    print("⚠️  CUDA not available!")
EOF

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test GPU: python3 scripts/test_gpu.py"
echo "2. Start Jupyter: jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root"
echo "3. Download models: python3 scripts/download_model.py"

