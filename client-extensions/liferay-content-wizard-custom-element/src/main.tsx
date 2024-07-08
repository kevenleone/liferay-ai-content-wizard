import ReactDOM, { Root } from 'react-dom/client';
import { ClayIconSpriteContext } from '@clayui/icon';

import App from './App.tsx';
import './index.css';
import { getIconSpriteMap } from './utils/iconSpritemap.ts';
import { SWRConfig } from 'swr';
import SWRCacheProvider from './SWRCacheProvider.ts';
import AppContextProvider from './AppContext.tsx';

const customElementId = 'liferay-content-wizard-custom-element';

class ContentWizard extends HTMLElement {
  private root?: Root;

  connectedCallback() {
    if (!this.root) {
      this.root = ReactDOM.createRoot(this);

      this.root.render(
        <SWRConfig
          value={{
            provider: SWRCacheProvider,
            revalidateIfStale: false,
            revalidateOnFocus: false,
          }}
        >
          <AppContextProvider>
            <ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
              <App />
            </ClayIconSpriteContext.Provider>
          </AppContextProvider>
        </SWRConfig>
      );
    }
  }
}

if (!customElements.get(customElementId)) {
  customElements.define(customElementId, ContentWizard);
}
