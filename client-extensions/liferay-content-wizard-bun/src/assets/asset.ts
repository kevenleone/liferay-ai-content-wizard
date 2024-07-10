import type { ZodSchema, z } from 'zod';
import type { HookContext, PromptInput, PromptPayload } from '../types';
import { categorizationSchema } from '../schemas';

export default class Asset<T = any> {
  protected data = {
    promptResponse: null,
    output: '',
  };
  protected hookContext: HookContext;
  public categorization: z.infer<typeof categorizationSchema>;
  public schema: ZodSchema;

  constructor(
    hookContext: HookContext,
    categorization: z.infer<typeof categorizationSchema>,
    zodSchema: ZodSchema
  ) {
    this.categorization = categorization;
    this.hookContext = hookContext;
    this.schema = zodSchema;
  }

  public async action(_data: T) {
    throw new Error(
      `${this.constructor.name} [action] implementation is needed`
    );
  }

  public afterPromptCall() {
    console.log('Calling afterPromptCall...');
  }

  public beforePromptCall() {
    console.log('Calling beforePromptCall...');
  }

  public getPrompt(_input: PromptInput): PromptPayload {
    throw new Error(
      `${this.constructor.name} [getPrompt] implementation is needed`
    );
  }

  public async getStructuredContentCustomCall(input: PromptInput) {
    console.log('Calling getStructuredContentCustomCall...');

    return this.hookContext.langChain.getStructuredContent(
      this.getPrompt(input)
    );
  }

  public async run() {
    console.log(`Start processing: ${this.constructor.name} - ${new Date()}`);
    await this.beforePromptCall();

    this.data.promptResponse = await this.getStructuredContentCustomCall(
      this.categorization
    );

    await this.afterPromptCall();

    await this.action(this.data.promptResponse as T);

    const { assetType, amount, subject } = this.categorization;

    let capitalizedAssetType =
      assetType.charAt(0).toUpperCase() +
      assetType.substring(1, assetType.length);

    if (amount !== 1) {
      capitalizedAssetType += assetType.charAt(-1) === 'y' ? 'ies' : 's';
    }

    this.data.output = `${capitalizedAssetType} generated with the following subject "${subject}"`;

    return this.data;
  }
}
