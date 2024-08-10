import type { HookContext, PromptInput, PromptPayload } from '../utils/types';
import type { Logger } from 'pino';

export default class Asset<T = any> {
    protected data = {
        output: '',
        promptResponse: null,
    };

    constructor(
        protected hookContext: HookContext,
        protected logger: Logger,
        protected promptInput: PromptInput
    ) {}

    public async action(_data: T) {
        throw new Error(
            `${this.constructor.name} [action] implementation is needed`
        );
    }

    public afterPromptCall() {
        this.logger.info('Calling afterPromptCall...');
    }

    public beforePromptCall() {
        this.logger.info('Calling beforePromptCall...');
    }

    public getPrompt(_input: PromptInput): PromptPayload {
        throw new Error(
            `${this.constructor.name} [getPrompt] implementation is needed`
        );
    }

    public async getStructuredContentCustomCall(input: PromptInput) {
        this.logger.info('Calling getStructuredContentCustomCall...');

        return this.hookContext.langChain.getStructuredContent(
            this.getPrompt(input)
        );
    }

    public async run() {
        this.logger.info('Start processing');

        await this.beforePromptCall();

        this.data.promptResponse = await this.getStructuredContentCustomCall(
            this.promptInput
        );

        await this.afterPromptCall();
        await this.action(this.data.promptResponse as T);

        const { assetType, amount, subject } = this.promptInput;

        let capitalizedAssetType =
            assetType.charAt(0).toUpperCase() +
            assetType.substring(1, assetType.length);

        if (amount !== 1) {
            capitalizedAssetType += assetType.charAt(-1) === 'y' ? 'ies' : 's';
        }

        if (!this.data.output) {
            this.data.output = `${capitalizedAssetType} generated with the following subject "${subject}"`;
        }

        this.logger.info('Finish processing');

        return this.data;
    }
}
