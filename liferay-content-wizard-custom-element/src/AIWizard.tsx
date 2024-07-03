import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Modal, { useModal } from '@clayui/modal';

import { Liferay } from './services/liferay';
import ChatBody from './components/Chat/ChatBody';
import ChatInput from './components/Chat/ChatInput';
import useAIWizardContentOAuth2 from './hooks/useAIWizardOAuth2';
import { Message } from './types';
import ClayAlert from '@clayui/alert';

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
      return appendMessage({
        role: 'system',
        text: (
          <ClayAlert displayType='danger'>
            <b>Error:</b> it seems like you might have typed a symbol by
            mistake. Please try again.
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
      text: JSON.stringify(data, null, 2),
      role: 'assistant',
    });

    form.setValue('input', '');
  }

  return (
    <Modal size='lg' observer={modal.observer}>
      <Modal.Header>AI Assistant</Modal.Header>
      <Modal.Body className='ai-assistant-body'>
        <ChatBody
          aiWizardContentOAuth2={aiWizardContentOAuth2}
          messages={messages}
          setMessages={setMessages}
          onSelectAsset={(asset) => setPlaceholder(asset.hint)}
        />

        {/* Bottom Reference, to scroll messages */}
        <div ref={ref} />
      </Modal.Body>
      <div className='modal-footer'>
        <ChatInput form={form} onSubmit={onSubmit} placeholder={placeholder} />

        <div className='d-flex mt-4 w-100 justify-content-end'>
          <ClayButton displayType='secondary' onClick={() => setMessages([])}>
            <ClayIcon symbol='reset' /> Restart Chat
          </ClayButton>
        </div>
      </div>
    </Modal>
  );
}
