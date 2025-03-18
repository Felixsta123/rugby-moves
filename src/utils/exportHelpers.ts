import { toPng } from "html-to-image";

// Function to capture a frame of the rugby pitch
export const captureFrame = async (elementId: string): Promise<string> => {
    const element = document.getElementById(elementId);

    if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
    }

    return toPng(element);
};

// Function to download a Blob as a file
export const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
};

// Simple GIF creation using canvas frames
// Note: In a real app, you might want to use a library like gif.js
export const createGif = async (
    frames: string[],
    delay: number
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        try {
            // This is a placeholder. For a real implementation,
            // you'd need to use a proper GIF encoding library

            // For now, we'll just return the first frame as a PNG
            fetch(frames[0])
                .then((res) => res.blob())
                .then((blob) => resolve(blob))
                .catch(reject);

            // In a full implementation, you'd convert all frames to a GIF
            // using a library like gif.js
        } catch (error) {
            reject(error);
        }
    });
};
