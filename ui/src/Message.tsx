interface MessageProps {
  message: any;
  selected: boolean;
}

const isUrl = (text: string) => {
  const pattern =
    /^(http|https|ftp):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/;
  return pattern.test(text);
};

const isHexColor = (text: string) => {
  const pattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return pattern.test(text);
};

interface MessageIconProps {
  text: string;
}

function MessageIcon({ text }: MessageIconProps) {
  if (isUrl(text)) {
    return <span>↗</span>;
  } else if (isHexColor(text)) {
    return (
      <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: text }} />
    );
  }
  return null;
}

export default function Message({ message, selected }: MessageProps) {
  return (
    <>
      <div
        className={`flex flex-row justify-between px-2 py-2 border-l-4 ${
          selected ? "border-primary" : "border-transparent"
        }`}
      >
        <div className="flex flex-row gap-2 items-center">
          <MessageIcon text={message.content} />
          <div className="flex flex-col">
            <span className={`truncate whitespace-pre-wrap ${(message.content.length >= 250) && "max-h-64 overflow-y-scroll"}`}>
              {message.content}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
