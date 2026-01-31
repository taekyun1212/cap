import os
from dotenv import load_dotenv
import redis.asyncio as redis

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

redis_client = redis.Redis(host="localhost", port=6379, decode_responses=False)
