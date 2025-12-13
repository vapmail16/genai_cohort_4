# 🔧 Troubleshooting: Model Loading Stuck

## Is It Really Stuck?

**Most likely: It's downloading!** A 7B model is ~13-14 GB and can take 10-20 minutes to download.

## Quick Checks

### 1. Check Download Progress

In Jupyter, create a new cell and run:

```python
import os
from pathlib import Path

cache_dir = Path.home() / ".cache" / "huggingface" / "hub"
model_cache = cache_dir / "models--mistralai--Mistral-7B-Instruct-v0.2"

if model_cache.exists():
    total_size = sum(f.stat().st_size for f in model_cache.rglob('*') if f.is_file())
    print(f"Downloaded: {total_size / 1e9:.2f} GB / ~14 GB")
    print("✅ Still downloading - be patient!")
else:
    print("⏳ Download just started...")
```

### 2. Check GPU Memory (in Terminal)

If you have SSH access, run:
```bash
watch -n 2 nvidia-smi
```

You should see memory usage increasing if the model is loading.

### 3. Check Network Activity

The model downloads from HuggingFace. Check if there's network activity.

## Solutions

### Option 1: Wait It Out (Recommended)

- **First download**: 10-20 minutes
- **Model loading**: 2-5 minutes
- **Total**: ~15-25 minutes first time

**Just wait!** The notebook is working, it's just downloading the large model files.

### Option 2: Use GPT-2 (Recommended for Testing)

GPT-2 is now the default model - it's small and fast:

```python
# GPT-2 is the default - loads in seconds
MODEL_NAME = "gpt2"  # Only 500MB, loads in seconds

from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to("cuda")

# Test it with repetition penalty
prompt = "Hello, how are"
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
outputs = model.generate(
    **inputs, 
    max_length=50,
    repetition_penalty=1.2,  # Prevents repetition
    no_repeat_ngram_size=2
)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

If this works, your setup is fine! GPT-2 is great for testing. For better quality, use larger models when you have more disk space.

### Option 3: Download Separately First

Download the model separately, then load it:

```python
# Cell 1: Download only
from huggingface_hub import snapshot_download
import os

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"
cache_dir = os.path.expanduser("~/models")

print("Downloading model (this will take 10-20 minutes)...")
model_path = snapshot_download(
    repo_id=MODEL_NAME,
    cache_dir=cache_dir
)
print(f"✅ Downloaded to: {model_path}")
```

Then in another cell, load from cache:

```python
# Cell 2: Load from cache
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    device_map="auto"
)
```

### Option 4: Use 8-bit Quantization (Faster Loading)

This loads faster and uses less memory:

```python
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"

# 8-bit config
quantization_config = BitsAndBytesConfig(load_in_8bit=True)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=quantization_config,
    device_map="auto"
)
```

### Option 5: Check for Errors

Look at the notebook output carefully. Sometimes errors are hidden. Common issues:

1. **Out of memory**: Use 8-bit quantization
2. **Network timeout**: Retry or use a different network
3. **Permission errors**: Check disk space

## What to Look For

### Good Signs (It's Working!):
- Progress bars showing download percentage
- Network activity
- GPU memory increasing
- No error messages
- Output shows "Downloading..." or progress

### Bad Signs (Actually Stuck):
- No output for 30+ minutes
- Error messages
- Kernel crashed
- "Connection timeout" errors

## Quick Test: Is Jupyter Working?

Run this simple test:

```python
import torch
print(f"CUDA: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'None'}")
```

If this works, your GPU is fine - just wait for the model download!

## Still Stuck?

1. **Restart kernel**: Kernel → Restart
2. **Clear output**: Cell → All Output → Clear
3. **Try again**: Run cells one by one
4. **Check logs**: Look for any error messages
5. **Use terminal**: Try the Python script instead: `python3 scripts/run_7b_model.py`

## Expected Timeline

### GPT-2 (Default)
- **0-2 min**: Installing packages (if needed)
- **0-30 sec**: Downloading model (~500MB)
- **10-30 sec**: Loading model to GPU
- **< 3 min total**: Ready to use! ✅

### 7B Models
- **0-2 min**: Installing packages (if needed)
- **2-20 min**: Downloading model (13-14 GB)
- **20-25 min**: Loading model to GPU
- **25+ min**: Ready to use! ✅

**GPT-2 is fast - use it for testing!** 🚀

