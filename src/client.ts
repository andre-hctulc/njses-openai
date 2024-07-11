import { Service, ServiceRegistery } from "@backend/packages/njses";
import OpenAI, { ClientOptions } from "openai";
import { FriendlyUploadable } from "./types";
import { parseFile } from "./system";
import { OpenAIAssistant, OpenAIAssistantOptions } from "./assistant";
import { OpenAIVectorStore, OpenAIVectorStoreOptions } from "./vector-store";

interface OpenAIClientConfig extends ClientOptions {
    requestOptions?: OpenAI.RequestOptions;
}

@Service({ name: "OpenAIClient" })
export class OpenAIClient {
    readonly client: OpenAI;

    constructor(private config: OpenAIClientConfig) {
        this.client = new OpenAI(config);
    }

    // -- assistants

    async createAssistant(
        config: OpenAI.Beta.Assistants.AssistantCreateParams,
        options: OpenAIAssistantOptions = {}
    ): Promise<OpenAIAssistant> {
        const assistant = await this.client.beta.assistants.create(config, this.config.requestOptions);
        return ServiceRegistery.create(OpenAIAssistant, assistant.id, this.client, {
            requestOptions: this.config.requestOptions,
            ...options,
        });
    }

    deleteAssistant(assitantId: string) {
        return this.client.beta.assistants.del(assitantId, this.config.requestOptions);
    }

    // -- vector stores

    async createVectorStore(
        config: OpenAI.Beta.VectorStores.VectorStoreCreateParams,
        options: OpenAIVectorStoreOptions = {}
    ): Promise<OpenAIVectorStore> {
        const store = await this.client.beta.vectorStores.create(config, this.config.requestOptions);
        return ServiceRegistery.create(OpenAIVectorStore, store.id, this.client, {
            requestOptions: this.config.requestOptions,
            ...options,
        });
    }

    deleteVectorStore(storeId: string) {
        return this.client.beta.vectorStores.del(storeId, this.config.requestOptions);
    }

    // -- files

    createFile(file: FriendlyUploadable, purpose: "assistants" | "batch" | "fine-tune" | "vision") {
        return this.client.files.create({ file: parseFile(file), purpose }, this.config.requestOptions);
    }

    deleteFile(fileId: string) {
        return this.client.files.del(fileId, this.config.requestOptions);
    }

    loadFile(fileId: string) {
        return this.client.files.retrieve(fileId, this.config.requestOptions);
    }

    listFiles(query?: OpenAI.Files.FileListParams) {
        return this.client.files.list(query, this.config.requestOptions);
    }
}
