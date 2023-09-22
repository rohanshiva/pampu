from pydantic import BaseModel
import store
from models import Bookmark
from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse


app = FastAPI()
store = store.Store()


"""
Routes
"""


@app.get("/")
def hello():
    return {"msg": "👋🏿 Pampu API!"}


@app.post("/add", status_code=201)
async def add_bookmark(bookmark: Bookmark):
    res = store.add(bookmark)
    return res


@app.post("/add/file", status_code=201)
def upload_file(key: str, file: UploadFile = File(...)):
    res = store.add_file(key, file)
    return res


@app.get("/fetch")
async def fetch_bookmarks(limit: int = 5, last: Union[str, None] = None):
    res = store.fetch(limit=limit, last=last)
    return res


@app.get("/download/{name}")
def download_file(name: str):
    res = store.download_file(name)
    return StreamingResponse(res.iter_chunks(), media_type="image/png")


@app.delete("/delete/{key}")
def delete_bookmark(key: str):
    return store.delete(key)


class ActionEvent(BaseModel):
    id: str
    trigger: str


class Action(BaseModel):
    event: ActionEvent


@app.post("/__space/v0/actions")
def actions(action: Action):
    if action.event.id == "cleanup":
        store.cleanup()
