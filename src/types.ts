import type { Uploadable } from "openai/uploads.mjs";
import type { NodeBlob } from "./blob";

export type FriendlyUploadable = Uploadable | string | NodeBlob;
