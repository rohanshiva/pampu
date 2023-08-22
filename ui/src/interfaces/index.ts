export enum ContentType {
    FILE = "file",
    IMAGE = "image",
    TEXT = "text",
}

export const isImage = (contentType: ContentType) => {
    return contentType === ContentType.IMAGE
}

export const isFile = (contentType: ContentType) => {
    return contentType === ContentType.FILE
}

export const isFileLike = (contentType: ContentType) => {
    return contentType === ContentType.FILE || contentType === ContentType.IMAGE
}

export interface IBookmark {
    key: string;
    contentType: ContentType;
    snippet: string;
    file: File | null;
    metadata: Record<string, unknown>
}
