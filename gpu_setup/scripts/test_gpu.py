#!/usr/bin/env python3
"""
GPU Test Script
Tests GPU availability and performance
"""

import torch
import time
import sys

def test_gpu():
    """Test GPU availability and basic operations"""
    
    print("=" * 60)
    print("GPU TEST SUITE")
    print("=" * 60)
    
    # Check CUDA availability
    print("\n1. CUDA Availability Check")
    print("-" * 60)
    cuda_available = torch.cuda.is_available()
    print(f"CUDA Available: {cuda_available}")
    
    if not cuda_available:
        print("❌ CUDA is not available!")
        print("Please check:")
        print("  - NVIDIA drivers are installed")
        print("  - CUDA toolkit is installed")
        print("  - PyTorch was installed with CUDA support")
        return False
    
    # GPU Information
    print("\n2. GPU Information")
    print("-" * 60)
    device_count = torch.cuda.device_count()
    print(f"Number of GPUs: {device_count}")
    
    for i in range(device_count):
        print(f"\nGPU {i}:")
        props = torch.cuda.get_device_properties(i)
        print(f"  Name: {props.name}")
        print(f"  Total Memory: {props.total_memory / 1e9:.2f} GB")
        print(f"  Compute Capability: {props.major}.{props.minor}")
        print(f"  Multi Processor Count: {props.multi_processor_count}")
    
    # Memory Test
    print("\n3. Memory Test")
    print("-" * 60)
    device = torch.device("cuda:0")
    
    # Allocate a tensor
    try:
        test_tensor = torch.randn(1000, 1000, device=device)
        print(f"✅ Successfully allocated tensor on GPU")
        print(f"   Tensor shape: {test_tensor.shape}")
        print(f"   Tensor device: {test_tensor.device}")
        
        # Check memory usage
        allocated = torch.cuda.memory_allocated(device) / 1e9
        reserved = torch.cuda.memory_reserved(device) / 1e9
        print(f"   Allocated Memory: {allocated:.2f} GB")
        print(f"   Reserved Memory: {reserved:.2f} GB")
        
        del test_tensor
        torch.cuda.empty_cache()
        print("✅ Memory cleared successfully")
        
    except Exception as e:
        print(f"❌ Memory test failed: {e}")
        return False
    
    # Performance Test
    print("\n4. Performance Test")
    print("-" * 60)
    try:
        # Matrix multiplication test
        size = 2000
        a = torch.randn(size, size, device=device)
        b = torch.randn(size, size, device=device)
        
        # Warm up
        for _ in range(3):
            _ = torch.matmul(a, b)
        torch.cuda.synchronize()
        
        # Benchmark
        start_time = time.time()
        for _ in range(10):
            c = torch.matmul(a, b)
        torch.cuda.synchronize()
        end_time = time.time()
        
        avg_time = (end_time - start_time) / 10
        print(f"✅ Matrix multiplication test passed")
        print(f"   Matrix size: {size}x{size}")
        print(f"   Average time per operation: {avg_time*1000:.2f} ms")
        print(f"   Throughput: {1/avg_time:.2f} ops/sec")
        
        del a, b, c
        torch.cuda.empty_cache()
        
    except Exception as e:
        print(f"❌ Performance test failed: {e}")
        return False
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    print("\nYour GPU is ready to use! 🚀")
    
    return True

if __name__ == "__main__":
    success = test_gpu()
    sys.exit(0 if success else 1)

