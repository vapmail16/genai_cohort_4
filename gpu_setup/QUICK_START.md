# 🚀 Quick Start Guide - Renting GPU on Vast.ai

## Step-by-Step: Rent Your First GPU (5 minutes)

### 1. Choose Your GPU (2 min)

1. Go to [cloud.vast.ai](https://cloud.vast.ai) → **Search** tab
2. **Recommended for $10 budget:**
   - Filter: **1x RTX 5090** or **1x RTX 4090**
   - Price: **Under $0.50/hr** (gives you ~20 hours)
   - Reliability: **Toggle "Show Secure Cloud Only"** ✅
   - Location: Choose closest to you

3. **Good options:**
   - **1x RTX 5090** at ~$0.40/hr = 25 hours
   - **1x RTX 4090** at ~$0.30/hr = 33 hours
   - **2x RTX 5090** at ~$0.94/hr = 10 hours (if you need more power)

### 2. Configure Instance (1 min)

Click **"RENT"** button, then configure:

- **Image**: Choose `Ubuntu 22.04` or `PyTorch` template
- **Disk**: 30-50GB (enough for most models)
- **SSH Key**: Optional - vast.ai provides password authentication
  - If you want to use SSH key later, you can add it in Settings → Keys
  - For now, you can use the password provided in instance details
- **Jupyter**: ✅ Enable it (very useful!)
- **Password**: Set a Jupyter password (or use the one provided)

### 3. Start Instance (1 min)

1. Click **"Create"** or **"Rent"**
2. Wait 1-2 minutes
3. Status changes to **"Running"** ✅

### 4. Connect (1 min)

**Option A: SSH (Recommended)**
```bash
# Copy SSH command from vast.ai dashboard
# Looks like: ssh -p 12345 root@ssh.vast.ai
ssh -p YOUR_PORT root@ssh.vast.ai
```

**Option B: Jupyter**
- Copy Jupyter URL from dashboard
- Open in browser
- Enter password

### 5. Setup Environment (10-15 min)

Once connected, run:

```bash
# Upload or clone your setup files
# Then run:
chmod +x scripts/setup_gpu_environment.sh
./scripts/setup_gpu_environment.sh
```

This installs everything you need automatically!

### 6. Test GPU (30 sec)

```bash
python3 scripts/test_gpu.py
```

You should see: ✅ ALL TESTS PASSED!

## 🎉 You're Ready!

Now you can:
- Run models
- Train models  
- Use Jupyter notebooks
- Process data

## 💰 Cost Reminder

- **$0.40/hr** = ~25 hours with $10
- **$0.94/hr** = ~10 hours with $10
- **Always stop instance when done!**

## 📚 Next Steps

1. Test with GPT-2 (fast!): `python3 scripts/run_7b_model.py`
2. Run inference with a prompt: `python3 scripts/run_7b_model.py --prompt "Hello, how are you?"`
3. Monitor GPU: `python3 scripts/monitor_gpu.py`
4. For larger models (when you have more disk space): `python3 scripts/run_7b_model.py --model-name mistralai/Mistral-7B-Instruct-v0.2`

## 🆘 Need Help?

- See `configs/vast_ai_setup_guide.md` for detailed guide
- See `configs/troubleshooting.md` for common issues
- Check vast.ai dashboard for instance status

---

**Pro Tip:** Use `tmux` or `screen` to keep sessions alive:
```bash
tmux new -s gpu-session
# Your work continues even if SSH disconnects
```

