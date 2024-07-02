import { createPortal } from 'react-dom';
import Modal, { useModal } from '@clayui/modal';
import useSWR from 'swr';

import DisplayButton from './DisplayButton';
import ModalContent from './ModalContent';

import { useEffect, useState } from 'react';
import WizardEmptyState from './components/WizardEmptyState';
import useAIWizardContentOAuth2 from './hooks/useAIWizardOAuth2';

const controlMenu = document.querySelector(
  '.control-menu-nav-item.layout-reports-icon'
)!;

function App() {
  const aiWizardContentOAuth2 = useAIWizardContentOAuth2();
  const [container, setContainer] = useState<HTMLElement>();
  const { isLoading, data } = useSWR(
    '/ai/settings',
    aiWizardContentOAuth2.settings
  );

  console.log({ data });

  const modal = useModal({ defaultOpen: true });

  useEffect(() => {
    const _container = document.getElementById('controlMenu');

    if (_container) {
      setContainer(_container);
    }
  }, []);

  return (
    <>
      {modal.open ? (
        <Modal size='lg' observer={modal.observer}>
          <Modal.Header>AI Assistant</Modal.Header>
          <Modal.Body>
            <ModalContent />
            <WizardEmptyState
              description='You must setting up the AI Wizard Settings.'
              title='Oops... Unable to continue'
            />
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}

      {container &&
        createPortal(
          <DisplayButton onClick={() => modal.onOpenChange(true)} />,
          controlMenu
        )}
    </>
  );
}

export default App;
