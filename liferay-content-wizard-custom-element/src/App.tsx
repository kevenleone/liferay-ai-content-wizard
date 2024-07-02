import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useModal } from '@clayui/modal';

import AIWizard from './AIWizard';
import DisplayButton from './DisplayButton';

const controlMenu = document.querySelector(
  '.control-menu-nav-item.layout-reports-icon'
)!;

function App() {
  const [container, setContainer] = useState<HTMLElement>();

  const modal = useModal({ defaultOpen: true });

  useEffect(() => {
    const _container = document.getElementById('controlMenu');

    if (_container) {
      setContainer(_container);
    }
  }, []);

  return (
    <>
      {modal.open && <AIWizard modal={modal} />}

      {container &&
        createPortal(
          <DisplayButton onClick={() => modal.onOpenChange(true)} />,
          controlMenu
        )}
    </>
  );
}

export default App;
