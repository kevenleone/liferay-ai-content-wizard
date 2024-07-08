import ReactDOM, { Root } from 'react-dom/client';
import { ClayIconSpriteContext } from '@clayui/icon';

import App from './routes/App.tsx';
import './index.css';
import { getIconSpriteMap } from './utils/iconSpritemap.ts';
import { SWRConfig } from 'swr';
import SWRCacheProvider from './SWRCacheProvider.ts';
import AppContextProvider from './context/AppContext.tsx';
import Settings from './routes/Settings.tsx';

const customElementId = 'liferay-content-wizard-custom-element';

type Route = 'app' | 'settings';

class ContentWizard extends HTMLElement {
  private root?: Root;

  connectedCallback() {
    if (!this.root) {
      this.root = ReactDOM.createRoot(this);

      const route = (this.getAttribute('route') as Route) || 'app';

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
              {route === 'app' && <App />}
              {route === 'settings' && <Settings />}
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
