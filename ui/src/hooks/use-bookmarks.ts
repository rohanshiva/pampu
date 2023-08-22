import { useCallback, useState } from "react";
import { IBookmark, isImage } from "../interfaces";
import Store from "../services/store";
import { toast } from "sonner";

async function addBookmarkToStore(bookmark: IBookmark) {
    try {
        const res = await Store.add(bookmark);

        if (isImage(bookmark.contentType) && bookmark.file) {
            await Store.addFile(bookmark.key, bookmark.file);
        }

        return res;
    } catch (error) {
        throw new Error();
    }
}

async function removeBookmarkFromStore(key: string) {
    try {
        const res = await Store.delete(key);
        return res;
    } catch (error) {
        throw new Error();
    }
}

export default function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const addBookmark = async (bookmark: IBookmark) => {
        setBookmarks([bookmark, ...bookmarks]);

        toast.promise(addBookmarkToStore(bookmark), {
            loading: "Syncing",
            success: () => {
                return "Synced!";
            },
            error: () => {
                return "Failed to sync! Refresh the page.";
            },
        });
    };

    const removeBookmark = async (key: string) => {
        setBookmarks([...bookmarks].filter((bookmark) => bookmark.key !== key));

        toast.promise(removeBookmarkFromStore(key), {
            loading: "Syncing",
            success: () => {
                return "Synced!";
            },
            error: () => {
                return "Failed to sync! Try refreshing the page.";
            },
        });
    };

    const fetchBookmarks = useCallback(async () => {
        if (isLoading || !hasMore) return;


        setIsLoading(true);

        let newBookmarks: IBookmark[] = [];


        try {
            if (bookmarks.length) {
                newBookmarks = await Store.fetch(bookmarks[bookmarks.length - 1].key);
            } else {
                newBookmarks = await Store.fetch();
            }

            if (newBookmarks.length === 0) {
                setHasMore(false);
                return;
            }

            const allBookmarks = [...bookmarks, ...newBookmarks];
        
            const uniqueBookmarks = allBookmarks.filter((bookmark, index, self) => 
                index === self.findIndex((b) => b.key === bookmark.key)
            );
    
            setBookmarks(uniqueBookmarks);
        } catch (error) {
            toast("Failed to fetch some bookmarks! Try refreshing the page.")
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, bookmarks]);

    return {
        bookmarks,
        addBookmark,
        removeBookmark,
        fetchBookmarks,
    };
}
