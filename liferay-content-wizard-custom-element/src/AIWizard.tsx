import Modal, { useModal } from '@clayui/modal';
import ClayButton from '@clayui/button';
import ClayForm, { ClayInput } from '@clayui/form';
import useSWR from 'swr';

import ModalContent from './ModalContent';

import { useState } from 'react';
import WizardEmptyState from './components/WizardEmptyState';
import useAIWizardContentOAuth2 from './hooks/useAIWizardOAuth2';
import ClayIcon from '@clayui/icon';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Liferay } from './services/liferay';

type AIWizardProps = {
  modal: ReturnType<typeof useModal>;
};

type ContentWizardProps = {
  aiWizardContentOAuth2: ReturnType<typeof useAIWizardContentOAuth2>;
  messages: any[];
  setMessages: React.Dispatch<any>;
};

function ContentWizard({
  aiWizardContentOAuth2,
  messages,
  setMessages,
}: ContentWizardProps) {
  const { isLoading, data: settings = {} } = useSWR(
    '/ai/settings',
    aiWizardContentOAuth2.settings
  );

  if (isLoading) {
    return <b>Loading...</b>;
  }

  if (!settings.configured) {
    return <ModalContent messages={messages} setMessages={setMessages} />;
  }

  return (
    <WizardEmptyState
      description='You must setting up the AI Wizard Settings.'
      title='Oops... Unable to continue'
    />
  );
}

const schema = z.object({ input: z.string() });

type Schema = z.infer<typeof schema>;

export default function AIWizard({ modal }: AIWizardProps) {
  const aiWizardContentOAuth2 = useAIWizardContentOAuth2();

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const [messages, setMessages] = useState([]);

  async function onSubmit({ input }: Schema) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, role: 'user' },
    ]);

    const response = await aiWizardContentOAuth2.generate({
      question: input,
    });

    const data = await response.json();

    Liferay.Util.openToast({
      message:
        'Your content has been succesfully generated. You can view it in...',
      title: 'Success',
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: JSON.stringify(data, null, 2), role: 'assistant' },
    ]);
  }

  return (
    <Modal size='lg' observer={modal.observer}>
      <Modal.Header>AI Assistant</Modal.Header>
      <Modal.Body>
        <ContentWizard
          aiWizardContentOAuth2={aiWizardContentOAuth2}
          messages={messages}
          setMessages={setMessages}
        />
      </Modal.Body>
      <div className='modal-footer'>
        <ClayForm className='d-flex w-100' onSubmit={handleSubmit(onSubmit)}>
          <ClayInput
            {...register('input')}
            disabled={formState.isSubmitting || formState.isLoading}
            placeholder='Write your answer'
          />

          <ClayIcon
            color='gray'
            style={{ marginLeft: -30, marginTop: 14 }}
            aria-label='Submit Prompt'
            symbol='order-arrow-right'
          />
        </ClayForm>

        <div className='d-flex mt-4 w-100 justify-content-end'>
          <ClayButton displayType='secondary'>
            <ClayIcon symbol='reset' /> Restart Chat
          </ClayButton>
        </div>
      </div>
    </Modal>
  );
}
