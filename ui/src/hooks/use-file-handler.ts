import { useRef, useState } from "react";

interface UseFileHandlerProps {
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    setSnippet: React.Dispatch<React.SetStateAction<string>>;
}

export const useFileHandler = ({ setFile, setSnippet }: UseFileHandlerProps) => {
    const [isDragActive, setDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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

    const handleFiles = (files: FileList) => {
        if (files.length && files[0].type.indexOf("image/png") !== -1) {
            const [selectedFile] = files;
            const filename = selectedFile.name.replace(/\.png$/, "");
            setFile(selectedFile);
            setSnippet(filename);
        }
    };

    const handleFileInputChange = () => {
        if (fileInputRef.current) {
            const files = fileInputRef.current.files;
            if (files) {
                handleFiles(files);
            }
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        const files = event.dataTransfer.files;
        handleFiles(files);
    };

    return {
        isDragActive,
        fileInputRef,
        handleFileInputChange,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        resetFileInput,
    };
};