import type { BlobLike } from "openai/uploads.mjs";

/**
 * This is used as a wrapper for stringsto satisfy the openai `Uploadable` interface.
 */
export class NodeBlob implements BlobLike {
    readonly size: number;
    readonly type: string;

    readonly name = "";
    readonly lastModified = Date.now();

    private buffer: Buffer | undefined;
    private originalText: string | undefined;

    constructor(data: string | Buffer, type?: string) {
        if (typeof data === "string") {
            this.originalText = data;
            data = Buffer.from(data);
            this.type = type ?? "text/plain";
        } else {
            this.type = type ?? "application/octet-stream";
            this.buffer = data;
        }
        this.size = data.length;
    }

    // Must return UTF-8 encoded string (See MDN spec)
    async text(): Promise<string> {
        return this.originalText ?? this.buffer!.toString("utf-8");
    }

    slice(start?: number, end?: number): NodeBlob {
        if (!this.buffer) this.buffer = Buffer.from(this.originalText!);
        return new NodeBlob(this.buffer.slice(start, end), this.type);
    }
}
