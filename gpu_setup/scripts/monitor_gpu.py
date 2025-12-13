#!/usr/bin/env python3
"""
GPU Monitoring Script
Monitors GPU usage in real-time
"""

import time
import subprocess
import sys

def get_gpu_info():
    """Get GPU information using nvidia-smi"""
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=index,name,utilization.gpu,memory.used,memory.total,temperature.gpu", "--format=csv,noheader,nounits"],
            capture_output=True,
            text=True
        )
        return result.stdout
    except Exception as e:
        print(f"Error getting GPU info: {e}")
        return None

def monitor_loop(interval=2):
    """Monitor GPU in a loop"""
    print("🖥️  GPU Monitor (Press Ctrl+C to stop)")
    print("=" * 80)
    
    try:
        while True:
            # Clear screen (works on most terminals)
            print("\033[2J\033[H", end="")
            
            print("🖥️  GPU Monitor")
            print("=" * 80)
            print(f"Update interval: {interval} seconds")
            print("=" * 80)
            
            gpu_info = get_gpu_info()
            if gpu_info:
                print(gpu_info)
            else:
                print("❌ Could not get GPU information")
            
            print("=" * 80)
            print("Press Ctrl+C to stop")
            
            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("\n\n✅ Monitoring stopped")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Monitor GPU usage")
    parser.add_argument(
        "--interval",
        type=int,
        default=2,
        help="Update interval in seconds (default: 2)"
    )
    
    args = parser.parse_args()
    
    monitor_loop(interval=args.interval)

