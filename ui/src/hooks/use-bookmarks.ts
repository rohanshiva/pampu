import { useState } from "react";

export interface Bookmark {
    key: string;
    isFile: boolean;
    content: string;
}

export default function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    const addBookmark = (bookmark: Bookmark) => {
        setBookmarks([...bookmarks, bookmark]);
        // todo: add to base & drive
    };


    const removeBookmark = (key: string) => {
        setBookmarks([...bookmarks].filter(bookmark => bookmark.key !== key));
        // todo: remove from base & drive
    };

    return {
        bookmarks,
        addBookmark,
        removeBookmark
    };
}
