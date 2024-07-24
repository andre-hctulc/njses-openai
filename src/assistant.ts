import OpenAI from "openai";
import { Service } from "../../njses/src/decorators";

export interface OAIAssistantOptions {
    /** Used for all operations */
    requestOptions?: OpenAI.RequestOptions;
}

@Service({ name: "$$openai_assistant" })
export class OAIAssistant {
    readonly id: string;

    constructor(readonly client: OpenAI, assistantId: string, private options: OAIAssistantOptions = {}) {
        this.id = assistantId;
    }

    async describe() {
        return this.client.beta.assistants.retrieve(this.id, this.options.requestOptions);
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
