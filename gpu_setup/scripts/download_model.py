#!/usr/bin/env python3
"""
Model Download Script
Downloads models from HuggingFace Hub
"""

import argparse
from huggingface_hub import snapshot_download, login
import os

def download_model(model_name, cache_dir=None, token=None):
    """
    Download a model from HuggingFace Hub
    
    Args:
        model_name: Name of the model (e.g., "meta-llama/Llama-2-7b-chat-hf")
        cache_dir: Directory to cache the model
        token: HuggingFace token (optional, for private models)
    """
    
    if cache_dir is None:
        cache_dir = os.path.expanduser("~/models")
    
    os.makedirs(cache_dir, exist_ok=True)
    
    print(f"📥 Downloading model: {model_name}")
    print(f"📁 Cache directory: {cache_dir}")
    
    try:
        # Login if token provided
        if token:
            login(token=token)
        
        # Download model
        model_path = snapshot_download(
            repo_id=model_name,
            cache_dir=cache_dir,
            local_dir=os.path.join(cache_dir, model_name.replace("/", "_"))
        )
        
        print(f"✅ Model downloaded successfully!")
        print(f"📂 Location: {model_path}")
        
        return model_path
        
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Download models from HuggingFace Hub")
    parser.add_argument(
        "--model-name",
        type=str,
        required=True,
        help="Model name (e.g., 'meta-llama/Llama-2-7b-chat-hf')"
    )
    parser.add_argument(
        "--cache-dir",
        type=str,
        default=None,
        help="Directory to cache the model (default: ~/models)"
    )
    parser.add_argument(
        "--token",
        type=str,
        default=None,
        help="HuggingFace token (for private models)"
    )
    
    args = parser.parse_args()
    
    download_model(
        model_name=args.model_name,
        cache_dir=args.cache_dir,
        token=args.token
    )

if __name__ == "__main__":
    main()

