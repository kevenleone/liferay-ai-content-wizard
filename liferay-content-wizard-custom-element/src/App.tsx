import { createPortal } from 'react-dom';
import { useState } from 'react';
import DisplayButton from './DisplayButton';
import ModalContent from './ModalContent';

const controlMenu = document.getElementById('controlMenu')!;

function App() {
  const [showModal, setShowModal] = useState(false);
 
  return <>
      {showModal?

        <div
          className={"fade modal " + ( showModal ? "show" : "" )}
          style={{display: showModal ? "block" : "none"}}
          id="claySmallModal"
        >
          <ModalContent onClose={() => setShowModal(false)} />
        </div>
        : 
        <></>
      }
      
      {createPortal(
        <DisplayButton onClick={() => setShowModal(true)}/>,
        controlMenu
      )}
  </>;
}

export default App;
