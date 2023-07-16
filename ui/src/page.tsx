import { useEffect, useRef, useState } from "react";
import "./app.css";
import Message from "./Message";
import ThemeContext, { Theme, ThemeType } from "./context/ThemeContext";
import { Textarea } from "./components/ui/textarea";
import Nav from "./nav";

export default function Page() {
  const [theme, setTheme] = useState(ThemeType.LIGHT);
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState([
    { content: "Buy milk", time: "15 hours ago" },
    { content: "Walk Dog", time: "15 hours ago" },
    { content: "Read", time: "15 hours ago" },
  ]);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown": {
          setCursor((cursor + 1) % messages.length);
          break;
        }
        case "ArrowUp": {
          if (cursor === 0) {
            setCursor(messages.length - 1);
          } else {
            setCursor((cursor - 1) % messages.length);
          }
          break;
        }
        case "Enter": {
          await navigator.clipboard.writeText(messages[cursor].content);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursor, messages, isInputFocused]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme } as Theme}>
        <div className='w-5/6 max-w-3xl mx-auto h-full'>
          <Nav/>
          <div className="pt-12">
            <Textarea placeholder="Insert any links, text, or images"
              ref={inputRef} value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (input.trim() === "") {
                    return;
                  }
                  setMessages([
                    ...messages,
                    { content: input, time: "12 hours ago" },
                  ]);
                  setInput("");
                }
              }} />
          </div>
          <div className="mt-8 pt-4 flex flex-col gap-1 border-t-2 cursor-pointer">
            {messages.map((message, index) => (
              <div onClick={async () => {
                await navigator.clipboard.writeText(message.content);
                setCursor(index);
              }}>
                <Message message={message} selected={index === cursor} />
              </div>
            ))}
          </div>
        </div>
      </ThemeContext.Provider>
    </>
  );
}

