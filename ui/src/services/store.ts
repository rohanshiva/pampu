import { Base, Drive } from "deta";
import { nanoid } from "nanoid";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ContentType, IBookmark } from "../interfaces";
import { FetchOptions } from "deta/dist/types/types/base/request";
import { DetaType } from "deta/dist/types/types/basic";

interface BookmarkResponse {
    key: string;
    content_type: string;
    snipped: string;
    metadata: Record<string, any>;
}

class Store {
    private static base = Base("bookmarks");
    private static drive = Drive("bookmarks");

    static config = {
        base: "api",
        add: "add",
        addFile: "add/file",
        fetch: "fetch",
        download: "download",
        delete: "delete"
    }

    static buildFilename(key: string, metadata: Record<string, any>): string {
        const fileExtension = metadata["file_extension"];
        return fileExtension ? `${key}${fileExtension}` : key;
    }

    static async addFile(key: string, file: File) {
        const item = await this.base.get(key) as unknown as BookmarkResponse;

        // file store not needed if base item doesn't exist or if content type is not file-like
        if ((!item) || (item["content_type"] == ContentType.TEXT)) {
            return
        }

        const filename = this.buildFilename(key, item["metadata"]);
        const buffer = new Uint8Array(await file.arrayBuffer());

        try {
            await this.drive.put(filename, { data: buffer, contentType: item["content_type"] });
            return key;
        } catch (err: any) {
            throw Error("Sorry, something is wrong! Couldn't sync your bookmark's file. Please try refreshing.");
        }
    }

    static async add(bookmark: IBookmark): Promise<IBookmark> {
        try {
            await this.base.put(decamelizeKeys(bookmark) as DetaType);
            return bookmark;
        } catch (error: any) {

            throw Error("Sorry, somehting is wrong! Couldn't sync your bookmark. Please try refreshing.");
        }
    }

    static async fetch(last?: string): Promise<IBookmark[]> {
        try {
            const options: FetchOptions = last ? { last } : {};
            const response = await this.base.fetch({}, options);
            const bookmarks = await response.items;
            return bookmarks.map((bookmark) => camelizeKeys(bookmark) as IBookmark);
        } catch (error: any) {
            throw Error("Sorry, something is wrong! Please try refreshing.")
        }
    }

    static async delete(key: string): Promise<string> {
        const item = await this.base.get(key) as unknown as BookmarkResponse;

        if (!item) {
            return key
        }

        try {
            await this.base.delete(key);
        } catch (err) {
            throw Error("Sorry, something is wrong! Couldn't delete your bookmark.");
        }

        if (item["content_type"] == ContentType.TEXT) {
            return key
        }

        const filename = await this.buildFilename(key, item["metadata"]);

        try {
            await this.drive.delete(filename);
            return key
        } catch (error: any) {
            throw Error("Sorry, something is wrong! Couldn't delete your bookmark's image.")
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