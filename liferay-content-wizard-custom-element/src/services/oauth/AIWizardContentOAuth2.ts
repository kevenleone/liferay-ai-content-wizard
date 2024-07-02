import { Liferay } from '../liferay';
// import OAuth2Client from './OAuth2Client';

export default class AIWizardContentOAuth2 {
  constructor() {
    // super('liferay-ai-wizard-content-oauth-application-user-agent');
  }

  async generate(data: unknown) {
    return Liferay.Util.fetch('http://localhost:3333/generate', {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  async settings() {
    const response = await Liferay.Util.fetch('http://localhost:3333/settings');

    return response.json();
  }
}
