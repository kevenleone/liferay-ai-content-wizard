import { Outlet, useParams } from 'react-router-dom';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import useSWR from 'swr';

import useAIWizardContentOAuth2 from '../../hooks/useAIWizardOAuth2';

export default function SettingOutlet() {
    const aiWizardOAuth2 = useAIWizardContentOAuth2();
    const { id } = useParams();

    const {
        data: setting,
        mutate,
        isLoading,
    } = useSWR(`/setting/${id}`, () => aiWizardOAuth2.getSetting(id as string));

    if (isLoading) {
        return <ClayLoadingIndicator />;
    }

    return <Outlet context={{ mutate, setting }} />;
}
