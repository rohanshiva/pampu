import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Bookmark } from "./hooks/use-bookmarks";

export enum Key {
    Enter = "Enter"
}

interface InputProps {
    addBookmark: (bookmark: Bookmark) => void;
}

export default function Input({ addBookmark }: InputProps) {
    const [input, setInput] = useState<string>("");

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((!(event.key === Key.Enter && !event.shiftKey)) || (!input.trim().length)) {
            return
        }
        event.preventDefault();
        addBookmark({ key: input, content: input, isFile: false })
        setInput("");
    }

    return (
        <Textarea
            placeholder="Insert any links, text, or images"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
}
