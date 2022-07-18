from datetime import datetime, timezone
from time import time

"""
Helpers
"""


def now_in_millis():
    return int(datetime.now(timezone.utc).timestamp() * 1000)

def get_key():
    now = datetime.now(timezone.utc)
    future = datetime(2080, 1, 1, tzinfo=timezone.utc)
    key = future - now
    key = key.total_seconds() * 1000
    return int(key)