import { Liferay } from './../services/liferay';

import useSWR from 'swr';

const useListTypeDefinition = (externalReferenceCode: string) => {
  return useSWR(`/list-type-definition/${externalReferenceCode}`, async () => {
    const response = await Liferay.Util.fetch(
    `/o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/${externalReferenceCode}`
    );

    const data = await response.json();

    return data.listTypeEntries;
  });
};

export default useListTypeDefinition;