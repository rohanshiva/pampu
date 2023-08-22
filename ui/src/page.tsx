import { useCallback, useEffect, useRef, useState } from "react";
import "./app.css";
import Bookmark, { isUrl } from "./bookmark";
import ThemeContext, { Theme, ThemeType } from "./context/ThemeContext";
import Nav from "./nav";
import Input from "./input";
import { Key } from "./key";
import { Toaster } from "./components/ui/toaster";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "./components/ui/context-menu";
import useBookmarks from "./hooks/use-bookmarks";
import useInfiniteScroll from "./hooks/use-infinite-scroll";
import { toast } from "sonner";
import { ContentType, isImage } from "./interfaces";
import Store from "./services/store";
import PreviewBookmark from "./preview-bookmark";

export default function Page() {
  const [theme, setTheme] = useState(ThemeType.LIGHT);
  const [cursor, setCursor] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { bookmarks, addBookmark, removeBookmark, fetchBookmarks } = useBookmarks();

  if (!bookmarks.length) fetchBookmarks();

  const next = useCallback(() => {
    setCursor((prevCursor) => (prevCursor + 1) % bookmarks.length);
    setPreviewOpen(false);
  }, [bookmarks]);

  const prev = useCallback(() => {
    setCursor(
      (prevCursor) => (prevCursor - 1 + bookmarks.length) % bookmarks.length
    );
    setPreviewOpen(false);
  }, [bookmarks]);

  const remove = useCallback((index: number) => {
    if (bookmarks.length) {
      removeBookmark(bookmarks[index].key);
      if (cursor === bookmarks.length - 1) {
        setCursor(prevCursor => (prevCursor - 1 + bookmarks.length) % bookmarks.length);
      }
      setPreviewOpen(false);
    }
  }, [bookmarks, removeBookmark]);

  const copyBookmark = useCallback(async () => {
    if (bookmarks.length) {
      const { key, snippet, contentType, metadata } = bookmarks[cursor];

      if (contentType === ContentType.FILE || contentType === ContentType.IMAGE) {
        await navigator.clipboard.writeText(`${Store.config.base}/${Store.config.download}/${key}${metadata["fileExtension"]}`);
      } else {
        await navigator.clipboard.writeText(snippet);
      }

      toast(
        "Copied!"
      )
    }
  }, [bookmarks, cursor]);

  const openBookmark = useCallback(async () => {
    if (bookmarks.length) {
      const { snippet } = bookmarks[cursor];

      if (isUrl(snippet)) {
        window.open(snippet, "_blank");
      }
    }
  }, [bookmarks, cursor]);

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.code === Key.ArrowDown) {
        event.preventDefault();
        next();
      } else if (event.code === Key.ArrowUp) {
        event.preventDefault();
        prev();
      } else if ((event.metaKey || event.ctrlKey) && event.code === Key.Enter) {
        event.preventDefault();
        copyBookmark();
        setPreviewOpen(false);
      } else if ((event.metaKey || event.ctrlKey) && event.code === Key.Backspace) {
        event.preventDefault();
        remove(cursor);
      } else if (event.code === Key.P) {
        setPreviewOpen(true);
      } else if ((event.metaKey || event.ctrlKey) && event.code === Key.I) {
        event.preventDefault();
        openBookmark();
      }
    },
    [cursor, bookmarks]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const lastBookmarkRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll(lastBookmarkRef, fetchBookmarks);

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme } as Theme}>
        <div className="w-5/6 max-w-3xl mx-auto max-h-screen flex flex-col pt-8 pb-8">
          <Nav />
          <div className="pt-12">
            <Input addBookmark={addBookmark} />
          </div>
          <div className="flex-grow mt-8 pt-4 flex flex-col gap-1 border-t-2 cursor-pointer overflow-y-auto">
            {bookmarks.map((bookmark, index) => (
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    onClick={() => {
                      setCursor(index);
                    }}
                    key={bookmark.key}
                    ref={index === bookmarks.length - 1 ? lastBookmarkRef : null}
                  >
                    <Bookmark bookmark={bookmark} selected={index === cursor} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  {isImage(bookmark.contentType) &&
                    <ContextMenuItem onClick={() => {
                      setCursor(index);
                      setPreviewOpen(true);
                    }}>Preview
                      <ContextMenuShortcut>Space</ContextMenuShortcut>
                    </ContextMenuItem>
                  }
                  <ContextMenuItem onClick={() => {
                    remove(index);
                  }}>Delete
                    <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => {
                    setCursor(index);
                    copyBookmark();
                  }}>Copy
                    <ContextMenuShortcut>⌘ Enter</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
          {bookmarks[cursor] && <PreviewBookmark bookmark={bookmarks[cursor]} setOpen={setPreviewOpen} open={previewOpen} />}
        </div>
        <Toaster />
      </ThemeContext.Provider>
    </>
  );
}
