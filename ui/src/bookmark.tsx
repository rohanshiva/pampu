import { FileIcon, ImageIcon, ArrowTopRightIcon } from "@radix-ui/react-icons"
import { KBD } from "./components/ui/kbd";
import { ContentType, IBookmark } from "./interfaces";
import { truncate } from "./lib/utils";


export const isUrl = (text: string) => {
  const pattern =
    /^(http|https|ftp):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/;
  return pattern.test(text);
};

export const isHexColor = (text: string) => {
  const pattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return pattern.test(text);
};

interface BookmarkIconProps {
  bookmark: IBookmark;
}

function BookmarkIcon({ bookmark: { snippet, contentType } }: BookmarkIconProps) {

  if (contentType === ContentType.FILE) {
    return <FileIcon className="w-4 h-4 text-foreground" />
  }

  if (contentType === ContentType.IMAGE) {
    return <ImageIcon className="w-4 h-4 text-foreground" />
  }

  if (isUrl(snippet)) {
    return <ArrowTopRightIcon className="w-4 h-4 text-foreground" />
  } else if (isHexColor(snippet)) {
    return (
      <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: snippet }} />
    );
  }
  return null;
}

interface BookmarkProps {
  bookmark: IBookmark;
  selected: boolean;
}


export default function Bookmark({ bookmark, selected }: BookmarkProps) {

  const { snippet } = bookmark;

  return (
    <>
      <div
        className={`flex flex-row justify-between items-center px-2 py-2 border-l-4 ${selected ? "border-transparent bg-accent rounded-sm" : "border-transparent"
          }`}
      >
        <div className={`flex flex-row gap-2 items-center ${isUrl(snippet) && "font-mono"}`}>
          <BookmarkIcon bookmark={bookmark} />
          <abbr title={snippet} className="no-underline">
            <span className="whitespace-pre-wrap truncate">
              {truncate(snippet, 250)}
            </span>
          </abbr>
        </div>
        {selected && (
          <div className="flex flex-row gap-1">
            <KBD>
              ⌘
            </KBD>
            <KBD>
              Enter
            </KBD>
          </div>
        )}
      </div>
    </>
  );
}
