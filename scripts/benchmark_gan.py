import time
import sys
import os

# Add root to path
root = os.path.join(os.path.dirname(__file__), '..')
if root not in sys.path:
    sys.path.insert(0, root)

from backend.gan_simulator import GANSimulator

def benchmark_simulation():
    print("--- GAN Performance Benchmark ---")
    simulator = GANSimulator()
    simulator.max_epochs = 50 # Reduce for faster benchmark
    
    # 1. Benchmark Training step
    print(f"Benchmarking {simulator.max_epochs} simulated training epochs...")
    start = time.time()
    epochs_count = 0
    for _ in simulator.train():
        epochs_count += 1
    duration = time.time() - start
    print(f"{epochs_count} Epochs simulated in: {duration:.4f}s")
    print(f"Avg time per epoch: {(duration/epochs_count)*1000:.2f}ms")
    
    # 2. Benchmark Sample Generation
    print("\nBenchmarking generation of 1000 synthetic samples...")
    start = time.time()
    _ = simulator.generate_samples(1000)
    duration = time.time() - start
    print(f"1000 samples generated in: {duration:.4f}s")
    print(f"Throughput: {1000/duration:.2f} samples/sec")

if __name__ == "__main__":
    benchmark_simulation()
