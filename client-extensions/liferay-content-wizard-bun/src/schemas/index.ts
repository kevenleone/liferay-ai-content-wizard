import { z } from 'zod';

export const accountSchema = z.array(
    z.object({
        type: z
            .enum(['business', 'supplier', 'person'])
            .describe(
                'The type of the account, business is for general public, suppliers are used for people that publishes products, person is a single user account, you can consider "business" value if the user not mention the account type'
            ),
        description: z.string().describe('Business description'),
        name: z.string().describe('Name of the business'),
    })
);

export const blogSchema = z
    .array(
        z.object({
            alternativeHeadline: z
                .string()
                .describe('A headline that is a summary of the blog'),
            articleBody: z.string().describe('The content of the blog article'),
            headline: z.string().describe('The title of the blog article'),
            keywords: z
                .array(
                    z
                        .string()
                        .describe(
                            'Identify the content of the blog and add meaningful keywords using the following format: hyphen-case'
                        )
                )
                .describe('You cannot add more than 5 keywords.'),
            pictureDescription: z
                .string()
                .describe(
                    'A description of an appropriate image for this blog in three sentences.'
                ),
            taxonomyCategoryIds: z
                .array(z.number())
                .default([])
                .describe(
                    'This field is a relationship with TaxonomyCategory, you must filter taxonomyCategoryIds that are most related to the articleBody/keywords/headline and store the id, max: 3 taxonomyCategoryIds.'
                ),
        })
    )
    .describe(
        'An array of blog articles with the articleBody formatted as HTML, keywords should be 5'
    );

export const categorySchema = z
    .object({
        categories: z
            .array(
                z.object({
                    childCategories: z
                        .array(
                            z.object({
                                name: z
                                    .string()
                                    .describe('The name of the child category'),
                                name_i18n: z.any(),
                            })
                        )
                        .describe('child categories'),
                    name: z.string().describe('The name of the category'),
                    name_i18n: z.any(),
                })
            )
            .describe('An array of categories'),
        name: z
            .string()
            .describe('The vocabulary name based on the title with few words.'),
        name_i18n: z.any(),
    })
    .describe(
        'Vocabulary structure with the name and a list of categories and their child categories. For all name_i18n: they are related to the closest "name" property, use the language as key and the translated value'
    );

export const categorizationSchema = z
    .object({
        amount: z
            .number()
            .describe(
                'The amount of items to be generated, the default value is 1, undetermined is -1'
            ),
        assetType: z
            .enum([
                'account',
                'blog',
                'category',
                'image',
                'knowledgeBase',
                'news',
                'none',
                'objectDefinition',
                'organization',
                'page',
                'product',
                'tag',
                'user',
                'warehouse',
                'wiki',
            ])
            .describe(
                `The user prompt is related to one of these options, if you dont know for sure the best qualified option, you can say "none", category can be known as "categories" and "asset categories"`
            ),
        metadata: z.object({
            availableLanguages: z
                .array(z.string())
                .describe(
                    'Add all the languages mentioned by the user, following the BCP47 format, like en-US, pt-BR'
                ),
            additionalContext: z
                .string()
                .describe(
                    'If there is something valuable inserted by the user, add it here all the metadata you found, otherwise let it blank'
                ),
            language: z
                .string()
                .describe('Identify the user language based on his question'),
            tone: z
                .enum([
                    'rude',
                    'formal',
                    'neutral',
                    'insult',
                    'profanity',
                    'uncertain',
                ])
                .describe(
                    'The tone of the question, you can say unknown if none of these matches'
                ),
        }),
        subject: z.string().describe('The prompt subject'),
    })
    .describe('Prompt Description metadata');

export const knowledgeBaseSchema = z
    .array(
        z.object({
            articles: z.array(
                z.object({
                    articleBody: z
                        .string()
                        .describe('The knowledge base article body'),
                    keywords: z
                        .array(
                            z
                                .string()
                                .describe(
                                    'Identify the content of the knowledge base article and add meaningful keywords, use the kebab-case and no longer than 16 characters'
                                )
                        )
                        .describe('You cannot add more than 3 keywords.'),
                    title: z
                        .string()
                        .describe('Title of knowledge base article'),
                })
            ),
            name: z.string().describe('Name of the knowledge base category'),
            viewableBy: z
                .enum(['Anyone', 'Members', 'Owner'])
                .describe(
                    'The Knowledge Base can be viewed by one of these options, consider anyone if not specified.'
                ),
        })
    )
    .describe('An array of knowledge base categories related to a given topic');

export const organizationSchema = z
    .array(
        z.object({
            name: z.string().describe('The name of the business organization.'),
            childOrganizations: z.array(
                z.object({
                    name: z.string().describe('The name of the organization'),
                })
            ),
        })
    )
    .describe('An array of organizations related to a given topic');

export const objectDefinitionSchema = z
    .object({
        label: z.any(),
        scope: z
            .enum(['company', 'site'])
            .describe(
                'The Object Definition Scope definition, the default value is company'
            ),
        name: z
            .string()
            .describe('Name of the database schema, use the PascalCase format'),
        fields: z.array(
            z.object({
                label: z.any(),
                name: z
                    .string()
                    .describe(
                        'Name of the database field, the first character of a name must be a lower case letter'
                    ),
                type: z
                    .enum([
                        'String',
                        'Integer',
                        'Boolean',
                        'BigDecimal',
                        'DateTime',
                    ])
                    .describe(
                        'Based on the field name, find the appropriate data type, use String as default'
                    ),
                required: z.boolean().describe('default value is false'),
            })
        ),
    })
    .describe(
        'A simple database schema related to the given topic. All the "label" fields are related to the closest "name" property, use the language as key with BCP47 format and the translated value'
    );

export const tagSchema = z
    .array(
        z.object({
            name: z.string().describe('Tag name'),
        })
    )
    .describe('An array of Tags related to a given topic');

export const wikiSchema = z
    .object({
        name: z
            .string()
            .describe('The vocabulary name based on the title with few words.'),
        viewableBy: z
            .enum(['Anyone', 'Members', 'Owner'])
            .describe(
                'TheWiki can be viewed by one of these options, consider anyone if not specified.'
            ),
        wikiPages: z
            .array(
                z.object({
                    childArticles: z
                        .array(
                            z.object({
                                articleBody: z
                                    .string()
                                    .describe('The wiki child article'),
                                title: z
                                    .string()
                                    .describe(
                                        'The title of the wiki child article'
                                    ),
                            })
                        )
                        .describe('An array of child wiki articles'),
                    pageBody: z
                        .string()
                        .describe(
                            'The wiki category page article or description'
                        ),
                    title: z.string().describe('Title of the wiki page'),
                })
            )
            .describe('An array of wiki category pages'),
    })
    .describe(
        'Wiki structure with the name and a list of wikis and their child wiki articles'
    );

export const warehouseSchema = z
    .array(
        z.object({
            longitute: z.number().describe('Region Longitude'),
            latitude: z.number().describe('Region Latitude'),
            name: z.string().describe('Name of the Region'),
        })
    )
    .describe('an array of cities, regions, or counties within a region.');
