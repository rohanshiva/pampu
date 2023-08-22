import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { IBookmark, isImage } from "./interfaces";
import { truncate } from "./lib/utils";
import Store from "./services/store";

interface PreviewBookmarkProps {
    bookmark: IBookmark;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PreviewBookmark({ bookmark, open, setOpen }: PreviewBookmarkProps) {
    if (!bookmark) {
        return null
    }

    if (!isImage(bookmark.contentType)) {
        return null
    }

    const imageSrc = `${Store.config.base}/${Store.config.download}/${bookmark.key}.png`

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {truncate(bookmark.snippet, 10)}
                    </DialogTitle>
                </DialogHeader>
                <img src={imageSrc} className="object-contain" />
            </DialogContent>
        </Dialog>
    )
}