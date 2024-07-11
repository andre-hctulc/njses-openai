import { Service } from "@backend/packages/njses";
import OpenAI from "openai";

export interface OpenAIAssistantOptions {
    /** Used for all operations */
    requestOptions?: OpenAI.RequestOptions;
}

@Service({ name: "OpenAIAssistant" })
export class OpenAIAssistant {
    readonly id: string;

    constructor(assistantId: string, readonly client: OpenAI, private options: OpenAIAssistantOptions = {}) {
        this.id = assistantId;
    }

    // private assitant!: OpenAI.Beta.Assistants.Assistant;

    // @Init
    // private async init() {
    //     this.assitant = await this.client.beta.assistants.retrieve(this.id, this.options.requestOptions);
    // }

    createThread() {
        return this.client.beta.threads.create(this.options.requestOptions);
    }

    createRun(threadId: string) {
        return this.client.beta.threads.runs.create(
            threadId,
            { assistant_id: this.id },
            this.options.requestOptions
        );
    }

    update(data: OpenAI.Beta.Assistants.AssistantUpdateParams) {
        return this.client.beta.assistants.update(this.id, data, this.options.requestOptions);
    }

    /**
     * Adds a vector store to the assistant for _file search_.
     */
    configureFileSearch(vectorStoreIds: string[]) {
        return this.client.beta.assistants.update(
            this.id,
            { tool_resources: { file_search: { vector_store_ids: vectorStoreIds } } },
            this.options.requestOptions
        );
    }

    configureCodeInterpreter(fileIds: string[]) {
        return this.client.beta.assistants.update(
            this.id,
            { tool_resources: { code_interpreter: { file_ids: fileIds } } },
            this.options.requestOptions
        );
    }
}