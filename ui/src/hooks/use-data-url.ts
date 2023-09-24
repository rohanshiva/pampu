import { useEffect, useState } from "react";

export const useDataUrl = (file: File | null) => {
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