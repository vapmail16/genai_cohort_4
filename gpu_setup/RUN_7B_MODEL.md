# 🚀 Running Language Models on Your GPU Instance

**Default: GPT-2 (small, fast, ~500MB)**  
**Also supports: 7B models (Mistral, Llama 2) for larger instances**

## Quick Start - 3 Methods

### Method 1: Using Vast.ai Web Portal (Easiest) ⭐

Since your instance is already running with Jupyter:

1. **Open Jupyter**:
   - Go to your instance in vast.ai dashboard
   - Click **"Open"** button
   - Or go to **Applications** → Click **"Launch Application"** on Jupyter
   - This opens Jupyter in your browser

2. **Open the notebook**:
   - Navigate to `notebooks/run_7b_model.ipynb`
   - Or create new notebook and copy code

3. **Run the cells** - GPT-2 downloads in seconds and runs immediately!

### Method 2: Using SSH + Script (Recommended)

1. **Connect via SSH**:
   ```bash
   # Get SSH command from vast.ai dashboard
   # It looks like: ssh -p 12345 root@ssh.vast.ai
   ssh -p YOUR_PORT root@ssh.vast.ai
   ```

2. **Upload the script** (if not already there):
   ```bash
   # From your local machine
   cd gpu_setup
   scp -P YOUR_PORT scripts/run_7b_model.py root@ssh.vast.ai:~/
   ```

3. **On the GPU instance, run**:
   ```bash
   # Make executable
   chmod +x run_7b_model.py
   
   # Download and run model (interactive mode) - GPT-2 by default
   python3 run_7b_model.py
   
   # Or with a prompt
   python3 run_7b_model.py \
     --prompt "Explain how neural networks work in simple terms"
   
   # For larger models (requires more disk space):
   python3 run_7b_model.py --model-name mistralai/Mistral-7B-Instruct-v0.2
   ```

### Method 3: Using Jupyter Terminal

1. **Open Jupyter** from vast.ai Applications
2. **Click "New"** → **"Terminal"**
3. **Run commands**:
   ```bash
   cd ~
   python3 run_7b_model.py  # Uses GPT-2 by default
   ```

## 📥 Downloading Models

### Option 1: Using the Script (Automatic)

```bash
# Download only (don't load) - GPT-2 is fast, no need to pre-download
python3 scripts/run_7b_model.py \
  --model-name gpt2 \
  --download-only

# For larger models:
python3 scripts/run_7b_model.py \
  --model-name mistralai/Mistral-7B-Instruct-v0.2 \
  --download-only
```

### Option 2: Using HuggingFace CLI

```bash
# Install CLI
pip install huggingface-hub

# Login (for gated models like Llama)
huggingface-cli login
# Enter your token from: https://huggingface.co/settings/tokens

# Download model
huggingface-cli download meta-llama/Llama-2-7b-chat-hf
```

### Option 3: Using Python

```bash
python3 scripts/download_model.py \
  --model-name meta-llama/Llama-2-7b-chat-hf
```

## 🤖 Recommended Models

### Small Models (Fast, Good for Testing)
| Model | Size | HuggingFace Name | Notes |
|-------|------|-----------------|-------|
| GPT-2 | ~500MB | `gpt2` | **Default** - Fast, works on any instance |
| GPT-2 Medium | ~1.5GB | `gpt2-medium` | Better quality, still fast |

### Large Models (Better Quality, Need More Space)
| Model | Size | HuggingFace Name | Notes |
|-------|------|-----------------|-------|
| Mistral 7B Instruct | ~14GB | `mistralai/Mistral-7B-Instruct-v0.2` | Open, no login needed |
| Llama 2 7B Chat | ~14GB | `meta-llama/Llama-2-7b-chat-hf` | Requires HuggingFace login |
| Qwen 7B | ~14GB | `Qwen/Qwen-7B-Chat` | Good alternative |
| Gemma 7B | ~14GB | `google/gemma-7b` | Google's model |

## 💾 Model Sizes & Disk Requirements

- **GPT-2**: ~500MB - Works on 16GB disk instances ✅
- **GPT-2 Medium**: ~1.5GB - Works on 16GB disk instances ✅
- **7B models**: ~13-14GB - Need 50-100GB disk space ⚠️
- **Your RTX 5090**: 32 GB VRAM ✅ (plenty of VRAM for any model!)

## ⚡ Running with 8-bit Quantization

If you want to save memory or run multiple models:

```bash
python3 run_7b_model.py \
  --model-name meta-llama/Llama-2-7b-chat-hf \
  --use-8bit \
  --prompt "Your prompt here"
```

This reduces memory usage from ~14GB to ~7GB.

## 📝 Example Usage

### Single Prompt (GPT-2 - Default)

```bash
# GPT-2 (fast, small)
python3 run_7b_model.py \
  --prompt "Write a Python function to calculate fibonacci numbers"

# Or specify model explicitly
python3 run_7b_model.py \
  --model-name gpt2 \
  --prompt "Explain machine learning"
```

### Interactive Chat

```bash
# GPT-2 (default)
python3 run_7b_model.py

# For larger models (need more disk space):
python3 run_7b_model.py --model-name mistralai/Mistral-7B-Instruct-v0.2

# Then type your prompts interactively
# Type 'quit' to exit
```

### Download Only

```bash
# GPT-2 downloads instantly, no need to pre-download
# For larger models:
python3 run_7b_model.py \
  --model-name mistralai/Mistral-7B-Instruct-v0.2 \
  --download-only
```

## 🔧 Troubleshooting

### Out of Memory

- Use `--use-8bit` flag
- Close other applications
- Use a smaller model variant

### Model Not Found

- Check model name is correct
- For gated models (like Llama), you need to login:
  ```bash
  huggingface-cli login
  ```

### Slow Downloads

- GPT-2 downloads in seconds (~500MB)
- Large models (7B) are 13-14 GB, be patient
- Check network speed in instance details
- Use `--resume-download` if interrupted

### Repetitive Responses

- GPT-2 can be repetitive (it's a smaller model)
- The script includes repetition penalty to reduce this
- For better quality, use GPT-2 Medium or larger models

### Can't Connect

- Check instance is running in dashboard
- Verify SSH port is correct
- Try using Jupyter web interface instead

## 💰 Cost Estimate

### GPT-2 (Default)
- **Download time**: Seconds (~500MB)
- **Model loading**: < 30 seconds
- **Inference**: Very fast, minimal cost
- **Total for setup**: < $0.01 (one-time)
- **Per query**: Negligible (< $0.001)

### 7B Models
- **Download time**: 10-20 minutes (one-time, ~14GB)
- **Model loading**: 1-2 minutes
- **Inference**: Fast, minimal cost
- **Total for setup**: ~$0.10-0.20 (one-time)
- **Per query**: Negligible (< $0.01)

## 📚 Next Steps

After running your first model:

1. Try different prompts
2. Experiment with temperature settings
3. Try other 7B models
4. Set up for production use
5. Fine-tune on your data (advanced)

## 🆘 Need Help?

- Check `configs/troubleshooting.md`
- Monitor GPU: `python3 scripts/monitor_gpu.py`
- Check memory: `nvidia-smi`

