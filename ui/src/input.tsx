import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Key } from "./key";
import { ContentType, IBookmark } from "./interfaces";
import Store from "./services/store";
import { isMobile } from "./lib/utils";
import { Button } from "./components/ui/button";
import Icon from "./assets/icon";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { useFileHandler } from "./hooks/use-file-handler";
import { useDataUrl } from "./hooks/use-data-url";

const isEmpty = (snippet: string) => {
    return snippet.trim().length === 0;
};

const buildBookmark = (snippet: string, file: File | null): IBookmark => {
    let contentType = ContentType.TEXT;
    let metadata = {};

    // TODO: allow other file types
    if (file) {
        contentType = ContentType.IMAGE;
        metadata = { fileExtension: ".png" };
    }

    return {
        key: Store.key(),
        snippet,
        contentType,
        metadata: metadata,
        file,
    };
};

function FileInputSlug({
    file,
    removeFile,
}: {
    file: File | null;
    removeFile: () => void;
}) {
    const dataUrl = useDataUrl(file);

    if (!dataUrl) {
        return null;
    }

    return (
        <div className="block items-center group">
            <Button
                variant="secondary"
                className="font-mono h-fit w-fit text-xs rounded-full px-1 py-0 text-center absolute -ml-2 -mt-2 invisible group-hover:visible"
                onClick={() => {
                    removeFile();
                }}
            >
                x
            </Button>
            <img className="w-24 h-24 object-contain pb-4" src={dataUrl} />
        </div>
    );
}

interface InputProps {
    addBookmark: (bookmark: IBookmark) => void;
}

export default function Input({ addBookmark }: InputProps) {
    const [snippet, setSnippet] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const { fileInputRef, isDragActive, handleFileInputChange, handleDragOver, handleDragEnter, handleDragLeave, handleDrop, resetFileInput } = useFileHandler({ setFile, setSnippet });

    const toggleFileInput = () => {
        if (fileInputRef.current) {
            (fileInputRef.current as HTMLInputElement).click();
        }
    };

    const handleSubmit = () => {
        const bookmark = buildBookmark(snippet, file);
        addBookmark(bookmark);
        setSnippet("");
        setFile(null);
        resetFileInput();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === Key.Escape) {
            setFile(null);
        }

        if (
            !(event.key === Key.Enter && !event.shiftKey) ||
            ((event.metaKey || event.ctrlKey) && event.key === Key.Enter) ||
            isEmpty(snippet) ||
            isMobile()
        ) {
            return;
        }

        event.preventDefault();

        handleSubmit();
    };

    const handlePaste = async (
        event: React.ClipboardEvent<HTMLTextAreaElement>
    ) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                const blob = item.getAsFile();
                setFile(blob);
            }
        }
    };

    const placeholder = isDragActive
        ? "Drop the file!"
        : file
            ? "Uploaded image! Insert image caption, or click Esc to discontinue."
            : "Insert any links, text, or images";

    return (
        <>
            <FileInputSlug
                file={file}
                removeFile={() => {
                    setFile(null);
                    setSnippet("");
                    resetFileInput();
                }}
            />
            <div
                className="flex flex-row gap-2 items-end"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Textarea
                    placeholder={placeholder}
                    className={`${isDragActive && "border-dashed"}`}
                    value={snippet}
                    onChange={(event) => setSnippet(event.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                />
                {isMobile() && (
                    <div className="flex flex-col gap-2">
                        <>
                            <input
                                type="file"
                                accept="image/png"
                                hidden
                                ref={fileInputRef}
                                key="file-input-mobile"
                                onChange={handleFileInputChange}
                            />
                            <Button variant="outline" onClick={toggleFileInput} size="icon">
                                <FilePlusIcon className="h-4 w-4" />
                            </Button>
                        </>
                        <Button
                            variant="outline"
                            onClick={() => {
                                handleSubmit();
                            }}
                            size="icon"
                            disabled={isEmpty(snippet)}
                        >
                            <Icon width="32" height="24" />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
