import { useEffect, useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Key } from "./key";
import { ContentType, IBookmark } from "./interfaces";
import Store from "./services/store";

const isEmpty = (snippet: string) => {
    return snippet.trim().length === 0;
};

const buildBookmark = (snippet: string, file: File | null): IBookmark => {
    let contentType = ContentType.TEXT;
    let metadata = {};

    // TODO: allow other file types
    if (file) {
        contentType = ContentType.IMAGE;
        metadata = { fileExtension: ".png" }
    }

    return {
        key: Store.key(),
        snippet,
        contentType,
        metadata: metadata,
        file,
    };
};

const useDataUrl = (file: File | null) => {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setDataUrl(null);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const imageDataUrl = reader.result as string;
            setDataUrl(imageDataUrl);
        };

        reader.readAsDataURL(file);

        return () => {
            reader.abort();
        };
    }, [file]);

    return dataUrl;
};

function FileInputSlug({ file }: { file: File | null }) {
    const dataUrl = useDataUrl(file);

    if (!dataUrl) {
        return null;
    }

    return <img className="w-24 h-24 object-contain pb-4" src={dataUrl} />;
}

interface InputProps {
    addBookmark: (bookmark: IBookmark) => void;
}

export default function Input({ addBookmark }: InputProps) {
    const [snippet, setSnippet] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setDragActive] = useState<boolean>(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        const files = event.dataTransfer.files;
        if (files.length && files[0].type.indexOf("image/png") !== -1) {
            const [selectedFile] = files;
            const filename = selectedFile.name.replace(/\.png$/, "");
            setFile(selectedFile);
            setSnippet(filename);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === Key.Escape) {
            setFile(null);
        }

        if (!(event.key === Key.Enter && !event.shiftKey) || isEmpty(snippet)) {
            return;
        }

        event.preventDefault();

        const bookmark = buildBookmark(snippet, file);
        addBookmark(bookmark);
        setSnippet("");
        setFile(null);
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

    const placeholder = isDragActive ? "Drop the file!" : (file
        ? "Uploaded image! Insert image caption, or click Esc to discontinue."
        : "Insert any links, text, or images")

    return (
        <>
            <FileInputSlug file={file} />

            <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Textarea
                    placeholder={
                        placeholder
                    }
                    className={`${isDragActive && "border-dashed"}`}
                    value={snippet}
                    onChange={(event) => setSnippet(event.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                />
            </div>
        </>
    );
}
