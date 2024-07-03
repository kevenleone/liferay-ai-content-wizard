import useSWR from 'swr';

import ModalContent from '../../ModalContent';
import useAIWizardContentOAuth2 from '../../hooks/useAIWizardOAuth2';
import WizardEmptyState from '../WizardEmptyState';

type ContentWizardProps = {
  aiWizardContentOAuth2: ReturnType<typeof useAIWizardContentOAuth2>;
  messages: any[];
  onSelectAsset: (asset: any) => void;
  setMessages: React.Dispatch<any>;
};

export default function ChatBody({
  aiWizardContentOAuth2,
  messages,
  onSelectAsset,
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
    return (
      <ModalContent
        messages={messages}
        setMessages={setMessages}
        onSelectAsset={onSelectAsset}
      />
    );
  }

  return (
    <WizardEmptyState
      description='You must setting up the AI Wizard Settings.'
      title='Oops... Unable to continue'
    />
  );
}
