import type { APIResponse, WizardSetting } from '../utils/types';
import type getLiferayInstance from './liferay';

export default function liferayHeadless(
    liferay: ReturnType<typeof getLiferayInstance>
) {
    return {
        instance: liferay,

        getContentWizardSetting(id: string) {
            return liferay
                .get(`o/c/contentwizardsettingses/${id}`)
                .json<WizardSetting & { id: number }>();
        },

        getContentWizardSettings(urlSearchParams = new URLSearchParams()) {
            return liferay
                .get(
                    `o/c/contentwizardsettingses?${urlSearchParams.toString()}`
                )
                .json<APIResponse<WizardSetting & { id: number }>>();
        },

        deleteContentWizardSetting(id: number) {
            return liferay.delete(`o/c/contentwizardsettingses/${id}`);
        },

        patchContentWizardSettings(id: number, json: unknown) {
            return liferay
                .patch(`o/c/contentwizardsettingses/${id}`, { json })
                .json<WizardSetting & { id: number }>();
        },

        postContentWizardSettings(json: unknown) {
            return liferay
                .post('o/c/contentwizardsettingses', { json })
                .json<WizardSetting & { id: number }>();
        },

        postPage(siteId: string, json: unknown) {
            return liferay.post(`o/headless-delivery/v1.0/sites/${siteId}/site-pages/`, {
                json
            });
        },

        async postAccount(account: {
            description: string;
            externalReferenceCode: string;
            name: string;
            type: string;
        }) {
            return liferay.post('o/headless-admin-user/v1.0/accounts', {
                json: account,
            });
        },

        createKnowledgeBase(
            knowledgeBaseFolderId: number,
            json: { articleBody: string; title: string; viewableBy: string }
        ) {
            return liferay.post(
                `o/headless-delivery/v1.0/knowledge-base-folders/${knowledgeBaseFolderId}/knowledge-base-articles`,
                {
                    json,
                }
            );
        },

        createTaxonomyVocabulary(
            siteId: string,
            json: { name: string; name_i18n: unknown }
        ) {
            return liferay.post(
                `o/headless-admin-taxonomy/v1.0/sites/${siteId}/taxonomy-vocabularies`,
                { json }
            );
        },

        createTaxonomyVocabularyCategory(vocabularyId: number, json: any) {
            return liferay.post(
                `o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies/${vocabularyId}/taxonomy-categories`,
                { json }
            );
        },

        createTaxonomyCategory(categoryId: number, json: any) {
            return liferay.post(
                `o/headless-admin-taxonomy/v1.0/taxonomy-categories/${categoryId}/taxonomy-categories`,
                { json }
            );
        },

        createKnowledgeBaseFolder(
            siteId: string,
            json: { name: string; viewableBy: string }
        ) {
            return liferay.post(
                `o/headless-delivery/v1.0/sites/${siteId}/knowledge-base-folders`,
                {
                    json,
                }
            );
        },

        createOrganization(json: unknown) {
            return liferay.post(`o/headless-admin-user/v1.0/organizations`, {
                json,
            });
        },

        createObjectDefinition(json: unknown) {
            return liferay.post(`o/object-admin/v1.0/object-definitions`, {
                json,
            });
        },

        createWikiNode(
            siteId: string,
            json: { name: string; viewableBy: string }
        ) {
            return liferay.post(
                `o/headless-delivery/v1.0/sites/${siteId}/wiki-nodes`,
                {
                    json,
                }
            );
        },

        createWikiPage(
            nodeId: number,
            json: {
                content: string;
                encodingFormat: string;
                headline: string;
                viewableBy: string;
            }
        ) {
            return liferay.post(
                `o/headless-delivery/v1.0/wiki-nodes/${nodeId}/wiki-pages`,
                {
                    json,
                }
            );
        },

        getTaxonomyCategoriesRanked(siteId: string) {
            return liferay.post(`o/graphql?ts=${new Date().getTime()}`, {
                json: {
                    query: `query taxonomyCategoriesRanked {
            taxonomyCategoriesRanked(siteKey: "${siteId}",pageSize: 500) {
            actions
            lastPage
            items {
                id
                name
            }
            page
            pageSize
            totalCount
            }
        }`,
                },
            });
        },

        getKeywords(siteId: string, searchParams = new URLSearchParams()) {
            return liferay.get(
                `o/headless-admin-taxonomy/v1.0/sites/${siteId}/keywords?${searchParams.toString()}`
            );
        },

        createKeyword(siteId: string, name: string) {
            return liferay.post(
                `o/headless-admin-taxonomy/v1.0/sites/${siteId}/keywords`,
                { json: { name } }
            );
        },

        createChildWikiPage(
            parentWikiPageId: number,
            json: {
                content: string;
                encodingFormat: string;
                headline: string;
                parentWikiPageId: number;
                wikiNodeId: number;
                viewableBy: string;
            }
        ) {
            return liferay.post(
                `o/headless-delivery/v1.0/wiki-pages/${parentWikiPageId}/wiki-pages`,
                {
                    json,
                }
            );
        },

        async postBlogImage(siteId: string, body: FormData) {
            return liferay.post(
                `o/headless-delivery/v1.0/sites/${siteId}/blog-posting-images`,
                {
                    body,
                }
            );
        },

        async postBlog(siteId: string, json: unknown) {
            return liferay.post(
                `o/headless-delivery/v1.0/sites/${siteId}/blog-postings`,
                {
                    json,
                }
            );
        },

        myUserAccount() {
            return liferay.get('o/headless-admin-user/v1.0/my-user-account');
        },
    };
}
