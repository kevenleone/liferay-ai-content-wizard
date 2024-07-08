import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useModal } from '@clayui/modal';

import AIWizard from '../components/AIWizard';
import DisplayIcon from '../components/DisplayIcon';
import DisplayButton from '../components/DisplayButton';

const controlMenu = document.querySelector(
  '.control-menu-nav-item.layout-reports-icon'
)!;

const adminNav = document.querySelector('#productMenuSidebar')!;

function App() {
  const [container, setContainer] = useState<HTMLElement>();

  const modal = useModal({ defaultOpen: false });

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
          <DisplayIcon onClick={() => modal.onOpenChange(true)} />,
          controlMenu
        )}

      {container &&
        createPortal(
          <DisplayButton onClick={() => modal.onOpenChange(true)} />,
          adminNav
        )}
    </>
  );
}

export default App;
