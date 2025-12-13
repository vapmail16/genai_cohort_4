# Vast.ai Setup Guide - Step by Step

## 🎯 Quick Setup Checklist

- [ ] Create account on vast.ai
- [ ] Add payment method ($10 credit added)
- [ ] Choose GPU instance
- [ ] Configure instance settings
- [ ] Rent and start instance
- [ ] Connect via SSH
- [ ] Run setup script
- [ ] Test GPU
- [ ] Start using!

## 📝 Detailed Steps

### Step 1: Account Setup

1. Go to [cloud.vast.ai](https://cloud.vast.ai)
2. Sign up or log in
3. Add payment method (you've already added $10 credit ✅)

### Step 2: Choose Your GPU

**Recommended GPUs for $10 budget:**

| GPU | Price/hr | Hours Available | Best For |
|-----|----------|----------------|----------|
| RTX 5090 (1x) | $0.40 | ~25 hours | Most models, great value |
| RTX 5090 (2x) | $0.94 | ~10 hours | Larger models, faster training |
| RTX 4090 | $0.30-0.50 | ~20 hours | Good alternative |
| H200 | $2.00+ | ~5 hours | Very large models only |

**Filter Settings:**
- **Reliability**: 90%+ (toggle "Show Secure Cloud Only")
- **Max Duration**: Set based on your needs (7 days default)
- **Location**: Choose closest to you for lower latency
- **Price**: Under $1/hr recommended for your budget

### Step 3: Configure Instance

When clicking "RENT", configure:

1. **Image Selection:**
   - Choose: `Ubuntu 22.04` or `PyTorch` template
   - Base images are fine, templates save setup time

2. **Disk Space:**
   - **16-20GB**: GPT-2 models (default, works great!)
   - **50GB**: 7B models (Mistral, Llama 2)
   - **100GB+**: Large models, datasets

3. **SSH Key:**
   - Generate if you don't have one:
     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ```
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Paste into vast.ai SSH key field

4. **Jupyter (Optional but Recommended):**
   - Enable Jupyter Lab
   - Set a password
   - Access via URL provided

5. **Network:**
   - Public IP: Usually enabled by default
   - Static IP: Optional, costs extra

### Step 4: Start Instance

1. Click **"Create"** or **"Rent"**
2. Wait 1-3 minutes for instance to start
3. Status will change to "Running"
4. Note the connection details

### Step 5: Connect

**Option A: SSH (Recommended)**

1. Go to **"Instances"** tab
2. Click on your instance
3. Copy SSH command (looks like):
   ```bash
   ssh -p 12345 root@ssh.vast.ai
   ```
4. Run in terminal

**Option B: Jupyter**

1. Copy Jupyter URL from instance details
2. Open in browser
3. Enter password/token
4. Start coding!

**Option C: VS Code Remote**

1. Install "Remote - SSH" extension
2. Add to `~/.ssh/config`:
   ```
   Host vast-gpu
       HostName ssh.vast.ai
       Port 12345
       User root
   ```
3. Connect via VS Code

### Step 6: Initial Setup

Once connected, run:

```bash
# Clone or upload your setup script
git clone <your-repo>  # or upload files

# Make executable
chmod +x scripts/setup_gpu_environment.sh

# Run setup
./scripts/setup_gpu_environment.sh
```

This will take 10-15 minutes and install:
- CUDA toolkit
- PyTorch with GPU support
- ML libraries
- Jupyter Lab
- Utilities

### Step 7: Verify Setup

```bash
# Test GPU
python3 scripts/test_gpu.py

# Check GPU status
nvidia-smi

# Monitor GPU
python3 scripts/monitor_gpu.py
```

### Step 8: Start Using!

You're ready to:
- Run models
- Train models
- Use Jupyter notebooks
- Process data

## 💰 Cost Management

### Budget Breakdown

With $10 credit:
- **$0.40/hr** = 25 hours total
- **$0.94/hr** = 10.6 hours total
- **$2.00/hr** = 5 hours total

### Cost-Saving Tips

1. **Stop when not using**: Instances charge per hour
2. **Use spot instances**: 20-30% cheaper
3. **Monitor usage**: Check dashboard regularly
4. **Set alerts**: Get notified at 80% usage
5. **Download results**: Before stopping instance

### Setting Up Alerts

1. Go to **"Billing"** in vast.ai
2. Set usage alerts
3. Configure email notifications

## 🔧 Common Configurations

### For Small Models (GPT-2, GPT-2 Medium)
- GPU: 1x RTX 5090 or RTX 4090
- Disk: 16-20GB (works on minimal instances!)
- Price: $0.30-0.50/hr
- **Recommended for testing and learning**

### For Medium Models (7B parameters)
- GPU: 1x RTX 5090 or 2x RTX 4090
- Disk: 50-100GB (need more space!)
- Price: $0.40-0.94/hr

### For Large Models (13B+ parameters)
- GPU: 2x RTX 5090 or H200
- Disk: 100GB+
- Price: $0.94-2.00+/hr

## ⚠️ Important Notes

1. **Instances can be interrupted**: Save work frequently
2. **Data persistence**: Use external storage for important data
3. **Network speeds**: Can vary, test before large downloads
4. **Time limits**: Some instances have max duration limits
5. **Auto-shutdown**: Configure to avoid unexpected charges

## 🆘 Troubleshooting

### Can't Connect via SSH
- Check port number is correct
- Verify SSH key is added
- Try password authentication
- Check instance status is "Running"

### GPU Not Detected
- Run `nvidia-smi` to check drivers
- Verify CUDA installation
- Check PyTorch CUDA version matches

### Out of Disk Space
- Clean up: `apt-get clean`
- Remove unused packages
- Use external storage
- Rent instance with more disk

### Instance Too Slow
- Check GPU utilization: `nvidia-smi`
- Verify you're using GPU, not CPU
- Check network speeds
- Consider upgrading to more GPUs

## 📚 Next Steps

After setup:
1. Download your first model
2. Run inference
3. Start training (if needed)
4. Monitor costs
5. Save your work!

