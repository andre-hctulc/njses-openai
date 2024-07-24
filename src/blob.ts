import type { BlobLike } from "openai/uploads";

function getByteLength(str: string) {
    return new TextEncoder().encode(str).length;
}

/**
 * This is used as a wrapper for _strings_, _Buffers_ and _Blobs_ to satisfy the openai `Uploadable` interface.
 */
export class NodeBlob implements BlobLike {
    readonly size: number;
    readonly type: string;

    readonly name = "";
    readonly lastModified = Date.now();

    private buffer: Buffer | undefined;
    private blob: Blob | undefined;

    constructor(data: string | Buffer | Blob, type?: string) {
        if (data instanceof Blob) {
            this.blob = data;
            this.type = data.type;
            this.size = data.size;
        } else if (typeof data === "string") {
            data = Buffer.from(data);
            this.type = type ?? "text/plain";
            this.size = data.length;
            this.buffer = data;
        } else {
            this.type = type ?? "application/octet-stream";
            this.buffer = data;
            this.size = data.length;
        }
    }

    // Must return UTF-8 encoded string (See MDN spec)
    async text(): Promise<string> {
        if (this.blob) return this.blob.text();
        else return this.buffer!.toString("utf-8");
    }

    slice(start?: number, end?: number): NodeBlob {
        if (this.blob) return new NodeBlob(this.blob.slice(start, end));
        else return new NodeBlob(this.buffer!.slice(start, end), this.type);
    }
}
