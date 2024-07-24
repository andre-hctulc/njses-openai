import type { Uploadable } from "openai/uploads";
import type { FriendlyUploadable } from "./types";
import { NodeBlob } from "./blob";

export function parseFile(file: FriendlyUploadable): Uploadable {
    if (typeof file === "string" || file instanceof Blob) return new NodeBlob(file);
    return file;
}

/**
 * @returns The byte length of the given string
 */
export function getByteLength(str: string) {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
        const codePoint = str.charCodeAt(i);
        if (codePoint <= 0x7f) {
            byteLength += 1;
        } else if (codePoint <= 0x7ff) {
            byteLength += 2;
        } else if (codePoint >= 0xd800 && codePoint <= 0xdbff) {
            // High surrogate, assume the next character is the low surrogate
            byteLength += 4;
            i++;
        } else {
            byteLength += 3;
        }
    }
    return byteLength;
}
