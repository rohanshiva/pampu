import { nanoid } from "nanoid";
import { camelizeKeys, decamelizeKeys } from "humps";
import { IBookmark } from "../interfaces";

interface BookmarkResponse {
    key: string;
    content_type: string;
    snipped: string;
    metadata: Record<string, any>;
}

class Store {
    static config = {
        base: `./api`,
        add: "add",
        addFile: "add/file",
        fetch: "fetch",
        download: "download",
        delete: "delete"
    }

    static async addFile(key: string, file: File) {
        const url = `${Store.config.base}/${Store.config.addFile}?key=${encodeURIComponent(key)}`;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(url, { method: "POST", body: formData });
            if (response.status === 201) {
                return await response.json();
            } else {
                throw Error(`Failed to add image for bookmark: ${response.status}`)
            }
        } catch (error: any) {
            throw (error);
        }
    }

    static async add(bookmark: IBookmark): Promise<IBookmark> {
        const url = `${Store.config.base}/${Store.config.add}`;

        const body = decamelizeKeys(bookmark);

        try {
            const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            if (response.status === 201) {
                const bookmark: BookmarkResponse = await response.json();
                return camelizeKeys(bookmark) as IBookmark;
            } else {
                throw Error(`Failed to add bookmark: ${response.status}`)
            }
        } catch (error: any) {

            throw (error);
        }
    }

    static async fetch(last?: string): Promise<IBookmark[]> {
        let url = `${Store.config.base}/${Store.config.fetch}`

        if (last) {
            url = `${url}?last=${last}`
        }

        try {
            const response = await fetch(url);
            if (response.status === 200) {
                const bookmarks = await response.json();
                return bookmarks.map((bookmark: BookmarkResponse) => camelizeKeys(bookmark) as IBookmark);
            } else {
                throw Error(`Failed to add lime: ${response.status}`)
            }
        } catch (error: any) {
            throw (error);
        }
    }

    static async delete(key: string): Promise<string> {
        const url = `${Store.config.base}/${Store.config.delete}/${key}`
        try {
            const response = await fetch(url, { method: "DELETE" });
            if (response.status === 200) {
                return key
            } else {
                throw Error(`Failed to delete bookmark: ${response.status}`)
            }
        } catch (error: any) {
            throw (error);
        }
    }

    static key() {
        const maxDateNowValue = 8.64e15;

        const id = nanoid(10);
        const timestamp = maxDateNowValue - Date.now();

        return `${timestamp}_${id}`
    }
}

export default Store;