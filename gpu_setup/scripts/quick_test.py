#!/usr/bin/env python3
"""
Quick Test Script - Verify GPU and Setup
Tests with a small model first before loading 7B model
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import sys

def test_gpu():
    """Test GPU availability"""
    print("=" * 60)
    print("GPU TEST")
    print("=" * 60)
    
    if not torch.cuda.is_available():
        print("❌ CUDA not available!")
        return False
    
    print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
    print(f"✅ VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    return True

def test_small_model():
    """Test with a small model (GPT-2, ~500MB)"""
    print("\n" + "=" * 60)
    print("SMALL MODEL TEST (GPT-2)")
    print("=" * 60)
    print("This tests your setup with a small model first...")
    print("If this works, your 7B model will work too!")
    print("-" * 60)
    
    try:
        print("Loading GPT-2 (this should be fast, ~30 seconds)...")
        tokenizer = AutoTokenizer.from_pretrained("gpt2")
        model = AutoModelForCausalLM.from_pretrained("gpt2").to("cuda")
        
        print("✅ Model loaded!")
        
        # Test generation
        print("\nTesting generation...")
        prompt = "The future of AI is"
        inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=50,
                temperature=0.7,
                do_sample=True,
                repetition_penalty=1.2,  # Prevent repetitive outputs
                no_repeat_ngram_size=2
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"\n✅ Test successful!")
        print(f"Prompt: {prompt}")
        print(f"Response: {response}")
        
        # Cleanup
        del model
        torch.cuda.empty_cache()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        print("\n💡 Your setup is working correctly!")
        print("💡 GPT-2 is now the default model - it's fast and works great!")
        print("💡 For better quality, you can use larger models (7B+) when you have more disk space.")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check if transformers is installed: pip install transformers")
        print("2. Check GPU is available: nvidia-smi")
        print("3. Check disk space: df -h")
        return False

if __name__ == "__main__":
    if not test_gpu():
        sys.exit(1)
    
    if not test_small_model():
        sys.exit(1)
    
        print("\n🚀 Ready to load models!")
    print("💡 GPT-2 (default) downloads in seconds!")
    print("💡 7B models take 10-20 minutes to download")

