import os
from deta import Deta
from fastapi import UploadFile
from models import Bookmark, ContentType
import util

deta = Deta()

"""
Store
"""


class Store:
    def __init__(self):
        self._base = deta.Base("bookmarks")
        self._drive = deta.Drive("bookmarks")

    def add(self, bookmark: Bookmark):
        item = {
            "snippet": bookmark.snippet,
            "key": bookmark.key or util.key(),
            "content_type": bookmark.content_type,
            "metadata": bookmark.metadata,
        }

        try:
            self._base.put(item)
        except Exception as e:
            raise Exception(
                "An error occurred while storing a bookmark in base."
            ) from e

        return item

    def __build_filename(self, key: str, metadata: dict):
        file_extension = metadata["file_extension"]

        if file_extension:
            return f"{key}{file_extension}"

        return key

    def add_file(self, key: str, file: UploadFile):
        item = self._base.get(key)

        # file store not needed if base item doesn't exist or if content type is not file-like
        if (not item) or (item["content_type"] == ContentType.TEXT):
            return None

        filename = self.__build_filename(key, item["metadata"])

        try:
            self._drive.put(filename, data=file.file, content_type=file.content_type)
        except Exception as e:
            raise Exception(
                "An error occurred while storing a bookmark in drive."
            ) from e

        return key

    def delete(self, key: str):
        item = self._base.get(key)

        if not item:
            return key

        content_type = item["content_type"]

        try:
            self._base.delete(key)
        except Exception as e:
            raise Exception(
                "An error occurred while deleting a bookmark from base."
            ) from e

        if content_type == ContentType.FILE or content_type == ContentType.IMAGE:
            try:
                filename = self.__build_filename(key, item["metadata"])
                self._drive.delete(filename)
            except Exception as e:
                raise Exception(
                    "An error occurred while deleting a bookmark from drive."
                ) from e

        return key

    def delete_all(self):
        bookmarks = self.fetch_all()
        for bookmark in bookmarks:
            self.delete(bookmark["key"])

    def fetch(self, last=None, limit=50, query={}):
        res = self._base.fetch(query=query, limit=limit, last=last)
        return res.items

    def fetch_all(self):
        res = self._base.fetch()
        all_bookmarks = res.items

        while res.last:
            res = self._base.fetch(last=res.last)
            all_bookmarks += res.items
        return all_bookmarks

    def download_file(self, name: str):
        res = self._drive.get(name)
        return res

    def cleanup(self):
        res = self._drive.list()
        files = res["names"]
        while res.get("paging") and res["paging"].get("last"):
            res = self._drive.list(last=res["paging"].get("last"))
            files += res["names"]

        files_to_delete = []
        for file in files:
            key, _ = os.path.splitext(file)
            if not self._base.get(key):
                files_to_delete.append(file)

        if len(files_to_delete):
            print(f"Deleting #{files_to_delete}")
            self._drive.delete_many(files_to_delete)
