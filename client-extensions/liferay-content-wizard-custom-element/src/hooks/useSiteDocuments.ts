import useSWR from 'swr';

import { Liferay } from '../services/liferay';

const useSiteDocuments = () => {
  return useSWR('/o/graphql/documents', async () => {
    const response = await Liferay.Util.fetch('/o/graphql', {
    body: JSON.stringify({
        query: `query Documents {
                documents(siteKey: "${Liferay.ThemeDisplay.getScopeGroupId()}", flatten: true) {
                    items {
                    contentUrl
                    fileName
                    folder {
                        id
                        name
                        }
                    id
                    }
                    totalCount
                }
                }`,
    }),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    });

    return response.json();
  });
};

export default useSiteDocuments;