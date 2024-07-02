import ReactDOM, { Root } from 'react-dom/client';
import { ClayIconSpriteContext } from '@clayui/icon';

import App from './App.tsx';
import './index.css';
import { getIconSpriteMap } from './utils/iconSpritemap.ts';

const customElementId = 'liferay-content-wizard-custom-element';

class ContentWizard extends HTMLElement {
  private root?: Root;

  connectedCallback() {
    if (!this.root) {
      this.root = ReactDOM.createRoot(this);

      this.root.render(
        <ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
          <App />
        </ClayIconSpriteContext.Provider>
      );
    }
  }
}

if (!customElements.get(customElementId)) {
  customElements.define(customElementId, ContentWizard);
}
