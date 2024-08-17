import { KeyedMutator } from 'swr';
import { Container } from '@clayui/layout';
import { useForm } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClayButton from '@clayui/button';
import ClayForm, {
    ClayCheckbox,
    ClayInput,
    ClaySelectWithOption,
} from '@clayui/form';

import { contentWizardSettings as zodSchema } from '../../schema';
import { Liferay } from '../../services/liferay';
import useAIWizardContentOAuth2 from '../../hooks/useAIWizardOAuth2';
import useListTypeDefinition from '../../hooks/useListTypeDefinition';

export default function SettingsBody() {
    const outletContext = useOutletContext<{
        mutate?: KeyedMutator<any>;
        setting?: any;
    }>();

    const { setting, mutate = () => {} } = outletContext || {};

    const form = useForm<z.infer<typeof zodSchema>>({
        defaultValues: setting
            ? {
                  active: setting.active,
                  apiKey: setting.apiKey,
                  description: setting.description,
                  id: setting.id,
                  imageModel: setting.imageModel.key,
                  model: setting.model.key,
                  provider: setting.provider.key,
              }
            : {
                  active: true,
                  apiKey: '',
                  description: '',
                  imageModel: '',
                  model: '',
                  provider: '',
              },
        resolver: zodResolver(zodSchema),
    });

    const navigate = useNavigate();
    const aiWizardOAuth2 = useAIWizardContentOAuth2();
    const { data: models = [] } = useListTypeDefinition('AIWIZARD_MODELS');
    const { data: providers = [] } =
        useListTypeDefinition('AIWIZARD_PROVIDERS');

    const active = form.watch('active');
    const imageModel = form.watch('imageModel') || '';
    const model = form.watch('model') || '';
    const provider = form.watch('provider') || '';

    const onSave = async (data: z.infer<typeof zodSchema>) => {
        try {
            const response = await aiWizardOAuth2.saveSettings(data);

            mutate!(response);

            Liferay.Util.openToast({
                message: 'Yayy! Settings saved',
                title: 'Success',
                type: 'success',
            });

            navigate('/');
        } catch (error) {
            console.error(error);

            Liferay.Util.openToast({
                message: 'Oops... something went wrong',
                title: 'Error',
                type: 'danger',
            });
        }
    };

    const modelsFilteredByProvider = [
        { name: 'Select a Model', key: '' },
        ...models.filter(({ externalReferenceCode }) =>
            externalReferenceCode.startsWith(provider.toUpperCase())
        ),
    ];

    return (
        <Container className="bg-white mt-4 p-4">
            <ClayForm onSubmit={form.handleSubmit(onSave)}>
                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="basicInput">API Key</label>
                    <ClayInput
                        placeholder="API Key"
                        {...form.register('apiKey')}
                    />
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="provider">AI Provider</label>

                    <ClaySelectWithOption
                        value={provider}
                        {...form.register('provider', {
                            onChange: (event) =>
                                form.setValue('provider', event.target.value),
                        })}
                        options={[
                            { label: 'Select a Provider', value: '' },
                            ...providers.map((provider: any) => ({
                                label: provider.name,
                                value: provider.key,
                            })),
                        ]}
                    />
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="model">AI Model</label>
                    <ClaySelectWithOption
                        disabled={!provider}
                        value={model}
                        options={modelsFilteredByProvider.map((model: any) => ({
                            label: model.name,
                            value: model.key,
                        }))}
                        {...form.register('model', {
                            onChange: (event) =>
                                form.setValue('model', event.target.value),
                        })}
                    />
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="model">Image Model</label>
                    <ClaySelectWithOption
                        disabled={!provider}
                        options={modelsFilteredByProvider.map((model: any) => ({
                            label: model.name,
                            value: model.key,
                        }))}
                        value={imageModel}
                        {...form.register('imageModel', {
                            onChange: (event) =>
                                form.setValue('imageModel', event.target.value),
                        })}
                    />
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="basicInput">Description</label>
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        {...form.register('description')}
                    />
                </ClayForm.Group>

                <ClayCheckbox
                    aria-label="Active Setting"
                    checked={active}
                    label="Active"
                    onChange={() => form.setValue('active', !active)}
                />

                <ClayButton
                    displayType="secondary"
                    onClick={() => navigate('/')}
                >
                    Cancel
                </ClayButton>

                <ClayButton
                    className="ml-2"
                    disabled={
                        !form.formState.isValid || form.formState.isSubmitting
                    }
                    type="submit"
                >
                    Save
                </ClayButton>
            </ClayForm>
        </Container>
    );
}
