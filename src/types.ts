import type { Uploadable } from "openai/uploads";

export type FriendlyUploadable = Uploadable | string | Blob;
