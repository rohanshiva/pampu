import os
import util
import store
import models
from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
store = store.Store()



host = os.getenv('DETA_SPACE_APP_HOSTNAME')
origin = f"https://{host}"
origins = [origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"],
)

"""
Routes
"""


@app.get("/")
def hello():
    return {"msg": "hello from pampu backend api!! 🍋"}

@app.get("/primary")
def primary_micro():
    return {"primary": origins}

@app.post("/api/add", status_code=201)
def add_lime(lime: models.Lime):
    res = store.add(lime.content, None, lime.expires)
    return res


@app.post("/api/add/file", status_code=201)
def upload_img(file: UploadFile = File(...)):
    name = file.filename
    f = file.file
    res = store.add(name, f, False)
    return res


@app.get("/api/fetch")
async def fetch_limes(limit: int = 10, last: Union[str, None] = None):
    # res = store.fetch(last, limit)
    res = store.fetch_all()
    return res


@app.get("/api/download/{name}")
def download_file(name: str):
    res = store.download_file(name)
    return StreamingResponse(res.iter_chunks())


@app.delete("/api/delete/{key}")
def delete_lime(key: str):
    return store.delete(key)
