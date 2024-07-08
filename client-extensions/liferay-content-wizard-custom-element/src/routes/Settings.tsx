import { Text } from '@clayui/core';
import ClayForm, { ClayInput, ClaySelectWithOption } from '@clayui/form';
import { Container } from '@clayui/layout';
import useSWR from 'swr';
import ClayButton from '@clayui/button';
import ClayEmptyState from '@clayui/empty-state';

import { Liferay } from '../services/liferay';
import { useEffect, useState } from 'react';
import useListTypeDefinition from '../hooks/useListTypeDefinition';
import ClayCard from '@clayui/card';

const SettingsBody = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    apiKey: '',
    imageModel: '',
    model: '',
    provider: '',
  });
  const { data: models = [] } = useListTypeDefinition('AIWIZARD_MODELS');
  const { data: providers = [] } = useListTypeDefinition('AIWIZARD_PROVIDERS');

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      imageModel: models[0],
      model: models[0],
    }));
  }, [form.provider, models]);

  const { data = {}, isLoading } = useSWR(
    '/o/content-wizard-settings',
    async () => {
      const response = await Liferay.Util.fetch('/o/c/contentwizardsettingses');

      if (!response.ok) {
        throw new Error('Error...');
      }

      return response.json();
    }
  );

  const onChange = (event: any) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (data.totalCount === 0 && !showForm) {
    return (
      <ClayEmptyState
        title='Oops... looks like is your first time here'
        description='No settings was found, click in the button below to start the configuration'
      >
        <ClayButton displayType='primary' onClick={() => setShowForm(true)}>
          Setup
        </ClayButton>
      </ClayEmptyState>
    );
  }

  const modelsFilteredByProvider = [
    { name: 'Select a Model', key: '' },
    ...models.filter(({ externalReferenceCode }) =>
      externalReferenceCode.startsWith(form.provider.toUpperCase())
    ),
  ];

  return (
    <ClayForm>
      <ClayForm.Group className='form-group-sm'>
        <label htmlFor='basicInput'>API Key</label>
        <ClayInput
          placeholder='API Key'
          onChange={onChange}
          name='apiKey'
        ></ClayInput>
      </ClayForm.Group>

      <ClayForm.Group className='form-group-sm'>
        <label htmlFor='provider'>AI Provider</label>
        <ClaySelectWithOption
          onChange={onChange}
          value={form.provider}
          options={[
            { label: 'Select a Provider', value: '' },
            ...providers.map((provider: any) => ({
              label: provider.name,
              value: provider.key,
            })),
          ]}
          name='provider'
        />
      </ClayForm.Group>

      <ClayForm.Group className='form-group-sm'>
        <label htmlFor='model'>Image Model</label>
        <ClaySelectWithOption
          value={form.imageModel}
          onChange={onChange}
          disabled={!form.provider}
          options={modelsFilteredByProvider.map((model: any) => ({
            label: model.name,
            value: model.key,
          }))}
          name='imageModel'
        />
      </ClayForm.Group>

      <ClayForm.Group className='form-group-sm'>
        <label htmlFor='model'>AI Model</label>
        <ClaySelectWithOption
          onChange={onChange}
          disabled={!form.provider}
          value={form.model}
          options={modelsFilteredByProvider.map((model: any) => ({
            label: model.name,
            value: model.key,
          }))}
          name='model'
        />
      </ClayForm.Group>

      <ClayForm.Group className='form-group-sm'>
        <label htmlFor='basicInput'>Description</label>
        <textarea className='form-control' placeholder='Description'></textarea>
      </ClayForm.Group>
    </ClayForm>
  );
};

export default function Settings() {
  return (
    <Container className='mt-4'>
      <Text as='p' size={10}>
        Wizard Settings
      </Text>

      <ClayCard>
        <ClayCard.Body className='mx-2 mb-2'>
          <SettingsBody />
        </ClayCard.Body>
      </ClayCard>
    </Container>
  );
}
