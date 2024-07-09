import type getLiferayInstance from './liferay';

const SITE_ID = 10101;

export default function liferayHeadless(
  liferay: ReturnType<typeof getLiferayInstance>
) {
  return {
    instance: liferay,

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

    createOrganization(json: any) {
      return liferay.post(`o/headless-admin-user/v1.0/organizations`, {
        json,
      });
    },

    createWikiNode(siteId: string, json: { name: string; viewableBy: string }) {
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

    createKeywordBatch(siteId: string, json: unknown) {
      return liferay.post(
        `o/headless-admin-taxonomy/v1.0/sites/${siteId}/keywords/batch`,
        { json }
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

    postProductImage(productId: number, body: unknown) {
      return liferay.post(
        `o/headless-commerce-admin-catalog/v1.0/products/${productId}/images`,
        { json: body }
      );
    },

    postSpecification(productId: number, body: unknown) {
      return liferay.post(
        `o/headless-commerce-admin-catalog/v1.0/products/${productId}/productSpecifications`,
        { json: body }
      );
    },

    myUserAccount() {
      return liferay.get('o/headless-admin-user/v1.0/my-user-account');
    },

    getAccountGroups() {
      return liferay
        .get(
          'o/headless-commerce-admin-account/v1.0/accountGroups?pageSize=1000'
        )
        .json<any>();
    },

    createDocumentFolder(name: string, parentDocumentFolderId: number) {
      const url =
        parentDocumentFolderId !== 0
          ? `/o/headless-delivery/v1.0/document-folders/{parentDocumentFolderId}/document-folders`
          : `o/headless-delivery/v1.0/sites/${SITE_ID}/document-folders`;

      return liferay
        .post(url, {
          json: {
            name,
            parentDocumentFolderId,
            viewableBy: 'Anyone',
          },
        })
        .json<{ id: number }>();
    },

    createCatalog(catalog: any) {
      return liferay
        .post(`o/headless-commerce-admin-catalog/v1.0/catalogs`, {
          json: catalog,
        })
        .json();
    },

    createAccountGroup(accountGroup: any) {
      return liferay
        .post('o/headless-commerce-admin-account/v1.0/accountGroups', {
          json: accountGroup,
        })
        .json();
    },

    getRoles() {
      return liferay
        .get('o/headless-admin-user/v1.0/roles?types=1&pageSize=-1')
        .then((response) => response.json<any>());
    },

    updateSiteDocuments(id: string, document: any) {
      return liferay
        .put(`o/headless-delivery/v1.0/documents/${id}`, {
          body: document,
        })
        .json<any>();
    },

    createSiteDocuments(document: any) {
      return liferay
        .post(`o/headless-delivery/v1.0/sites/${SITE_ID}/documents`, {
          json: document,
        })
        .json<any>();
    },

    createDocumentFolderDocument(documentFolderId: string, document: any) {
      return liferay
        .post(
          `o/headless-delivery/v1.0/document-folders/${documentFolderId}/documents`,
          {
            json: document,
          }
        )
        .json<any>();
    },

    getSiteDocuments(siteId: number) {
      return liferay
        .get(
          `o/headless-delivery/v1.0/sites/${SITE_ID}/documents?flatten=true&page=-1`
        )
        .json<any>();
    },

    getSiteDocumentFolders() {
      return liferay
        .get(
          `o/headless-delivery/v1.0/sites/${SITE_ID}/document-folders?fields=id,parentDocumentFolderId,name&flatten=true&page=-1`
        )
        .json<any>();
    },

    getDocumentFolderDocuments(folderId: number) {
      return liferay.get(
        `o/headless-delivery/v1.0/document-folders/${folderId}/documents`
      );
    },
  };
}
