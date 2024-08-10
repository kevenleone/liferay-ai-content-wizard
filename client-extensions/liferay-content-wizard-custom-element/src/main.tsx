import ReactDOM, { Root } from 'react-dom/client';
import { ClayIconSpriteContext } from '@clayui/icon';
import { SWRConfig } from 'swr';

import App from './routes/App.tsx';
import './index.css';
import { getIconSpriteMap } from './utils/iconSpritemap.ts';
import SWRCacheProvider from './SWRCacheProvider.ts';
import AppContextProvider from './context/AppContext.tsx';
import SettingRouter from './routes/settings/SettingRouter.tsx';

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
                        revalidateIfStale: true,
                        revalidateOnFocus: false,
                    }}
                >
                    <AppContextProvider>
                        <ClayIconSpriteContext.Provider
                            value={getIconSpriteMap()}
                        >
                            {route === 'app' && <App />}
                            {route === 'settings' && <SettingRouter />}
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
