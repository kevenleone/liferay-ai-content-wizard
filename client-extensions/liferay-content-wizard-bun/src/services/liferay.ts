import ky from 'ky';

import logger from '../utils/logger';

export default function getLiferayInstance(
    authorization = '',
    prefixUrl = 'http://localhost:8080'
) {
    return ky.extend({
        prefixUrl,
        headers: {
            Authorization: authorization,
        },
        hooks: {
            beforeError: [
                async (error) => {
                    const response = error.response;

                    logger.error(error.message);

                    if (response) {
                        const data = await response.json();

                        logger.error(
                            `Error Formatted: ${JSON.stringify(
                                data,
                                null,
                                2
                            )} (${response.status})`
                        );
                    }

                    return error;
                },
            ],
        },
        retry: {
            limit: 2,
            methods: ['get', 'post'],
            statusCodes: [400, 403, 401],
            backoffLimit: 3000,
        },
    });
}

export type LiferayInstance = ReturnType<typeof getLiferayInstance>;
