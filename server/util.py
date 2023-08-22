from datetime import datetime, timezone
from nanoid import generate


"""
Helpers
"""

MAX_NOW_IN_MILLIS = 8.64e15


def now_in_millis():
    return int(MAX_NOW_IN_MILLIS - datetime.now(timezone.utc).timestamp() * 1000)


def key():
    id = generate(size=10)
    timestamp = now_in_millis()

    return f"{timestamp}_{id}"
