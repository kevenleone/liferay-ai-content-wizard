import { Liferay } from '../liferay';
import OAuth2Client from './OAuth2Client';

export default class AIWizardContentOAuth2 extends OAuth2Client {
    constructor() {
        super('liferay-content-wizard-oauth-application-user-agent');
    }

    async deleteSetting(id: number) {
        return this.fetch(`/settings/${id}`, { method: 'DELETE' });
    }

    async fetch(url: string, options?: FetchRequestInit) {
        return this.oAuth2Client.fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Language-Id': Liferay.ThemeDisplay.getLanguageId(),
                'Scope-Group-Id':
                    Liferay.ThemeDisplay.getScopeGroupId().toString(),
            },
        });
    }

    async generate(data: unknown) {
        return this.fetch('/ai/generate', {
            body: JSON.stringify(data),
            method: 'POST',
        }) as unknown as Promise<{ output: string }>;
    }

    async getSettingsStatus(): Promise<any> {
        return this.fetch('/settings/status');
    }

    async getSetting(id: string): Promise<any> {
        return this.fetch(`/settings/${id}`);
    }

    async getSettings(): Promise<any> {
        return this.fetch('/settings');
    }

    async saveSettings(data: unknown) {
        return this.fetch('/settings', {
            body: JSON.stringify(data),
            method: 'POST',
        });
    }
}
