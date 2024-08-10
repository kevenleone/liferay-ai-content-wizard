import type { KyResponse } from 'ky';

export default async function responseToBase64(response: KyResponse) {
    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    return buffer.toString('base64');
}
