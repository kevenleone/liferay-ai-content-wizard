import useSWR from 'swr';

import { Liferay } from '../services/liferay';

export const useMyUserAccount = () => {
  return useSWR('/my-user-account-2', () => {
    return Liferay.Util.fetch(
      `/o/headless-admin-user/v1.0/my-user-account`
    ).then((response) => response.json());
  });
};
