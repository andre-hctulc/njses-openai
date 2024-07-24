import OpenAI from "openai";

export interface OAITuneOptions {
    /** Used for all operations */
    requestOptions?: OpenAI.RequestOptions;
}

// TODO

/**
 * Make use of a fine-tuning job.
 */
export class OAITune {
    readonly id: string;

    constructor(readonly client: OpenAI, tuneId: string, readonly options: OAITuneOptions = {}) {
        this.id = tuneId;
    }

    async describe() {
        return this.client.fineTuning.jobs.retrieve(this.id, this.options.requestOptions);
    }
}
