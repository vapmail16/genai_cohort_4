# Troubleshooting Guide

Common issues and solutions when using Vast.ai GPU instances.

## Connection Issues

### SSH Connection Fails

**Symptoms:**
- "Connection refused" error
- "Permission denied" error
- Timeout errors

**Solutions:**
1. Verify instance is running in dashboard
2. Check port number is correct
3. Verify SSH key is added correctly
4. Try password authentication instead
5. Check firewall settings

### Jupyter Not Accessible

**Symptoms:**
- Can't access Jupyter URL
- Connection timeout

**Solutions:**
1. Verify Jupyter is enabled in instance settings
2. Check URL and token are correct
3. Try accessing via SSH tunnel:
   ```bash
   ssh -L 8888:localhost:8888 -p PORT root@ssh.vast.ai
   ```
4. Then access: `http://localhost:8888`

## GPU Issues

### GPU Not Detected

**Symptoms:**
- `nvidia-smi` shows no GPUs
- PyTorch says CUDA not available

**Solutions:**
1. Check NVIDIA drivers:
   ```bash
   nvidia-smi
   ```
2. Verify CUDA installation:
   ```bash
   nvcc --version
   ```
3. Reinstall PyTorch with correct CUDA version
4. Check instance actually has GPU (some base images don't)

### Out of Memory Errors

**Symptoms:**
- "CUDA out of memory" errors
- Model won't load

**Solutions:**
1. Use smaller batch size
2. Enable gradient checkpointing
3. Use model quantization (8-bit, 4-bit)
4. Clear cache:
   ```python
   torch.cuda.empty_cache()
   ```
5. Rent instance with more VRAM

### Slow Performance

**Symptoms:**
- Model runs but very slowly
- GPU utilization is low

**Solutions:**
1. Verify using GPU, not CPU:
   ```python
   device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
   model.to(device)
   ```
2. Check GPU utilization: `nvidia-smi -l 1`
3. Ensure data is on GPU, not CPU
4. Use mixed precision training
5. Check for bottlenecks in data loading

## Environment Issues

### Package Installation Fails

**Symptoms:**
- pip install errors
- Missing dependencies

**Solutions:**
1. Update pip: `pip install --upgrade pip`
2. Use conda instead of pip
3. Install build dependencies:
   ```bash
   apt-get install build-essential python3-dev
   ```
4. Use virtual environment
5. Check Python version compatibility

### CUDA Version Mismatch

**Symptoms:**
- PyTorch installed but CUDA not working
- Version errors

**Solutions:**
1. Check CUDA version: `nvcc --version`
2. Install matching PyTorch version:
   ```bash
   # For CUDA 11.8
   pip install torch --index-url https://download.pytorch.org/whl/cu118
   
   # For CUDA 12.1
   pip install torch --index-url https://download.pytorch.org/whl/cu121
   ```
3. Verify: `python -c "import torch; print(torch.version.cuda)"`

## Storage Issues

### Out of Disk Space

**Symptoms:**
- "No space left on device"
- Can't save files

**Solutions:**
1. Check disk usage: `df -h`
2. Clean package cache: `apt-get clean`
3. Remove unused packages
4. Delete old model checkpoints
5. Use external storage (S3, Google Drive)
6. Rent instance with more disk space

### Slow Disk I/O

**Symptoms:**
- Slow file operations
- Model loading is slow

**Solutions:**
1. Use faster storage option if available
2. Keep models in memory when possible
3. Use SSD storage option
4. Cache frequently used data

## Network Issues

### Slow Downloads

**Symptoms:**
- Model downloads very slowly
- Timeouts during download

**Solutions:**
1. Use `huggingface-cli` with resume:
   ```bash
   huggingface-cli download model-name --resume-download
   ```
2. Download to faster storage
3. Use wget with resume:
   ```bash
   wget -c URL
   ```
4. Check network speeds in instance details

### Connection Drops

**Symptoms:**
- SSH connection drops
- Jupyter disconnects

**Solutions:**
1. Use `tmux` or `screen`:
   ```bash
   tmux new -s session_name
   ```
2. Use keepalive:
   ```bash
   ssh -o ServerAliveInterval=60 -p PORT root@ssh.vast.ai
   ```
3. Save work frequently
4. Use version control (git)

## Cost Issues

### Unexpected Charges

**Symptoms:**
- Credit used faster than expected
- Charges for stopped instances

**Solutions:**
1. Always stop instances when done
2. Check instance status regularly
3. Set up usage alerts
4. Review billing history
5. Use spot instances for lower costs

### Instance Terminated

**Symptoms:**
- Instance suddenly stops
- Can't reconnect

**Solutions:**
1. Check if credit ran out
2. Verify instance wasn't manually stopped
3. Check instance logs in dashboard
4. Some instances have max duration limits
5. Create new instance if needed

## Model-Specific Issues

### Model Won't Load

**Symptoms:**
- Out of memory
- Loading errors
- Out of disk space

**Solutions:**
1. **Use GPT-2 first** (small, ~500MB) - works on any instance
2. Use smaller model variant
3. Enable 8-bit or 4-bit quantization
4. Use model sharding
5. Load model in CPU first, then move to GPU
6. Use gradient checkpointing
7. **Check disk space**: `df -h` - need 20GB+ for 7B models

### Inference Errors

**Symptoms:**
- Runtime errors during inference
- Wrong outputs
- Repetitive responses

**Solutions:**
1. Check input format matches model requirements
2. Verify model and tokenizer match
3. Check for NaN or inf values
4. Use proper data types (float32 vs float16)
5. Enable error checking and logging
6. **For repetitive outputs**: The script includes `repetition_penalty=1.2` - if still repetitive, try:
   - Increase repetition_penalty to 1.3-1.5
   - Lower temperature to 0.5-0.6
   - Use a larger model (GPT-2 Medium or 7B models)

## Getting Help

If issues persist:

1. Check vast.ai documentation
2. Review instance logs in dashboard
3. Check system logs: `journalctl -xe`
4. Test with simple example first
5. Contact vast.ai support
6. Check GitHub issues for similar problems

## Prevention Tips

1. **Always test with small examples first**
2. **Save work frequently** (use git, external storage)
3. **Monitor GPU and disk usage**
4. **Set up cost alerts**
5. **Use version control**
6. **Document your setup**
7. **Keep backups of important work**

