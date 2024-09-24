import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Modal, { useModal } from '@clayui/modal';
import useSWR from 'swr';

import { Message } from '../types';
import ChatBody from './Chat/ChatBody';
import ChatInput from './Chat/ChatInput';
import useAIWizardContentOAuth2 from '../hooks/useAIWizardOAuth2';

type AIWizardProps = {
    modal: ReturnType<typeof useModal>;
};

const schema = z.object({
    files: z.array(
        z.object({ type: z.enum(['fileEntryId', 'folder']), value: z.string() })
    ),
    image: z.string(),
    input: z.string(),
});

export type Schema = z.infer<typeof schema>;

export default function AIWizard({ modal }: AIWizardProps) {
    const [fullscreen, setFullscreen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const aiWizardContentOAuth2 = useAIWizardContentOAuth2();
    const ref = useRef<HTMLDivElement>(null);

    const { isLoading, data: settings = {} } = useSWR(
        '/ai/settings/status',
        () => aiWizardContentOAuth2.getSettingsStatus()
    );

    const form = useForm<Schema>({
        defaultValues: { files: [], input: '' },
        resolver: zodResolver(schema),
    });

    const appendMessage = (message: Message) =>
        setMessages((prevMessages) => [...prevMessages, message]);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function onSubmit({ files, input}: Schema, onSuccess: () => void) {
        appendMessage({ text: input, role: 'user' });

        try {
            const data = await aiWizardContentOAuth2.generate({
                files,
                question: input,
                image: (document.getElementById("wizard-content-image") as HTMLInputElement)?.value
            });

            appendMessage({
                text: data.output || JSON.stringify(data, null, 2),
                role: 'assistant',
            });

            onSuccess?.()

            form.setValue('input', '');
        } catch (error) {
            const data = await (error as Response).json();

            appendMessage({
                role: 'system',
                text: (
                    <ClayAlert displayType="danger">
                        <b>Error:</b> it seems like you might have typed a
                        symbol by mistake. Please try again.
                        <details className="mt-2">
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </details>
                    </ClayAlert>
                ),
            });
        }
    }

    const configured = settings.active;

    return (
        <Modal
            className="ai-parent-modal"
            disableAutoClose
            observer={modal.observer}
            size={fullscreen ? 'full-screen' : 'lg'}
        >
            <Modal.Header>
                <div className="justify-content-between d-flex align-items-center">
                    Liferay AI Content Wizard
                    <span
                        className="modal-options"
                        onClick={() => setFullscreen(!fullscreen)}
                    >
                        <ClayIcon symbol={fullscreen ? 'compress' : 'expand'} />
                    </span>
                </div>
            </Modal.Header>

            <Modal.Body>
                <ChatBody
                    configured={configured}
                    fullscreen={fullscreen}
                    isLoading={isLoading}
                    isLoadingContent={form.formState.isSubmitting}
                    messages={messages}
                    onClose={modal.onClose}
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
                                        Tell me more about what you would like
                                        to create. Here is an example: <br />
                                        <br />
                                        <i>"{asset.hint}"</i>
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
                <div className="modal-footer">
                    <ChatInput form={form} onSubmit={onSubmit} placeholder="" />

                    <div className="d-flex mt-4 justify-content-end">
                        <ClayButton
                            borderless
                            displayType="secondary"
                            onClick={() => setMessages([])}
                            size="xs"
                        >
                            <ClayIcon symbol="reset" /> Restart Chat
                        </ClayButton>
                    </div>
                </div>
            )}
        </Modal>
    );
}
