import type { Uploadable } from "openai/uploads.mjs";
import type { FriendlyUploadable } from "./types";
import { NodeBlob } from "./blob";

export function parseFile(file: FriendlyUploadable): Uploadable {
    if (typeof file === "string") return new NodeBlob(file);
    return file;
}
