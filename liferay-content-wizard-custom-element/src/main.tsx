import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const customElementId = 'liferay-content-wizard-custom-element';

class ContentWizard extends HTMLElement {
  connectedCallback() {
    ReactDOM.createRoot(this).render(<App />);
  }
}

if (!customElements.get(customElementId)) {
  customElements.define(customElementId, ContentWizard);
}
