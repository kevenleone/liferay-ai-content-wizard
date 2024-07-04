import ModalContent from '../../ModalContent';
import WizardEmptyState from '../WizardEmptyState';

type ContentWizardProps = {
  configured: boolean;
  isLoading: boolean;
  messages: any[];
  onSelectAsset: (asset: any) => void;
  setMessages: React.Dispatch<any>;
};

export default function ChatBody({
  isLoading,
  configured,
  messages,
  onSelectAsset,
  setMessages,
}: ContentWizardProps) {
  if (isLoading) {
    return <b>Loading...</b>;
  }

  if (1==1) {
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
