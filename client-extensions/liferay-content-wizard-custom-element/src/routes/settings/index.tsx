import { Button } from '@clayui/core';
import { ClayButtonWithIcon } from '@clayui/button';
import { useNavigate } from 'react-router-dom';
import ClayAlert from '@clayui/alert';
import ClayEmptyState from '@clayui/empty-state';
import useSWR from 'swr';
import ClayIcon from '@clayui/icon';

import Container from '../../components/Container';
import Table from '../../components/Table';
import useAIWizardContentOAuth2 from '../../hooks/useAIWizardOAuth2';

const renderPickList = ({ name }: { key: string; name: string }) => name;

const PAD_LIMIT = 15;

const providerStatuses = {
  true: {
    'aria-label': 'Active provider',
    color: 'green',
    symbol: 'check-circle',
  },
  false: {
    'aria-label': 'Deactivated provider',
    symbol: 'times-circle',
    color: 'red',
  },
};

export default function Settings() {
  const aiWizardOAuth2 = useAIWizardContentOAuth2();
  const navigate = useNavigate();

  const { data: settings, mutate } = useSWR('/settings', () =>
    aiWizardOAuth2.getSettings()
  );

  const onDelete = async ({ id }: any) => {
    if (!confirm('Are you sure you want to delete this setting?')) {
      return;
    }

    await aiWizardOAuth2.deleteSetting(id);
    await mutate((data: any) => data, { revalidate: true });
  };

  const items = settings?.items || [];
  const hasItems = items.length > 0;

  return (
    <Container className='p-4'>
      <div className='d-flex justify-content-between mb-4'>
        <h1>AI Wizard Settings</h1>

        {hasItems && (
          <ClayButtonWithIcon
            aria-label='Add Config'
            onClick={() => navigate('form')}
            symbol='plus'
          />
        )}
      </div>

      <Table
        actions={[
          {
            label: 'Edit',
            onClick: ({ id }: any) => navigate(`update/${id}`),
          },
          {
            label: 'Delete',
            onClick: onDelete,
          },
        ]}
        emptyState={
          <ClayEmptyState
            title='Oops... looks like is your first time here'
            description='No settings was found, click in the button below to start the configuration'
          >
            <Button displayType='primary' onClick={() => navigate('form')}>
              Setup
            </Button>
          </ClayEmptyState>
        }
        columns={[
          {
            key: 'provider',
            name: 'Provider',
            render: (data, { active }) => (
              <>
                <ClayIcon {...(providerStatuses as any)[active]} />{' '}
                {renderPickList(data)}
              </>
            ),
          },
          {
            key: 'apiKey',
            name: 'API Key',
            render: (apiKey: string) => (
              <b>
                {apiKey
                  .substring(0, PAD_LIMIT)
                  .padEnd(apiKey.length - PAD_LIMIT, '*****************')}
              </b>
            ),
          },
          { key: 'model', name: 'Model', render: renderPickList },
          { key: 'imageModel', name: 'Image Model', render: renderPickList },
        ]}
        rows={items}
      />

      {hasItems && (
        <ClayAlert>
          You can have multiple settings, but only one can be active at time.
        </ClayAlert>
      )}
    </Container>
  );
}
