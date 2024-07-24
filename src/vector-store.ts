import OpenAI from "openai";
import { NodeBlob } from "./blob";
import type { Uploadable } from "openai/uploads";
import { Service } from "../../njses/src/decorators";

export interface OpenAIVectorStoreOptions {
    /** Used for all operations */
    requestOptions?: OpenAI.RequestOptions;
}

type FriendlyUploadable = Uploadable | string | NodeBlob;

@Service({ name: "$$openai_vector_store" })
export class OAIVectorStore {
    readonly id: string;

    constructor(
        readonly client: OpenAI,
        vectorStoreId: string,
        private options: OpenAIVectorStoreOptions = {}
    ) {
        this.id = vectorStoreId;
    }

    async describe() {
        return this.client.beta.vectorStores.retrieve(this.id, this.options.requestOptions);
    }

    // TODO do we really want to poll all the time?

    /**
     * Upload a new file.
     *
     * This can also be plain text, that will be interpreted as _text/plain_.
     *  */
    uploadFile(file: FriendlyUploadable): Promise<OpenAI.Beta.VectorStores.Files.VectorStoreFile> {
        if (typeof file === "string") file = new NodeBlob(file);
        return this.client.beta.vectorStores.files.uploadAndPoll(this.id, file, this.options.requestOptions);
    }

    /** Add existing file */
    addFile(fileId: string): Promise<OpenAI.Beta.VectorStores.Files.VectorStoreFile> {
        return this.client.beta.vectorStores.files.createAndPoll(
            this.id,
            { file_id: fileId },
            this.options.requestOptions
        );
    }

    deleteFile(fileId: string) {
        return this.client.beta.vectorStores.files.del(this.id, fileId, this.options.requestOptions);
    }

    loadFile(fileId: string) {
        return this.client.beta.vectorStores.files.retrieve(this.id, fileId, this.options.requestOptions);
    }

    listFiles(query?: OpenAI.Beta.VectorStores.Files.FileListParams) {
        return this.client.beta.vectorStores.files.list(this.id, query, this.options.requestOptions);
    }
}
