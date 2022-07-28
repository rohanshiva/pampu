from deta import Deta
from pydantic import conset
from models import Lime
import util
from fastapi.responses import StreamingResponse

deta = Deta()

"""
Store
"""


class Store:
    def __init__(self):
        self._base = deta.Base("limes")
        self._drive = deta.Drive("limes")

    def add(self, content, file, expires):
        is_file = True if file else False
        item = {
            "content": content,
            "key": str(util.now_in_millis()),
            "is_file": is_file,
        }

        if is_file:
            self._drive.put(f"{item['key']}-{content}", file)
        if expires:
            self._base.put(item, expire_in=60)
        else:
            self._base.put(item)
        return item

    def fetch(self, last=None, limit=50, query={}):
        res = self._base.fetch(query=query, limit=limit, last=last)
        return res.items

    def delete(self, key: str):
        self._base.delete(key)
        return key

    def fetch_all(self):
        res = self._base.fetch()
        all_limes = res.items

        while res.last:
            res = self._base.fetch(last=res.last)
            all_limes += res.items
        return all_limes

    def delete_all(self):
        limes = self.fetch_all()
        for lime in limes:
            self._base.delete(lime["key"])

    def download_file(self, name: str):
        res = self._drive.get(name)
        return StreamingResponse(res.iter_chunks())
