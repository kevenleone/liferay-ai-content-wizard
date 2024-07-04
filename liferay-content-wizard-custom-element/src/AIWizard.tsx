import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Modal, { useModal } from '@clayui/modal';
import useSWR from 'swr';

import { Liferay } from './services/liferay';
import { Message } from './types';
import ChatBody from './components/Chat/ChatBody';
import ChatInput from './components/Chat/ChatInput';
import useAIWizardContentOAuth2 from './hooks/useAIWizardOAuth2';

type AIWizardProps = {
  modal: ReturnType<typeof useModal>;
};

const schema = z.object({ input: z.string() });

export type Schema = z.infer<typeof schema>;

export default function AIWizard({ modal }: AIWizardProps) {
  const [placeholder, setPlaceholder] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const aiWizardContentOAuth2 = useAIWizardContentOAuth2();
  const ref = useRef<HTMLDivElement>(null);

  const { isLoading, data: settings = {} } = useSWR(
    '/ai/settings',
    aiWizardContentOAuth2.settings
  );

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const appendMessage = (message: Message) =>
    setMessages((prevMessages) => [...prevMessages, message]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function onSubmit({ input }: Schema) {
    appendMessage({ text: input, role: 'user' });

    const response = await aiWizardContentOAuth2.generate({
      question: input,
    });

    if (!response.ok) {
      const data = await response.json();

      return appendMessage({
        role: 'system',
        text: (
          <ClayAlert displayType='danger'>
            <b>Error:</b> it seems like you might have typed a symbol by
            mistake. Please try again.
            <details className='mt-2'>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
          </ClayAlert>
        ),
      });
    }

    const data = await response.json();

    Liferay.Util.openToast({
      message:
        'Your content has been succesfully generated. You can view it in...',
      title: 'Success',
    });

    appendMessage({
      text: data.output || JSON.stringify(data, null, 2),
      role: 'assistant',
    });

    form.setValue('input', '');
  }

  const configured = settings.configured || true;

  return (
    <Modal size='full-screen' observer={modal.observer}>
      <Modal.Header>AI Assistant</Modal.Header>
      <Modal.Body>
        <ChatBody
          isLoadingContent={form.formState.isSubmitting}
          configured={configured}
          isLoading={isLoading}
          messages={messages}
          onSelectAsset={(asset) => setPlaceholder(asset.hint)}
        />

        {/* Bottom Reference, to scroll messages */}
        <div ref={ref} />
      </Modal.Body>

      {configured && (
        <div className='modal-footer'>
          <ChatInput
            form={form}
            onSubmit={onSubmit}
            placeholder={placeholder}
          />

          <div className='d-flex mt-4 w-100 justify-content-end'>
            <ClayButton displayType='secondary' onClick={() => setMessages([])}>
              <ClayIcon symbol='reset' /> Restart Chat
            </ClayButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
