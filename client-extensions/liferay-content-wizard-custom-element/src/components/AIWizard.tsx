import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Modal, { useModal } from '@clayui/modal';
import useSWR from 'swr';

import { Liferay } from '../services/liferay';
import { Message } from '../types';
import ChatBody from './Chat/ChatBody';
import ChatInput from './Chat/ChatInput';
import useAIWizardContentOAuth2 from '../hooks/useAIWizardOAuth2';

type AIWizardProps = {
  modal: ReturnType<typeof useModal>;
};

const schema = z.object({
  input: z.string(),
  files: z.array(
    z.object({ value: z.string(), type: z.enum(['fileEntryId', 'folder']) })
  ),
});

export type Schema = z.infer<typeof schema>;

export default function AIWizard({ modal }: AIWizardProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const aiWizardContentOAuth2 = useAIWizardContentOAuth2();
  const ref = useRef<HTMLDivElement>(null);

  const { isLoading, data: settings = {} } = useSWR(
    '/ai/settings',
    aiWizardContentOAuth2.settings
  );

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { files: [], input: '' },
  });

  const appendMessage = (message: Message) =>
    setMessages((prevMessages) => [...prevMessages, message]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function onSubmit({ files, input }: Schema) {
    appendMessage({ text: input, role: 'user' });

    const response = await aiWizardContentOAuth2.generate({
      files,
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
    <Modal
      className='ai-parent-modal'
      disableAutoClose
      size={fullscreen ? 'full-screen' : 'lg'}
      observer={modal.observer}
    >
      <Modal.Header>
        AI Assistant
        <span
          className='modal-options'
          onClick={() => setFullscreen(!fullscreen)}
        >
          <ClayIcon symbol={fullscreen ? 'compress' : 'expand'} />
        </span>
      </Modal.Header>
      <Modal.Body>
        <ChatBody
          configured={configured}
          fullscreen={fullscreen}
          isLoading={isLoading}
          isLoadingContent={form.formState.isSubmitting}
          messages={messages}
          onSelectAsset={(asset) => {
            appendMessage({
              role: 'user',
              text: `I would like to create ${asset.title}.`,
            });

            setTimeout(() => {
              appendMessage({
                role: 'assistant',
                text: (
                  <>
                    Tell me more about what you would like to create. Here is an
                    example: <i>Eg. {asset.hint}</i>
                  </>
                ),
              });
            }, 750);
          }}
        />

        {/* Bottom Reference, to scroll messages */}
        <div ref={ref} />
      </Modal.Body>

      {configured && (
        <div className='modal-footer'>
          <ChatInput form={form} onSubmit={onSubmit} placeholder='' />

          <div className='d-flex mt-4 justify-content-end'>
            <ClayButton
              borderless
              size='xs'
              displayType='secondary'
              onClick={() => setMessages([])}
            >
              <ClayIcon symbol='reset' /> Restart Chat
            </ClayButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
