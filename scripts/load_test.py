import asyncio
import aiohttp
import time
import statistics

# Configuration
BASE_URL = "http://localhost:8000"
CONCURRENT_USERS = 10
REQUESTS_PER_USER = 5
ENDPOINT = "/generate?count=2"

async def simulate_user(user_id):
    latencies = []
    async with aiohttp.ClientSession() as session:
        for i in range(REQUESTS_PER_USER):
            start_time = time.time()
            try:
                async with session.get(f"{BASE_URL}{ENDPOINT}") as response:
                    await response.json()
                    latency = time.time() - start_time
                    latencies.append(latency)
                    # print(f"User {user_id} - Request {i+1}: {latency:.2f}s")
            except Exception as e:
                print(f"User {user_id} failed: {e}")
    return latencies

async def main():
    print(f"Starting load test on {BASE_URL}...")
    print(f"Users: {CONCURRENT_USERS}, Requests/User: {REQUESTS_PER_USER}")
    
    start_total = time.time()
    tasks = [simulate_user(i) for i in range(CONCURRENT_USERS)]
    results = await asyncio.gather(*tasks)
    
    total_time = time.time() - start_total
    all_latencies = [l for user_l in results for l in user_l]
    
    if all_latencies:
        print("\n--- Load Test Results ---")
        print(f"Total Requests: {len(all_latencies)}")
        print(f"Total Time: {total_time:.2f}s")
        print(f"Avg Latency: {statistics.mean(all_latencies):.2f}s")
        print(f"P95 Latency: {statistics.quantiles(all_latencies, n=20)[18]:.2f}s")
        print(f"Requests/sec: {len(all_latencies) / total_time:.2f}")
    else:
        print("No successful requests recorded.")

if __name__ == "__main__":
    asyncio.run(main())
