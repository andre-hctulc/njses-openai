import { Service, App } from "../../njses";
import OpenAI, { ClientOptions } from "openai";
import { FriendlyUploadable } from "./types";
import { parseFile } from "./system";
import { OAIAssistant, OAIAssistantOptions } from "./assistant";
import { OAIVectorStore, OpenAIVectorStoreOptions } from "./vector-store";
// @ts-ignore
import type { EmbeddingCreateParams } from "openai/resources";

interface OAIClientConfig extends ClientOptions {
    requestOptions?: OpenAI.RequestOptions;
}

@Service({ name: "$$openai" })
export class OAIClient {
    readonly oai: OpenAI;

    constructor(private config: OAIClientConfig) {
        this.oai = new OpenAI(config);
    }

    // -- assistants

    async createAssistant(
        config: OpenAI.Beta.Assistants.AssistantCreateParams,
        options: OAIAssistantOptions = {}
    ): Promise<OAIAssistant> {
        const assistant = await this.oai.beta.assistants.create(config, this.config.requestOptions);
        return new OAIAssistant(this.oai, assistant.id, {
            requestOptions: this.config.requestOptions,
            ...options,
        });
    }

    deleteAssistant(assitantId: string) {
        return this.oai.beta.assistants.del(assitantId, this.config.requestOptions);
    }

    updateAssistant(assistantId: string, data: OpenAI.Beta.Assistants.AssistantUpdateParams) {
        return this.oai.beta.assistants.update(assistantId, data, this.config.requestOptions);
    }

    /**
     * Mounts the given assistant
     */
    async getAssistant(assistantId: string, options: OAIAssistantOptions = {}): Promise<OAIAssistant> {
        return App.injectX([
            OAIAssistant,
            this.oai,
            assistantId,
            {
                requestOptions: this.config.requestOptions,
                ...options,
            },
        ]);
    }

    // -- vector stores

    async createVectorStore(
        config: OpenAI.Beta.VectorStores.VectorStoreCreateParams,
        options: OpenAIVectorStoreOptions = {}
    ): Promise<OAIVectorStore> {
        const store = await this.oai.beta.vectorStores.create(config, this.config.requestOptions);
        return new OAIVectorStore(this.oai, store.id, {
            requestOptions: this.config.requestOptions,
            ...options,
        });
    }

    deleteVectorStore(storeId: string) {
        return this.oai.beta.vectorStores.del(storeId, this.config.requestOptions);
    }

    getVectorStore(storeId: string, options: OpenAIVectorStoreOptions = {}): OAIVectorStore {
        return new OAIVectorStore(this.oai, storeId, {
            requestOptions: this.config.requestOptions,
            ...options,
        });
    }

    // -- files

    uploadFile(file: FriendlyUploadable, purpose: "assistants" | "batch" | "fine-tune" | "vision") {
        return this.oai.files.create({ file: parseFile(file), purpose }, this.config.requestOptions);
    }

    deleteFile(fileId: string) {
        return this.oai.files.del(fileId, this.config.requestOptions);
    }

    loadFile(fileId: string) {
        return this.oai.files.retrieve(fileId, this.config.requestOptions);
    }

    loadFileContent(fileId: string): Promise<Response> {
        return this.oai.files.content(fileId, this.config.requestOptions);
    }

    listFiles(query?: OpenAI.Files.FileListParams) {
        return this.oai.files.list(query, this.config.requestOptions);
    }

    // -- embeddings

    async embedd(params: EmbeddingCreateParams) {
        return this.oai.embeddings.create(params, this.config.requestOptions);
    }

    async complete(params: OpenAI.Completions.CompletionCreateParamsNonStreaming) {
        return this.oai.completions.create(params, this.config.requestOptions);
    }

    // -- threads

    createThread() {
        return this.oai.beta.threads.create(this.config.requestOptions);
    }
}
