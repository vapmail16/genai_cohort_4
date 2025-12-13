# GPU Setup Guide - Vast.ai

This folder contains all artifacts and scripts for renting and using GPUs from vast.ai to run AI models.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Renting a GPU](#renting-a-gpu)
- [Connecting to Your Instance](#connecting-to-your-instance)
- [Setting Up Environment](#setting-up-environment)
- [Running Models](#running-models)
- [Cost Management](#cost-management)

## 🚀 Quick Start

1. **Rent a GPU** from [vast.ai](https://cloud.vast.ai)
2. **Connect** using SSH (see connection details in vast.ai dashboard)
3. **Run setup script**: `./scripts/setup_gpu_environment.sh`
4. **Start running models** using provided scripts

## 💰 Renting a GPU on Vast.ai

### Step 1: Choose a GPU Instance

1. Go to [cloud.vast.ai](https://cloud.vast.ai)
2. Navigate to **Search** tab
3. Filter by:
   - **GPU Type**: RTX 5090, H200, or RTX 4090 (good for most models)
   - **Price**: Under $1/hr (with $10 credit, you can run ~10 hours)
   - **Reliability**: 90%+ (toggle "Show Secure Cloud Only")
   - **Max Duration**: Set based on your needs

### Step 2: Select Template (Optional)

- Click **"Select Template"** button
- Choose a pre-configured template (PyTorch, TensorFlow, etc.)
- Or start with a base image and configure manually

### Step 3: Rent the Instance

1. Click **"RENT"** on your chosen GPU
2. Configure:
   - **Image**: Choose base image (Ubuntu 22.04 recommended)
   - **Disk Space**: 20GB for GPT-2, 50-100GB for 7B+ models
   - **SSH Key**: Add your SSH public key
3. Click **"Create"**
4. Wait 1-2 minutes for instance to start

### Step 4: Get Connection Details

Once instance is running:
1. Go to **"Instances"** tab
2. Click on your instance
3. Copy:
   - **SSH Command** (looks like: `ssh -p 12345 root@ssh.vast.ai`)
   - **Password** (if using password auth)
   - **Jupyter URL** (if enabled)

## 🔌 Connecting to Your Instance

### Method 1: SSH Connection

```bash
# Use the SSH command from vast.ai dashboard
ssh -p <PORT> root@ssh.vast.ai

# Or use the connection script
./scripts/connect_to_instance.sh
```

### Method 2: Jupyter Notebook

1. Enable Jupyter in instance settings
2. Access via URL provided in dashboard
3. Use token from instance details

### Method 3: VS Code Remote SSH

1. Install "Remote - SSH" extension
2. Add connection details to `~/.ssh/config`
3. Connect directly from VS Code

## 🛠️ Setting Up Environment

### Automatic Setup

Run the setup script after connecting:

```bash
./scripts/setup_gpu_environment.sh
```

This will install:
- CUDA toolkit
- PyTorch with GPU support
- Common ML libraries
- Jupyter Lab
- Model management tools

### Manual Setup

See `configs/environment_setup.md` for detailed manual setup instructions.

## 🤖 Running Models

### Quick Test

```bash
# Test GPU availability
python scripts/test_gpu.py

# Run a simple model (GPT-2, fast and small)
python scripts/run_7b_model.py --model-name gpt2
```

### Using Provided Scripts

- `scripts/run_7b_model.py` - Run language models (GPT-2 by default, supports larger models)
- `scripts/download_model.py` - Download models from HuggingFace
- `scripts/monitor_gpu.py` - Monitor GPU usage
- `scripts/transfer_files.sh` - Transfer files to/from instance
- `scripts/quick_test.py` - Quick test with small model

## 💵 Cost Management

### Budget Tracking

With $10 credit:
- **$0.40/hr** = ~25 hours
- **$0.94/hr** = ~10 hours
- **$2.00/hr** = ~5 hours

### Cost Monitoring

```bash
# Check current usage
./scripts/check_usage.sh

# Set up alerts
./scripts/setup_cost_alerts.sh
```

### Best Practices

1. **Stop instances** when not in use
2. **Use spot instances** for lower costs
3. **Monitor usage** regularly
4. **Set up auto-shutdown** after inactivity
5. **Download results** before stopping instance

## 📁 Folder Structure

```
gpu_setup/
├── scripts/          # Automation scripts
├── configs/          # Configuration files
├── models/           # Model files and checkpoints
├── logs/             # Training/inference logs
├── notebooks/        # Jupyter notebooks
└── README.md         # This file
```

## 🔗 Useful Links

- [Vast.ai Documentation](https://docs.vast.ai/)
- [Vast.ai Dashboard](https://cloud.vast.ai)
- [CUDA Installation Guide](https://developer.nvidia.com/cuda-downloads)
- [PyTorch Installation](https://pytorch.org/get-started/locally/)

## ⚠️ Important Notes

1. **Always backup your work** - Instances can be terminated
2. **Monitor costs** - Set up alerts before hitting limit
3. **Save checkpoints** - Download model checkpoints regularly
4. **Use persistent storage** - For important data
5. **Check instance status** - Instances can be interrupted

## 🆘 Troubleshooting

See `configs/troubleshooting.md` for common issues and solutions.

