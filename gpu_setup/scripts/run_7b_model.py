#!/usr/bin/env python3
"""
Run Language Model Script
Downloads and runs language models (GPT-2 by default, supports 7B+ models)
Includes repetition penalty to prevent repetitive outputs
"""

import argparse
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import sys
import os

def check_gpu():
    """Check if GPU is available"""
    if not torch.cuda.is_available():
        print("❌ CUDA not available! Make sure you're on a GPU instance.")
        return False
    
    device = torch.device("cuda")
    print(f"✅ GPU Available: {torch.cuda.get_device_name(0)}")
    print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    return device

def download_model(model_name, cache_dir=None):
    """Download model from HuggingFace"""
    if cache_dir is None:
        cache_dir = os.path.expanduser("~/models")
    
    os.makedirs(cache_dir, exist_ok=True)
    
    # Estimate download time based on model size
    model_sizes = {
        "gpt2": "~500MB (downloads in seconds)",
        "gpt2-medium": "~1.5GB (downloads in minutes)",
    }
    
    size_info = model_sizes.get(model_name, "~13-14GB (downloads in 10-20 minutes)")
    
    print(f"\n📥 Downloading model: {model_name}")
    print(f"📁 Cache directory: {cache_dir}")
    print(f"⏳ Size: {size_info}")
    
    try:
        from huggingface_hub import snapshot_download
        model_path = snapshot_download(
            repo_id=model_name,
            cache_dir=cache_dir,
            local_dir=os.path.join(cache_dir, model_name.replace("/", "_"))
        )
        print(f"✅ Model downloaded to: {model_path}")
        return model_path
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        return None

def load_model(model_name, device, use_8bit=False):
    """Load model and tokenizer"""
    print(f"\n🔄 Loading model: {model_name}")
    
    try:
        # Load tokenizer
        print("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Set pad token if not set
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Load model
        is_small_model = model_name.startswith("gpt2")
        if is_small_model:
            print("Loading model (GPT-2 is fast, this takes seconds)...")
        else:
            print("Loading model (this may take a few minutes)...")
        
        load_kwargs = {
            "torch_dtype": torch.float16,  # Use half precision to save memory
        }
        
        # For small models, load directly to GPU
        # For large models, use device_map
        if not is_small_model:
            load_kwargs["device_map"] = "auto"
        
        if use_8bit:
            from transformers import BitsAndBytesConfig
            load_kwargs["quantization_config"] = BitsAndBytesConfig(
                load_in_8bit=True
            )
            print("Using 8-bit quantization to save memory...")
        
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            **load_kwargs
        )
        
        # Move to GPU if not using device_map
        if is_small_model:
            model = model.to(device)
        
        print("✅ Model loaded successfully!")
        return model, tokenizer
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None, None

def generate_text(model, tokenizer, prompt, max_length=512, temperature=0.7):
    """Generate text from prompt with repetition penalty"""
    print(f"\n💭 Generating response...")
    print(f"Prompt: {prompt}")
    print("-" * 60)
    
    # Tokenize input
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    # Generate with repetition penalty to prevent loops
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            temperature=temperature,
            do_sample=True,
            top_p=0.9,
            repetition_penalty=1.2,  # Prevents repetitive outputs
            no_repeat_ngram_size=2,  # Prevents repeating 2-word phrases
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )
    
    # Decode output
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract only the new text (remove prompt)
    response = generated_text[len(prompt):].strip()
    
    return response

def interactive_mode(model, tokenizer):
    """Interactive chat mode"""
    print("\n" + "=" * 60)
    print("🤖 Interactive Mode - Type 'quit' or 'exit' to stop")
    print("=" * 60)
    
    while True:
        try:
            prompt = input("\nYou: ")
            
            if prompt.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not prompt.strip():
                continue
            
            response = generate_text(model, tokenizer, prompt, max_length=256, temperature=0.7)
            print(f"\n🤖 Assistant: {response}")
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Run language model on GPU (GPT-2 by default)")
    parser.add_argument(
        "--model-name",
        type=str,
        default="gpt2",
        help="Model name from HuggingFace (default: gpt2). Options: gpt2, gpt2-medium, mistralai/Mistral-7B-Instruct-v0.2, etc."
    )
    parser.add_argument(
        "--prompt",
        type=str,
        default=None,
        help="Single prompt to generate (if not provided, enters interactive mode)"
    )
    parser.add_argument(
        "--use-8bit",
        action="store_true",
        help="Use 8-bit quantization (saves memory, slightly slower)"
    )
    parser.add_argument(
        "--download-only",
        action="store_true",
        help="Only download model, don't load it"
    )
    parser.add_argument(
        "--cache-dir",
        type=str,
        default=None,
        help="Directory to cache models (default: ~/models)"
    )
    
    args = parser.parse_args()
    
    # Check GPU
    device = check_gpu()
    if not device:
        sys.exit(1)
    
    # Download model if needed
    model_path = download_model(args.model_name, args.cache_dir)
    if not model_path and not args.download_only:
        sys.exit(1)
    
    if args.download_only:
        print("✅ Download complete!")
        sys.exit(0)
    
    # Load model
    model, tokenizer = load_model(args.model_name, device, args.use_8bit)
    if model is None:
        sys.exit(1)
    
    # Check memory usage
    allocated = torch.cuda.memory_allocated(device) / 1e9
    reserved = torch.cuda.memory_reserved(device) / 1e9
    print(f"\n📊 Memory Usage:")
    print(f"   Allocated: {allocated:.2f} GB")
    print(f"   Reserved: {reserved:.2f} GB")
    
    # Run inference
    if args.prompt:
        response = generate_text(model, tokenizer, args.prompt)
        print(f"\n🤖 Response: {response}")
    else:
        interactive_mode(model, tokenizer)
    
    # Cleanup
    del model
    torch.cuda.empty_cache()
    print("\n✅ Done!")

if __name__ == "__main__":
    main()

